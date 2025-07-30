import React, { useState, useEffect } from 'react';
import './AboutEvent.css';

const AboutEvent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Event information for the carousel
  const eventData = [
    {
      title: "Aero League 2024",
      subtitle: "Aviation Innovation Hackathon",
      description: "Join us for a groundbreaking 48-hour hackathon focused on revolutionizing aviation technology.",
      image: "/event-aviation.jpg",
      highlight: "48 Hours"
    },
    {
      title: "Build the Future",
      subtitle: "Create Innovative Solutions",
      description: "Develop cutting-edge solutions for aviation challenges using AI, IoT, and emerging technologies.",
      image: "/event-innovation.jpg",
      highlight: "Innovation"
    },
    {
      title: "Connect & Collaborate",
      subtitle: "Network with Experts",
      description: "Meet industry leaders, mentors, and fellow innovators in the aviation technology space.",
      image: "/event-network.jpg",
      highlight: "Network"
    },
    {
      title: "Win Amazing Prizes",
      subtitle: "Up to $10,000 in Rewards",
      description: "Compete for cash prizes, internships, and mentorship opportunities with leading aviation companies.",
      image: "/event-prizes.jpg",
      highlight: "$10,000"
    },
    {
      title: "Learn & Grow",
      subtitle: "Workshops & Mentorship",
      description: "Attend technical workshops, design thinking sessions, and get guidance from industry experts.",
      image: "/event-learn.jpg",
      highlight: "Learn"
    },
    {
      title: "Showcase Your Skills",
      subtitle: "Present to Industry Leaders",
      description: "Present your innovative solutions to a panel of aviation industry experts and investors.",
      image: "/event-present.jpg",
      highlight: "Present"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % eventData.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [eventData.length]);

  return (
    <section className="about-event-section" id="home">
      <div className="about-event-container">
        <div className="about-event-content">
          <h1 className="about-event-title">
            Welcome to <span className="highlight">Aero League</span>
          </h1>
          <p className="about-event-subtitle">
            The Future of Aviation Technology
          </p>
          
          {/* Carousel Container */}
          <div className="event-carousel-container">
            <div className="event-carousel">
              <div
                className="event-carousel-inner"
                style={{
                  transform: `rotateY(${currentIndex * -60}deg)`,
                }}
              >
                {eventData.map((event, index) => {
                  const angle = index * (360 / eventData.length);
                  return (
                    <div 
                      key={index} 
                      className="event-carousel-item" 
                      style={{ transform: `rotateY(${angle}deg) translateZ(300px)` }}
                    >
                      <div className="event-card">
                        <div className="event-card-image">
                          <div className="event-image-placeholder">
                            <span className="event-highlight">{event.highlight}</span>
                          </div>
                        </div>
                        <div className="event-card-content">
                          <h3 className="event-card-title">{event.title}</h3>
                          <p className="event-card-subtitle">{event.subtitle}</p>
                          <p className="event-card-description">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutEvent;
