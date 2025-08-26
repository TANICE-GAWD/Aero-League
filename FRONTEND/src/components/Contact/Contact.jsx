import { FaEnvelope, FaLinkedin, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { GiDeliveryDrone } from "react-icons/gi";
import './Contact.css';


const contactsData = [
  {
    name: 'Ishaan Jindal',
    title: 'Organizer',
    description: 'Leads the organizational efforts for the event.',
    image: '/assets/Ishaan_Jindal.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'Advitya Dua',
    title: 'Organizer',
    description: 'Coordinates logistics and participant relations.',
    image: '/assets/Advitya_Dua.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/advitya-dua',
  },
  {
    name: 'Aadil Sharma',
    title: 'Organizer',
    description: 'Manages marketing and community outreach.',
    image: '/assets/Aadil_Sharma.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/aadil-sharma-31b005287',
  },
  {
    name: 'Prince Sharma',
    title: 'Developer',
    description: 'Sophomore at Thapar University, building the future.',
    image: '/assets/Prince_Sharma.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/prince-tanice',
  }
];

// Individual Card Component to handle its own state and effects
const ContactCard = ({ contact }) => {
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <div className="contact-card" onMouseMove={handleMouseMove}>
      <GiDeliveryDrone className="card-drone drone-br" />
      <div className="contact-card-content">
        <div className="card-image-wrapper">
          <img src={contact.image} alt={contact.name} className="profile-image" />
          <a href={contact.linkedinLink} target="_blank" rel="noopener noreferrer" className="linkedin-overlay">
            <FaLinkedin />
          </a>
        </div>
        <div className="card-info-content">
          <h3 className="contact-name">{contact.name}</h3>
          <p className="contact-title-secondary">{contact.title}</p>
          <p className="contact-description">{contact.description}</p>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ContactPoints = () => {
  return (
    <section className="team-section">
      <div className="contact-points-container">
        <div className="contact-points-header">
          <h2 className="contact-points-title">Organizing Team</h2>
        </div>
        <div className="contact-cards-wrapper">
          {contactsData.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
        </div>

        {/* --- NEW GENERAL CONTACT SECTION --- */}
        <div className="general-contact-container">
          <a href="mailto:thapardronechallenge@gmail.com" className="contact-info-pill email">
            <span className="icon-wrapper">
              <FaEnvelope />
            </span>
            thapardronechallenge@gmail.com
          </a>
          <a href="tel:+91-7986035529" className="contact-info-pill phone">
            <span className="icon-wrapper">
              <FaPhoneAlt />
            </span>
            +91-7986035529
          </a>

          <a href='https://share.google/YugvQtKwDjuXnfEhF'>
            <div className="contact-info-pill location">
            <span className="icon-wrapper">
              <FaMapMarkerAlt />
            </span>
            Thapar Institute of Engineering & Technology, Patiala
          </div>
          </a>

        </div>
        {/* --- END OF NEW SECTION --- */}

      </div>
    </section>
  );
};

export default ContactPoints;