import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// Import all components
import AdminLogin from './components/AdminLogin/AdminLogin';
import Registration from './components/Registration/Registration';
import HeroSection from './components/HeroSection/HeroSection';
import Dashboard from './components/AdminDashboard/AdminDashboard';
import Animation from './components/AeroLeague/AeroLeague';
import Challenges from './components/Challenges/Challenges';
import TimeLine from './components/TimeLine/TimeLine';
import RewardsSection from './components/Prize/Prize';
import Rules from './components/Rules/Rules';
import Contact from './components/Contact/Contact';

import './App.css';

// This component protects routes that require an admin token
const ProtectedRoute = () => {
  const token = localStorage.getItem('admin_token');
  // If token exists, show the child component (the Dashboard). Otherwise, redirect to login.
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
          <Route path="/dashboard" element={<ProtectedRoute />}>
            {/* This route is only accessible if the user is logged in as an admin */}
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
