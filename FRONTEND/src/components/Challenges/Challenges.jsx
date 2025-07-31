"use client"

import { useState, useEffect, useRef } from "react"
import "./Challenges.css"

const Challenges = () => {
  const [activeChallenge, setActiveChallenge] = useState(0)
  const [visibleCards, setVisibleCards] = useState(new Set())
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  const challenges = [
    {
      id: 1,
      title: "OBSTACLE SPRINT",
      description: "Navigate through a complex maze of obstacles while maintaining maximum speed and precision.",
      objective: "Navigate 5 checkpoints in 60 seconds",
      color: "#00BFFF",
      icon: "🚁",
    },
    {
      id: 2,
      title: "PRECISION LANDING",
      description: "Test your piloting skills with pinpoint accuracy in challenging landing scenarios.",
      objective: "Land within 10cm of target zone",
      color: "#7CFC00",
      icon: "🎯",
    },
    {
      id: 3,
      title: "SPEED CIRCUIT",
      description: "Push your drone to its limits in high-speed racing through dynamic course layouts.",
      objective: "Complete 3 laps under 90 seconds",
      color: "#FF6F61",
      icon: "⚡",
    },
    {
      id: 4,
      title: "FREESTYLE BATTLE",
      description: "Showcase creativity and technical prowess in open-format aerial performance challenges.",
      objective: "Score 85+ points from judges",
      color: "#00BFFF",
      icon: "🎪",
    },
  ]

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -20% 0px",
      threshold: 0.5,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const index = Number.parseInt(entry.target.dataset.index)

        if (entry.isIntersecting) {
          setActiveChallenge(index)
          setVisibleCards((prev) => new Set([...prev, index]))
        }
      })
    }, observerOptions)

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const handleLearnMore = (challengeId) => {
    console.log(`Learn more about challenge ${challengeId}`)
  }

  return (
    <section className="challenges-section" ref={sectionRef}>
      <div className="sticky-header">
        <h1 className="section-title">CHALLENGES</h1>
        <div className="progress-indicator">
          <div className="progress-line">
            <div
              className="progress-fill"
              style={{ height: `${((activeChallenge + 1) / challenges.length) * 100}%` }}
            />
          </div>
          <div className="progress-dots">
            {challenges.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index <= activeChallenge ? "active" : ""}`}
                style={{
                  backgroundColor: index <= activeChallenge ? challenges[index].color : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="challenges-container">
        {challenges.map((challenge, index) => (
          <div
            key={challenge.id}
            ref={(el) => (cardRefs.current[index] = el)}
            data-index={index}
            className={`challenge-card ${visibleCards.has(index) ? "visible" : ""} ${
              index % 2 === 0 ? "slide-left" : "slide-right"
            }`}
          >
            <div className="card-content">
              <div className="challenge-visual">
                <div
                  className="icon-container"
                  style={{ borderColor: challenge.color, boxShadow: `0 0 20px ${challenge.color}40` }}
                >
                  <span className="challenge-icon">{challenge.icon}</span>
                  <div className="rotating-ring" style={{ borderColor: challenge.color }}></div>
                </div>
              </div>

              <div className="challenge-info">
                <h2 className="challenge-title" style={{ color: challenge.color }}>
                  {challenge.title}
                </h2>
                <p className="challenge-description">{challenge.description}</p>
                <div
                  className="challenge-objective"
                  style={{
                    backgroundColor: `${challenge.color}20`,
                    borderLeft: `4px solid ${challenge.color}`,
                    boxShadow: `0 0 15px ${challenge.color}30`,
                  }}
                >
                  <span className="objective-label">OBJECTIVE:</span>
                  <span className="objective-text">{challenge.objective}</span>
                </div>
                <button
                  className="cta-button"
                  style={{
                    backgroundColor: challenge.color,
                    boxShadow: `0 0 20px ${challenge.color}50`,
                  }}
                  onClick={() => handleLearnMore(challenge.id)}
                >
                  <span>LEARN MORE</span>
                  <div className="button-ripple"></div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Challenges
