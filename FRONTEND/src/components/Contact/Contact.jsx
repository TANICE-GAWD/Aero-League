import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-header">
          <p className="contact-pre-title">We're here to help!</p>
          <h2 className="contact-main-title">CONTACT US</h2>
          <p className="contact-subtitle">
            Have questions about the Aero-League? Reach out and we'll get back to you soon.
          </p>
        </div>

        <div className="contact-info-wrapper">
          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaEnvelope />
            </div>
            <div className="contact-details">
              <h3 className="contact-card-title">Email Us</h3>
              <a href="mailto:contact@israeli-indian-hackathon.org" className="contact-link">
                contact@aero-league.com
              </a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaPhoneAlt />
            </div>
            <div className="contact-details">
              <h3 className="contact-card-title">Call Us</h3>
              <a href="tel:+91-9313889932" className="contact-link">
                +91-93138 89932
              </a>
            </div>
          </div>

          <div className="contact-info-card">
            <div className="contact-icon-wrapper">
              <FaMapMarkerAlt />
            </div>
            <div className="contact-details">
              <h3 className="contact-card-title">Location</h3>
              <p className="contact-text">Virtual & Physical</p>
            </div>
          </div>
        </div>
        
        <div className="contact-notice">
          <p>All prizes and certificates released within 7 days after event completion.</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
