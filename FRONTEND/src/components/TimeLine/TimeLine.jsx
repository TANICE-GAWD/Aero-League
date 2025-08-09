"use client";
import React, { useEffect, useRef } from 'react';
import { FaCalendarAlt, FaRocket, FaTrophy, FaFlag } from 'react-icons/fa';
import { MdFlightTakeoff } from 'react-icons/md';
import { AiTwotoneReconciliation } from 'react-icons/ai';
import { GiDeliveryDrone } from 'react-icons/gi';
import { LuTrophy } from 'react-icons/lu';
import './TimeLine.css';

const timelineData = [
  { Icon: FaCalendarAlt, title: "Registration Opens", description: "Secure your spot. Early registration begins for all teams and pilots.", date: "August 5, 2025" },
  { Icon: FaRocket, title: "Hackathon Kickoff", description: "Opening ceremony and team formation. The race begins now.", date: "August 30th, 2025" },
  { Icon: MdFlightTakeoff, title: "Challenge 1", description: "Low-Level Flight", date: "1200 Hours - August 30-31, 2025" },
  { Icon: AiTwotoneReconciliation, title: "Challenge 2", description: "Evening Recon", date: "1400 Hours - August 31st, 2025" },
  { Icon: GiDeliveryDrone, title: "Challenge 3", description: "Turbulent Delivery", date: "1600 Hours - August 31st, 2025" },
  { Icon: LuTrophy, title: "Challenge 4", description: "The Gauntlet", date: "1800 Hours - August 31st, 2025" },
  { Icon: FaFlag, title: "Bonus Race", description: "Strategic Dash", date: "2100 Hours - August 31st, 2025" },
  { Icon: FaTrophy, title: "Awards Ceremony", description: "Winners are announced and prizes awarded. Celebrate your achievements.", date: "August 31st, 2025" }
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