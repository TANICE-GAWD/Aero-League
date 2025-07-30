import { useState } from 'react'
import HeroSection from './components/HeroSection/HeroSection'
import AboutEvent from './components/AboutEvent/AboutEvent'
import './App.css'

function App() {
  return (
    <div className="app">
      {/* Header/Navigation */}
      <HeroSection />
      
      {/* Main Content Sections */}
      <main className="main-content">
        {/* Hero Carousel Section */}
        <AboutEvent />

        {/* Timeline Section */}
        <section id="timeline" className="section">
          <div className="section__container">
            <h2 className="section__title">Timeline</h2>
            <p className="section__description">
              Important dates and milestones for the hackathon.
            </p>
          </div>
        </section>

        {/* Prizes Section */}
        <section id="prizes" className="section">
          <div className="section__container">
            <h2 className="section__title">Prizes</h2>
            <p className="section__description">
              Amazing rewards await the winners.
            </p>
          </div>
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
