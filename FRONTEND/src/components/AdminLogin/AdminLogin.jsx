import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaSpinner, FaKey, FaUserPlus, FaEnvelope, FaHashtag } from 'react-icons/fa';
import './AdminLogin.css';

const AdminLogin = () => {
    // State to toggle between 'login', 'register', and 'forgot' views
    const [view, setView] = useState('login'); 

    // State for the login form
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // State for the admin registration form
    const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', access_code: '' });
    
    // --- NEW: State for the Forgot Password form ---
    const [forgotData, setForgotData] = useState({ email: '', otp_code: '', new_password: '' });
    const [otpSent, setOtpSent] = useState(false); // Tracks if OTP has been sent

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Base URLs for API endpoints
    const adminBaseUrl = 'https://tal-backend.vercel.app/admin/';
    const userBaseUrl = 'https://tal-backend.vercel.app/users/';

    // --- Handlers for Login Form ---
    const handleLoginChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Attempt 1: Log in as an Admin
            const adminResponse = await fetch(`${adminBaseUrl}login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (adminResponse.ok) {
                const adminData = await adminResponse.json();
                localStorage.setItem('admin_token', adminData.access_token);
                localStorage.setItem('admin_user', JSON.stringify(adminData.user));
                navigate('/dashboard');
                return;
            }

            // Attempt 2: If admin login fails, try as a regular user
            const userResponse = await fetch(`${userBaseUrl}login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            
            const userData = await userResponse.json();

            if (userResponse.ok) {
                localStorage.setItem('access_token', userData.access_token);
                localStorage.setItem('user', JSON.stringify(userData.user));
                navigate('/user-dashboard');
                return;
            }
            
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
            setView('login');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // --- NEW: Handlers for Forgot Password Flow ---
    const handleForgotChange = (e) => {
        setForgotData({ ...forgotData, [e.target.name]: e.target.value });
    };

    // Step 1: Request an OTP
    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        
        try {
            const response = await fetch(`${userBaseUrl}otp/generate/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: forgotData.email }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to send OTP. Please check the email address.");
            }

            setSuccessMessage("OTP has been sent to your email address.");
            setOtpSent(true); // Move to the next step
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Reset the password with OTP
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`${userBaseUrl}otp/password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(forgotData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to reset password. The OTP may be invalid or expired.");
            }
            
            setSuccessMessage("Password has been reset successfully! Please log in.");
            setView('login'); // Switch back to login view
            setOtpSent(false); // Reset OTP state
            setForgotData({ email: '', otp_code: '', new_password: '' }); // Clear form
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    // Function to switch view and reset states
    const switchView = (newView) => {
        setView(newView);
        setError(null);
        setSuccessMessage(null);
        setOtpSent(false);
    }

    // --- Render Logic ---
    return (
        <section className="login-page-section">
            <div className="login-card">
                {view === 'login' ? (
                    // --- LOGIN VIEW ---
                    <>
                        <div className="login-header">
                            <h1 className="login-title">Login</h1>
                        </div>
                        {successMessage && <p className="login-success">{successMessage}</p>}
                        <form onSubmit={handleLoginSubmit} className="login-form">
                            <div className="input-wrapper">
                                <FaUserShield className="input-icon" />
                                <input type="email" name="email" placeholder="Email" className="input-field" value={loginData.email} onChange={handleLoginChange} required disabled={isLoading} />
                            </div>
                            <div className="input-wrapper">
                                <FaLock className="input-icon" />
                                <input type="password" name="password" placeholder="Password" className="input-field" value={loginData.password} onChange={handleLoginChange} required disabled={isLoading} />
                            </div>
                            {error && <p className="login-error">{error}</p>}
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? <FaSpinner className="spinner-icon" /> : 'Login'}
                            </button>
                            <p className="toggle-view-text">
                                <span onClick={() => switchView('forgot')} className="toggle-view-link">
                                    Forgot Password?
                                </span>
                            </p>
                            
                        </form>
                    </>
                ) : view === 'register' ? (
                    // --- ADMIN REGISTRATION VIEW ---
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
                                    Already have an account?{' '}
                                    <span onClick={() => switchView('login')} className="toggle-view-link">
                                        Login here
                                    </span>
                                </p>
                        </form>
                    </>
                ) : (
                    // --- FORGOT PASSWORD VIEW ---
                    <>
                        <div className="login-header">
                            <h1 className="login-title">Reset Password</h1>
                            <p className="login-subtitle">{!otpSent ? 'Enter your email to receive an OTP' : 'Check your email for the OTP'}</p>
                        </div>
                        {successMessage && <p className="login-success">{successMessage}</p>}
                        
                        {/* Phase 1: Request OTP */}
                        {!otpSent ? (
                            <form onSubmit={handleRequestOTP} className="login-form">
                                <div className="input-wrapper">
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" name="email" placeholder="Email Address" className="input-field" value={forgotData.email} onChange={handleForgotChange} required disabled={isLoading} />
                                </div>
                                {error && <p className="login-error">{error}</p>}
                                <button type="submit" className="login-button" disabled={isLoading}>
                                    {isLoading ? <FaSpinner className="spinner-icon" /> : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                        /* Phase 2: Submit OTP and New Password */
                            <form onSubmit={handleResetPassword} className="login-form">
                                <div className="input-wrapper">
                                    <FaHashtag className="input-icon" />
                                    <input type="text" name="otp_code" placeholder="OTP Code" className="input-field" value={forgotData.otp_code} onChange={handleForgotChange} required disabled={isLoading} />
                                </div>
                                <div className="input-wrapper">
                                    <FaKey className="input-icon" />
                                    <input type="password" name="new_password" placeholder="New Password" className="input-field" value={forgotData.new_password} onChange={handleForgotChange} required disabled={isLoading} />
                                </div>
                                {error && <p className="login-error">{error}</p>}
                                <button type="submit" className="login-button" disabled={isLoading}>
                                    {isLoading ? <FaSpinner className="spinner-icon" /> : 'Reset Password'}
                                </button>
                            </form>
                        )}
                        
                        <p className="toggle-view-text">
                            {' '}
                            <span onClick={() => switchView('login')} className="toggle-view-link">
                                Back to Login
                            </span>
                        </p>
                    </>
                )}
            </div>
        </section>
    );
};

export default AdminLogin;