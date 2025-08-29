import './AeroLeague.css';
import React from 'react';



const cardData = [
  {
    
    title: 'Premier Competition',
    description: 'Bringing together the nation\'s brightest minds to tackle demanding challenges in drone technology and test the limits of innovation.'
  },
  {
    
    title: 'Hands-On Challenge',
    description: 'This challenge focuses on custom-built drones, fostering excellence in aerodynamics, programming, and piloting among future tech pioneers.'
  },
  {
    title: 'Dominate the Skies',
    description: 'Competitors will navigate complex obstacle courses and execute precision maneuvers in a race that is a launchpad for aerospace innovators.'
  }
];


function AeroLeagueLayout() {
  return (
    <div className="aero-container">
      <img src='/assets/drone/1.png' className='aero-drone-image-1' alt='Drone 1' />
      <img src='/assets/drone/2.png' className='aero-drone-image-2' alt='Drone 2' />
      
      <div className="aero-header">
        <h1>THAPAR DRONE</h1>
        <h2>CHALLENGE</h2>
      </div>

      <h3 className="aero-subtitle">
        <span className='aero-build'>BUILD.</span>
        <span className='aero-fly'>FLY.</span>
        <span className='aero-dominate'>DOMINATE.</span>
      </h3>

      <div className="aero-info">
        <p>6th & 7th SEPTEMBER 2025 | 10 am Onwards</p>
        <button className="learn-more-btn" onClick={() => window.open('https://tanice-gawd.github.io/tal-doc/', '_blank')}>
          Learn More
        </button>
      </div>
    </div>
  );
}


function AboutSection() {
  return (
    <section className="aero-about-section">
      <div className="aero-about-content">
        <h2 className="aero-about-heading">ABOUT</h2>
        <p className="aero-about-subheader">
          An initiative by <strong>CSED, Thapar Institute</strong>
        </p>
        <div className="about-cards-container">
          {cardData.map((card, index) => (
            <div className="info-card" key={index}>
              <div className="info-card-icon">{card.icon}</div>
              <h3 className="info-card-title">{card.title}</h3>
              <p className="info-card-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function AeroLeaguePage() {
    return (
        <>
            <AeroLeagueLayout />
            <AboutSection /> 
        </>
    )
}

export default AeroLeaguePage;