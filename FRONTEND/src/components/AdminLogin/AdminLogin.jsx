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
  
  // Base URLs for API endpoints
  const adminBaseUrl = 'https://tal-backend.vercel.app/admin/';
  const userBaseUrl = 'https://tal-backend.vercel.app/users/'; // <-- Added for user login fallback

  // --- Handlers for Login Form ---
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // --- Attempt 1: Log in as an Admin ---
      const adminResponse = await fetch(`${adminBaseUrl}login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (adminResponse.ok) {
        // SUCCESS: User is an Admin
        const adminData = await adminResponse.json();
        localStorage.setItem('admin_token', adminData.access_token);
        localStorage.setItem('admin_user', JSON.stringify(adminData.user));
        navigate('/dashboard'); // Navigate to Admin Dashboard
        return; // Exit function after successful admin login
      }

      // --- Attempt 2: If admin login fails, try as a regular user ---
      const userResponse = await fetch(`${userBaseUrl}login/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
      });
      
      const userData = await userResponse.json();

      if (userResponse.ok) {
          // SUCCESS: User is a regular user
          localStorage.setItem('access_token', userData.access_token);
          localStorage.setItem('user', JSON.stringify(userData.user));
          navigate('/user-dashboard'); // Redirect to User Dashboard
          return; // Exit function
      }
      
      // --- FAILURE: If both attempts fail, throw final error ---
      throw new Error(userData.error || 'Invalid credentials.');

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
        const response = await fetch(`${adminBaseUrl}register/`, {
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

  // --- Render Logic (No changes needed below) ---
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