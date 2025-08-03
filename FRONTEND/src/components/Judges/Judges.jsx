// Judges.js
import React from 'react';
import './Judges.css';
import ContactCard from './ContactCard'; // Import the new component

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
    <section className="team-section">
      <div className="contact-points-container">
        <div className="contact-points-header">
          <h2 className="contact-points-title">Dedicated Contacts</h2>
          <p className="contact-points-subtitle">
            Need assistance? Our team is ready to help. Reach out to the right person for your query.
          </p>
        </div>

        <div className="contact-cards-wrapper">
          {contactsData.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;