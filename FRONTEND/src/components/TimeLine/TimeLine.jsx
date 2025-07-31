import React, { useEffect, useRef, useState } from 'react';
import './TimeLine.css';

// Timeline data for Aero-League hackathon
const timelineSteps = [
  {
    icon: "📅",
    title: "Registration Opens",
    description: "Early registration begins for all participants. Secure your spot in the competition.",
    date: "January 15, 2024"
  },
  {
    icon: "🚀",
    title: "Hackathon Kickoff",
    description: "Opening ceremony and team formation. Get ready for an exciting journey of innovation.",
    date: "February 1, 2024"
  },
  {
    icon: "💻",
    title: "Coding Phase",
    description: "48 hours of intense coding, collaboration, and building amazing projects.",
    date: "February 1-3, 2024"
  },
  {
    icon: "🎯",
    title: "Project Submission",
    description: "Finalize your project and submit your work for evaluation by our expert judges.",
    date: "February 3, 2024"
  },
  {
    icon: "🏆",
    title: "Awards Ceremony",
    description: "Winners announced and prizes awarded. Celebrate the achievements of all participants.",
    date: "February 4, 2024"
  }
];

const TimeLine = () => {
  const timelineRef = useRef(null);
  const cardRefs = useRef([]);
  const nodeRefs = useRef([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all timeline cards and nodes
    cardRefs.current.forEach((card) => {
      if (card) {
        observer.observe(card);
      }
    });

    nodeRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) {
          observer.unobserve(card);
        }
      });
      nodeRefs.current.forEach((node) => {
        if (node) {
          observer.unobserve(node);
        }
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineElement = timelineRef.current;
      const rect = timelineElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within the timeline section with smoother interpolation
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      
      if (timelineTop < windowHeight && timelineTop + timelineHeight > 0) {
        // Enhanced progress calculation with easing
        const rawProgress = (windowHeight - timelineTop) / (windowHeight + timelineHeight);
        const easedProgress = Math.pow(rawProgress, 0.8); // Smooth easing
        const clampedProgress = Math.max(0, Math.min(1, easedProgress));
        
        // Add a small delay for smoother animation
        requestAnimationFrame(() => {
          setScrollProgress(clampedProgress);
        });
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <section className="timeline-section" id="timeline">
      <div className="timeline-container">
        <div className="timeline-header">
          <h2 className="timeline-title">
            <span className="timeline-title-gradient">
              Event Timeline
            </span>
          </h2>
          <p className="timeline-description">
            Important dates and milestones for the Aero-League hackathon.
          </p>
        </div>
        
        <div className="timeline-wrapper" ref={timelineRef}>
          {/* Timeline line with scroll-based color change */}
          <div className="timeline-line">
            <div 
              className="timeline-line-progress"
              style={{ height: `${scrollProgress * 100}%` }}
            ></div>
          </div>
          
          <div className="timeline-steps">
            {timelineSteps.map((step, index) => (
              <div key={index} className="timeline-step">
                {/* For even items, swap order on desktop */}
                <div className={`timeline-content ${index % 2 === 1 ? 'timeline-content-right' : 'timeline-content-left'}`}>
                  <div 
                    className="timeline-card"
                    ref={(el) => (cardRefs.current[index] = el)}
                  >
                    <div className="timeline-icon-mobile">
                      <span className="timeline-icon-text">{step.icon}</span>
                    </div>
                    <h3 className="timeline-step-title">{step.title}</h3>
                    <p className="timeline-step-description">{step.description}</p>
                    <div className="timeline-date">{step.date}</div>
                  </div>
                </div>
                
                {/* Timeline node - visible only on desktop */}
                <div 
                  className="timeline-node"
                  ref={(el) => (nodeRefs.current[index] = el)}
                >
                  <span className="timeline-node-icon">{step.icon}</span>
                </div>
                
                {/* Empty div for layout on odd items */}
                <div className={`timeline-spacer ${index % 2 === 1 ? 'timeline-spacer-left' : 'timeline-spacer-right'}`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimeLine;
