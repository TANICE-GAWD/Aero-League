import { useEffect, useState } from "react"
import { Mail, Lock, Shield, User } from "lucide-react"
import { useAdminLoginMutation, useUserLoginMutation } from '@/app/api/authApiSlice'
import { setCredentials } from "../../features/authSlice"
import { useSelector, useDispatch } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import HeroSection from '../../components/HeroSection/HeroSection'
import './Login.css'

function Login() {
  const token = useSelector((state) => state.auth?.token)
  const user = useSelector((state) => state.auth?.user)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginType, setLoginType] = useState("user")
  const [error, setError] = useState(null)
  const [userLogin, { isLoading: userLoading, error: userError }] = useUserLoginMutation()
  const [adminLogin, { isLoading: adminLoading, error: adminError }] = useAdminLoginMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setError(null)
    e.preventDefault()
    try {
      let response
      if (loginType === "user") {
        response = await userLogin({ email, password }).unwrap()
      } else {
        response = await adminLogin({ email, password }).unwrap()
      }
      dispatch(setCredentials({token: response.access_token, user: response.user}))
      return navigate(loginType === "user" ? "/user/dashboard" : "/admin/dashboard", {replace: true})
    } catch (err) {
      setError(err?.data?.error || "Login failed. Please try again.")
      console.error("Login failed:", err)
    }
  }

  useEffect(() => {
  if (token) {
    navigate(user?.is_admin ? "/admin/dashboard" : "/user/dashboard", { replace: true })
  }
}, [token, user, navigate])

  return (
    <div className="login-page">
      <HeroSection />
      <div className="login-container">
        <div className="login-card">
        <div className="login-type-selector">
          <button
            type="button"
            onClick={() => setLoginType("user")}
            className={`login-type-button ${loginType === "user" ? "active" : "inactive"}`}
          >
            <User className="login-type-icon" />
            User
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`login-type-button ${loginType === "admin" ? "active" : "inactive"}`}
          >
            <Shield className="login-type-icon" />
            Admin
          </button>
        </div>

        <h1 className="login-title">
          {loginType === "admin" ? "Admin Login" : "User Login"}
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <Mail className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <button
            type="submit"
            className={`login-button ${loginType}`}
            disabled={userLoading || adminLoading}
          >
            {userLoading || adminLoading
              ? "Logging in..."
              : loginType === "admin"
              ? "ADMIN LOGIN"
              : "LOGIN"}
          </button>
        </form>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        <div className="forgot-password-link">
          <NavLink to="/forgot">
            Forgot Password?
          </NavLink>
        </div>
      </div>
    </div></div>
  )
}


export default Login;