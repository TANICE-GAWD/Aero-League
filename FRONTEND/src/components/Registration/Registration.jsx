import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaPhone, FaUniversity, FaEnvelope, FaLock, FaUsers, FaPlusCircle, FaTrash, FaSpinner, FaKey } from 'react-icons/fa';
import './Registration.css';

const Registration = () => {
  // State for the multi-step registration process
  const [registrationStep, setRegistrationStep] = useState('form'); // 'form', 'otp', 'success'
  const [otp, setOtp] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    institute_name: '',
    email: '',
    password: '',
    team_members: [{ name: '', email: '' }],
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  // UPDATED: The base URL now includes the '/users' path
  const baseUrl = 'https://tal-backend.vercel.app/users/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTeamMemberChange = (index, e) => {
    const { name, value } = e.target;
    const members = [...formData.team_members];
    members[index][name] = value;
    setFormData({ ...formData, team_members: members });
  };

  const addTeamMember = () => {
    // Limit the number of team members to 4
    if (formData.team_members.length < 4) {
      setFormData({
        ...formData,
        team_members: [...formData.team_members, { name: '', email: '' }],
      });
    }
  };

  const removeTeamMember = (index) => {
    const members = [...formData.team_members];
    if (members.length > 1) {
      members.splice(index, 1);
      setFormData({ ...formData, team_members: members });
    }
  };

  // Step 1: Handle the initial form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      const response = await fetch(`${baseUrl}register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
      
        const errorMsg = data.email ? `Email: ${data.email[0]}` : 'Registration failed.';
        throw new Error(errorMsg);
      }

      
      await generateOtp();
      setRegistrationStep('otp'); 

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const generateOtp = async () => {
      
      await fetch(`${baseUrl}otp/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
  };

  
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
        
        const response = await fetch(`${baseUrl}verify/email/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.email, otp_code: otp }),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Invalid or expired OTP.');
        }

        
        setRegistrationStep('success');
        setTimeout(() => {
            navigate('/login');
        }, 3000); 

    } catch (err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  
  const renderStep = () => {
    switch (registrationStep) {
      case 'otp':
        return (
            <form onSubmit={handleOtpSubmit} className="registration-form">
                <div className="registration-header">
                    <h1 className="registration-title">Verify Your Email</h1>
                    <p className="registration-subtitle">An OTP has been sent to <strong>{formData.email}</strong>. Please enter it below.</p>
                </div>
                <div className="input-wrapper">
                    <FaKey className="input-icon" />
                    <input type="text" name="otp" placeholder="Enter 6-Digit OTP" className="input-field" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                {error && <p className="registration-error">{error}</p>}
                <button type="submit" className="register-button" disabled={isLoading}>
                    {isLoading ? <FaSpinner className="spinner-icon" /> : 'Verify & Complete'}
                </button>
            </form>
        );
      case 'success':
        return (
            <div className="registration-header">
                <h1 className="registration-title">Registration Complete!</h1>
                <p className="registration-subtitle">Your email has been verified. Redirecting you to the login page...</p>
            </div>
        );
      default: // 'form' step
        return (
            <>
                <div className="registration-header">
                    <h1 className="registration-title">Join the League</h1>
                    <p className="registration-subtitle">Create your team and prepare for lift-off</p>
                </div>
                <form onSubmit={handleFormSubmit} className="registration-form">
                    <fieldset className="form-fieldset">
                        <legend>Team Lead Details</legend>
                        <div className="input-wrapper"><FaUser className="input-icon" /><input type="text" name="name" placeholder="Full Name" className="input-field" onChange={handleInputChange} required /></div>
                        <div className="input-wrapper"><FaPhone className="input-icon" /><input type="tel" name="phone_number" placeholder="Phone Number" className="input-field" onChange={handleInputChange} required /></div>
                        <div className="input-wrapper"><FaUniversity className="input-icon" /><input type="text" name="institute_name" placeholder="Institute Name" className="input-field" onChange={handleInputChange} required /></div>
                        <div className="input-wrapper"><FaEnvelope className="input-icon" /><input type="email" name="email" placeholder="Email Address" className="input-field" onChange={handleInputChange} required /></div>
                        <div className="input-wrapper"><FaLock className="input-icon" /><input type="password" name="password" placeholder="Password" className="input-field" onChange={handleInputChange} required /></div>
                    </fieldset>
                    <fieldset className="form-fieldset">
                        <legend>Team Members</legend>
                        {formData.team_members.map((member, index) => (
                        <div key={index} className="team-member-row">
                            <div className="input-wrapper"><FaUser className="input-icon" /><input type="text" name="name" placeholder={`Member ${index + 1} Name`} className="input-field" value={member.name} onChange={(e) => handleTeamMemberChange(index, e)} required /></div>
                            <div className="input-wrapper"><FaEnvelope className="input-icon" /><input type="email" name="email" placeholder={`Member ${index + 1} Email`} className="input-field" value={member.email} onChange={(e) => handleTeamMemberChange(index, e)} required /></div>
                            <button type="button" className="remove-member-btn" onClick={() => removeTeamMember(index)} disabled={formData.team_members.length === 1}><FaTrash /></button>
                        </div>
                        ))}
                        <button 
                                type="button" 
                                className="add-member-btn" 
                                onClick={addTeamMember} 
                                disabled={formData.team_members.length >= 4}
                                style={{ 
                                    cursor: formData.team_members.length >= 4 ? 'not-allowed' : 'pointer',
                                    opacity: formData.team_members.length >= 4 ? 0.6 : 1 
                                }}
                            >
                                <FaPlusCircle /> Add Another Member
                            </button>
                    </fieldset>
                    {error && <p className="registration-error">{error}</p>}
                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? <FaSpinner className="spinner-icon" /> : 'Register Team'}
                    </button>
                </form>
            </>
        );
    }
  };

  return (
    <section className="registration-page-section">
      <div className="registration-card">
        {renderStep()}
      </div>
    </section>
  );
};

export default Registration;
