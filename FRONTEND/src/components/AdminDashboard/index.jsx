import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import './AdminDashboard.css'

export default function AdminDashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-dashboard-layout">
      <div className="admin-dashboard-container">
        <div className="admin-sidebar-container">
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <div className="admin-main-content">
          <div className="admin-content-wrapper">
            <div className="admin-navbar-container">
              <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            </div>
            <div className="admin-page-content">
              <div className="admin-page-content-inner">
                <div className="admin-content-max-width">
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
