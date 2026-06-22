import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCompass } from 'react-icons/fa';

const Footer = () => {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#070b12] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div className="space-y-6">
          <button onClick={() => scrollToSection('home')} className="flex items-center gap-2 text-left cursor-pointer">
            <div className="p-2 rounded-xl bg-forest-700/80 text-white">
              <FaCompass className="text-xl" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white">SK REDDY</span>
              <span className="block text-[10px] tracking-[0.2em] uppercase text-forest-500 font-semibold leading-tight">Adventures</span>
            </div>
          </button>
          <p className="text-sm text-gray-400 leading-relaxed">
            Leading premium, safe, and unforgettable outdoor adventures, trekking expeditions, and camping tours around the globe. Join us to experience the wild like never before.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all duration-300">
              <FaFacebookF className="text-sm" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all duration-300">
              <FaTwitter className="text-sm" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all duration-300">
              <FaInstagram className="text-sm" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-white/5 hover:bg-forest-800 text-gray-400 hover:text-white transition-all duration-300">
              <FaYoutube className="text-sm" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-forest-500 pl-3">Quick Links</h4>
          <ul className="space-y-3 flex flex-col items-start">
            <li>
              <button onClick={() => scrollToSection('about')} className="text-sm text-gray-400 hover:text-forest-500 transition-colors cursor-pointer text-left">About SK Reddy</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('tours')} className="text-sm text-gray-400 hover:text-forest-500 transition-colors cursor-pointer text-left">Upcoming Adventure Tours</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('gallery')} className="text-sm text-gray-400 hover:text-forest-500 transition-colors cursor-pointer text-left">Memories & Gallery</button>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact')} className="text-sm text-gray-400 hover:text-forest-500 transition-colors cursor-pointer text-left">Contact Us / Enquiry</button>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-forest-500 pl-3">Destinations & Styles</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li onClick={() => scrollToSection('tours')} className="hover:text-forest-500 cursor-pointer transition-colors">Himalayan Trekking</li>
            <li onClick={() => scrollToSection('tours')} className="hover:text-forest-500 cursor-pointer transition-colors">Wilderness Camping</li>
            <li onClick={() => scrollToSection('tours')} className="hover:text-forest-500 cursor-pointer transition-colors">Water Rafting & Kayaking</li>
            <li onClick={() => scrollToSection('tours')} className="hover:text-forest-500 cursor-pointer transition-colors">Mountain Climbing</li>
            <li onClick={() => scrollToSection('tours')} className="hover:text-forest-500 cursor-pointer transition-colors">Eco-Hiking Tours</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white border-l-2 border-forest-500 pl-3">Get in Touch</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-forest-500 mt-1 shrink-0" />
              <span className="text-sm text-gray-400">123, Adventure Lane, Off MG Road, Bangalore, Karnataka - 560001, India</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-forest-500 shrink-0" />
              <span className="text-sm text-gray-400">+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-forest-500 shrink-0" />
              <span className="text-sm text-gray-400">info@skreddyadventures.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} SK Reddy Adventures. All rights reserved.
        </p>
        <p className="text-xs text-gray-600">
          Designed with ❤️ for Adventurers.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
