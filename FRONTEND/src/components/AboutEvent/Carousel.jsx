"use client";
import React, { useState, useEffect } from "react";
import './Carousel.css';

export default function Carousel() {
  const [executives, setExecutives] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="contributors-section">
      <div className="contributors-container">
        <h2 className="contributors-title">AERO LEAGUE</h2>
        <div className="carousel-container">
          <div className="carousel">
            <div
              className="carousel-inner"
              style={{
                transform: isMobile 
                  ? `translateX(-${currentIndex * 220}px)` 
                  : `rotateY(${currentIndex * -(360 / executives.length)}deg)`,
              }}
            >
              {executives.map((executive, index) => {
                const angle = index * (360 / executives.length);
                return (
                  <div 
                    key={index} 
                    className="carousel-item" 
                    style={{ 
                      transform: isMobile 
                        ? 'none' 
                        : `translate(-50%, -50%) rotateY(${angle}deg) translateZ(480px)` 
                    }}
                  >
                    <div className="member-card">
                      <div className="member-image">
                        <img src={executive.image} alt={executive.name} />
                      </div>
                      <h3 className="member-name">{executive.name}</h3>
                      <p className="member-role">{executive.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
