import './AeroLeague.css';
import React from 'react';
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
    <section>
      <div className="about-section">
        <h2 className='about-header'>About</h2>
        <p className='about-content'>
          The Thapar Drone Challenge 2025, organized by the Department of Computer Science and Engineering (CSED), Thapar Institute of Engineering and Technology, is an exciting platform that brings together the brightest innovators to push the boundaries of drone technology.
        </p>
        <p className='about-content'>
          This dynamic event features four core challenges designed to test creativity, technical expertise, and problem-solving skills, along with an additional bonus race that adds to the thrill and competitive spirit.
        </p>
        <p className='about-content'>
          Participants will engage in real-world scenarios, showcasing their ability to design, build, and maneuver drones with precision. By combining innovation with practical application, the Thapar Drone Challenge not only fosters technological excellence but also inspires collaboration and knowledge exchange among aspiring engineers.
        </p>

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