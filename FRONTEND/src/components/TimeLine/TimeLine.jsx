"use client";
import React, { useEffect, useRef } from 'react';
import { FaCalendarAlt, FaRocket, FaTrophy, FaFlag } from 'react-icons/fa';
import { MdFlightTakeoff } from 'react-icons/md';
import { AiTwotoneReconciliation } from 'react-icons/ai';
import { GiDeliveryDrone } from 'react-icons/gi';
import { LuTrophy } from 'react-icons/lu';
import './TimeLine.css';

const timelineData = [
  { Icon: FaCalendarAlt, title: "Registration Opens", description: "Secure your spot. Early registration begins for all teams and pilots.", date: "Monday, September 1, 2025"},
  { Icon: FaRocket, title: "Hackathon Kickoff", description: "Opening ceremony and team formation. The race begins now.", date: "Friday, September 12, 2025" },
  { Icon: MdFlightTakeoff, title: "Challenge 1", description: "Low-Level Flight", date: "Friday, 12 September, 2025 - 12:00PM " },
  { Icon: AiTwotoneReconciliation, title: "Challenge 2", description: "Evening Recon", date: "Friday, 12 September, 2025 - 4:00PM" },
  { Icon: GiDeliveryDrone, title: "Challenge 3", description: "Turbulent Delivery", date: "Saturday, 13 September, 2025 - 9:00AM" },
  { Icon: LuTrophy, title: "Challenge 4", description: "The Gauntlet", date: "Saturday, 13 September, 2025 - 12:00PM" },
  { Icon: FaFlag, title: "Bonus Race", description: "Strategic Dash", date: "Saturday, 13 September, 2025 - 3:00PM" },
  { Icon: FaTrophy, title: "Awards Ceremony", description: "Winners are announced and prizes awarded. Celebrate your achievements.", date: "Saturday, 13 September, 2025 - 6:00PM" }
];

const FlightpathTimeline = () => {
  const timelineRef = useRef(null);
  const progressRef = useRef(null);

  
  const pairedData = [];
  for (let i = 0; i < timelineData.length; i += 2) {
    pairedData.push({
      left: timelineData[i],
      right: timelineData[i + 1] 
    });
  }

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
    
    const elements = timelineRef.current.querySelectorAll('.timeline-row');
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
          
          {/* --- CHANGED: Container for rows instead of columns --- */}
          <div className="timeline-rows-container">
            {pairedData.map((pair, index) => (
              <div key={index} className="timeline-row">
                {/* Left Card */}
                <div className="timeline-content timeline-content-left">
                  <div className="timeline-card">
                    <h3 className="timeline-card-title">{pair.left.title}</h3>
                    <p className="timeline-card-description">{pair.left.description}</p>
                    <div className="timeline-card-date">{pair.left.date}</div>
                  </div>
                </div>

                {/* Shared Center Icon */}
                <div className="timeline-waypoint">
                  <pair.left.Icon />
                </div>

                {/* Right Card */}
                <div className="timeline-content timeline-content-right">
                  {pair.right && ( 
                    <div className="timeline-card">
                      <h3 className="timeline-card-title">{pair.right.title}</h3>
                      <p className="timeline-card-description">{pair.right.description}</p>
                      <div className="timeline-card-date">{pair.right.date}</div>
                    </div>
                  )}
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