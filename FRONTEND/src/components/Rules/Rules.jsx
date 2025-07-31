import { useState } from 'react';
import './Rules.css';

const Rules = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const rulesData = [
    {
      id: 'eligibility',
      title: 'Eligibility',
      icon: '👥',
      content: [
        'Participants must be enrolled students at recognized educational institutions',
        'Teams can consist of 2-4 members',
        'All team members must be 18 years or older',
        'Participants must have valid student identification',
        'Previous winners may participate but are not eligible for the same prize category'
      ]
    },
    {
      id: 'team-formation',
      title: 'Team Formation',
      icon: '🤝',
      content: [
        'Teams must be formed before the registration deadline',
        'Each team must have a designated team leader',
        'Team members cannot be changed after registration',
        'Cross-institution teams are allowed',
        'All team members must be present during the competition'
      ]
    },
    {
      id: 'submission-guidelines',
      title: 'Submission Guidelines',
      icon: '📝',
      content: [
        'All submissions must be original work created during the competition',
        'Code must be well-documented and commented',
        'Projects must be submitted through the designated platform',
        'Include a comprehensive README file with setup instructions',
        'All external libraries and resources must be properly attributed'
      ]
    },
    {
      id: 'judging-criteria',
      title: 'Judging Criteria',
      icon: '⚖️',
      content: [
        'Innovation and creativity (30%)',
        'Technical implementation and code quality (25%)',
        'User experience and design (20%)',
        'Problem-solving approach (15%)',
        'Documentation and presentation (10%)'
      ]
    },
    {
      id: 'code-of-conduct',
      title: 'Code of Conduct',
      icon: '📋',
      content: [
        'Respect all participants, organizers, and mentors',
        'No harassment, discrimination, or inappropriate behavior',
        'Maintain professional and ethical conduct throughout',
        'Follow all competition rules and guidelines',
        'Report any violations to organizers immediately'
      ]
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="rules-container">
      <div className="rules-header">
        <h2 className="rules-title">Rules & Regulations</h2>
        <p className="rules-subtitle">
          Comprehensive guidelines to ensure a fair and successful competition
        </p>
      </div>
      
      <div className="accordion-container">
        {rulesData.map((rule) => (
          <div 
            key={rule.id} 
            className={`accordion-item ${activeAccordion === rule.id ? 'active' : ''}`}
          >
            <button
              className="accordion-header"
              onClick={() => toggleAccordion(rule.id)}
              aria-expanded={activeAccordion === rule.id}
            >
              <div className="accordion-icon">
                <span className="icon">{rule.icon}</span>
              </div>
              <h3 className="accordion-title">{rule.title}</h3>
              <div className="accordion-arrow">
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
              </div>
            </button>
            
            <div className="accordion-content">
              <div className="accordion-content-inner">
                <ul className="rules-list">
                  {rule.content.map((item, index) => (
                    <li key={index} className="rules-list-item">
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
  );
};

export default Rules;
