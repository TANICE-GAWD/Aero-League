import { Menu, X } from "lucide-react"
import { useLocation } from "react-router-dom"

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", path: "/user/dashboard" },
  { id: "team", label: "Team Details", path: "/user/team" },
  { id: "video", label: "Video Link", path: "/user/video" },
  { id: "tickets", label: "Support Tickets", path: "/user/tickets" },
]


export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()

  const currentItem = sidebarItems.find((item) => item.path === location.pathname)
  const pageTitle = currentItem?.label || "Dashboard"

  return (
    <div className="navbar">
      {/* Mobile Header with Breadcrumb */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <div className="mobile-nav-controls">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-toggle"
            >
              {sidebarOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
            <div className="breadcrumb">
              <span className="breadcrumb-item">Dashboard</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">{currentItem?.label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="desktop-header">
        <h1 className="desktop-title">{pageTitle}</h1>
        <div className="desktop-breadcrumb">
          <span>Dashboard</span>
          <span>/</span>
          <span className="desktop-breadcrumb-current">{currentItem?.label}</span>
        </div>
      </div>

      {/* Mobile Title */}
      <div className="mobile-title-section">
        <h1 className="mobile-title">{pageTitle}</h1>
      </div>
    </div>
  )
}
