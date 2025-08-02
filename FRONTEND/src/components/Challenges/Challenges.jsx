"use client";

import { useState, useEffect, useRef } from "react";
import { FaBullhorn, FaCrosshairs, FaParachuteBox, FaArchway, FaBolt } from "react-icons/fa";
import "./Challenges.css";

const challengesData = [
  
  {
    id: 1,
    title: "LOW-LEVEL FLIGHT",
    description: "Showcase your piloting skills by performing acrobatic loops and navigating obstacles, all while maintaining a challenging low altitude.",
    objective: "Loops and obstacle flying at 1 meter of height",
    accentColor: "#32CD32",
    accentColorRgb: "50, 205, 50", 
    Icon: FaCrosshairs,
    direction: "right",
  },
  {
    id: 2,
    title: "EVENING RECON",
    description: "Scan the twilight landscape for signal flashes and use the announcement system to report your findings accurately and swiftly.",
    objective: "Flash spotting at evening with announcement system",
    accentColor: "#8A2BE2",
    accentColorRgb: "138, 43, 226", 
    Icon: FaBullhorn,
    direction: "left", 
},
  {
    id: 3,
    title: "TURBULENT DELIVERY",
    description: "Navigate through heavy air turbulence and evade enemy threats to deliver your critical 250 gm payload to a precise landing zone.",
    objective: "Air turbulence based landing on a fixed spot with payload 250 gm escaping from enemies",
    accentColor: "#FF4500",
    accentColorRgb: "255, 69, 0", 
    Icon: FaParachuteBox,
    direction: "right", 
  },
  {
    id: 4,
    title: "THE GAUNTLET",
    description: "Rely solely on your instruments to navigate a treacherous, smoke-filled tunnel. Avoid submerged obstacles and the tunnel walls in zero-visibility conditions.",
    objective: "Navigate a smoky, water-filled tunnel with obstacles using only instruments (no visibility).",
    accentColor: "#4682B4",
    accentColorRgb: "70, 130, 180", 
    Icon: FaArchway,
    direction: "left", 
  },
  {
    id: 5,
    title: "RACE TO THE FINISH",
    description: "Compete in a high-speed race to the finish line.",
    objective: "Be the first to cross the finish line",
    accentColor: "#FF5733",
    accentColorRgb: "255, 87, 51",
    Icon: FaBolt,
    direction: "left",
  }
];


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