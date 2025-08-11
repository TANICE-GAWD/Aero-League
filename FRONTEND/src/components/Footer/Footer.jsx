import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css'; 

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* Column 1: Quick Links */}
          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/about">About</a></li>
              <li><a href="/timeline">Timeline</a></li>
              <li><a href="/themes">Themes</a></li>
              <li><a href="/registration">Registration</a></li>
              <li><a href="/support">Technical Support</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Column 2: Follow Us */}
          <div className="footer-column">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            </div>
            <ul className="contact-info">
              <li>
                <a href="mailto:contact@israeli-indian-hackathon.org">
                  <FaEnvelope /> contact@israeli-indian-hackathon.org
                </a>
              </li>
              <li>
                <a href="tel:+919313889932">
                  <FaPhoneAlt /> +91-93138 89932
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Organizing Credits */}
          <div className="footer-column">
            <h3>Organizing Credits</h3>
            <div className="organizer-title">
              Israeli-Indian Hackathon 2025
            </div>
            <p className="organizer-description">
              A collaborative initiative promoting innovation in healthcare technology between Israel and India. Organized with support from leading academia, institutions, industry partners, and government bodies.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright-text">
            © 2025 Israeli-Indian Hackathon. All rights reserved. | Restorative Health Care Innovation Challenge
          </div>
          <div className="developer-credit">
            <span>Developed by Team CCS</span>
            <a href="mailto:ccs@thapar.edu">ccs@thapar.edu</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;