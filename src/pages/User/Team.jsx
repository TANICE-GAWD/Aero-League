import { useState, useEffect } from 'react'
import { useGetUserQuery } from '../../app/api/userApiSlice'
import { Users, Mail, Phone, School, Video, CheckCircle, XCircle, Crown, X, Trash2, Save, Edit } from "lucide-react"
import { useDispatch } from 'react-redux'
import { setUser } from '../../features/authSlice'
import { useUpdateUserMutation } from '../../app/api/userApiSlice'
import styles from './Team.module.css';


function Team() {
  const { data: user, isLoading } = useGetUserQuery(null, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true
  })
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const dispatch = useDispatch()
  const [userEditingTeam, setUserEditingTeam] = useState(null)
  const [showUserEditModal, setShowUserEditModal] = useState(false)

  useEffect(() => {
    if (user) {
      dispatch(setUser({ user: user }))
    }
  }, [user, dispatch])

  const handleEdit = () => {
    setUserEditingTeam({ ...user, team_members: [...user.team_members] })
    setShowUserEditModal(true)
  }

  const handleUserSaveEdit = async () => {
    try {
      const response = await updateUser(userEditingTeam).unwrap()
      if (response) {
        dispatch(setUser({ user: userEditingTeam }))
        setShowUserEditModal(false)
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  return (
    <>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.header}>
            <div>
              <h2 className={styles.headerTitle}>Team Overview</h2>
              <p className={styles.headerSubtitle}>Manage your team information and submissions</p>
            </div>
            <div className={styles.headerActions}>
              <button
                className={styles.editButton}
                onClick={handleEdit}
              >
                <Edit className={styles.iconSmall} />
                Edit Team Details
              </button>
              <span
                className={`${styles.statusBadge} ${user.is_active ? styles.activeStatus : styles.inactiveStatus}`}
              >
                {user.is_active ? <CheckCircle className={styles.iconSmall} /> : <XCircle className={styles.iconSmall} />}
                <span>{user.is_active ? "Active" : "Inactive"}</span>
              </span>
            </div>
          </div>

          {/* Team Leader Info */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.avatarLarge}>
                <span className={styles.avatarTextLarge}>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <h3 className={styles.teamLeaderName}>{user.name}</h3>
                <p className={styles.subtitle}>Team Leader</p>
              </div>
            </div>
            <div className={styles.detailsGrid}>
              <div className={styles.detailsColumn}>
                <div className={styles.detailItem}>
                  <Mail className={styles.iconMedium} />
                  <div>
                    <p className={styles.detailLabel}>Email</p>
                    <p className={styles.detailValue}>{user.email}</p>
                  </div>
                  {user.email_verified && <CheckCircle className={`${styles.iconSmall} ${styles.successIcon}`} />}
                </div>
                <div className={styles.detailItem}>
                  <Phone className={styles.iconMedium} />
                  <div>
                    <p className={styles.detailLabel}>Phone</p>
                    <p className={styles.detailValue}>{user.phone_number}</p>
                  </div>
                </div>
              </div>
              <div className={styles.detailsColumn}>
                <div className={styles.detailItem}>
                  <School className={styles.iconMedium} />
                  <div>
                    <p className={styles.detailLabel}>Institute</p>
                    <p className={styles.detailValue}>{user.institute_name}</p>
                  </div>
                </div>
                <div className={styles.detailItem}>
                  <Users className={styles.iconMedium} />
                  <div>
                    <p className={styles.detailLabel}>Team Size</p>
                    <p className={styles.detailValue}>
                      {user.team_members.length + 1} member{user.team_members.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Users className={styles.iconMedium} />
              <span>Team Members</span>
            </h3>
            <div className={styles.teamMemberList}>
              {user.team_members.map((member, index) => (
                <div key={index} className={styles.teamMemberItem}>
                  <div className={styles.teamMemberInfo}>
                    <div className={styles.avatarMedium}>
                      <span className={styles.avatarTextMedium}>
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className={styles.memberName}>{member.name}</p>
                      <p className={styles.memberEmail}>{member.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Submission */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <Video className={styles.iconMedium} />
              <span>Video Submission</span>
            </h3>
            {user?.video_link.length !== 0 ? (
              <div className={styles.submissionInfoBox}>
                <div className={styles.submissionDetails}>
                  <div>
                    <p className={styles.submissionLabel}>Current Submission</p>
                    <p className={styles.submissionLink}>{user.video_link[user.video_link.length - 1].url}</p>
                  </div>
                  <div className={styles.submissionActions}>
                    <p className={styles.submissionDate}>Uploaded on {new Date(user.video_link[user.video_link.length - 1].added_at).toLocaleDateString()}</p>
                    <a
                      href={user.video_link[user.video_link.length - 1].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.primaryButton}
                    >
                      <Video className={styles.iconSmall} />
                      <span>View Video</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.noSubmission}>
                <Video className={styles.noSubmissionIcon} />
                <p>No video submission yet</p>
                <p className={styles.noSubmissionSubtext}>Upload your team's video to get started</p>
              </div>
            )}
          </div>

          {/* Status Indicators */}
          <div className={styles.statusGrid}>
            <div className={styles.statusCard}>
              <div className={styles.statusItem}>
                {user.email_verified ? <CheckCircle className={`${styles.iconLarge} ${styles.successIcon}`} /> : <XCircle className={`${styles.iconLarge} ${styles.dangerIcon}`} />}
                <div>
                  <p className={styles.detailLabel}>Email Status</p>
                  <p className={styles.statusText}>{user.email_verified ? "Verified" : "Not Verified"}</p>
                </div>
              </div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusItem}>
                {user.video_link.length !== 0 ? <CheckCircle className={`${styles.iconLarge} ${styles.successIcon}`} /> : <XCircle className={`${styles.iconLarge} ${styles.dangerIcon}`} />}
                <div>
                  <p className={styles.detailLabel}>Submission</p>
                  <p className={styles.statusText}>{user.video_link.length !== 0 ? "Submitted" : "Pending"}</p>
                </div>
              </div>
            </div>
            <div className={styles.statusCard}>
              <div className={styles.statusItem}>
                {user.video_freeze ? <CheckCircle className={`${styles.iconLarge} ${styles.successIcon}`} /> : <XCircle className={`${styles.iconLarge} ${styles.dangerIcon}`} />}
                <div>
                  <p className={styles.detailLabel}>Final Submission</p>
                  <p className={styles.statusText}>{user.video_freeze ? "Submitted" : "Pending"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showUserEditModal && userEditingTeam && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {/* Header */}
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Profile</h3>
              <button
                onClick={() => setShowUserEditModal(false)}
                className={styles.closeButton}
              >
                <X className={styles.iconClose} />
              </button>
            </div>
            {/* Body */}
            <div className={styles.modalBody}>
              <div className={styles.modalFormGrid}>
                <div>
                  <label className={styles.formLabel}>Name</label>
                  <input
                    type="text"
                    value={userEditingTeam.name}
                    onChange={(e) => setUserEditingTeam({ ...userEditingTeam, name: e.target.value })}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Phone Number</label>
                  <input
                    type="tel"
                    value={userEditingTeam.phone_number}
                    onChange={(e) => setUserEditingTeam({ ...userEditingTeam, phone_number: e.target.value })}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Institute Name</label>
                  <input
                    type="text"
                    value={userEditingTeam.institute_name}
                    onChange={(e) => setUserEditingTeam({ ...userEditingTeam, institute_name: e.target.value })}
                    className={styles.inputField}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>Team Name</label>
                  <input
                    type="text"
                    value={userEditingTeam.team_name}
                    onChange={(e) => setUserEditingTeam({ ...userEditingTeam, team_name: e.target.value })}
                    className={styles.inputField}
                  />
                </div>
              </div>
              <div>
                <h4 className={styles.modalSubtitle}>Team Members</h4>
                <div className={styles.modalMemberList}>
                  {userEditingTeam.team_members.map((member, index) => (
                    <div key={index} className={styles.modalMemberItem}>
                      <input
                        type="text"
                        placeholder="Name"
                        value={member.name}
                        onChange={(e) => {
                          const updatedMembers = [...userEditingTeam.team_members];
                          updatedMembers[index].name = e.target.value;
                          setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                        }}
                        className={styles.inputField}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        value={member.email}
                        onChange={(e) => {
                          const updatedMembers = [...userEditingTeam.team_members];
                          updatedMembers[index].email = e.target.value;
                          setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                        }}
                        className={styles.inputField}
                      />
                      <button
                        onClick={() => {
                          const updatedMembers = userEditingTeam.team_members.filter((_, i) => i !== index);
                          setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                        }}
                        className={styles.deleteButton}
                        disabled={userEditingTeam.team_members.length <= 1}
                      >
                        <Trash2 className={styles.iconSmall} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    const updatedMembers = [...userEditingTeam.team_members, { name: "", email: "" }];
                    setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                  }}
                  className={styles.addButton}
                  disabled={userEditingTeam.team_members.length >= 4}
                >
                  + Add Member
                </button>
              </div>
            </div>
            {/* Actions */}
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowUserEditModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleUserSaveEdit}
                className={styles.saveButton}
                disabled={isUpdating}
              >
                <Save className={styles.iconSmall} />
                <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Team