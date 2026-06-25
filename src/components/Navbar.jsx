import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaCompass } from 'react-icons/fa';
import { isAuthenticated } from '../services/api';

const Navbar = ({ onOpenAdminLogin, onViewChange, currentView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const isAdminLoggedIn = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setIsOpen(false);
    
    if (currentView !== 'public') {
      onViewChange('public');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = () => {
    const now = Date.now();
    
    // If the click is within 1.5 seconds of the last click, increment counter
    if (now - lastClickTime < 1500) {
      const nextClicks = logoClicks + 1;
      if (nextClicks === 3) {
        // Secret action triggered on triple-click!
        if (isAdminLoggedIn) {
          onViewChange('admin-dashboard');
        } else {
          onOpenAdminLogin();
        }
        setLogoClicks(0);
      } else {
        setLogoClicks(nextClicks);
      }
    } else {
      // First click or timed-out click resets counter to 1
      setLogoClicks(1);
    }
    
    setLastClickTime(now);

    // Standard logo behavior (scroll to home section)
    handleNavClick('home');
  };

  const navLinks = [
    { name: 'Home', target: 'home' },
    { name: 'About', target: 'about' },
    { name: 'Tours', target: 'tours' },
    { name: 'Gallery', target: 'gallery' },
    { name: 'Contact', target: 'contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
      scrolled ? 'glass-nav py-4 shadow-lg' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo with Secret click handler */}
        <button 
          onClick={handleLogoClick} 
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
          title="SK Reddy Adventures"
        >
          <div className="p-2 rounded-xl bg-forest-700/80 text-forest-50 group-hover:bg-forest-600 transition-all duration-300">
            <FaCompass className="text-2xl animate-spin-slow" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white">SK REDDY</span>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-forest-500 font-semibold leading-tight">Adventures</span>
          </div>
        </button>

        {/* Desktop Navigation Links (No Admin references) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.target)}
              className="text-sm font-medium tracking-wide text-gray-300 hover:text-forest-500 transition-colors duration-200 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-300 hover:text-white text-2xl focus:outline-none cursor-pointer"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu (No Admin references) */}
      <div className={`md:hidden absolute top-full left-0 right-0 glass transition-all duration-300 overflow-hidden shadow-2xl ${
        isOpen ? 'max-h-[300px] border-b border-white/10 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
      }`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.target)}
              className="text-left text-base font-medium py-2 text-gray-300 hover:text-forest-500 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
