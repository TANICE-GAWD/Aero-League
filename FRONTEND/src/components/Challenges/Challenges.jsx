"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const Challenges = () => {
  const [activeChallenge, setActiveChallenge] = useState(0)
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  const challenges = [
    {
      id: 1,
      title: "OBSTACLE SPRINT",
      description: "Navigate through a complex maze of obstacles while maintaining maximum speed and precision.",
      objective: "Navigate 5 checkpoints in 60 seconds",
      color: "electric-blue",
      colorHex: "#00BFFF",
      icon: "🚁",
    },
    {
      id: 2,
      title: "PRECISION LANDING",
      description: "Test your piloting skills with pinpoint accuracy in challenging landing scenarios.",
      objective: "Land within 10cm of target zone",
      color: "neon-green",
      colorHex: "#7CFC00",
      icon: "🎯",
    },
    {
      id: 3,
      title: "SPEED CIRCUIT",
      description: "Push your drone to its limits in high-speed racing through dynamic course layouts.",
      objective: "Complete 3 laps under 90 seconds",
      color: "vibrant-orange",
      colorHex: "#FF6F61",
      icon: "⚡",
    },
    {
      id: 4,
      title: "FREESTYLE BATTLE",
      description: "Showcase creativity and technical prowess in open-format aerial performance challenges.",
      objective: "Score 85+ points from judges",
      color: "electric-blue",
      colorHex: "#00BFFF",
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
        }
      })
    }, observerOptions)

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const slideVariants = {
    hiddenLeft: {
      opacity: 0,
      x: -100,
      scale: 0.9,
    },
    hiddenRight: {
      opacity: 0,
      x: 100,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const handleLearnMore = (challengeId) => {
    console.log(`Learn more about challenge ${challengeId}`)
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-deep-navy via-navy-mid to-navy-light overflow-x-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/10 via-transparent to-neon-green/10 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,191,255,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,rgba(124,252,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_40%,rgba(255,111,97,0.1)_0%,transparent_50%)] pointer-events-none" />

      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-deep-navy/95 backdrop-blur-lg border-b border-electric-blue/20 py-4 md:py-8">
        <h1 className="font-montserrat font-extrabold text-4xl md:text-6xl text-white text-center tracking-widest animate-glow">
          CHALLENGES
        </h1>
      </div>

      {/* Progress Indicator */}
      <div className="fixed right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-40 hidden md:flex items-center gap-4">
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.id}
              className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                index <= activeChallenge
                  ? `bg-${challenge.color} border-${challenge.color} shadow-lg`
                  : "border-white/30 bg-transparent"
              }`}
              style={{
                backgroundColor: index <= activeChallenge ? challenge.colorHex : "transparent",
                borderColor: index <= activeChallenge ? challenge.colorHex : "rgba(255,255,255,0.3)",
                boxShadow: index <= activeChallenge ? `0 0 15px ${challenge.colorHex}` : "none",
              }}
            />
          ))}
        </div>
        <div className="w-0.5 h-48 bg-white/20 relative">
          <div
            className="absolute top-0 left-0 w-full bg-gradient-to-b from-electric-blue via-neon-green to-vibrant-orange transition-all duration-700 ease-out"
            style={{ height: `${((activeChallenge + 1) / challenges.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Challenges Container */}
      <div className="relative z-10" ref={sectionRef}>
        {challenges.map((challenge, index) => {
          const isEven = index % 2 === 0
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              isEven={isEven}
              slideVariants={slideVariants}
              onLearnMore={handleLearnMore}
              ref={(el) => (cardRefs.current[index] = el)}
            />
          )
        })}
      </div>
    </section>
  )
}

const ChallengeCard = ({ challenge, index, isEven, slideVariants, onLearnMore }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-20%" })

  return (
    <div ref={ref} data-index={index} className="h-screen flex items-center justify-center p-4 md:p-8">
      <motion.div
        initial={isEven ? "hiddenLeft" : "hiddenRight"}
        animate={isInView ? "visible" : isEven ? "hiddenLeft" : "hiddenRight"}
        variants={slideVariants}
        className="w-full max-w-6xl"
      >
        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-12">
            {/* Visual Section */}
            <div className={`flex items-center justify-center ${!isEven ? "md:order-2" : ""}`}>
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="relative">
                <div
                  className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 flex items-center justify-center bg-white/5 relative"
                  style={{
                    borderColor: challenge.colorHex,
                    boxShadow: `0 0 30px ${challenge.colorHex}40`,
                  }}
                >
                  <span className="text-6xl md:text-8xl animate-float">{challenge.icon}</span>
                  <div
                    className="absolute -inset-4 rounded-full border-2 border-t-transparent border-r-transparent animate-rotate"
                    style={{ borderColor: challenge.colorHex }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Content Section */}
            <div className={`space-y-6 ${!isEven ? "md:order-1" : ""}`}>
              <CardHeader className="p-0">
                <CardTitle
                  className="font-montserrat font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-wider"
                  style={{ color: challenge.colorHex, textShadow: `0 0 20px ${challenge.colorHex}50` }}
                >
                  {challenge.title}
                </CardTitle>
                <CardDescription className="font-open-sans text-lg md:text-xl text-white/80 leading-relaxed mt-4">
                  {challenge.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-xl border-l-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: `${challenge.colorHex}20`,
                    borderLeftColor: challenge.colorHex,
                    boxShadow: `0 0 20px ${challenge.colorHex}30`,
                  }}
                >
                  <Badge variant="secondary" className="mb-3 font-montserrat font-bold text-xs tracking-widest">
                    OBJECTIVE
                  </Badge>
                  <p className="font-open-sans text-white font-semibold text-lg">{challenge.objective}</p>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => onLearnMore(challenge.id)}
                    className="w-full md:w-auto font-montserrat font-bold text-white px-8 py-6 text-lg tracking-wider uppercase rounded-full transition-all duration-300 relative overflow-hidden group"
                    style={{
                      backgroundColor: challenge.colorHex,
                      boxShadow: `0 0 25px ${challenge.colorHex}50`,
                    }}
                  >
                    <span className="relative z-10">Learn More</span>
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 2, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              </CardContent>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Challenges
