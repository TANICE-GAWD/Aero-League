import {
  Video,
  Eye,
  CheckCircle,
  ExternalLink,
  Bell,
  User,
  Mail,
  Phone,
  School,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from '../../features/authSlice';
import { useGetNotificationsQuery } from '../../app/api/userApiSlice';
import './Dashboard.css'; // Import the CSS file

export default function UserDashboard() {
  const userData = useSelector(selectUser);
  const recentSubmission = userData.video_link;
  const { data: notifications, isLoading, isFetching } = useGetNotificationsQuery(null, {
    pollingInterval: 15000,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  return (
    <div className="user-dashboard-container">
      <div className="welcome-banner">
        <h1 className="welcome-title">Welcome back, {userData.name.split(" ")[0]}!</h1>
        <p className="welcome-subtitle">Track your progress in the Thapar Drone Challenge 2025</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-card-label">Team Members</p>
              <p className="stat-card-value">{userData.team_members.length + 1}</p>
            </div>
            <div className="stat-icon-wrapper icon-blue">
              <User className="icon" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-card-label">Submission Status</p>
              <p className="stat-card-value status-submitted">{userData.video_link ? "Submitted" : "Not Submitted"}</p>
            </div>
            <div className="stat-icon-wrapper icon-green">
              <CheckCircle className="icon" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div>
              <p className="stat-card-label">Notifications</p>
              <p className="stat-card-value status-pending">{isLoading ? "Loading..." : notifications?.filter(n => n).length || 0}</p>
            </div>
            <div className="stat-icon-wrapper icon-yellow">
              <Bell className="icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="main-content-grid">
        <div className="user-details-card">
          <div className="card-header user-details-header">
            <div className="card-header-icon-wrapper">
              <User className="icon-white" />
            </div>
            <h2 className="card-title">User Details</h2>
          </div>
          <div className="card-body user-details-body">
            <div className="detail-item">
              <User className="detail-icon" />
              <div>
                <p className="detail-label">Full Name</p>
                <p className="detail-value">{userData.name}</p>
              </div>
            </div>
            <div className="detail-item">
              <Mail className="detail-icon" />
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{userData.email}</p>
              </div>
            </div>
            <div className="detail-item">
              <School className="detail-icon" />
              <div>
                <p className="detail-label">Institute</p>
                <p className="detail-value">{userData.institute_name}</p>
              </div>
            </div>
            <div className="detail-item">
              <Phone className="detail-icon" />
              <div>
                <p className="detail-label">Phone</p>
                <p className="detail-value">{userData.phone_number}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="submission-and-notifications-wrapper">
          {recentSubmission && (
            <div className="card recent-submission-card">
              <div className="card-header submission-header">
                <div className="card-header-icon-wrapper green">
                  <CheckCircle className="icon-white" />
                </div>
                <h2 className="card-title">Recent Submission</h2>
              </div>
              <div className="card-body">
                <div className="submission-row">
                  <div className="submission-info">
                    <div className="submission-icon-wrapper">
                      <Video className="icon-blue" />
                    </div>
                    <p className="submission-label">Latest Video Submission</p>
                  </div>
                  <a href={recentSubmission} target="_blank" rel="noopener noreferrer" className="view-video-button">
                    <Eye className="button-icon" />
                    <span>View Video</span>
                    <ExternalLink className="button-icon" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card notifications-card">
        <div className="card-header notifications-header">
          <h2 className="card-title notifications-title-flex">
            <div className="notification-title-icon-wrapper">
              <Bell className="icon-yellow" />
            </div>
            <span>Notifications</span>
          </h2>
        </div>
        <div className="notifications-list">
          {isLoading || isFetching ? (
            <div className="loading-state">
              <div className="loading-text">Loading notifications...</div>
            </div>
          ) : (
            notifications?.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-content">
                  <div className="notification-icon-wrapper">
                    <Bell className="icon-blue" />
                  </div>
                  <div className="notification-details">
                    <div className="notification-top-row">
                      <p className="notification-title">{notification.title}</p>
                      <p className="notification-timestamp">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                    <div className="notification-bottom-row">
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-recipient">To: {notification.user === "all" ? "Everyone" : "Me"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}