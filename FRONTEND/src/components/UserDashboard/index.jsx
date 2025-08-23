import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import './UserDashboard.css'

export default function UserDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="user-dashboard-layout">
      <div className="dashboard-container">
        <div className="sidebar-container">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <div className="main-content">
          <div className="content-wrapper">
            <div className="navbar-container">
              <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            <div className="page-content">
              <div className="page-content-inner">
                <div className="content-max-width">
                  <Outlet />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
