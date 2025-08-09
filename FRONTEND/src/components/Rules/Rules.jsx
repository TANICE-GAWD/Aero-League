

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
      'Team size must be between 2 to 5 members. No solo entries.',
      'Love building and flying drones? Join in.',
      'A valid ID proof is required for verification during check-in.',
      'Each team is eligible for only one prize.'
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
      {
        text: 'The following team composition criteria must be met:',
        sublist: [
          'All team members must be from the same college.',
          'Inter-college teams are not permitted.',
          'A mix of students from different academic years is encouraged.'
        ]
      }
    ]
  },
  {
    id: 'submission-guidelines',
    title: 'Submission Guidelines',
    Icon: FaLaptopCode,
    content: [
      'A demo video of the drone must be submitted before the given deadline.',
      'The drone must qualify the minimum eligibility criteria.',
      'All source code must be submitted to the designated repository.',
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
          <h2 className="rules-main-title">GUIDELINES</h2>

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
                        {/* Render text for both strings and objects */}
                        {typeof item === 'string' ? item : item.text}

                        {/* If item has a sublist, render it */}
                        {item.sublist && (
                          <ul className="rules-sublist">
                            {item.sublist.map((subItem, subIndex) => (
                              <li key={subIndex} className="rules-sublist-item-detail">
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        )}
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