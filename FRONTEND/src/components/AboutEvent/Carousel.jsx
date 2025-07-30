"use client";
import React, { useState, useEffect } from "react";
import './AboutEvent.css';

export default function Carousel() {
  const [executives, setExecutives] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


  useEffect(() => {
    const Data = [
      { "name": "Member 1", "role": "Role", "image": "/images.png" },
      { "name": "Member 2", "role": "Role", "image": "/images.jpg" },
      { "name": "Member 3", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 4", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 5", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 6", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 7", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 8", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 9", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 10", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 11", "role": "MEMBER", "image": "/images.jpg" },
      { "name": "Member 12", "role": "MEMBER", "image": "/images.jpg" }
    ];
    setExecutives(Data);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + executives.length) % executives.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % executives.length);
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
      // Only handle keyboard events when the carousel is focused
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
              <div key={index} className="mobile-event-card">
                <div className="event-card-image">
                  <div className="event-image-placeholder">
                    <span className="event-highlight">{executive.name.charAt(0)}</span>
                  </div>
                </div>
                <div className="event-card-content">
                  <h3 className="event-card-title">{executive.name}</h3>
                  <p className="event-card-subtitle">{executive.role}</p>
                  <p className="event-card-description">
                    Team member contributing to the success of our event.
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Dots Indicator */}
          <div className="mobile-carousel-dots">
            {executives.map((_, index) => (
              <button
                key={index}
                className={`mobile-dot ${index === currentIndex ? 'mobile-dot--active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to member ${index + 1}`}
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
                transform: `rotateY(${currentIndex * -30}deg)`,
              }}
            >
              {executives.map((executive, index) => {
                const angle = index * (360 / executives.length);
                return (
                  <div key={index} className="event-carousel-item" style={{ transform: `rotateY(${angle}deg) translateZ(480px)` }}>
                    <div className="event-card">
                      <div className="event-card-image">
                        <div className="event-image-placeholder">
                          <span className="event-highlight">{executive.name.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="event-card-content">
                        <h3 className="event-card-title">{executive.name}</h3>
                        <p className="event-card-subtitle">{executive.role}</p>
                        <p className="event-card-description">
                          Team member contributing to the success of our event.
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev} 
            className="carousel-nav-button carousel-nav-button--prev"
            aria-label="Previous member"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button 
            onClick={handleNext} 
            className="carousel-nav-button carousel-nav-button--next"
            aria-label="Next member"
            type="button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Carousel Indicators */}
          <div className="carousel-indicators" role="tablist" aria-label="Carousel navigation">
            {executives.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'carousel-indicator--active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to member ${index + 1}`}
                aria-selected={index === currentIndex}
                role="tab"
                type="button"
              />
            ))}
          </div>
          
          {/* Screen reader status */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {`Showing member ${currentIndex + 1} of ${executives.length}`}
          </div>
                 </div>
       )}
     </>
   );
 }
