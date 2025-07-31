"use client"

import { useState, useEffect, useRef } from "react"
import "./Challenges.css"

const challengesData = [
  {
      id: 1,
      title: "OBSTACLE SPRINT",
      description: "Navigate through a complex maze of obstacles while maintaining maximum speed and precision.",
      objective: "Navigate 5 checkpoints in 60 seconds",
      color: "#00BFFF",
      visual: "🚁",
    },
    {
      id: 2,
      title: "PRECISION LANDING",
      description: "Test your piloting skills with pinpoint accuracy in challenging landing scenarios.",
      objective: "Land within 10cm of target zone",
      color: "#7CFC00",
      visual: "🎯",
    },
    {
      id: 3,
      title: "SPEED CIRCUIT",
      description: "Push your drone to its limits in high-speed racing through dynamic course layouts.",
      objective: "Complete 3 laps under 90 seconds",
      color: "#FF6F61",
      visual: "⚡",
    },
    {
      id: 4,
      title: "FREESTYLE BATTLE",
      description: "Showcase creativity and technical prowess in open-format aerial performance challenges.",
      objective: "Score 85+ points from judges",
      color: "#00BFFF",
      visual: "🎪",
    },
]

const ChallengeCard = ({ challenge, isVisible, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`challenge-card ${isVisible ? "visible" : ""} ${challenge.direction}`}
      style={{
        "--accent-color": challenge.accentColor,
        "--animation-delay": `${index * 0.2}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-content">
        <div className="card-visual">
          <span className="visual-icon">{challenge.visual}</span>
        </div>

        <div className="card-text">
          <h3 className="card-title">{challenge.title}</h3>
          <p className="card-description">{challenge.description}</p>

          <div className="objective-box" style={{ backgroundColor: challenge.accentColor }}>
            <span className="objective-text">{challenge.objective}</span>
          </div>

          <button className={`cta-button ${isHovered ? "hovered" : ""}`} style={{ borderColor: challenge.accentColor }}>
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}

const ProgressIndicator = ({ activeIndex, totalItems }) => {
  return (
    <div className="progress-indicator">
      <div className="progress-line">
        <div
          className="progress-fill"
          style={{
            height: `${((activeIndex + 1) / totalItems) * 100}%`,
            backgroundColor: challengesData[activeIndex]?.accentColor || "#00BFFF",
          }}
        />
      </div>
      {challengesData.map((_, index) => (
        <div
          key={index}
          className={`progress-dot ${index <= activeIndex ? "active" : ""}`}
          style={{
            backgroundColor: index <= activeIndex ? challengesData[index].accentColor : "#ddd",
          }}
        />
      ))}
    </div>
  )
}

const Challenges = () => {
  const [visibleCards, setVisibleCards] = useState([])
  const [activeCard, setActiveCard] = useState(0)
  const cardRefs = useRef([])
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = Number.parseInt(entry.target.dataset.index)

          if (entry.isIntersecting) {
            setVisibleCards((prev) => [...new Set([...prev, cardIndex])])
            if (entry.intersectionRatio > 0.5) {
              setActiveCard(cardIndex)
            }
          }
        })
      },
      {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: "-20% 0px -20% 0px",
      },
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section className="challenges-section" ref={sectionRef}>
      <div className="sticky-header">
        <h1 className="section-title">CHALLENGES</h1>
      </div>

      <ProgressIndicator activeIndex={activeCard} totalItems={challengesData.length} />

      <div className="challenges-container">
        {challengesData.map((challenge, index) => (
          <div
            key={challenge.id}
            ref={(el) => (cardRefs.current[index] = el)}
            data-index={index}
            className="challenge-wrapper"
          >
            <ChallengeCard challenge={challenge} isVisible={visibleCards.includes(index)} index={index} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Challenges
