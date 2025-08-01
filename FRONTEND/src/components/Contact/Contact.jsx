import React from 'react';
import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import './Contact.css';

// Data for the contact points, now including a third placeholder
const contactsData = [
  {
    name: 'Dir. Ishaan Jindal',
    title: 'title_1',
    description: 'desc_1',
    image: 'https://placehold.co/150x150/EFEFEF/1A1A2E?text=',
    contactLink: 'mailto:hsingh@example.com',
    linkedinLink: '#',
  },
  {
    name: 'Advitya Dua',
    title: 'title_2',
    description: 'desc_2',
    image: 'https://placehold.co/150x150/EFEFEF/1A1A2E?text=',
    contactLink: 'mailto:okadvil@example.com',
    linkedinLink: '#',
  },
  {
    name: 'Prince Sharma',
    spoc: 'SPOC - Global',
    title: 'title_3',
    description: 'desc_3',
    image: 'https://placehold.co/150x150/EFEFEF/1A1A2E?text=',
    contactLink: 'mailto:placeholder@example.com',
    linkedinLink: '#',
  }
];

const ContactPoints = () => {
  return (
    <section className="team-section">
      <div className="contact-points-container">
        <div className="contact-points-header">
          <h2 className="contact-points-title">Dedicated Contacts</h2>
          <p className="contact-points-subtitle">
            Need Assistance?
          </p>
        </div>

        <div className="contact-cards-wrapper">
          {contactsData.map((contact, index) => (
            <div key={index} className="contact-card">
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

export default ContactPoints;