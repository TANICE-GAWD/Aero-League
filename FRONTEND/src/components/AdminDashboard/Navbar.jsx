import { Menu, X } from "lucide-react"
import { useLocation } from "react-router-dom"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { id: "teams", label: "Team Details", path: "/admin/teams" },
  { id: "notifications", label: "Notifications", path: "/admin/notifications" },
  { id: "tickets", label: "Tickets", path: "/admin/tickets" }
]


export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()

  const currentItem = sidebarItems.find((item) => item.path === location.pathname)
  const pageTitle = currentItem?.label || "Dashboard"

  return (
    <div className="admin-navbar">
      {/* Mobile Header with Breadcrumb */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-header-content">
          <div className="admin-mobile-nav-controls">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-menu-toggle"
            >
              {sidebarOpen ? <X className="admin-menu-icon" /> : <Menu className="admin-menu-icon" />}
            </button>
            <div className="admin-breadcrumb">
              <span className="admin-breadcrumb-item">Dashboard</span>
              <span className="admin-breadcrumb-separator">/</span>
              <span className="admin-breadcrumb-current">{currentItem?.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="admin-desktop-header">
        <h1 className="admin-desktop-title">{pageTitle}</h1>
        <div className="admin-desktop-breadcrumb">
          <span>Dashboard</span>
          <span>/</span>
          <span className="admin-desktop-breadcrumb-current">{currentItem?.label}</span>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="admin-mobile-title-section">
        <h1 className="admin-mobile-title">{pageTitle}</h1>
      </div>
    </div>
  )
}
