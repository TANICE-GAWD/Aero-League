import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import { eventFeatures, eventStats } from './teamData';
import './AboutEvent.css';

const AboutEvent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector('.about-event-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={`about-event-section ${isVisible ? 'fade-in' : ''}`} id="about">
      <div className="about-event-container">
        <div className="about-event-content">
          <div className="about-event-header">
            <h1 className="about-event-title">
              About <span className="highlight">Aero League</span>
            </h1>
            <p className="about-event-subtitle">
              Revolutionizing Drone Technology Through Innovation
            </p>
          </div>

          <div className="about-event-description">
            <div className="description-grid">
              {eventFeatures.map((feature, index) => (
                <div key={index} className="description-card">
                  <div className="card-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="team-section">
            <h2 className="team-title">Meet Our Drone Team</h2>
            <p className="team-subtitle">The passionate individuals behind Aero League Drone Hackathon 2024</p>
            <Carousel />
          </div>

          <div className="stats-section">
            <div className="stats-grid">
              {eventStats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutEvent; 