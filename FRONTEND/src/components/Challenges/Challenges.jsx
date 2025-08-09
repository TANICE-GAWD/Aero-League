"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaCrosshairs,
  FaBullhorn,
  FaParachuteBox,
  FaArchway,
  FaFlagCheckered,
} from "react-icons/fa";
import "./Challenges.css";

const challengesData = [
  {
    id: 1,
    tag: "CHALLENGE 1",
    title: "LOW-LEVEL FLIGHT",
    objective: "Showcase your piloting skills by performing acrobatic loops and navigating obstacles, all while maintaining a challenging low altitude.",
    Icon: FaCrosshairs,
    accentColor: "#32cd32",
    gradientColors: ["#4de24db6", "#32cd3283"],
  },
  {
    id: 2,
    tag: "CHALLENGE 2",
    title: "EVENING RECON",
    objective: "Scan the twilight landscape for signal flashes and use the announcement system to report your findings accurately and swiftly.",
    Icon: FaBullhorn,
    accentColor: "#892be2",
    gradientColors: ["#a049f184", "#892be290"],
  },
  {
    id: 3,
    tag: "CHALLENGE 3",
    title: "TURBULENT DELIVERY",
    objective: "Navigate through heavy air turbulence and evade enemy threats to deliver your critical 250 gm payload to a precise landing zone.",
    Icon: FaParachuteBox,
    accentColor: "#FF4500",
    gradientColors: ["#ff642ba3", "#ff44008d"],
  },
  {
    id: 4,
    tag: "CHALLENGE 4",
    title: "THE GAUNTLET",
    objective: "Rely solely on your instruments to navigate a treacherous, smoke-filled tunnel. Avoid submerged obstacles and the tunnel walls in zero-visibility conditions.",
    Icon: FaArchway,
    accentColor: "#4682B4",
    gradientColors: ["#5e89b2", "#4682B4"],
  },
  {
    id: 5,
    tag: "BONUS RACE",
    title: "STRATEGIC DASH",
    objective: "This isn't just about speed, it's about strategy. Decide on the fly which checkpoints to hit and which to skip, but be warned: every missed checkpoint comes at a cost.",
    Icon: FaFlagCheckered,
    accentColor: "#FFD700",
    gradientColors: ["#ffe033c6", "#ffd900ba"],
  },
];

const ChallengeCard = ({ challenge, isVisible }) => {
  const { Icon, title, objective, tag, gradientColors, accentColor } = challenge;

  return (
    <div
      className={`challenge-card ${isVisible ? "visible" : ""}`}
      style={{
        "--gradient-start": gradientColors[0],
        "--gradient-end": gradientColors[1],
        "--accent-color": accentColor,
      }}
    >
      <header className="card-header">
        <div className="header-top">
          <Icon className="header-icon" />
          <span className="challenge-tag-header">{tag}</span>
        </div>
        <h3 className="card-title">{title}</h3>
      </header>
      <div className="card-body">
        <div className="objective-box">
          <span className="objective-label">Objective</span>
          <p className="objective-text">{objective}</p>
        </div>
      </div>
    </div>
  );
};

const Challenges = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = Number(entry.target.dataset.index);
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])]);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.1 }
    );

    const currentRefs = cardRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="team-section">
      <section className="challenges-section">
        <header className="section-header">
          <h1 className="section-main-title">CHALLENGES</h1>
        </header>

        <div className="challenges-container">
          {challengesData.map((challenge, index) => (
            <div
              key={challenge.id}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              // Added a dynamic class for grid positioning
              className={`challenge-card-wrapper challenge-pos-${index + 1}`}
            >
              <ChallengeCard
                challenge={challenge}
                isVisible={visibleCards.includes(index)}
              />
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Challenges;