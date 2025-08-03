import React from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { PiDrone } from 'react-icons/pi';
import './Judges.css';

// Data for the contact points
const contactsData = [
  {
    name: 'Ishaan Jindal',
    title: 'Organizer',
    description: 'Lead organizer, coordinating all event logistics and planning.',
    image: '/assets/Dir._Ishaan_Jindal.jpg',
    contactLink: 'mailto:hsingh@example.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'Advitya Dua',
    title: 'Organizer',
    description: 'Manages sponsorships and external relations for the event.',
    image: '/assets/Advitya_Dua.jpg',
    contactLink: 'mailto:adua60_be24@thapar.edu',
    linkedinLink: 'https://www.linkedin.com/in/advitya-dua',
  },
];

const Judges = () => {
  return (
    <section className="contact-points-section">
      <div className="contact-points-container">
        <div className="contact-points-header">
          <h2 className="contact-points-title">Dedicated Contacts</h2>
          <p className="contact-points-subtitle">
            Need assistance? Our team is ready to help. Reach out to the right person for your query.
          </p>
        </div>

        <div className="contact-cards-wrapper">
          {contactsData.map((contact, index) => (
            <div key={index} className="contact-card">
              {/* This div creates the animated gradient border */}
              <div className="card-border"></div>
              {/* This div creates the spotlight effect on hover */}
              <div className="card-spotlight"></div>

              {/* Drones for each corner */}
              <PiDrone className="card-drone-icon drone-top-left" />


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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;