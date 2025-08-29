import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { BsLinkedin } from 'react-icons/bs';
import { GiDeliveryDrone } from "react-icons/gi";
import './Contact.css';


const contactsData = [
  {
    name: 'Dr. Sandeep Verma',
    title: 'Event Co-ordinator',
    description: 'Assistant Professor, CSED',
    image: '/assets/sandeep.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dr-sandeep-verma-39b4a164/',
  },
  {
    name: 'Dr. Neeraj Kumar',
    title: 'Event Member',
    description: 'HOD, CSED',
    image: '/assets/neeraj.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/neeraj-kumar-06a98b24/',
  },
  {
    name: 'Dr. PS Rana',
    title: 'Event Member',
    description: 'Associate Professor, CSED',
    image: '/assets/rana.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/psrana/',
  },
  {
    name: 'ABC',
    title: 'abc',
    description: 'abc',
    image: '/assets/abc.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'XYZ',
    title: 'xyz',
    description: 'xyz',
    image: '/assets/xyz.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'Ishaan Jindal',
    title: '',
    description: 'Pre-Final year student at Thapar University',
    image: '/assets/Ishaan_Jindal.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/dir-ishaan-jindal-804596284',
  },
  {
    name: 'Advitya Dua',
    title: '',
    description: 'Pre-Final year student at Thapar University',
    image: '/assets/Advitya_Dua.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/advitya-dua',
  },
  {
    name: 'Aadil Sharma',
    title: '',
    description: 'Pre-Final year student at Thapar University',
    image: '/assets/Aadil_Sharma.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/aadil-sharma-31b005287',
  },
  {
    name: 'Prince Sharma',
    title: '',
    description: 'Sophomore at Thapar University',
    image: '/assets/Prince_Sharma.webp',
    contactLink: 'mailto:thaparaeroleague@gmail.com',
    linkedinLink: 'https://www.linkedin.com/in/prince-tanice',
  },
];


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
            <BsLinkedin />
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
        

      </div>
    </section>
  );
};

export default ContactPoints;