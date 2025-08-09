import { FaEnvelope, FaLinkedin } from 'react-icons/fa';
import { GiDeliveryDrone } from "react-icons/gi";
import './Contact.css';


const contactsData = [
  {
    name: 'Ishaan Jindal',
    title: 'Organizer',
    description: 'Leads the organizational efforts for the event.',
    image: '/assets/Dir._Ishaan_Jindal.jpg',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'Advitya Dua',
    title: 'Organizer',
    description: 'Coordinates logistics and participant relations.',
    image: '/assets/Advitya_Dua.jpg',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/advitya-dua',
  },
  {
    name: 'Aadil Sharma',
    title: 'Organizer',
    description: 'Manages marketing and community outreach.',
    image: '/assets/Aadil_Sharma.jpg',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/aadil-sharma-31b005287',
  },
  {
    name: 'Prince Sharma',
    title: 'Developer',
    description: 'Sophomore at Thapar University, building the future.',
    image: '/assets/Prince_Sharma.jpg',
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
      {/* Four drone icons for the corner animation */}
      <GiDeliveryDrone className="card-drone drone-tr" />


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
      </div>
    </section>
  );
};

export default ContactPoints;