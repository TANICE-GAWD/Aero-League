import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSpinner, FaKey, FaUserPlus } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
  // State to toggle between 'login' and 'register' views
  const [view, setView] = useState('login'); 
  
  // State for the login form
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // State for the admin registration form
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', access_code: '' });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Base URL for the admin-specific API endpoints
  const baseUrl = 'https://tal-backend.vercel.app/admin/';

  // --- Handlers for Login Form ---
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }

      localStorage.setItem('admin_token', data.access_token);
      navigate('/dashboard'); // Redirect to the admin dashboard

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handlers for Admin Registration Form ---
  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
        const response = await fetch(`${baseUrl}register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Admin creation failed.');
        }
        setSuccessMessage('Admin user created successfully! Please log in.');
        setView('login'); // Switch back to login view on success
    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Render Logic ---
  return (
    <section className="login-page-section">
      <div className="login-card">
        {view === 'login' ? (
          // LOGIN VIEW
          <>
            <div className="login-header">
              <h1 className="login-title">Mission Control</h1>
              <p className="login-subtitle">Admin Authentication</p>
            </div>
            {successMessage && <p className="login-success">{successMessage}</p>}
            <form onSubmit={handleLoginSubmit} className="login-form">
              <div className="input-wrapper">
                <FaUserShield className="input-icon" />
                <input type="email" name="email" placeholder="Admin Email" className="input-field" value={loginData.email} onChange={handleLoginChange} required disabled={isLoading} />
              </div>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input type="password" name="password" placeholder="Password" className="input-field" value={loginData.password} onChange={handleLoginChange} required disabled={isLoading} />
              </div>
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? <FaSpinner className="spinner-icon" /> : 'Authorize Access'}
              </button>
              <p className="toggle-view-text">
                Need to create an admin account?{' '}
                <span onClick={() => { setView('register'); setError(null); setSuccessMessage(null); }} className="toggle-view-link">
                  Register here
                </span>
              </p>
            </form>
          </>
        ) : (
          // ADMIN REGISTRATION VIEW
          <>
            <div className="login-header">
              <h1 className="login-title">Create Admin User</h1>
              <p className="login-subtitle">Requires Secret Access Code</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="login-form">
                <div className="input-wrapper"><FaUserPlus className="input-icon" /><input type="text" name="name" placeholder="Full Name" className="input-field" value={registerData.name} onChange={handleRegisterChange} required disabled={isLoading} /></div>
                <div className="input-wrapper"><FaUserShield className="input-icon" /><input type="email" name="email" placeholder="Admin Email" className="input-field" value={registerData.email} onChange={handleRegisterChange} required disabled={isLoading} /></div>
                <div className="input-wrapper"><FaLock className="input-icon" /><input type="password" name="password" placeholder="Password" className="input-field" value={registerData.password} onChange={handleRegisterChange} required disabled={isLoading} /></div>
                <div className="input-wrapper"><FaKey className="input-icon" /><input type="password" name="access_code" placeholder="Secret Access Code" className="input-field" value={registerData.access_code} onChange={handleRegisterChange} required disabled={isLoading} /></div>
                {error && <p className="login-error">{error}</p>}
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? <FaSpinner className="spinner-icon" /> : 'Create Admin'}
                </button>
                <p className="toggle-view-text">
                    Already have an admin account?{' '}
                    <span onClick={() => { setView('login'); setError(null); }} className="toggle-view-link">
                    Login here
                    </span>
                </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminLogin;
