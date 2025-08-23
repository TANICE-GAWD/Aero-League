import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RequireAuthAsUser, RequireAuthAsAdmin } from './components/RequireAuth'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import OTPVerification from './pages/Register/Otp'
import { UserDashboard, Team, VideoPage, UserTickets } from './pages/User'
import { AdminDashboard, Teams, Notifications, AdminTicket } from './pages/Admin'
import UserDashboardLayout from './components/UserDashboard'
import AdminDashboardLayout from './components/AdminDashboard'
import NotFound from './pages/NotFound'
import ForgotPassword from './pages/Login/ForgotPassword'

// Import all components for the SPA
import HeroSection from './components/HeroSection/HeroSection'
import Animation from './components/AeroLeague/AeroLeague'
import Challenges from './components/Challenges/Challenges'
import TimeLine from './components/TimeLine/TimeLine'
import RewardsSection from './components/Prize/Prize'
import Rules from './components/Rules/Rules'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'







// Create the main Home component with all sections
const Home = () => {
  return (
    <div className="app-container">
      <div className="overlay-bg"></div>
      <HeroSection />
      <div className="main-content">
        <section id="home" className="section">
          <Animation />
        </section>
        <section id="challenges" className="section">
          <Challenges />
        </section>
        <section id="timeline" className="section">
          <TimeLine />
        </section>
        <section id="prizes" className="section">
          <RewardsSection />
        </section>
        <section id="rules" className="section">
          <Rules />
        </section>
        <section id="contact" className="section">
          <Contact />
        </section>
        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
        {/* Main SPA Routes with single page navigation */}
        <Route path="/" element={<Home />} />
        <Route path="/aeroleague" element={<Home />} />
        <Route path="/challenges" element={<Home />} />
        <Route path="/timeline" element={<Home />} />
        <Route path="/prize" element={<Home />} />
        <Route path="/rules" element={<Home />} />
        <Route path="/contact" element={<Home />} />

        {/* Authentication Routes - Standalone (no HeroSection/Footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OTPVerification />} />
        <Route path="/forgot" element={<ForgotPassword />} />

        {/* User Dashboard Routes - Standalone (no HeroSection/Footer) */}
        <Route path='/user' element={<RequireAuthAsUser />}>
          <Route element={<UserDashboardLayout />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="team" element={<Team />} />
            <Route path="video" element={<VideoPage />} />
            <Route path="tickets" element={<UserTickets />} />
          </Route>
        </Route>

        {/* Admin Dashboard Routes - Standalone (no HeroSection/Footer) */}
        <Route path='/admin' element={<RequireAuthAsAdmin />}>
          <Route element={<AdminDashboardLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="teams" element={<Teams />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="tickets" element={<AdminTicket />} />
          </Route>
        </Route>

        {/* Error Routes */}
        <Route path='/404' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App