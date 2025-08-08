import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaTachometerAlt, FaUserAstronaut, FaBell, FaKey, FaSignOutAlt, FaVideo,
    FaSpinner, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';

// --- Import your new component ---
import UserProfile from './UserProfile'; // Ensure this path is correct
import './UserDashboard.css';

// --- API Helper ---
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

// --- Main Dashboard Component ---
const UserDashboard = () => {
  // --- Component State ---
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');

  // --- Form State ---
  // ADD VIDEO - STEP 1: State to manage the video link input field.
  const [videoLink, setVideoLink] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // --- UI State ---
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // --- Hooks ---
  const navigate = useNavigate();
  const baseUrl = 'https://tal-backend.vercel.app/users/';
  const token = localStorage.getItem('access_token');

  // --- Data Fetching ---
  const fetchInitialData = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // ADD VIDEO - STEP 1.1: Pre-fill the input with the user's existing video link, if any.
      setVideoLink(parsedUser.video_link || '');
    } else {
      localStorage.removeItem('access_token');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const notificationsData = await api.request('GET', `${baseUrl}notifications/`, token);
      setNotifications(notificationsData);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401') || err.message.includes('403')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, token]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // --- Event Handlers ---
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

  // ADD VIDEO - STEP 2: The handler function that submits the video link to the backend.
  const handleAddVideoLink = async (e) => {
    e.preventDefault();
    clearMessages();
    setIsLoading(true);
    try {
      // Makes the API call to the '/add-video/' endpoint.
      await api.request('POST', `${baseUrl}add-video/`, token, { video_link: videoLink });
      setSuccess('Video link updated successfully!');
      
      // Updates user state locally for an immediate UI update.
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
      setSuccess('Password changed successfully! You will be logged out shortly.');
      setTimeout(handleLogout, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Methods for Different Views ---
  const renderDashboard = () => (
    <>
      {/* ADD VIDEO - STEP 3: The UI form for submitting the link. */}
      <div className="content-section">
        <h2><FaVideo /> Submit Your Video Link</h2>
        {/* The onSubmit handler is correctly wired to the handleAddVideoLink function. */}
        <form onSubmit={handleAddVideoLink} className="dashboard-form">
          <div className="form-group">
            <label htmlFor="videoLink">YouTube or Google Drive Link</label>
            <input
              type="url"
              id="videoLink"
              // The input's value is controlled by the 'videoLink' state.
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

  // --- Loading State ---
  if (!user) {
    return (
      <div className="loading-fullpage">
        <FaSpinner className="spinner-icon" />
        <p>Loading Pilot Dashboard...</p>
      </div>
    );
  }

  // --- Main Component Render ---
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
        
        {/* --- Conditionally Render the Active View --- */}
        {activeView === 'dashboard' && renderDashboard()}
        
        {/* Use the new UserProfile component for the profile view */}
        {activeView === 'profile' && <UserProfile user={user} />} 

        {activeView === 'password' && renderPasswordChange()}
      </main>
    </div>
  );
};

export default UserDashboard;