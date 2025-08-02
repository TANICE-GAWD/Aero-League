"use client";
import { useState } from 'react';
import { FaUserGraduate, FaUsers, FaLaptopCode, FaTrophy, FaHandsHelping, FaChevronDown } from 'react-icons/fa';
import './Rules.css';


const rulesData = [
  {
    id: 'eligibility',
    title: 'Eligibility Criteria',
    Icon: FaUserGraduate,
    content: [
      'Participants must be currently enrolled in a college or university.',
      'Team size must be between 2 to 4 members. No solo entries.',
      'All participants must be 18 years or older by the event start date.',
      'A valid student ID is required for verification during check-in.',
      'Previous winners are welcome but cannot win the same category twice.'
    ]
  },
  {
    id: 'team-formation',
    title: 'Team Formation',
    Icon: FaUsers,
    content: [
      'Teams must be finalized before the registration deadline.',
      'Designate a team captain for all official communications.',
      'No changes to team members are permitted after registration closes.',
      'Inter-college teams are highly encouraged.',
      'All team members must be present for the final project presentation.'
    ]
  },
  {
    id: 'submission-guidelines',
    title: 'Submission Guidelines',
    Icon: FaLaptopCode,
    content: [
      'All code must be written during the 48-hour hackathon period.',
      'Submissions must be made through the official event portal.',
      'Include a detailed README file explaining your project and setup.',
      'Properly credit any third-party libraries, APIs, or assets used.',
      'A live, functional demo is required for judging.'
    ]
  },
  {
    id: 'judging-criteria',
    title: 'Judging Criteria',
    Icon: FaTrophy,
    content: [
      'Innovation & Creativity (30%)',
      'Technical Complexity & Execution (25%)',
      'Design & User Experience (20%)',
      'Problem Solving & Impact (15%)',
      'Presentation & Documentation (10%)'
    ]
  },
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    Icon: FaHandsHelping,
    content: [
      'Treat all participants, mentors, and organizers with respect.',
      'Harassment, discrimination, or any form of abuse will not be tolerated.',
      'Maintain a professional and collaborative environment at all times.',
      'Adhere to all rules and guidelines provided by the organizers.',
      'Report any violations to event staff immediately.'
    ]
  }
];

const RulesBriefing = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <section className="team-section">
      <div className="rules-container">
        <div className="rules-header-content">
          <h2 className="rules-main-title">MISSION BRIEFING</h2>
          <p className="rules-main-subtitle">
            Key regulations and guidelines for a fair and competitive event.
          </p>
        </div>
        
        <div className="accordion-wrapper">
          {rulesData.map((rule) => (
            <div 
              key={rule.id} 
              className={`accordion-item ${activeAccordion === rule.id ? 'active' : ''}`}
            >
              <button
                className="accordion-button"
                onClick={() => toggleAccordion(rule.id)}
                aria-expanded={activeAccordion === rule.id}
              >
                <rule.Icon className="accordion-icon-main" />
                <h3 className="accordion-button-title">{rule.title}</h3>
                <FaChevronDown className="accordion-chevron" />
              </button>
              
              <div className="accordion-content-panel">
                <div className="accordion-content-inner">
                  <ul className="rules-details-list">
                    {rule.content.map((item, index) => (
                      <li key={index} className="rules-list-item-detail">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RulesBriefing;
