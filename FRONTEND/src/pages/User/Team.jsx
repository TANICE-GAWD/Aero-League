import { useState, useEffect } from 'react';
import { useGetUserQuery, useUpdateUserMutation } from '../../app/api/userApiSlice';
import { Users, Mail, Phone, School, Video, CheckCircle, XCircle, Edit, X, Trash2, Save } from "lucide-react";
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/authSlice';
import './Team.css'; // Import the CSS file

function Team() {
  const { data: user, isLoading } = useGetUserQuery(null, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const dispatch = useDispatch();
  const [userEditingTeam, setUserEditingTeam] = useState(null);
  const [showUserEditModal, setShowUserEditModal] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(setUser({ user: user }));
    }
  }, [user, dispatch]);

  const handleEdit = () => {
    setUserEditingTeam({ ...user, team_members: [...user.team_members] });
    setShowUserEditModal(true);
  };

  const handleUserSaveEdit = async () => {
    try {
      const response = await updateUser(userEditingTeam).unwrap();
      if (response) {
        dispatch(setUser({ user: userEditingTeam }));
        setShowUserEditModal(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  if (isLoading) {
    return (
      <div className='loading-container'>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="team-page-container">
        <div className="page-header">
          <div>
            <h2 className="page-title">Team Overview</h2>
            <p className="page-subtitle">Manage your team information and submissions</p>
          </div>
          <div className="header-actions">
            <button className="edit-team-button" onClick={handleEdit}>
              <Edit className="icon-small" />
              Edit Team Details
            </button>
            <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
              {user.is_active ? <CheckCircle className="icon-small" /> : <XCircle className="icon-small" />}
              <span>{user.is_active ? "Active" : "Inactive"}</span>
            </span>
          </div>
        </div>

        {/* Team Leader Info */}
        <div className="card">
          <div className="team-leader-header">
            <div className="avatar">
              <span className="avatar-initials">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
            <div>
              <h3 className="user-name">{user.name}</h3>
              <p className="user-role">Team Leader</p>
            </div>
          </div>
          <div className="details-grid">
            <div className="details-column">
              <div className="detail-item">
                <Mail className="detail-icon" />
                <div>
                  <p className="detail-label">Email</p>
                  <p className="detail-value">{user.email}</p>
                </div>
                {user.email_verified && <CheckCircle className="icon-verified" />}
              </div>
              <div className="detail-item">
                <Phone className="detail-icon" />
                <div>
                  <p className="detail-label">Phone</p>
                  <p className="detail-value">{user.phone_number}</p>
                </div>
              </div>
            </div>
            <div className="details-column">
              <div className="detail-item">
                <School className="detail-icon" />
                <div>
                  <p className="detail-label">Institute</p>
                  <p className="detail-value">{user.institute_name}</p>
                </div>
              </div>
              <div className="detail-item">
                <Users className="detail-icon" />
                <div>
                  <p className="detail-label">Team Size</p>
                  <p className="detail-value">
                    {user.team_members.length + 1} member{user.team_members.length !== 0 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="card">
          <h3 className="card-title">
            <Users className="icon-medium" />
            <span>Team Members</span>
          </h3>
          <div className="member-list">
            {user.team_members.map((member, index) => (
              <div key={index} className="member-item">
                <div className="member-info">
                  <div className="avatar small">
                    <span className="avatar-initials small">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="member-name">{member.name}</p>
                    <p className="member-email">{member.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Submission */}
        <div className="card">
          <h3 className="card-title">
            <Video className="icon-medium" />
            <span>Video Submission</span>
          </h3>
          {user?.video_link.length !== 0 ? (
            <div className="submission-info-box">
              <div className="submission-details">
                <div>
                  <p className="detail-label">Current Submission</p>
                  <p className="submission-link">{user.video_link[user.video_link.length - 1].url}</p>
                </div>
                <div className="submission-actions">
                  <p className="submission-date">Uploaded on {new Date(user.video_link[user.video_link.length - 1].added_at).toLocaleDateString()}</p>
                  <a href={user.video_link[user.video_link.length - 1].url} target="_blank" rel="noopener noreferrer" className="view-video-button">
                    <Video className="icon-small" />
                    <span>View Video</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-submission-placeholder">
              <Video className="placeholder-icon" />
              <p>No video submission yet</p>
              <p className="detail-label">Upload your team's video to get started</p>
            </div>
          )}
        </div>

        {/* Status Indicators */}
        <div className="status-indicators-grid">
          <div className="status-card">
            <div className="status-content">
              {user.email_verified ? <CheckCircle className="status-icon success" /> : <XCircle className="status-icon error" />}
              <div>
                <p className="detail-label">Email Status</p>
                <p className="status-text">{user.email_verified ? "Verified" : "Not Verified"}</p>
              </div>
            </div>
          </div>
          <div className="status-card">
            <div className="status-content">
              {user.video_link.length !== 0 ? <CheckCircle className="status-icon success" /> : <XCircle className="status-icon error" />}
              <div>
                <p className="detail-label">Submission</p>
                <p className="status-text">{user.video_link.length !== 0 ? "Submitted" : "Pending"}</p>
              </div>
            </div>
          </div>
          <div className="status-card">
            <div className="status-content">
              {user.video_freeze ? <CheckCircle className="status-icon success" /> : <XCircle className="status-icon error" />}
              <div>
                <p className="detail-label">Final Submission</p>
                <p className="status-text">{user.video_freeze ? "Submitted" : "Pending"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showUserEditModal && userEditingTeam && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button onClick={() => setShowUserEditModal(false)} className="modal-close-button">
                <X className="icon-large" />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" value={userEditingTeam.name} onChange={(e) => setUserEditingTeam({ ...userEditingTeam, name: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" value={userEditingTeam.phone_number} onChange={(e) => setUserEditingTeam({ ...userEditingTeam, phone_number: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Institute Name</label>
                  <input type="text" value={userEditingTeam.institute_name} onChange={(e) => setUserEditingTeam({ ...userEditingTeam, institute_name: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input type="text" value={userEditingTeam.team_name} onChange={(e) => setUserEditingTeam({ ...userEditingTeam, team_name: e.target.value })} className="form-input" />
                </div>
              </div>

              <div>
                <h4 className="form-subtitle">Team Members</h4>
                <div className="member-edit-list">
                  {userEditingTeam.team_members.map((member, index) => (
                    <div key={index} className="member-edit-row">
                      <input type="text" placeholder="Name" value={member.name} onChange={(e) => {
                        const updatedMembers = [...userEditingTeam.team_members];
                        updatedMembers[index].name = e.target.value;
                        setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                      }} className="form-input" />
                      <input type="email" placeholder="Email" value={member.email} onChange={(e) => {
                        const updatedMembers = [...userEditingTeam.team_members];
                        updatedMembers[index].email = e.target.value;
                        setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                      }} className="form-input" />
                      <button onClick={() => {
                        const updatedMembers = userEditingTeam.team_members.filter((_, i) => i !== index);
                        setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                      }} className="delete-member-button" disabled={userEditingTeam.team_members.length <= 1}>
                        <Trash2 className="icon-small" />
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  const updatedMembers = [...userEditingTeam.team_members, { name: "", email: "" }];
                  setUserEditingTeam({ ...userEditingTeam, team_members: updatedMembers });
                }} className="add-member-button" disabled={userEditingTeam.team_members.length >= 4}>
                  + Add Member
                </button>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setShowUserEditModal(false)} className="button-secondary">
                Cancel
              </button>
              <button onClick={handleUserSaveEdit} className="button-primary" disabled={isUpdating}>
                <Save className="icon-small" />
                <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Team;