"use client";

import { useState, useEffect, useRef } from "react";
import { FaHelicopter, FaBullseye, FaBolt, FaMagic } from "react-icons/fa";
import "./Challenges.css";

// --- Data is enhanced for better maintainability ---
const challengesData = [
  {
    id: 1,
    title: "OBSTACLE SPRINT",
    description: "Navigate a complex maze of obstacles with maximum speed and precision.",
    objective: "Navigate 5 checkpoints in 60 seconds",
    accentColor: "#00BFFF",
    accentColorRgb: "0, 191, 255", // Explicit RGB for easier use in CSS
    Icon: FaHelicopter,
    direction: "left", // For alternating animations
  },
  {
    id: 2,
    title: "PRECISION LANDING",
    description: "Test your piloting skills with pinpoint accuracy in challenging landing scenarios.",
    objective: "Land within 10cm of target zone",
    accentColor: "#7CFC00",
    accentColorRgb: "124, 252, 0",
    Icon: FaBullseye,
    direction: "right",
  },
  {
    id: 3,
    title: "SPEED CIRCUIT",
    description: "Push your drone to its limits in high-speed racing through dynamic course layouts.",
    objective: "Complete 3 laps under 90 seconds",
    accentColor: "#FF6F61",
    accentColorRgb: "255, 111, 97",
    Icon: FaBolt,
    direction: "left",
  },
  {
    id: 4,
    title: "FREESTYLE BATTLE",
    description: "Showcase creativity and technical prowess in open-format aerial performance.",
    objective: "Score 85+ points from judges",
    accentColor: "#9B59B6", // Added a new color for variety
    accentColorRgb: "155, 89, 182",
    Icon: FaMagic,
    direction: "right",
  },
];

// --- Card Component: Simplified state, uses robust icons ---
const ChallengeCard = ({ challenge, isVisible }) => {
  const { Icon, title, description, objective, accentColor, accentColorRgb, direction } = challenge;

  return (
    <div
      className={`challenge-card ${isVisible ? "visible" : ""} ${direction}`}
      style={{
        "--accent-color": accentColor,
        "--accent-color-rgb": accentColorRgb,
      }}
    >
      <div className="card-content">
        <div className="card-visual">
          <Icon className="visual-icon" />
        </div>
        <div className="card-text">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <div className="objective-box">
            <span className="objective-text">{objective}</span>
          </div>
          <button className="cta-button">Learn More</button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component: Adds scroll progress logic ---
const Challenges = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])]);
          }
        });
      },
      { rootMargin: "0px 0px -25% 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);
  
  // Effect for calculating scroll progress
  useEffect(() => {
    const handleScroll = () => {
        if (!sectionRef.current) return;
        const { top, height } = sectionRef.current.getBoundingClientRect();
        const progress = -top / (height - window.innerHeight);
        setScrollProgress(Math.min(1, Math.max(0, progress)));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="team-section">
      <section className="challenges-section" ref={sectionRef}>
        <header className="sticky-header">
          <h1 className="section-title">CHALLENGES</h1>
        </header>

        <div className="challenges-container">
          {challengesData.map((challenge, index) => (
            <div
              key={challenge.id}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className="challenge-wrapper"
            >
              <ChallengeCard challenge={challenge} isVisible={visibleCards.includes(index)} />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Challenges;