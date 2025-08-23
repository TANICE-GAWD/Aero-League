import { useState, useMemo, useEffect } from "react";
import { Users, Mail, Phone, School, Video, CheckCircle, XCircle, Eye, Edit, Trash2, Search, ChevronUp, ChevronDown, X, Save } from "lucide-react";
import { useGetTeamsQuery, useUpdateTeamMutation, useDeleteTeamMutation } from "../../app/api/userApiSlice";
import './Teams.css'; // Import the new CSS file

export default function Teams() {
    const { data: teamsData = [], isLoading, isFetching } = useGetTeamsQuery([], {
        pollingInterval: 15000, refetchOnFocus: true, refetchOnReconnect: true,
    });
    const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
    const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

    const [teams, setTeams] = useState(teamsData);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortDirection, setSortDirection] = useState("asc");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editingTeam, setEditingTeam] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [filters, setFilters] = useState({ hasVideo: false, frozen: false });

    useEffect(() => { setTeams(teamsData); }, [teamsData]);

    const filteredAndSortedTeams = useMemo(() => {
        let filtered = teams.filter((team) =>
            team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.institute_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filters.hasVideo) { filtered = filtered.filter(team => team.video_link?.length > 0); }
        if (filters.frozen) { filtered = filtered.filter(team => team.video_freeze === true); }
        
        return filtered.sort((a, b) => {
            let aValue = a[sortField]; let bValue = b[sortField];
            if (sortField === "team_members") { aValue = a.team_members.length; bValue = b.team_members.length; }
            if (typeof aValue === "string") { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
            if (sortDirection === "asc") return aValue > bValue ? 1 : -1;
            else return aValue < bValue ? 1 : -1;
        });
    }, [filters, teams, searchTerm, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        else { setSortField(field); setSortDirection("asc"); }
    };

    const confirmDelete = async () => {
        if (teamToDelete) {
            await deleteTeam(teamToDelete.id);
            setTeams(teams.filter((t) => t.id !== teamToDelete.id));
            setShowDeleteModal(false);
            setTeamToDelete(null);
        }
    };

    const handleSaveEdit = async () => {
        if (editingTeam) {
            const originalTeam = teams.find(t => t.id === editingTeam.id);
            const changes = {};
            Object.keys(editingTeam).forEach(key => {
                if (key !== 'id' && JSON.stringify(originalTeam[key]) !== JSON.stringify(editingTeam[key])) {
                    changes[key] = editingTeam[key];
                }
            });
            await updateTeam({ id: editingTeam.id, team: changes });
            setShowEditModal(false);
            setEditingTeam(null);
        }
    };

    const SortButton = ({ field, children }) => (
        <button onClick={() => handleSort(field)} className="sort-button">
            <span>{children}</span>
            {sortField === field && (sortDirection === "asc" ? <ChevronUp className="icon-small" /> : <ChevronDown className="icon-small" />)}
        </button>
    );

    const closeModal = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div>
                    <h2 className="page-title">Teams Management</h2>
                    <p className="page-subtitle">View and manage all registered teams</p>
                </div>
                <div className="header-actions">
                    <span className="total-badge">{teams.length} Total Teams</span>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="search-bar">
                <div className="search-input-wrapper">
                    <Search className="search-icon" />
                    <input type="text" placeholder="Search teams by name, email, or institute..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
                </div>
                <div className="filter-group">
                    <label className="checkbox-label"><input type="checkbox" checked={filters.hasVideo} onChange={() => setFilters({ ...filters, hasVideo: !filters.hasVideo })} className="checkbox" /><span>Has Video</span></label>
                    <label className="checkbox-label"><input type="checkbox" checked={filters.frozen} onChange={() => setFilters({ ...filters, frozen: !filters.frozen })} className="checkbox" /><span>Frozen</span></label>
                </div>
            </div>

            {/* Teams Table */}
            {isLoading || isFetching ? <div className="loading-text">Loading...</div> :
                <div className="table-container">
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead className="table-header">
                                <tr>
                                    <th className="table-heading"><SortButton field="name">Team Leader</SortButton></th>
                                    <th className="table-heading"><SortButton field="email">Contact</SortButton></th>
                                    <th className="table-heading"><SortButton field="institute_name">Institute</SortButton></th>
                                    <th className="table-heading"><SortButton field="team_members">Team Size</SortButton></th>
                                    <th className="table-heading">Status</th>
                                    <th className="table-heading">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {filteredAndSortedTeams.map((team) => (
                                    <tr key={team.id} className="table-row">
                                        <td className="table-cell">
                                            <div className="user-cell">
                                                <div className="avatar"><span className="avatar-initials">{team.name.split(" ").map((n) => n[0]).join("")}</span></div>
                                                <div className="user-info">
                                                    <div className="user-name">{team.name}</div>
                                                    <div className="user-id">ID: {team.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="table-cell"><div className="user-name">{team.email}</div><div className="user-id">{team.phone_number}</div></td>
                                        <td className="table-cell"><div className="user-name">{team.institute_name}</div></td>
                                        <td className="table-cell">
                                            <div className="team-size-cell"><Users className="icon-small icon-muted" /><span>{team.team_members.length + 1}</span></div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="status-badges-group">
                                                <span className={`status-badge ${team.email_verified ? 'verified' : 'unverified'}`}>{team.email_verified ? <CheckCircle className="icon-tiny" /> : <XCircle className="icon-tiny" />}{team.email_verified ? "Verified" : "Unverified"}</span>
                                                {team.video_link.length > 0 && (<span className="status-badge submitted"><Video className="icon-tiny" />Submitted</span>)}
                                                {team.video_freeze && (<span className="status-badge frozen"><Video className="icon-tiny" />Frozen</span>)}
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="action-buttons-group">
                                                <button onClick={() => { setSelectedTeam(team); setShowViewModal(true); }} className="action-button view" title="View Details"><Eye className="icon-small" /></button>
                                                <button onClick={() => { setEditingTeam({ ...team }); setShowEditModal(true); }} className="action-button edit" title="Edit Team"><Edit className="icon-small" /></button>
                                                <button onClick={() => { setTeamToDelete(team); setShowDeleteModal(true); }} className="action-button delete" title="Delete Team"><Trash2 className="icon-small" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>}

            {/* View Modal */}
            {showViewModal && selectedTeam && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header"><h3 className="modal-title">Team Details</h3><button onClick={closeModal} className="modal-close-button"><X className="icon-large" /></button></div>
                        <div className="modal-body">
                            <div className="detail-header">
                                <div className="avatar large"><span className="avatar-initials large">{selectedTeam.name.split(" ").map((n) => n[0]).join("")}</span></div>
                                <div><h4 className="detail-title">{selectedTeam.name}</h4><p className="detail-subtitle">Team Leader</p></div>
                            </div>
                            <div className="detail-grid">
                                <div className="detail-column">
                                    <div className="detail-item"><Mail className="icon-medium icon-muted" /><div><p className="detail-label">Email</p><p className="detail-value">{selectedTeam.email}</p></div>{selectedTeam.email_verified && <CheckCircle className="icon-small icon-verified" />}</div>
                                    <div className="detail-item"><Phone className="icon-medium icon-muted" /><div><p className="detail-label">Phone</p><p className="detail-value">{selectedTeam.phone_number}</p></div></div>
                                </div>
                                <div className="detail-column">
                                    <div className="detail-item"><School className="icon-medium icon-muted" /><div><p className="detail-label">Institute</p><p className="detail-value">{selectedTeam.institute_name}</p></div></div>
                                    <div className="detail-item"><Users className="icon-medium icon-muted" /><div><p className="detail-label">Team Size</p><p className="detail-value">{selectedTeam.team_members.length + 1} members</p></div></div>
                                </div>
                            </div>
                            <div>
                                <h5 className="detail-section-title">Team Members</h5>
                                <div className="member-list">
                                    {selectedTeam.team_members.map((member, index) => (
                                        <div key={index} className="member-item">
                                            <div className="avatar small"><span className="avatar-initials small">{member.name.split(" ").map((n) => n[0]).join("")}</span></div>
                                            <div><p className="member-name">{member.name}</p><p className="member-email">{member.email}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {selectedTeam.video_link.length > 0 && (
                                <div>
                                    <h5 className="detail-section-title">Video Submission</h5>
                                    <div className="video-submission-box">
                                        <div><p className="detail-label">Submitted Video</p><p className="detail-value video-link">{selectedTeam.video_link[selectedTeam.video_link.length - 1].url}</p></div>
                                        <a href={selectedTeam.video_link[selectedTeam.video_link.length - 1].url} target="_blank" rel="noopener noreferrer" className="button button-primary view-video"><Video className="icon-small" /><span>View</span></a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editingTeam && (
                <div className="modal-overlay">
                    <div className="modal-content large">
                        <div className="modal-header"><h3 className="modal-title">Edit Team</h3><button onClick={closeModal} className="modal-close-button"><X className="icon-large" /></button></div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div className="form-group"><label className="form-label">Name</label><input type="text" value={editingTeam.name} onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Email</label><input type="email" value={editingTeam.email} className="form-input" disabled={true} /></div>
                                <div className="form-group"><label className="form-label">Phone</label><input type="tel" value={editingTeam.phone_number} onChange={(e) => setEditingTeam({ ...editingTeam, phone_number: e.target.value })} className="form-input" /></div>
                                <div className="form-group"><label className="form-label">Institute</label><input type="text" value={editingTeam.institute_name} onChange={(e) => setEditingTeam({ ...editingTeam, institute_name: e.target.value })} className="form-input" /></div>
                            </div>
                            <div>
                                <h4 className="detail-section-title">Video Submissions</h4>
                                <div className="edit-list">
                                    {editingTeam.video_link.map((video, index) => (<div key={index} className="edit-list-item"><input type="url" value={video.url || ""} onChange={(e) => setEditingTeam({ ...editingTeam, video_link: editingTeam.video_link.map((v, i) => i === index ? { ...v, url: e.target.value } : v) })} className="form-input" placeholder="https://..." /></div>))}
                                </div>
                            </div>
                            <div className="checkbox-group">
                                <label className="checkbox-label"><input type="checkbox" checked={editingTeam.email_verified} onChange={(e) => setEditingTeam({ ...editingTeam, email_verified: e.target.checked })} className="checkbox" /><span>Email Verified</span></label>
                                <label className="checkbox-label"><input type="checkbox" checked={editingTeam.is_active} onChange={(e) => setEditingTeam({ ...editingTeam, is_active: e.target.checked })} className="checkbox" /><span>Active</span></label>
                                <label className="checkbox-label"><input type="checkbox" checked={editingTeam.video_freeze} onChange={(e) => setEditingTeam({ ...editingTeam, video_freeze: e.target.checked })} className="checkbox" /><span>Video Freeze</span></label>
                            </div>
                            <div>
                                <h4 className="detail-section-title">Team Members</h4>
                                <div className="edit-list">
                                    {editingTeam.team_members.map((member, index) => (
                                        <div key={index} className="member-edit-row">
                                            <input type="text" placeholder="Name" value={member.name} onChange={(e) => { const updated = [...editingTeam.team_members]; updated[index].name = e.target.value; setEditingTeam({ ...editingTeam, team_members: updated }); }} className="form-input" />
                                            <input type="email" placeholder="Email" value={member.email} onChange={(e) => { const updated = [...editingTeam.team_members]; updated[index].email = e.target.value; setEditingTeam({ ...editingTeam, team_members: updated }); }} className="form-input" />
                                            <button onClick={() => { const updated = editingTeam.team_members.filter((_, i) => i !== index); setEditingTeam({ ...editingTeam, team_members: updated }); }} className="action-button delete" disabled={editingTeam.team_members.length <= 1}><Trash2 className="icon-small" /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => setEditingTeam({ ...editingTeam, team_members: [...editingTeam.team_members, { name: "", email: "" }] })} className="button add-member-button" disabled={editingTeam.team_members.length >= 4}>+ Add Member</button>
                            </div>
                            <div className="modal-footer"><button onClick={closeModal} className="button button-secondary">Cancel</button><button onClick={handleSaveEdit} className="button button-primary" disabled={isUpdating}><Save className="icon-small" />{isUpdating ? "Saving..." : "Save Changes"}</button></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && teamToDelete && (
                <div className="modal-overlay">
                    <div className="modal-content delete-modal">
                        <div className="modal-header delete">
                            <div className="modal-icon-wrapper delete"><Trash2 className="icon-large icon-delete" /></div>
                            <div><h3 className="modal-title">Delete Team</h3><p className="modal-subtitle">This action cannot be undone</p></div>
                        </div>
                        <p className="modal-body-text">Are you sure you want to delete the team led by <strong>{teamToDelete.name}</strong>?</p>
                        <div className="modal-footer"><button onClick={closeModal} className="button button-secondary">Cancel</button><button onClick={confirmDelete} className="button button-danger" disabled={isDeleting}>{isDeleting ? "Deleting..." : "Delete Team"}</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}