import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowRight, FaRoute, FaImages } from 'react-icons/fa';
import { getTours, getGalleryItems, getImageUrl } from '../services/api';
import TourCard from '../components/TourCard';
import { TourCardSkeleton } from '../components/SkeletonLoader';

const Home = () => {
  const [tours, setTours] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = [
    { value: '100+', label: 'Tours Completed' },
    { value: '500+', label: 'Travelers Guided' },
    { value: '20+', label: 'Destinations' },
    { value: '10+', label: 'Years Experience' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const toursData = await getTours();
        const galleryData = await getGalleryItems();
        if (Array.isArray(toursData)) setTours(toursData);
        if (Array.isArray(galleryData)) setGallery(galleryData);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

      {/* Section 2: About Preview */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-b border-white/5">
        <div className="lg:col-span-5 relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] border border-white/5 relative">
            <img
              src="https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=800&q=80"
              alt="SK Reddy Guide"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Who We Are</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Leading with Experience & Passion</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            SK Reddy is an avid mountaineer, certified search-and-rescue specialist, and professional nature photographer. Growing up near the Western Ghats, his love for wilderness started early. Over the past decade, this passion has transformed into a commitment to showing others the majestic beauty of the world's most remote locations.
          </p>
          <div className="pt-2">
            <Link to="/about" className="inline-flex items-center gap-2 text-sm font-bold text-forest-500 hover:text-white transition-colors">
              Learn More About Us <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3: Featured Upcoming Tours */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12 border-b border-white/5">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Featured Trips</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Popular Upcoming Tours</h2>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => <TourCardSkeleton key={n} />)}
          </div>
        ) : tours.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No upcoming tours found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.slice(0, 3).map(tour => (
              <TourCard key={tour._id} tour={tour} />
            ))}
          </div>
        )}
        <div className="text-center pt-4">
          <Link to="/tours" className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-bold transition-all border border-forest-600/20 text-xs uppercase tracking-wider">
            View All Tours <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </section>

      {/* Section 4: Photo Gallery Preview */}
      <section className="py-20 max-w-7xl mx-auto px-6 space-y-12 border-b border-white/5">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Expedition Records</span>
          <h2 className="text-3xl md:text-5xl font-black text-white">Memories & Snapshots</h2>
        </div>
        {loading ? (
          <p className="text-sm text-gray-400 text-center">Loading gallery...</p>
        ) : gallery.length === 0 ? (
          <p className="text-sm text-gray-400 text-center">No photos available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.slice(0, 4).map(item => (
              <div key={item._id} className="relative rounded-2xl overflow-hidden aspect-square border border-white/5 group shadow-lg">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-dark-bg/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <h4 className="font-bold text-white text-xs leading-snug">{item.title}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center pt-4">
          <Link to="/gallery" className="inline-flex items-center gap-2 px-6 py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-bold transition-all border border-forest-600/20 text-xs uppercase tracking-wider">
            View Full Gallery <FaArrowRight className="text-[10px]" />
          </Link>
        </div>
      </section>

      {/* Section 5: Call to Action */}
      <section className="py-20 max-w-5xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-black text-white">Ready to Start Your Next Adventure?</h2>
        <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
          Contact SK Reddy Adventures today to reserve slots on upcoming treks, custom campsite bookings, or group outings.
        </p>
        <div className="pt-4">
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-forest-800 hover:bg-forest-700 text-white rounded-2xl font-bold transition-all shadow-lg border border-forest-600/30 text-sm">
            Get In Touch <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
