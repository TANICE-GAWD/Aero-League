import React from 'react';
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
        
        <div className="timeline-wrapper">
          {/* Timeline line */}
          <div className="timeline-line"></div>
          
          <div className="timeline-steps">
            {timelineSteps.map((step, index) => (
              <div key={index} className="timeline-step">
                {/* For even items, swap order on desktop */}
                <div className={`timeline-content ${index % 2 === 1 ? 'timeline-content-right' : 'timeline-content-left'}`}>
                  <div className="timeline-card">
                    <div className="timeline-icon-mobile">
                      <span className="timeline-icon-text">{step.icon}</span>
                    </div>
                    <h3 className="timeline-step-title">{step.title}</h3>
                    <p className="timeline-step-description">{step.description}</p>
                    <div className="timeline-date">{step.date}</div>
                  </div>
                </div>
                
                {/* Timeline node - visible only on desktop */}
                <div className="timeline-node">
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
