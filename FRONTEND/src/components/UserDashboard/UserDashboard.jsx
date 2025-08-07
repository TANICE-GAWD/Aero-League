import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaUserAstronaut, FaBell, FaKey, FaSignOutAlt, FaVideo, 
    FaSpinner, FaCheckCircle, FaExclamationTriangle 
} from 'react-icons/fa';
import './UserDashboard.css';

// --- API Helper (remains the same) ---
const api = {
  request: async (method, url, token, body = null) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: body ? JSON.stringify(body) : null,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed with status ' + response.status }));
        throw new Error(errorData.error || JSON.stringify(errorData));
    }
    if (response.status === 204) return null;
    return response.json();
  }
};

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard', 'profile', 'password'
  
  // Form State
  const [videoLink, setVideoLink] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const baseUrl = 'https://tal-backend.vercel.app/users/'; 
  const token = localStorage.getItem('access_token');

  // --- Data Fetching (UPDATED) ---
  const fetchInitialData = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user profile and notifications in parallel
      const [profileData, notificationsData] = await Promise.all([
        api.request('GET', `${baseUrl}profile/`, token), // <-- Fetches user profile
        api.request('GET', `${baseUrl}notifications/`, token)
      ]);

      // Set state with fresh data
      setUser(profileData);
      setNotifications(notificationsData);
      
      // Pre-fill form fields
      setVideoLink(profileData.video_link || '');

      // Update localStorage with fresh user data
      localStorage.setItem('user', JSON.stringify(profileData));

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
      // If token is invalid, log out the user
      if (err.message.includes('401') || err.message.includes('403')) {
        setTimeout(handleLogout, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, token, baseUrl]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- Handlers ---
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const clearMessages = () => {
    setError(null);
    setSuccess('');
  };

  const handleNavigate = (view) => {
    clearMessages();
    setActiveView(view);
  };

  const handleAddVideoLink = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);
    try {
      await api.request('POST', `${baseUrl}add-video/`, token, { video_link: videoLink });
      setSuccess('Video link updated successfully!');
      // Update user state and localStorage
      const updatedUser = {...user, video_link: videoLink};
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);

    const payload = { new_password: newPassword };
    if (!user.first_login) {
      payload.old_password = oldPassword;
    }

    try {
      await api.request('POST', `${baseUrl}password/change/`, token, payload);
      setSuccess('Password changed successfully! Please log in again.');
      setTimeout(handleLogout, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Methods ---
  const renderDashboard = () => (
    <>
      <div className="content-section">
        <h2><FaVideo /> Submit Your Video Link</h2>
        <form onSubmit={handleAddVideoLink} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="videoLink">YouTube or Google Drive Link</label>
            <input
              type="url"
              id="videoLink"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              placeholder="https://..."
              required
            />
          </div>
          <button type="submit" className="button-primary" disabled={isLoading}>
            {isLoading ? <FaSpinner className="spinner-icon" /> : 'Save Link'}
          </button>
        </form>
      </div>

      <div className="content-section">
        <h2><FaBell /> Notifications</h2>
        <div className="notification-list">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div key={n.id} className="notification-item">
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span>{new Date(n.created_at).toLocaleDateString()}</span>
              </div>
            ))
          ) : (
            <p>You have no new notifications.</p>
          )}
        </div>
      </div>
    </>
  );

  const renderProfile = () => (
    <div className="content-section">
      <h2><FaUserAstronaut /> Your Profile</h2>
      <div className="profile-details-card">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Institute:</strong> {user.institute_name}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
        <p>
          <strong>Email Status:</strong> 
          {user.email_verified 
            ? <span className="status-tag verified"><FaCheckCircle /> Verified</span> 
            : <span className="status-tag unverified"><FaExclamationTriangle /> Not Verified</span>}
        </p>
        <p><strong>Team Members:</strong> {user.team_members}</p>
      </div>
    </div>
  );

  const renderPasswordChange = () => (
    <div className="content-section">
      <h2><FaKey /> Change Your Password</h2>
      <form onSubmit={handleChangePassword} className="dashboard-form">
        {!user.first_login && (
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength="8"
          />
        </div>
        <button type="submit" className="button-primary" disabled={isLoading}>
          {isLoading ? <FaSpinner className="spinner-icon" /> : 'Update Password'}
        </button>
      </form>
    </div>
  );

  if (isLoading && !user) {
    return (
      <div className="loading-fullpage">
        <FaSpinner className="spinner-icon" />
        <p>Loading Pilot Dashboard...</p>
      </div>
    );
  }
  
  if (!user) {
      return (
        <div className="loading-fullpage">
            <p style={{color: 'red'}}>{error || 'Could not load user data. Please try logging in again.'}</p>
        </div>
      )
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <FaUserAstronaut className="sidebar-main-icon" />
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <nav className="sidebar-nav">
          <button onClick={() => handleNavigate('dashboard')} className={activeView === 'dashboard' ? 'active' : ''}>
            <FaTachometerAlt /> Dashboard
          </button>
          <button onClick={() => handleNavigate('profile')} className={activeView === 'profile' ? 'active' : ''}>
            <FaUserAstronaut /> Profile
          </button>
          <button onClick={() => handleNavigate('password')} className={activeView === 'password' ? 'active' : ''}>
            <FaKey /> Change Password
          </button>
        </nav>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="content-header">
            <h1>Pilot Dashboard</h1>
        </header>
        {error && <div className="message error-message"><FaExclamationTriangle /> {error}</div>}
        {success && <div className="message success-message"><FaCheckCircle /> {success}</div>}
        
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'profile' && renderProfile()}
        {activeView === 'password' && renderPasswordChange()}
      </main>
    </div>
  );
};

export default UserDashboard;