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
      
      <HeroSection />
      
      
      <main className="main-content">
        
        
        <section id="home">
          <Carousel />
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

        <section id="contact">
          <Contact />
        </section>
        
      </main>
    </div>
  );
}

export default App;