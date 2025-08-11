import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const location = useLocation();

    const quickLinks = [
        { id: 'home', label: 'Home' },
        { id: 'challenges', label: 'Challenges' },
        { id: 'timeline', label: 'Timeline' },
        { id: 'prizes', label: 'Prizes' },
        { id: 'rules', label: 'Rules' },
        { id: 'contact', label: 'Contact' },
    ];

    const handleLinkClick = (e, hash) => {
        e.preventDefault();
        
        if (location.pathname === '/') {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            
            
            window.location.href = `/${hash}`;
        }
    };

    return (
        <footer className="site-footer" id="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>Quick Links</h3>
                        <ul>
                            {quickLinks.map(link => (
                                <li key={link.id}>
                                    {/* --- FIX IS HERE --- */}
                                    <a href={`#${link.id}`} onClick={(e) => handleLinkClick(e, `#${link.id}`)}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Follow Us</h3>
                        <div className="social-icons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        </div>
                        <ul className="contact-info">
                            <li><a href="mailto:mail_uspls@gmail.com"><FaEnvelope /> mail_uspls@gmail.com</a></li>
                            <li><a href="tel:+91xxxxxxxxx"><FaPhoneAlt /> +91-xxxxxxxxxxx</a></li>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Organizing Credits</h3>
                        <div className="organizer-title">Thapar Drone Challenge 2025</div>
                        <p className="organizer-description">A thrilling aerial competition testing drone agility, strategy, and innovation through obstacle races, recon missions, and turbulent deliveries.</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="copyright-text">© 2025 Thapar Drone Challenge. All rights reserved.</div>
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