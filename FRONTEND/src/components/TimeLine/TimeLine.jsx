"use client";
import React, { useEffect, useRef } from 'react';
import { FaCalendarAlt, FaRocket, FaLaptopCode, FaTrophy } from 'react-icons/fa';
import './TimeLine.css';
import { MdFlightTakeoff} from 'react-icons/md';
import { AiTwotoneReconciliation } from 'react-icons/ai';
import { FaFlag } from 'react-icons/fa';
import { GiDeliveryDrone } from 'react-icons/gi';
import { LuTrophy } from 'react-icons/lu';

const timelineData = [
  {
    Icon: FaCalendarAlt,
    title: "Registration Opens",
    description: "Secure your spot. Early registration begins for all teams and pilots. (Start built drones)",
    date: "August 5, 2025"
  },
  {
    Icon: FaRocket,
    title: "Hackathon Kickoff",
    description: "Opening ceremony and team formation. The race begins now.",
    date: "August 30th, 2025"
  },
  {
    Icon: MdFlightTakeoff,
    title: "Challenge 1",
    description: "Low-Level Flight",
    date: "1200 Hours - August 30-31, 2025"
  },
  {
    Icon: AiTwotoneReconciliation,
    title: "Challenge 2",
    description: "Evening Recon",
    date: "1400 Hours - August 31st, 2025"
  },
  {
    Icon: GiDeliveryDrone,
    title: "Challenge 3",
    description: "Turbulent Delivery",
    date: "1600 Hours - August 31st, 2025"
  },
  {
    Icon: LuTrophy,
    title: "Challenge 4",
    description: "The Gauntlet",
    date: "1800 Hours - August 31st, 2025"
  },
  {
    Icon: FaFlag,
    title: "Bonus Race",
    description: "Strategic Dash",
    date: "2100 Hours - August 31st, 2025"
  },
  {
    Icon: FaTrophy,
    title: "Awards Ceremony",
    description: "Winners are announced and prizes awarded. Celebrate your achievements.",
    date: "August 31st, 2025"
  }
];

const FlightpathTimeline = () => {
  const timelineRef = useRef(null);
  const progressRef = useRef(null);

  
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

  
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !progressRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (rect.height + window.innerHeight / 2)));
      progressRef.current.style.height = `${progress * 100}%`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="team-section">
      <div className="timeline-container">
        <div className="timeline-header">
          <h2 className="timeline-title">TIMELINE</h2>
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
