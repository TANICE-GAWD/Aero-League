import React from 'react';
import { 
  FaUserCircle, FaBuilding, FaPhone, FaUsers, 
  FaEnvelopeOpenText, FaLink, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';
import './UserProfile.css'; 

const UserProfile = ({ user }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="profile-view-container">
      <div className="profile-card">
        <div className="profile-card-header">
          <FaUserCircle className="profile-avatar-icon" />
          <h2 className="profile-user-name">{user.name}</h2>
          <p className="profile-user-email">{user.email}</p>
        </div>
        <div className="profile-card-body">
          <div className="profile-detail-grid">
            
            <div className="detail-item">
              <span className="detail-icon"><FaBuilding /></span>
              <span className="detail-label">Institute</span>
              <span className="detail-value">{user.institute_name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon"><FaPhone /></span>
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{user.phone_number}</span>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon"><FaUsers /></span>
              <span className="detail-label">Team Members</span>
              <span className="detail-value">{user.team_members?.name || 'N/A'}</span>
            </div>

            <div className="detail-item">
              <span className="detail-icon"><FaEnvelopeOpenText /></span>
              <span className="detail-label">Email Status</span>
              <span className="detail-value">
                {user.email_verified ? (
                  <span className="status-tag verified">
                    <FaCheckCircle /> Verified
                  </span>
                ) : (
                  <span className="status-tag unverified">
                    <FaExclamationTriangle /> Not Verified
                  </span>
                )}
              </span>
            </div>

             <div className="detail-item">
              <span className="detail-icon"><FaLink /></span>
              <span className="detail-label">Video Submission</span>
              <span className="detail-value link">
                {user.video_link ? (
                  <a href={user.video_link} target="_blank" rel="noopener noreferrer">
                    View Submitted Link
                  </a>
                ) : (
                  'Not yet submitted'
                )}
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;