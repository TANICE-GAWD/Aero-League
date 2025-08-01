import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import Carousel from './components/AboutEvent/Carousel';
import TimeLine from './components/TimeLine/TimeLine';
import RewardsSection from './components/Prize/Prize';
import Rules from './components/Rules/Rules';
import Challenges from './components/Challenges/Challenges';
import Contact from './components/Contact/Contact';
import './App.css';

function App() {
  return (
    <div className="app">
      {/* Header/Navigation */}
      <HeroSection />
      
      {/* Main Content Sections */}
      <main className="main-content">
        
        {/* Hero Carousel Section - ID for home navigation */}
        <section id="home">
          <Carousel />
        </section>

        {/* Challenges Section - ID for challenges navigation */}
        <section id="challenges">
          <Challenges />
        </section>

        {/* Timeline Section - ID for timeline navigation */}
        <section id="timeline">
          <TimeLine />
        </section>

        {/* Prizes Section - ID for prizes navigation */}
        <section id="prizes">
          <RewardsSection />
        </section>

        {/* Rules Section - ID for rules navigation */}
        <section id="rules">
          <Rules />
        </section>

        {/* Contact Section - ID for contact navigation */}
        <section id="contact">
          <Contact />
        </section>
        
      </main>
    </div>
  );
}

export default App;