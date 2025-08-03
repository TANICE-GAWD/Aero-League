// ContactCard.js
import React, { useRef } from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { PiDrone } from 'react-icons/pi';

const ContactCard = ({ contact }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      className="contact-cards"
      onMouseMove={handleMouseMove}
    >
      <div className="card-border"></div>
      <div className="card-spotlight"></div>
      
      {/* Drones for each corner */}
      <PiDrone className="card-drone-icon drone-top-left" />
      <PiDrone className="card-drone-icon drone-top-right" />
      <PiDrone className="card-drone-icon drone-bottom-left" />
      <PiDrone className="card-drone-icon drone-bottom-right" />

      <div className="contact-card-content">
        <div className="contact-card-header">
          <div className="profile-image-container">
            <img src={contact.image} alt={contact.name} className="profile-image" />
          </div>
        </div>
        <div className="contact-card-body">
          <h3 className="contact-name">{contact.name}</h3>
          <p className="contact-title-secondary">{contact.title}</p>
          <p className="contact-description">{contact.description}</p>
        </div>
        <div className="contact-card-footer">
          <a href={contact.contactLink} className="contact-button primary">
            <FaEnvelope />
            <span>Contact</span>
          </a>
          <a href={contact.linkedinLink} target="_blank" rel="noopener noreferrer" className="contact-button secondary">
            <FaLinkedin />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;