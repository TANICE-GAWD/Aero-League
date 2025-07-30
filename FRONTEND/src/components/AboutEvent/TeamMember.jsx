import React from 'react';

const TeamMember = ({ member, isActive = false, onClick }) => {
  return (
    <div 
      className={`team-member-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className="member-image">
        <img 
          src={member.image} 
          alt={member.name}
          className="member-img"
        />
      </div>
      <div className="member-content">
        <h3 className="member-name">{member.name}</h3>
        <p className="member-role">{member.role}</p>
        <p className="member-description">{member.description}</p>
        <div className="member-expertise">{member.expertise}</div>
      </div>
    </div>
  );
};

export default TeamMember; 