import { Home, Users, VideoIcon, LogOut, Ticket } from "lucide-react"
import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom"
import { removeCredentials, selectUser } from "../../features/authSlice"
import { useLogoutMutation } from "../../app/api/authApiSlice"
import { useDispatch } from "react-redux"


const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { id: "teams", label: "Team Details", icon: Users, href: "/admin/teams" },
  { id: "notifications", label: "Notifications", icon: VideoIcon, href: "/admin/notifications" },
  { id: "tickets", label: "Tickets", icon: Ticket, href: "/admin/tickets" }
]


export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const [logout, {isLoading}] = useLogoutMutation()
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
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : ''} admin-sidebar-desktop`}>
        <div className="admin-sidebar-content">
          <div className="admin-sidebar-header">
            <h1 className="admin-sidebar-title">
              <span className="highlight">TDC</span> Dashboard
            </h1>
          </div>

          <nav className="admin-sidebar-nav">
            {sidebarItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.id}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive ? 'active' : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className="admin-nav-icon" />
                      <span className="admin-nav-label">{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button 
              className="admin-logout-btn" 
              onClick={onLogout} 
              disabled={isLoading}
            >
              <LogOut className="admin-logout-icon" />
              <span className="admin-nav-label">{isLoading ? "Logging out..." : "Logout"}</span>
            </button>

            <div className="admin-user-info">
              <div className="admin-user-avatar">
                <span className="admin-user-avatar-text">{user?.name?.charAt(0)}</span>
              </div>
              <div className="admin-user-details">
                <p className="admin-user-name">{user?.name}</p>
                <p className="admin-user-role">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </>
  )
}
