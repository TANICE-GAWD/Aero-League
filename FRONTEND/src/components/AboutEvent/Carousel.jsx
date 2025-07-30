"use client";
import React, { useState, useEffect } from "react";
import { teamData } from './teamData';
import './AboutEvent.css';

export default function Carousel() {
  const [executives, setExecutives] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    setExecutives(teamData);
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % executives.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, executives.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + executives.length) % executives.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % executives.length);
  };

  const handleIndicatorClick = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        handlePrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        handleNext();
        break;
      case 'Home':
        event.preventDefault();
        setCurrentIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setCurrentIndex(executives.length - 1);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.target.closest('.event-carousel-container')) {
        handleKeyDown(event);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [currentIndex, executives.length]);

  return (
    <>
      {isMobile ? (
        <div className="mobile-carousel-container">
          <div className="mobile-carousel-wrapper">
            {executives.map((executive, index) => (
              <div 
                key={executive.id} 
                className={`mobile-event-card ${index === currentIndex ? 'mobile-event-card--active' : ''}`}
                style={{ transform: `translateX(${(index - currentIndex) * 100}%)` }}
              >
                <div className="event-card-image">
                  <img 
                    src={executive.image} 
                    alt={executive.name}
                    className="event-card-img"
                  />
                </div>
                <div className="event-card-content">
                  <h3 className="event-card-title">{executive.name}</h3>
                  <p className="event-card-subtitle">{executive.role}</p>
                  <p className="event-card-description">{executive.description}</p>
                  <div className="expertise-tag">{executive.expertise}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mobile-carousel-dots">
            {executives.map((executive, index) => (
              <button
                key={executive.id}
                className={`mobile-dot ${index === currentIndex ? 'mobile-dot--active' : ''}`}
                onClick={() => handleIndicatorClick(index)}
                aria-label={`Go to ${executive.name}`}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : (
        <div 
          className="event-carousel-container"
          role="region"
          aria-label="Team members carousel"
          tabIndex={0}
        >
          <div className="event-carousel">
            <div
              className="event-carousel-inner"
              style={{
                transform: `rotateY(${currentIndex * -45}deg)`,
              }}
            >
              {executives.map((executive, index) => {
                const angle = index * (360 / executives.length);
                return (
                  <div key={executive.id} className="event-carousel-item" style={{ transform: `rotateY(${angle}deg) translateZ(480px)` }}>
                    <div className="event-card">
                      <div className="event-card-image">
                        <img 
                          src={executive.image} 
                          alt={executive.name}
                          className="event-card-img"
                        />
                      </div>
                      <div className="event-card-content">
                        <h3 className="event-card-title">{executive.name}</h3>
                        <p className="event-card-subtitle">{executive.role}</p>
                        <p className="event-card-description">{executive.description}</p>
                        <div className="expertise-tag">{executive.expertise}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {`Showing ${executives[currentIndex]?.name}, ${currentIndex + 1} of ${executives.length}`}
          </div>
        </div>
      )}
    </>
  );
}
