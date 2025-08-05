import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUsers, FaBell, FaSignOutAlt, FaSpinner, FaExclamationTriangle, 
    FaEdit, FaTrash, FaPlus, FaEye 
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
  const [modalType, setModalType] = useState(''); // 'notification' or 'team'

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

  const openModal = (item, type) => {
    setEditingItem(item);
    setModalType(type);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setEditingItem(null);
    setModalType('');
    setShowModal(false);
  };

  const openTeamDetailsModal = (team) => {
    openModal(team, 'team');
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

  // Fixed handleSaveNotification function
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

  // Enhanced renderTeamsContent function
  const renderTeamsContent = () => (
    <div className="table-container">
      <div className="teams-stats" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffffffff', borderRadius: '8px' }}>
        <h3>Teams Overview</h3>
        <p><strong>Total Teams:</strong> {teams.length}</p>
      </div>
      
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Lead Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Institute</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team.email}>
              <td>{team.name || 'N/A'}</td>
              <td>{team.email}</td>
              <td>{team.phone_number || 'N/A'}</td>
              <td>{team.institute_name || 'N/A'}</td>
              
              <td>
                <span className={`status-badge ${team.is_active ? 'active' : 'inactive'}`}>
                  {team.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="actions-cell">
                <button 
                  onClick={() => openTeamDetailsModal(team)} 
                  className="icon-button info" 
                  title="View Full Details"
                  style={{ marginRight: '8px' }}
                >
                  <FaEye />
                </button>
                <button 
                  onClick={() => handleDeleteTeam(team.email)} 
                  className="icon-button danger" 
                  title="Delete Team"
                >
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
        <button className="button-primary" onClick={() => openModal({ title: '', message: '' }, 'notification')}>
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
                  <button onClick={() => openModal(n, 'notification')} className="icon-button" title="Edit Notification">
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
      <style>{additionalStyles}</style>
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

      {showModal && modalType === 'notification' && (
        <NotificationModal 
            item={editingItem} 
            onClose={closeModal}
            onSave={handleSaveNotification}
        />
      )}

      {showModal && modalType === 'team' && (
        <TeamDetailsModal 
            team={editingItem} 
            onClose={closeModal}
        />
      )}
    </section>
  );
};

// --- Notification Modal Component ---
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

// --- Team Details Modal Component ---
const TeamDetailsModal = ({ team, onClose }) => {
  if (!team) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2>Team Details</h2>
          <button 
            className="close-button" 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
        
        <div className="team-details-content" style={{ padding: '20px' }}>
          <div className="detail-section">
            <h3>Team Lead Information</h3>
            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <strong>Name:</strong> {team.name || 'N/A'}
              </div>
              <div>
                <strong>Email:</strong> {team.email}
              </div>
              <div>
                <strong>Phone:</strong> {team.phone_number || 'N/A'}
              </div>
              <div>
                <strong>Institute:</strong> {team.institute_name || 'N/A'}
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Team Information</h3>
            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <strong>Team Name:</strong> {team.team_name || 'N/A'}
              </div>
              <div>
                <strong>Team Size:</strong> {team.team_size || 'N/A'}
              </div>
              <div>
                <strong>Registration Date:</strong> {
                  team.date_joined 
                    ? new Date(team.date_joined).toLocaleString() 
                    : team.created_at 
                      ? new Date(team.created_at).toLocaleString()
                      : 'N/A'
                }
              </div>
              <div>
                <strong>Status:</strong> 
                <span className={`status-badge ${team.is_active ? 'active' : 'inactive'}`} style={{ marginLeft: '8px' }}>
                  {team.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>

          {team.problem_statement && (
            <div className="detail-section">
              <h3>Problem Statement</h3>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#ffffffff', 
                borderRadius: '8px', 
                marginBottom: '20px',
                whiteSpace: 'pre-wrap'
              }}>
                {team.problem_statement}
              </div>
            </div>
          )}

          {/* Add more sections for additional team details if available */}
          {team.team_members && (
            <div className="detail-section">
              <h3>Team Members</h3>
              <div style={{ marginBottom: '20px' }}>
                {Array.isArray(team.team_members) ? (
                  <ul style={{ paddingLeft: '20px' }}>
                    {team.team_members.map((member, index) => (
                      <li key={index} style={{ marginBottom: '5px' }}>
                        {typeof member === 'object' ? `${member.name} (${member.email})` : member}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{team.team_members}</p>
                )}
              </div>
            </div>
          )}

          {team.technology_stack && (
            <div className="detail-section">
              <h3>Technology Stack</h3>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#ffffffff', 
                borderRadius: '8px', 
                marginBottom: '20px' 
              }}>
                {team.technology_stack}
              </div>
            </div>
          )}

          {team.project_description && (
            <div className="detail-section">
              <h3>Project Description</h3>
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#ffffffff', 
                borderRadius: '8px', 
                marginBottom: '20px',
                whiteSpace: 'pre-wrap'
              }}>
                {team.project_description}
              </div>
            </div>
          )}
        </div>

        <div className="modal-actions" style={{ padding: '20px', borderTop: '1px solid #000000ff' }}>
          <button type="button" className="button-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// CSS Styles
const additionalStyles = `
  * {
    color: black !important;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .status-badge.active {
    background-color: #ffffffff;
    color: #155724 !important;
  }

  .status-badge.inactive {
    background-color: #000000ff;
    color: #721c24 !important;
  }

  .icon-button.info {
    background-color: #17a2b8;
    color: white !important;
  }

  .icon-button.info:hover {
    background-color: #138496;
  }

  .detail-section {
    margin-bottom: 25px;
  }

  .detail-section h3 {
    margin-bottom: 15px;
    color: #ffffffff !important;
    border-bottom: 2px solid #fafafaff;
    padding-bottom: 8px;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
  }

  .teams-table {
    width: 100%;
    font-size: 14px;
  }

  .teams-table th,
  .teams-table td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #000000ff;
  }

  .teams-table th {
    background-color: #ffffffff;
    font-weight: 600;
    position: sticky;
    top: 0;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 400px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .modal-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    padding: 20px;
  }

  .button-primary {
    background-color: #007bff;
    color: white !important;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .button-secondary {
    background-color: #000000ff;
    color: white !important;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  .icon-button {
    background-color: #28a745;
    color: white !important;
    border: none;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 5px;
  }

  .icon-button.danger {
    background-color: #dc3545;
  }

  .icon-button:hover {
    opacity: 0.8;
  }

  .toolbar {
    margin-bottom: 20px;
  }

  .loading-state, .error-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    flex-direction: column;
  }

  .spinner-icon {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;


export default AdminDashboard;