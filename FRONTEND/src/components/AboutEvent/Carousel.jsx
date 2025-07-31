"use client";
import React, { useState, useEffect, useRef } from "react";
import { FaLinkedin, FaTwitter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Carousel.css';

// Data is now a constant outside the component and includes more details
const teamData = [
  { name: "member 1", role: "Role 1", image: "/assets/member1.png", linkedin: "#", twitter: "#" },
  { name: "member 2", role: "Role 2", image: "/assets/member2.png", linkedin: "#", twitter: "#" },
  { name: "member 3", role: "Role 3", image: "/assets/member3.png", linkedin: "#", twitter: "#" },
  { name: "member 4", role: "Role 4", image: "/assets/member4.png", linkedin: "#", twitter: "#" },
  { name: "member 5", role: "Role 5", image: "/assets/member5.png", linkedin: "#", twitter: "#" },
  { name: "member 6", role: "Role 6", image: "/assets/member6.png", linkedin: "#", twitter: "#" },
  { name: "member 7", role: "Role 7", image: "/assets/member7.png", linkedin: "#", twitter: "#" },
  { name: "member 8", role: "Role 8", image: "/assets/member8.png", linkedin: "#", twitter: "#" },
];

export default function TeamCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalItems = teamData.length;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalItems);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalItems) % totalItems);
  };

  // Auto-rotation effect that respects the pause state
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 3000);
    return () => clearInterval(interval);
  }, [isPaused, totalItems]); // Added totalItems as a dependency

  return (
    <section className="team-section">
      <div className="team-container">
        <h2 className="team-title">MEET THE PILOTS</h2>
        <div
          className="carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Decorative HUD Frame */}
          <div className="hud-frame"></div>
          
          <div className="carousel">
            <div
              className="carousel-inner"
              style={{ "--current-index": currentIndex }}
            >
              {teamData.map((member, index) => (
                <div
                  className="carousel-item"
                  key={index}
                  style={{ "--item-index": index }}
                >
                  <div className="member-card">
                    <div className="member-image-wrapper">
                      <img src={member.image} alt={member.name} className="member-image" />
                    </div>
                    <div className="member-info">
                      <h3 className="member-name">{member.name}</h3>
                      <p className="member-role">{member.role}</p>
                      
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Controls */}
          <button className="carousel-control prev" onClick={handlePrev} aria-label="Previous pilot"><FaChevronLeft /></button>
          <button className="carousel-control next" onClick={handleNext} aria-label="Next pilot"><FaChevronRight /></button>
        </div>

        {/* Dot Indicators */}
        <div className="carousel-dots">
          {teamData.map((_, index) => (
            <button
              key={index}
              className={`dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to pilot ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
