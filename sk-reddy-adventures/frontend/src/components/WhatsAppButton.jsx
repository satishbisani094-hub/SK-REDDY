import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton = () => {
  const phoneNumber = '919876543210'; // Default WhatsApp number
  const message = encodeURIComponent("Hi SK Reddy Adventures! I am interested in booking an adventure tour. Please share more details.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-[#25d366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-[#25d366]/40 animate-ping group-hover:hidden"></span>
      <span className="absolute inset-0 rounded-full bg-[#25d366]/20 animate-pulse"></span>
      
      <FaWhatsapp className="text-3xl relative z-10" />
      
      {/* Tooltip */}
      <span className="absolute right-16 bg-[#161f30] text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl border border-white/5 pointer-events-none">
        Chat with us!
      </span>
    </a>
  );
};

export default WhatsAppButton;
