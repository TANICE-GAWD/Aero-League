import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaSignOutAlt, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const baseUrl = 'https://tal-backend.vercel.app/admin/';

  useEffect(() => {
    const fetchTeams = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/login'); // Redirect if no token is found
        return;
      }

      try {
        const response = await fetch(`${baseUrl}teams/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Send the token for authentication
          },
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized: Please log in again.');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch teams data.');
        }

        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setError(err.message);
        // If token is invalid, clear it and redirect
        if (err.message.includes('Unauthorized')) {
          localStorage.removeItem('admin_token');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-state"><FaSpinner className="spinner-icon" /> <p>Loading Teams...</p></div>;
    }
    if (error) {
      return <div className="error-state"><FaExclamationTriangle /> <p>{error}</p></div>;
    }
    if (teams.length === 0) {
        return <div className="loading-state"><p>No teams have registered yet.</p></div>;
    }
    return (
      <div className="table-container">
        <table className="teams-table">
          <thead>
            <tr>
              <th>Team Lead Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Institute</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.email}>
                <td>{team.name}</td>
                <td>{team.email}</td>
                <td>{team.phone_number}</td>
                <td>{team.institute_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className="dashboard-section">
      <header className="dashboard-header">
        <div className="dashboard-title-container">
          <FaUsers className="dashboard-icon" />
          <h1 className="dashboard-title">Registered Teams</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FaSignOutAlt /> Logout
        </button>
      </header>
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </section>
  );
};

export default AdminDashboard;
