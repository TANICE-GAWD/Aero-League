import { useState } from 'react'
import HeroSection from './components/HeroSection/HeroSection'
import Carousel from './components/AboutEvent/Carousel'
import TimeLine from './components/TimeLine/TimeLine'
import './App.css'
import RewardsSection from './components/Prize/Prize'
import Rules from './components/Rules/Rules'
import Challenges from './components/Challenges/Challenges'
import Contact from './components/Contact/Contact';

function App() {
  return (
    <div className="app">
      {/* Header/Navigation */}
      <HeroSection />
      
      {/* Main Content Sections */}
      <main className="main-content">
        {/* Hero Carousel Section */}
        <Carousel />

        {/* Challenges Section */}
        
        <Challenges />


        {/* Timeline Section */}
        <TimeLine />

        {/* Prizes Section */}
        <RewardsSection />

        {/* Rules Section */}
        <Rules />

        {/* Contact Section */}
        <Contact />
      </main>
    </div>
  )
}

export default App
