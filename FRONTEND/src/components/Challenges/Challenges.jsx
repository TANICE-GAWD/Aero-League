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
    title: "Low-Level Flight",
    subheader: "Challenging low-altitude obstructed environments.",
    objective:
      "Showcase your piloting skills by performing acrobatic loops and navigating obstacles, all while maintaining a challenging low altitude.",
    Icon: FaCrosshairs,
    accentColor: "#32cd32",
    gradientColors: ["#4de24db6", "#32cd3283"],
  },
  {
    id: 2,
    tag: "CHALLENGE 2",
    title: "Evening Recon",
    subheader: "Signal communication and patrolling.",
    objective:
      "Scan the twilight landscape for signal flashes and use the announcement system to report your findings accurately and swiftly.",
    Icon: FaBullhorn,
    accentColor: "#892be2",
    gradientColors: ["#a049f184", "#892be290"],
  },
  {
    id: 3,
    tag: "CHALLENGE 3",
    title: "TURBULENT DELIVERY",
    subheader: "Deliver payload during heavy turbulence.",
    objective:
      "Navigate through heavy air turbulence and evade enemy threats to deliver your critical 250 gm payload to a precise landing zone.",
    Icon: FaParachuteBox,
    accentColor: "#FF4500",
    gradientColors: ["#ff642ba3", "#ff44008d"],
  },
  {
    id: 4,
    tag: "CHALLENGE 4",
    title: "THE GAUNTLET",
    subheader: "Reach the target in low visibility.",
    objective:
      "Rely solely on your instruments to navigate a treacherous, smoke-filled tunnel. Avoid submerged obstacles and the tunnel walls in zero-visibility conditions.",
    Icon: FaArchway,
    accentColor: "#63b1f0ff",
    gradientColors: ["#7abcfaff", "#3c96e0ff"],
  },
  {
    id: 5,
    tag: "BONUS RACE",
    title: "STRATEGIC DASH",
    subheader: "Fastest Drone wins the race.",
    objective:
      "This isn't just about speed, it's about strategy. Decide on the fly which checkpoints to hit and which to skip, but be warned: every missed checkpoint comes at a cost.",
    Icon: FaFlagCheckered,
    accentColor: "#FFD700",
    gradientColors: ["#ffe033c6", "#ffd900ba"],
  },
];

const ChallengeCard = ({ challenge, isVisible }) => {
  const { Icon, title, objective, tag, gradientColors, accentColor, subheader } = challenge;

  return (
    <div
      className={`challengeCard ${isVisible ? "visible" : ""}`}
      style={{
        "--gradientStart": gradientColors[0],
        "--gradientEnd": gradientColors[1],
        "--accentColor": accentColor,
      }}
    >
      <header className="cardHeader">
        <div className="headerTop">
          <div className="headerInfo">
          <Icon className="headerIcon" />
          <h3 className="cardTitle">{title}</h3>
          </div>
          <span className="challengeTagHeader">{tag}</span>
        </div>
        <span className="challengeSubheader">{subheader}</span>
      </header>
      <div className="cardBody">
        <div className="objectiveBox">
          <span className="objectiveLabel">Objective</span>
          <p className="objectiveText">{objective}</p>
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
    <>
      <section className="teamsection1">
      <section className="challengesSection">
        <header className="sectionHeader">
          <h1 className="sectionMainTitle">CHALLENGES</h1>
        </header>

        <div className="challengesContainer">
          {challengesData.map((challenge, index) => (
            <div
              key={challenge.id}
              ref={(el) => (cardRefs.current[index] = el)}
              data-index={index}
              className={`challengeCardWrapper challengePos${index + 1}`}
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
    <div>
      <button className="learn-more-btn" onClick={() => window.open('https://tanice-gawd.github.io/tal-doc/', '_blank')}>
          Learn More
        </button>
    </div>
    </>
  );
};

export default Challenges;