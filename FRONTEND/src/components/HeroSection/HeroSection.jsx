import React, { useState, useEffect } from 'react';
import './HeroSection.css'; 

const App = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home', href: '#home' },
        { id: 'challenges', label: 'Challenges', href: '#challenges' },
        { id: 'timeline', label: 'Timeline', href: '#timeline' },
        { id: 'prizes', label: 'Prizes', href: '#prizes' },
        { id: 'rules', label: 'Rules', href: '#rules' },
        { id: 'judges', label: 'Judges', href: '#judges' },
        { id: 'contact', label: 'Contact', href: '#contact' }
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 50);

            let currentSectionId = 'home';
            
            for (const item of navItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        currentSectionId = item.id;
                        break;
                    }
                }
            }
            setActiveSection(currentSectionId);
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [navItems]);

    const scrollToSection = (href) => {
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        setIsMenuOpen(false);
    };

    const handleKeyDown = (event, href) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            scrollToSection(href);
        }
    };

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="header__container">
                {/* Logo */}
                <div className="header__logo">
                    <a
                        href="#home"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToSection('#home');
                        }}
                        className="header__logo-link"
                        aria-label="Go to home section"
                    >
                        <img 
                            src="/assets/Logo.jpg" 
                            alt="Aero League logo placeholder" 
                            className="header__logo-img"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/1a1a2e/ffffff?text=Error'; }}
                        />
                        <span className="header__logo-text">Aero League</span>
                    </a>
                </div>

                {/* Desktop Navigation */}
                <nav className="header__nav" role="navigation" aria-label="Main navigation">
                    <ul className="header__nav-list">
                        {navItems.map((item) => (
                            <li key={item.id} className="header__nav-item">
                                <a
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.href);
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                                    className={`header__nav-link ${activeSection === item.id ? 'header__nav-link--active' : ''}`}
                                    aria-current={activeSection === item.id ? 'page' : undefined}
                                    tabIndex={0}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={`header__menu-button ${isMenuOpen ? 'header__menu-button--open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                >
                    <span className="header__menu-icon"></span>
                    <span className="header__menu-icon"></span>
                    <span className="header__menu-icon"></span>
                </button>

                {/* Mobile Navigation */}
                <nav
                    className={`header__mobile-nav ${isMenuOpen ? 'header__mobile-nav--open' : ''}`}
                    id="mobile-menu"
                    role="navigation"
                    aria-label="Mobile navigation"
                >
                    <ul className="header__mobile-nav-list">
                        {navItems.map((item) => (
                            <li key={item.id} className="header__mobile-nav-item">
                                <a
                                    href={item.href}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(item.href);
                                    }}
                                    onKeyDown={(e) => handleKeyDown(e, item.href)}
                                    className={`header__mobile-nav-link ${activeSection === item.id ? 'header__mobile-nav-link--active' : ''}`}
                                    aria-current={activeSection === item.id ? 'page' : undefined}
                                    tabIndex={0}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default App;