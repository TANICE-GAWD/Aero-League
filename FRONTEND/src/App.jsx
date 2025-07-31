import { useState } from 'react'
import HeroSection from './components/HeroSection/HeroSection'
import Carousel from './components/AboutEvent/Carousel'
import TimeLine from './components/TimeLine/TimeLine'
import './App.css'
import RewardsSection from './components/Prize/Prize'

function App() {
  return (
    <div className="app">
      {/* Header/Navigation */}
      <HeroSection />
      
      {/* Main Content Sections */}
      <main className="main-content">
        {/* Hero Carousel Section */}
        <Carousel />

        {/* Timeline Section */}
        <TimeLine />

        {/* Prizes Section */}
        <section id="prizes" className="section">
          <RewardsSection />
        </section>

        {/* Rules Section */}
        <section id="rules" className="section">
          <div className="section__container">
            <h2 className="section__title">Rules & Regulations</h2>
            <p className="section__description">
              Guidelines and requirements for participants.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="section">
          <div className="section__container">
            <h2 className="section__title">Contact</h2>
            <p className="section__description">
              Get in touch with us for more information.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
