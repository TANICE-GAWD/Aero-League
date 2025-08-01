"use client";
import React, { useEffect, useRef } from 'react';
import { FaCalendarAlt, FaRocket, FaLaptopCode, FaFileUpload, FaTrophy } from 'react-icons/fa';
import './Timeline.css';

// Data is updated with high-quality icons
const timelineData = [
  {
    Icon: FaCalendarAlt,
    title: "Registration Opens",
    description: "Secure your spot. Early registration begins for all teams and pilots.",
    date: "August 15, 2025"
  },
  {
    Icon: FaRocket,
    title: "Hackathon Kickoff",
    description: "Opening ceremony and team formation. The race begins now.",
    date: "September 1, 2025"
  },
  {
    Icon: FaLaptopCode,
    title: "Development Phase",
    description: "48 hours of intense coding, building, and innovation.",
    date: "September 1-3, 2025"
  },
  {
    Icon: FaFileUpload,
    title: "Project Submission",
    description: "Finalize your project and submit your work for evaluation by our judges.",
    date: "September 3, 2025"
  },
  {
    Icon: FaTrophy,
    title: "Awards Ceremony",
    description: "Winners are announced and prizes awarded. Celebrate your achievements.",
    date: "September 4, 2025"
  }
];

const FlightpathTimeline = () => {
  const timelineRef = useRef(null);
  const progressRef = useRef(null);

  // Simplified Intersection Observer to animate elements on view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.5 }
    );

    const elements = timelineRef.current.querySelectorAll('.timeline-step');
    elements.forEach(el => observer.observe(el));

    return () => elements.forEach(el => observer.unobserve(el));
  }, []);

  // Scroll progress for the timeline's energy trail
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !progressRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight / 2)));
      progressRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="timeline-section">
      <div className="timeline-container">
        <div className="timeline-header">
          <h2 className="timeline-title">MISSION TIMELINE</h2>
          <p className="timeline-subtitle">Key dates and milestones for the Aero-League competition.</p>
        </div>
        
        <div className="timeline-wrapper" ref={timelineRef}>
          <div className="timeline-flight-path">
            <div className="timeline-progress-trail" ref={progressRef}></div>
          </div>
          
          <div className="timeline-steps-container">
            {timelineData.map((step, index) => (
              <div key={index} className="timeline-step">
                <div className="timeline-waypoint">
                  <step.Icon />
                </div>
                <div className="timeline-card">
                  <h3 className="timeline-card-title">{step.title}</h3>
                  <p className="timeline-card-description">{step.description}</p>
                  <div className="timeline-card-date">{step.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlightpathTimeline;
