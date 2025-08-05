import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUsers, FaBell, FaSignOutAlt, FaSpinner, FaExclamationTriangle, 
    FaEdit, FaTrash, FaPlus 
} from 'react-icons/fa';
// Assuming you have a CSS file for styling
// import './AdminDashboard.css'; 

// --- API Helper ---
const api = {
  get: async (url, token) => {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Failed to fetch from ${url}. Status: ${response.status}`);
    return response.json();
  },
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
    if (response.status === 204) return null; 
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed with status ' + response.status }));
        const errorMessage = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData);
        throw new Error(errorMessage);
    }
    return response.json();
  }
};

// --- Main Dashboard Component ---
const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('teams');
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const navigate = useNavigate();
  const baseUrl = 'https://tal-backend.vercel.app/admin/';
  const token = localStorage.getItem('admin_token');

  const fetchData = useCallback(async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setIsLoading(true);
    try {
      const teamsData = await api.get(`${baseUrl}teams/`, token);
      const notificationsData = await api.get(`${baseUrl}notifications/`, token);
      
      setTeams(teamsData);
      setNotifications(notificationsData);
      setError(null);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('401') || err.message.includes('403')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, token, baseUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  const openModal = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setEditingItem(null);
    setShowModal(false);
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await api.request('DELETE', `${baseUrl}teams/${teamId}/`, token);
        setTeams(prevTeams => prevTeams.filter(team => team.email !== teamId));
      } catch (err) {
        alert(`Error deleting team: ${err.message}`);
      }
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await api.request('DELETE', `${baseUrl}notifications/${notificationId}/`, token);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      } catch (err) {
        alert(`Error deleting notification: ${err.message}`);
      }
    }
  };

  // --- FULLY UPDATED FUNCTION ---
  const handleSaveNotification = async (notificationData) => {
  const isNew = !notificationData.id;

  // Base payload with title and message
  let payload = {
      title: notificationData.title,
      message: notificationData.message
  };

  if (isNew) {
    const userString = localStorage.getItem('admin_user');
    if (!userString) {
      alert('Fatal Error: User information not found. Please log in again.');
      navigate('/login');
      return;
    }
    
    const loggedInUser = JSON.parse(userString);
    
    // Check for email instead of id, since your backend uses email as identifier
    if (!loggedInUser || !loggedInUser.email) {
      alert("Error: Admin user email not found in localStorage. Please log out and in again.");
      return;
    }
    
    // Use email instead of id (assuming your backend expects user email)
    payload.user = loggedInUser.email;

    // Add recipient info based on the admin's choice in the modal
    if (notificationData.recipientType === 'all') {
        payload.for_all_users = true; 
    } else if (notificationData.recipientType === 'specific') {
        payload.mail_id = notificationData.specificEmail; 
    }
  }

  const method = isNew ? 'POST' : 'PATCH';
  const url = isNew 
    ? `${baseUrl}notifications/` 
    : `${baseUrl}notifications/${notificationData.id}/`;

  try {
    console.log("Sending this payload:", payload);
    await api.request(method, url, token, payload);
    alert('Notification saved successfully!');
    closeModal();
    fetchData(); // Refresh data after saving
  } catch (err) {
    alert(`Error saving notification: ${err.message}`);
  }
};

  const renderTeamsContent = () => (
    <div className="table-container">
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Lead Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Institute</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.email}>
              <td>{team.name}</td>
              <td>{team.email}</td>
              <td>{team.phone_number}</td>
              <td>{team.institute_name}</td>
              <td className="actions-cell">
                <button onClick={() => handleDeleteTeam(team.email)} className="icon-button danger" title="Delete Team">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  const renderNotificationsContent = () => (
    <div>
      <div className="toolbar">
        <button className="button-primary" onClick={() => openModal({ title: '', message: '' })}>
          <FaPlus /> Create Notification
        </button>
      </div>
      <div className="table-container">
        <table className="teams-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Message</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n.id}>
                <td>{n.title}</td>
                <td>{n.message}</td>
                <td>{new Date(n.created_at).toLocaleString()}</td>
                <td className="actions-cell">
                  <button onClick={() => openModal(n)} className="icon-button" title="Edit Notification">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteNotification(n.id)} className="icon-button danger" title="Delete Notification">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <div className="loading-state"><FaSpinner className="spinner-icon" /> <p>Loading Dashboard...</p></div>;
    if (error) return <div className="error-state"><FaExclamationTriangle /> <p>{error}</p></div>;
    return activeTab === 'teams' ? renderTeamsContent() : renderNotificationsContent();
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-header">
        <div className="dashboard-title-container">
          <FaUsers className="dashboard-icon" />
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </header>

      <nav className="dashboard-tabs">
        <button onClick={() => setActiveTab('teams')} className={activeTab === 'teams' ? 'active' : ''}>
          <FaUsers /> Team Management
        </button>
        <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'active' : ''}>
          <FaBell /> Notification Management
        </button>
      </nav>
      
      <div className="dashboard-content">
        {renderContent()}
      </div>

      {showModal && activeTab === 'notifications' && (
        <NotificationModal 
            item={editingItem} 
            onClose={closeModal}
            onSave={handleSaveNotification}
        />
      )}
    </section>
  );
};

// --- Notification Modal Component (Updated) ---
const NotificationModal = ({ item, onClose, onSave }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [message, setMessage] = useState(item?.message || '');
    
    // State to manage recipient choice
    const [recipientType, setRecipientType] = useState('all'); // 'all' or 'specific'
    const [specificEmail, setSpecificEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Pass all data, including recipient info, to the onSave handler
        onSave({ ...item, title, message, recipientType, specificEmail });
    };

    // We only show the recipient options for new notifications
    const isNew = !item?.id;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <h2>{isNew ? 'Create' : 'Edit'} Notification</h2>
                    
                    {/* Show recipient options only when creating a new notification */}
                    {isNew && (
                        <>
                            <div className="form-group">
                                <label>Recipient:</label>
                                <div className="radio-group" style={{ display: 'flex', gap: '1rem' }}>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="recipient" 
                                            value="all" 
                                            checked={recipientType === 'all'} 
                                            onChange={() => setRecipientType('all')}
                                        />
                                        All Users
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name="recipient" 
                                            value="specific"
                                            checked={recipientType === 'specific'}
                                            onChange={() => setRecipientType('specific')}
                                        />
                                        Specific User
                                    </label>
                                </div>
                            </div>

                            {/* Show email input only if 'Specific User' is selected */}
                            {recipientType === 'specific' && (
                                <div className="form-group">
                                    <label htmlFor="specificEmail">Recipient Email</label>
                                    <input
                                        type="email"
                                        id="specificEmail"
                                        value={specificEmail}
                                        onChange={(e) => setSpecificEmail(e.target.value)}
                                        placeholder="Enter user's email address"
                                        required 
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input 
                            type="text" 
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea 
                            id="message"
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="button-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;