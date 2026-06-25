import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowRight } from 'react-icons/fa';
import About from './About';
import Tours from './Tours';
import Gallery from './Gallery';
import Contact from './Contact';

const Home = () => {
  const stats = [
    { value: '100+', label: 'Tours Completed' },
    { value: '500+', label: 'Travelers Guided' },
    { value: '20+', label: 'Destinations' },
    { value: '10+', label: 'Years Experience' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Section 1: Hero Banner */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/40 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-forest-500 uppercase tracking-widest border border-forest-500/20">
            <FaCompass className="animate-spin-slow" /> Discover the Wilderness
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
            Explore The World With <br />
            <span className="text-gradient">SK Reddy Adventures</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
            Unforgettable Adventure Tours and Trekking Experiences
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/tours"
              className="w-full sm:w-auto px-8 py-4 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer text-sm animate-pulse-slow"
            >
              Explore Tours <FaArrowRight className="text-xs" />
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <div className="w-1.5 h-6 rounded-full bg-forest-500"></div>
        </div>
      </section>

      {/* Stats counter overlaying hero bottom */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <div className="glass rounded-3xl p-6 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-black text-white">{stat.value}</h3>
              <p className="text-[10px] md:text-xs text-gray-400 font-semibold tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: About SK Reddy */}
      <section id="about" className="border-b border-white/5">
        <About />
      </section>

      {/* Section 3: Upcoming Tours */}
      <section id="tours" className="border-b border-white/5">
        <Tours />
      </section>

      {/* Section 4: Photo Gallery */}
      <section id="gallery" className="border-b border-white/5">
        <Gallery />
      </section>

      {/* Section 5: Contact Information & Forms */}
      <section id="contact" className="space-y-16 pb-12">
        <Contact />

        {/* Integrated Base Office Map */}
        <div className="max-w-7xl mx-auto px-6 space-y-6">
          <h3 className="text-lg font-bold text-white border-l-2 border-forest-500 pl-3">Find Our Base Office</h3>
          <div className="glass rounded-3xl overflow-hidden h-[350px] border border-white/5 shadow-xl relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.925769719339!2d77.59374027581534!3d12.976593987339178!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1672c1012c5f%3A0xf58839de8ca09e86!2sM%20G%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1714123456789!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SK Reddy Adventures Location Map"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
