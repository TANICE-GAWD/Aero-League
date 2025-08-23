import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { User, Phone, Building, Mail, Lock, Plus, X, Group } from "lucide-react"
import { useRegisterMutation } from "../../app/api/authApiSlice"
import './Register.css'



const Register = () => {
  const [teamMembers, setTeamMembers] = useState([{ id: 1, name: "", email: "" }])
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otp, setOtp] = useState("")

  const [register, { isLoading }] = useRegisterMutation()
  const navigate = useNavigate()

  const [teamLead, setTeamLead] = useState({
    name: "",
    phone_number: "",
    institute_name: "",
    email: "",
    password: "",
    team_name: "",
  })

  const addTeamMember = () => {
    if (teamMembers.length < 4) {
      const newId = Math.max(...teamMembers.map((m) => m.id)) + 1
      setTeamMembers([...teamMembers, { id: newId, name: "", email: "" }])
    }
  }

  const removeTeamMember = (id) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((member) => member.id !== id))
    }
  }

  const updateTeamMember = (id, field, value) => {
    setTeamMembers(
      teamMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member))
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    try {
      const response = await register({
        name: teamLead.name,
        phone_number: teamLead.phone_number,
        institute_name: teamLead.institute_name,
        email: teamLead.email,
        password: teamLead.password,
        team_name: teamLead.team_name,
        team_members: teamMembers,
      }).unwrap()

      setMessage("Registration successful! Redirecting.")
      setIsError(false)
      return navigate("/otp", {state: {from: 'register', email: teamLead.email}})
    } catch (error) {
      console.error("Registration failed:", error)
      setMessage(error?.data?.detail || "Registration failed. Please try again.")
      setIsError(true)
    }
  }

  return (
    <div className="register-container">
      <div className="register-content">
        <div className="register-wrapper">
          <div className="register-header">
            <h2 className="register-title">Join the Challenge</h2>
            <p className="register-subtitle">Create your team below</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {/* Team Lead Section */}
            <div>
              <h3 className="section-title">
                <User className="section-icon" /> Team Lead Details
              </h3>
              <div className="form-section">
                <div className="input-group">
                  <User className="input-icon" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={teamLead.name}
                    onChange={(e) => setTeamLead({ ...teamLead, name: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={teamLead.phone_number}
                    onChange={(e) => setTeamLead({ ...teamLead, phone_number: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <Group className="input-icon" />
                  <input
                    type="text"
                    placeholder="Team Name"
                    value={teamLead.team_name}
                    onChange={(e) => setTeamLead({ ...teamLead, team_name: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <Building className="input-icon" />
                  <input
                    type="text"
                    placeholder="Institute Name"
                    value={teamLead.institute_name}
                    onChange={(e) => setTeamLead({ ...teamLead, institute_name: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={teamLead.email}
                    onChange={(e) => setTeamLead({ ...teamLead, email: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
                <div className="input-group">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={teamLead.password}
                    onChange={(e) => setTeamLead({ ...teamLead, password: e.target.value })}
                    className="register-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="section-title">Team Members</h3>
              <div className="form-section">
                {teamMembers.map((member, index) => (
                  <div key={member.id} className="team-member-row">
                    <div className="input-group team-member-input">
                      <User className="input-icon" />
                      <input
                        type="text"
                        placeholder={`Member ${index + 1} Name`}
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, "name", e.target.value)}
                        className="register-input"
                        required
                      />
                    </div>
                    <div className="input-group team-member-input">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        placeholder={`Member ${index + 1} Email`}
                        value={member.email}
                        onChange={(e) => updateTeamMember(member.id, "email", e.target.value)}
                        className="register-input"
                        required
                      />
                    </div>
                    {teamMembers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTeamMember(member.id)}
                        className="remove-member-btn"
                      >
                        <X className="section-icon" />
                      </button>
                    )}
                  </div>
                ))}

                {teamMembers.length < 4 && (
                  <button
                    type="button"
                    onClick={addTeamMember}
                    className="add-member-btn"
                  >
                    <Plus className="section-icon" /> Add Another Member
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register Team"}
            </button>

            {message && (
              <p className={`message ${isError ? "error" : "success"}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Enter OTP</h3>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="modal-input"
            />
            <div className="modal-actions">
              <button
                onClick={() => setOtpModalOpen(false)}
                className="modal-btn cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                className="modal-btn confirm"
                disabled={otpLoading}
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Register
