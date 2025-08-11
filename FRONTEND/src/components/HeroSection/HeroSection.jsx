import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './HeroSection.css'; 

const HeroSection = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const navItems = [
        { id: 'home', label: 'Home', href: '#home' },
        { id: 'challenges', label: 'Challenges', href: '#challenges' },
        { id: 'timeline', label: 'Timeline', href: '#timeline' },
        { id: 'prizes', label: 'Prizes', href: '#prizes' },
        { id: 'rules', label: 'Rules', href: '#rules' },
        { id: 'contact', label: 'Contact', href: '#contact' },
    ];

    const routeNavItems = [
        { id: 'register', label: 'Register', href: '/register' },
        { id: 'login', label: 'Login', href: '/login' }
    ];

    useEffect(() => {
        if (location.pathname === '/') {
            const handleScroll = () => {
                const scrollTop = window.scrollY;
                setIsScrolled(scrollTop > 50);

                let currentSectionId = 'home';
                for (const item of navItems) {
                    const element = document.getElementById(item.id);
                    if (element && element.getBoundingClientRect().top <= 100) {
                        currentSectionId = item.id;
                    }
                }
                setActiveSection(currentSectionId);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [location.pathname, navItems]);

    const scrollToSection = (href) => {
        if (location.pathname !== '/') {
            window.location.href = `/${href}`;
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
            <div className="header__container">
                <div className="header__logo">
                    <Link to="/" className="header__logo-link">
                        <img 
                            src="/assets/Logo.png" 
                            alt="Aero League logo" 
                            className="header__logo-img"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/80x80/1a1a2e/ffffff?text=Logo'; }}
                        />
                        <span className="header__logo-text">Thapar Drone Challenge</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="header__nav">
                    <ul className="header__nav-list">
                        {navItems.map((item) => (
                            <li key={item.id} className="header__nav-item">
                                <a
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                    className={`header__nav-link ${activeSection === item.id ? 'header__nav-link--active' : ''}`}
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        
                        {/* NEW: Dropdown for Login/Register */}
                        <li 
                            className="header__nav-item header__nav-item--dropdown"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className="header__nav-link header__dropdown-trigger">
                                Account
                            </button>
                            {isDropdownOpen && (
                                <ul className="header__dropdown-menu">
                                    {routeNavItems.map(item => (
                                        <li key={item.id} className="header__dropdown-item">
                                            <Link to={item.href} className="header__dropdown-link">
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    </ul>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={`header__menu-button ${isMenuOpen ? 'header__menu-button--open' : ''}`}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    <span className="header__menu-icon"></span>
                    <span className="header__menu-icon"></span>
                    <span className="header__menu-icon"></span>
                </button>

                {/* Mobile Navigation */}
                <nav className={`header__mobile-nav ${isMenuOpen ? 'header__mobile-nav--open' : ''}`}>
                    <ul className="header__mobile-nav-list">
                        {navItems.map((item) => (
                            <li key={item.id} className="header__mobile-nav-item">
                                <a
                                    href={item.href}
                                    onClick={(e) => { e.preventDefault(); scrollToSection(item.href); }}
                                    className="header__mobile-nav-link"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                         {/* Kept separate for better mobile UX */}
                        {routeNavItems.map(item => (
                            <li key={item.id} className="header__mobile-nav-item">
                                <Link to={item.href} className="header__mobile-nav-link header__mobile-nav-link--button">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default HeroSection;