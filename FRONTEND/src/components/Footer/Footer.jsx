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
        { id: 'rules', label: 'Guidelines' },
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
                                    <a href={`#${link.id}`} onClick={(e) => handleLinkClick(e, `#${link.id}`)}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Contact Us</h3>
                        <ul className="contact-info">
                            <li><a href="mailto:thapardronechallenge@gmail.com"><FaEnvelope /> thapardronechallenge@gmail.com</a></li>
                            <li><a href="tel:+91-7986035529"><FaPhoneAlt /> +91-7986035529</a></li>
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
                        <span>Developed by: Prince Sharma | Advitya Dua</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;