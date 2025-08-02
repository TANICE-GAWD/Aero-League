import React from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa'; // Import FaDrone
import { GiDeliveryDrone } from "react-icons/gi";
import './Judges.css';

// Data for the contact points
const contactsData = [
  {
    name: 'j1',
    title: 'judge',
    description: 'desc_1',
    image: '/assets/Dir._Ishaan_Jindal.jpg',
    contactLink: 'mailto:hsingh@example.com',
    linkedinLink: '#',
  },
  {
    name: 'j2',
    title: 'judge',
    description: 'desc_2',
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
            Need Assistance? Ping our team.
          </p>
        </div>

        <div className="contact-cards-wrapper">
          {contactsData.map((contact, index) => (
            <div key={index} className="contact-card">
              {/* Drone Icon for animation */}
              <GiDeliveryDrone className="card-drone-icon" />

              <div className="contact-card-header">
                <div className="profile-image-container">
                  <img src={contact.image} alt={contact.name} className="profile-image" />
                </div>
              </div>
              <div className="contact-card-body">
                <h3 className="contact-name">{contact.name}</h3>
                <p className="contact-spoc">{contact.spoc}</p>
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;