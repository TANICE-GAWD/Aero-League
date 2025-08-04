import React from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import Carousel from './components/AboutEvent/Carousel';
import TimeLine from './components/TimeLine/TimeLine';
import RewardsSection from './components/Prize/Prize';
import Rules from './components/Rules/Rules';
import Challenges from './components/Challenges/Challenges';
import Contact from './components/Contact/Contact';
import Judges from './components/Judges/Judges';

import Animation from './components/AeroLeague/AeroLeague'; 
import './App.css';


function App() {
  return (
    <div className="app">

      <HeroSection />
      
      <main className="main-content">

        {/* The Animation component is now inside its own section tag */}
        <section id="animation-section">
          <Animation />
        </section>



        <section id="challenges">
          <Challenges />
        </section>

        <section id="timeline">
          <TimeLine />
        </section>

        <section id="prizes">
          <RewardsSection />
        </section>

        <section id="rules">
          <Rules />
        </section>

        <section id="judges">
          <Judges />
        </section>

        <section id="contact">
          <Contact />
        </section>
        
      </main>
    </div>
  );
}

export default App;