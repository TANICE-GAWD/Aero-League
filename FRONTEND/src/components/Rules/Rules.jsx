import { useState } from 'react';
import './Rules.css';

const Rules = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const rulesData = [
    {
      id: 'eligibility',
      title: 'Who Can Participate',
      icon: '🎓',
      content: [
        'Must be currently enrolled in a college/university (undergrad or grad)',
        'Team size: 2-4 people (no solo entries, sorry!)',
        'Everyone needs to be 18+ by the event start date',
        'Valid student ID required for verification',
        'Previous winners welcome but can\'t win the same category twice'
      ]
    },
    {
      id: 'team-formation',
      title: 'Team Setup',
      icon: '👥',
      content: [
        'Lock in your team before registration closes (no last-minute changes)',
        'Pick a team captain - they\'ll be our main contact',
        'No swapping team members after you register',
        'Mix students from different schools? Totally cool!',
        'All teammates must show up for the actual event'
      ]
    },
    {
      id: 'submission-guidelines',
      title: 'What to Submit',
      icon: '💻',
      content: [
        'Build something awesome during the hackathon (no pre-built stuff)',
        'Write clean, readable code with good comments',
        'Upload everything through our submission portal',
        'Include a solid README that explains how to run your project',
        'Credit any libraries, APIs, or resources you used'
      ]
    },
    {
      id: 'judging-criteria',
      title: 'How We Judge',
      icon: '🏆',
      content: [
        'How creative and innovative is your solution? (30%)',
        'Is your code well-written and technically sound? (25%)',
        'How good is the user experience and design? (20%)',
        'Did you solve the problem effectively? (15%)',
        'How well did you present and document your work? (10%)'
      ]
    },
    {
      id: 'code-of-conduct',
      title: 'Be Cool',
      icon: '🤝',
      content: [
        'Treat everyone with respect - organizers, mentors, other participants',
        'Zero tolerance for harassment, discrimination, or sketchy behavior',
        'Keep it professional and ethical throughout the event',
        'Follow all the rules we\'ve laid out here',
        'If you see something, say something - report issues to organizers'
      ]
    }
  ];

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="rules-container">
      <div className="rules-header">
        <h2 className="rules-title">The Rules</h2>
        <p className="rules-subtitle">
          Everything you need to know to have a great hackathon experience
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
