import { Home, Users, VideoIcon, LogOut, Ticket } from "lucide-react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { selectUser } from "../../features/authSlice"
import { useNavigate } from "react-router-dom"
import { useLogoutMutation } from "../../app/api/authApiSlice"
import { useDispatch } from "react-redux"
import { removeCredentials } from "../../features/authSlice"


const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/user/dashboard" },
  { id: "team", label: "Team Details", icon: Users, href: "/user/team" },
  { id: "video", label: "Video Link", icon: VideoIcon, href: "/user/video" },
  { id: "tickets", label: "Support Tickets", icon: Ticket, href: "/user/tickets" }
]


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const navigate = useNavigate()

  const onLogout = async () => {
    try {
      const result = await logout().unwrap()
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      dispatch(removeCredentials());
      return navigate("/login");
    }
  }
  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''} sidebar-desktop`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="sidebar-title">
              <span className="highlight">TDC</span> Dashboard
            </h1>
          </div>

          <nav className="sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="nav-icon" />
                      <span className="nav-label">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="sidebar-footer">
            <button 
              className="logout-btn" 
              disabled={isLoading} 
              onClick={onLogout}
            >
              <LogOut className="logout-icon" />
              <span className="nav-label">{isLoading ? "Logging out..." : "Logout"}</span>
            </button>

            <div className="user-info">
              <div className="user-avatar">
                <span className="user-avatar-text">{user?.name?.charAt(0)}</span>
              </div>
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-role">User</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}