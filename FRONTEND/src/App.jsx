import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';


import AdminLogin from './components/AdminLogin/AdminLogin';
import Registration from './components/Registration/Registration';
import HeroSection from './components/HeroSection/HeroSection';
import Dashboard from './components/AdminDashboard/AdminDashboard';
import UserDashboard from './components/UserDashboard/UserDashboard'; 
import Animation from './components/AeroLeague/AeroLeague';
import Challenges from './components/Challenges/Challenges';
import TimeLine from './components/TimeLine/TimeLine';
import RewardsSection from './components/Prize/Prize';
import Rules from './components/Rules/Rules';
import Contact from './components/Contact/Contact';

import './App.css';


const AdminProtectedRoute = () => {
  const token = localStorage.getItem('admin_token');
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};


const UserProtectedRoute = () => {
  const token = localStorage.getItem('access_token');
  
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};


const SharedLayout = () => (
  <>
    <HeroSection />
    <main><Outlet /></main>
  </>
);

const HomePageContent = () => (
  <>
    <section id="animation-section"><Animation /></section>
    <section id="challenges"><Challenges /></section>
    <section id="timeline"><TimeLine /></section>
    <section id="prizes"><RewardsSection /></section>
    <section id="rules"><Rules /></section>
    <section id="contact"><Contact /></section>
  </>
);

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes with Navbar */}
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<HomePageContent />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="register" element={<Registration />} />
          </Route>

          {/* Protected Admin Route */}
          <Route path="/dashboard" element={<AdminProtectedRoute />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Protected User Route */}
          <Route path="/user-dashboard" element={<UserProtectedRoute />}>
            <Route index element={<UserDashboard />} />
          </Route>

        </Routes>
      </div>
    </Router>
  );
}

export default App;
