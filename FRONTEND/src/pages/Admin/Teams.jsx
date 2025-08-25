import { useState, useMemo, useEffect } from "react"
import {
  Users,
  Mail,
  Phone,
  School,
  Video,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  Save,
} from "lucide-react"
import { useGetTeamsQuery, useUpdateTeamMutation, useDeleteTeamMutation } from "../../app/api/userApiSlice"
import styles from "./Teams.module.css"

export default function Teams() {
  const { data: teamsData = [], isLoading, isFetching } = useGetTeamsQuery([], {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation()
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation()
  const [teams, setTeams] = useState(teamsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [editingTeam, setEditingTeam] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState(null)
  const [filters, setFilters] = useState({
    hasVideo: false,
    frozen: false,
  })

  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filters.hasVideo) {
      filtered = filtered.filter(team => team.video_link?.length > 0)
    }
    if (filters.frozen) {
      filtered = filtered.filter(team => team.video_freeze === true)
    }
    return filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (sortField === "team_members") {
        aValue = a.team_members.length
        bValue = b.team_members.length
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }, [filters, teams, searchTerm, sortField, sortDirection])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleView = (team) => {
    setSelectedTeam(team)
    setShowViewModal(true)
  }

  const handleEdit = (team) => {
    setEditingTeam({ ...team })
    setShowEditModal(true)
  }

  const handleDelete = (team) => {
    setTeamToDelete(team)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    await deleteTeam(teamToDelete.id)
    if (teamToDelete) {
      setTeams(teams.filter((t) => t.id !== teamToDelete.id))
      setShowDeleteModal(false)
      setTeamToDelete(null)
    }
  }

  const handleSaveEdit = async () => {
    if (editingTeam) {
      console.log(editingTeam)

      const originalTeam = teams.find(t => t.id === editingTeam.id)
      const changes = {}

      Object.keys(editingTeam).forEach(key => {
        if (key !== 'id' && originalTeam[key] !== editingTeam[key]) {
          changes[key] = editingTeam[key]
        }
      })

      console.log('Changes:', changes)
      console.log('email: ', editingTeam.email)
      setTeams(teams.map((t) => (t.id === editingTeam.id ? editingTeam : t)))
      await updateTeam({ id: editingTeam.id, team: changes })
      setShowEditModal(false)
      setEditingTeam(null)
    }
  }

  const SortButton = ({ field, children }) => (
    <button onClick={() => handleSort(field)} className={styles.sortButton}>
      <span>{children}</span>
      {sortField === field && (sortDirection === "asc" ? <ChevronUp className={styles.sortIcon} /> : <ChevronDown className={styles.sortIcon} />)}
    </button>
  )

  useEffect(() => {
    setTeams(teamsData)
  }, [teamsData])

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.headerTitle}>Teams Management</h2>
          <p className={styles.headerSubtitle}>View and manage all registered teams</p>
        </div>
        <div className={styles.headerBadgeContainer}>
          <span className={styles.totalTeamsBadge}>{teams.length} Total Teams</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={styles.filtersCard}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search teams by name, email, or institute..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.checkboxFilters}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.hasVideo}
              onChange={() => setFilters({ ...filters, hasVideo: !filters.hasVideo })}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Has Video</span>
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.frozen}
              onChange={() => setFilters({ ...filters, frozen: !filters.frozen })}
              className={styles.checkbox}
            />
            <span className={styles.checkboxText}>Frozen</span>
          </label>
        </div>
      </div>

      {/* Teams Table */}
      {isLoading || isFetching ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : (
        <div className={styles.tableContainer}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th className={styles.tableHeader}>
                    <SortButton field="name">Team Leader</SortButton>
                  </th>
                  <th className={styles.tableHeader}>
                    <SortButton field="email">Contact</SortButton>
                  </th>
                  <th className={styles.tableHeader}>
                    <SortButton field="institute_name">Institute</SortButton>
                  </th>
                  <th className={styles.tableHeader}>
                    <SortButton field="team_members">Team Size</SortButton>
                  </th>
                  <th className={styles.tableHeader}>Status</th>
                  <th className={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {filteredAndSortedTeams.map((team) => (
                  <tr key={team.id} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      <div className={styles.cellFlexContainer}>
                        <div className={styles.avatar}>
                          <span className={styles.avatarInitials}>
                            {team.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div className={styles.leaderInfo}>
                          <div className={styles.textMdMedium}>{team.name}</div>
                          <div className={styles.textSmMuted}>ID: {team.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.textSmDefault}>{team.email}</div>
                      <div className={styles.textSmMuted}>{team.phone_number}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.textSmDefault}>{team.institute_name}</div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.cellFlexContainer}>
                        <Users className={styles.teamSizeIcon} />
                        <span className={styles.textSmDefault}>{team.team_members.length + 1}</span>
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.statusContainer}>
                        <span className={`${styles.statusBadge} ${team.email_verified ? styles.statusVerified : styles.statusUnverified}`}>
                          {team.email_verified ? <CheckCircle className={styles.statusIcon} /> : <XCircle className={styles.statusIcon} />}
                          {team.email_verified ? "Verified" : "Unverified"}
                        </span>
                        {team.video_link.length > 0 && (
                          <span className={`${styles.statusBadge} ${styles.statusSubmitted}`}>
                            <Video className={styles.statusIcon} />
                            Submitted
                          </span>
                        )}
                        {team.video_freeze && (
                          <span className={`${styles.statusBadge} ${styles.statusFreezed}`}>
                            <Video className={styles.statusIcon} />
                            Video Freezed
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionsContainer}>
                        <button onClick={() => handleView(team)} className={`${styles.iconButton} ${styles.iconButtonView}`} title="View Details">
                          <Eye className={styles.actionIcon} />
                        </button>
                        <button onClick={() => handleEdit(team)} className={`${styles.iconButton} ${styles.iconButtonEdit}`} title="Edit Team">
                          <Edit className={styles.actionIcon} />
                        </button>
                        <button onClick={() => handleDelete(team)} className={`${styles.iconButton} ${styles.iconButtonDelete}`} title="Delete Team">
                          <Trash2 className={styles.actionIcon} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedTeam && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Team Details</h3>
              <button onClick={() => setShowViewModal(false)} className={styles.modalCloseButton}>
                <X className={styles.modalCloseIcon} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.viewModalLeaderInfo}>
                <div className={styles.viewModalAvatar}>
                  <span className={styles.viewModalAvatarInitials}>
                    {selectedTeam.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <h4 className={styles.viewModalLeaderName}>{selectedTeam.name}</h4>
                  <p className={styles.textGray600}>Team Leader</p>
                </div>
              </div>
              <div className={styles.viewModalGrid}>
                <div className={styles.modalSection}>
                  <div className={styles.infoItem}>
                    <Mail className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Email</p>
                      <p className={styles.infoValue}>{selectedTeam.email}</p>
                    </div>
                    {selectedTeam.email_verified && <CheckCircle className={styles.verifiedIcon} />}
                  </div>
                  <div className={styles.infoItem}>
                    <Phone className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Phone</p>
                      <p className={styles.infoValue}>{selectedTeam.phone_number}</p>
                    </div>
                  </div>
                </div>
                <div className={styles.modalSection}>
                  <div className={styles.infoItem}>
                    <School className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Institute</p>
                      <p className={styles.infoValue}>{selectedTeam.institute_name}</p>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Users className={styles.infoIcon} />
                    <div>
                      <p className={styles.infoLabel}>Team Size</p>
                      <p className={styles.infoValue}>{selectedTeam.team_members.length} members</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h5 className={styles.sectionTitle}>Team Members</h5>
                <div className={styles.modalSection}>
                  {selectedTeam.team_members.map((member, index) => (
                    <div key={index} className={styles.memberItem}>
                      <div className={styles.memberAvatar}>
                        <span className={styles.memberAvatarInitials}>
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className={styles.memberName}>{member.name}</p>
                        <p className={styles.memberEmail}>{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedTeam.video_link && (
                <div>
                  <h5 className={styles.sectionTitle}>Video Submission</h5>
                  <div className={styles.videoSubmissionBox}>
                    <div className={styles.videoInfo}>
                      <div>
                        <p className={styles.videoLabel}>Submitted Video</p>
                        <p className={styles.videoLink}>{selectedTeam.video_link}</p>
                      </div>
                      <a href={selectedTeam.video_link} target="_blank" rel="noopener noreferrer" className={styles.viewVideoButton}>
                        <Video className={styles.actionIcon} />
                        <span>View</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingTeam && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Team</h3>
              <button onClick={() => setShowEditModal(false)} className={styles.modalCloseButton}>
                <X className={styles.modalCloseIcon} />
              </button>
            </div>
            <div className={`${styles.modalBody} ${styles.editModalBody}`}>
              <div className={styles.editFormGrid}>
                <div>
                  <label className={styles.inputLabel}>Name</label>
                  <input type="text" value={editingTeam.name} onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} className={styles.formInput} />
                </div>
                <div>
                  <label className={styles.inputLabel}>Email</label>
                  <input type="email" value={editingTeam.email} onChange={(e) => setEditingTeam({ ...editingTeam, email: e.target.value })} className={styles.formInput} disabled={true} />
                </div>
                <div>
                  <label className={styles.inputLabel}>Phone</label>
                  <input type="tel" value={editingTeam.phone_number} onChange={(e) => setEditingTeam({ ...editingTeam, phone_number: e.target.value })} className={styles.formInput} />
                </div>
                <div>
                  <label className={styles.inputLabel}>Institute</label>
                  <input type="text" value={editingTeam.institute_name} onChange={(e) => setEditingTeam({ ...editingTeam, institute_name: e.target.value })} className={styles.formInput} />
                </div>
              </div>
              <div>
                <h4 className={styles.editSectionTitle}>Video Submissions</h4>
                <div className={styles.videoEditList}>
                  {editingTeam.video_link.map((video, index) => {
                    const isLast = index === editingTeam.video_link.length - 1
                    return (
                      <div key={index} className={styles.videoEditItem}>
                        {isLast ? (
                          <input type="url" value={video.url || ""} onChange={(e) => setEditingTeam({ ...editingTeam, video_link: editingTeam.video_link.map((v, i) => (i === index ? { ...v, url: e.target.value } : v)) })} className={styles.videoInput} placeholder="https://..." />
                        ) : (
                          <a href={video.url} target="_blank" rel="noopener noreferrer" className={styles.videoLinkDisplay}>
                            {video.url}
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className={styles.editCheckboxesContainer}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={editingTeam.email_verified} onChange={(e) => setEditingTeam({ ...editingTeam, email_verified: e.target.checked })} className={styles.checkbox} />
                  <span className={styles.checkboxText}>Email Verified</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={editingTeam.is_active} onChange={(e) => setEditingTeam({ ...editingTeam, is_active: e.target.checked })} className={styles.checkbox} />
                  <span className={styles.checkboxText}>Active</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" checked={editingTeam.video_freeze} onChange={(e) => setEditingTeam({ ...editingTeam, video_freeze: e.target.checked })} className={styles.checkbox} />
                  <span className={styles.checkboxText}>Video Freeze</span>
                </label>
              </div>
              <div>
                <h4 className={styles.editSectionTitle}>Team Members</h4>
                <div className={styles.editMembersList}>
                  {editingTeam.team_members.map((member, index) => (
                    <div key={index} className={styles.editMemberItem}>
                      <input type="text" placeholder="Name" value={member.name} onChange={(e) => { const updatedMembers = [...editingTeam.team_members]; updatedMembers[index].name = e.target.value; setEditingTeam({ ...editingTeam, team_members: updatedMembers }); }} className={styles.memberInput} />
                      <input type="email" placeholder="Email" value={member.email} onChange={(e) => { const updatedMembers = [...editingTeam.team_members]; updatedMembers[index].email = e.target.value; setEditingTeam({ ...editingTeam, team_members: updatedMembers }); }} className={styles.memberInput} />
                      <button onClick={() => { const updatedMembers = editingTeam.team_members.filter((_, i) => i !== index); setEditingTeam({ ...editingTeam, team_members: updatedMembers }); }} className={`${styles.iconButton} ${styles.iconButtonDelete}`} disabled={editingTeam.team_members.length <= 1}>
                        <Trash2 className={styles.actionIcon} />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => { const updatedMembers = [...editingTeam.team_members, { name: "", email: "" }]; setEditingTeam({ ...editingTeam, team_members: updatedMembers }); }} className={styles.addMemberButton} disabled={editingTeam.team_members.length >= 4}>
                  + Add Member
                </button>
              </div>
              <div className={styles.modalFooter}>
                <button onClick={() => setShowEditModal(false)} className={`${styles.button} ${styles.cancelButton}`}>
                  Cancel
                </button>
                <button onClick={handleSaveEdit} className={`${styles.button} ${styles.saveButton}`} disabled={isUpdating}>
                  <Save className={styles.actionIcon} />
                  <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && teamToDelete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.deleteModalContent}>
            <div className={styles.modalBody}>
              <div className={styles.deleteModalHeader}>
                <div className={styles.deleteIconWrapper}>
                  <Trash2 className={styles.deleteIcon} />
                </div>
                <div>
                  <h3 className={styles.modalTitle}>Delete Team</h3>
                  <p className={styles.textGray600}>This action cannot be undone</p>
                </div>
              </div>
              <p className={styles.deleteConfirmationText}>
                Are you sure you want to delete the team led by <strong>{teamToDelete.name}</strong>?
              </p>
              <div className={styles.modalFooter}>
                <button onClick={() => setShowDeleteModal(false)} className={`${styles.button} ${styles.cancelButton}`}>
                  Cancel
                </button>
                <button onClick={confirmDelete} className={`${styles.button} ${styles.deleteButton}`} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete Team"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}