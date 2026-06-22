import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaCompass, FaTag } from 'react-icons/fa';
import { getGalleryItems, getImageUrl } from '../services/api';
import { GallerySkeleton } from '../components/SkeletonLoader';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const data = await getGalleryItems(category);
        setItems(data);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [category]);

  // Handle keyboard events in lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, items]);

  const handlePrev = () => {
    if (items.length === 0) return;
    setLightboxIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (items.length === 0) return;
    setLightboxIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const categories = ['All', 'Trekking', 'Camping', 'Hiking', 'Water Adventures', 'Mountain Tours'];

  return (
    <div className="py-20 space-y-12 max-w-7xl mx-auto px-6">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase tracking-widest font-bold text-forest-500">Expedition Records</span>
        <h1 className="text-4xl md:text-6xl font-black text-white">Memories & Gallery</h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Take a look at snapshots of our past treks, camping nights, summit conquests, and water activities.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 justify-center py-2 border-y border-white/5 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              category === cat
                ? 'bg-forest-800 text-white border-forest-600/30 shadow-lg'
                : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Native Masonry Columns */}
      {loading ? (
        <GallerySkeleton />
      ) : items.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center border border-white/5 space-y-4">
          <div className="inline-flex p-4 rounded-full bg-white/5 text-gray-500">
            <FaCompass className="text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white">Gallery is Empty</h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            No memories have been uploaded for "{category}" category yet. Check back soon for new photos.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {items.map((item, idx) => (
            <div
              key={item._id}
              onClick={() => setLightboxIndex(idx)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group border border-white/5 shadow-lg cursor-zoom-in glass inline-block w-full"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-dark-bg/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <span className="text-[10px] bg-forest-800 text-forest-50 px-2 py-0.5 rounded-full font-bold w-fit uppercase tracking-wider mb-2 flex items-center gap-1">
                  <FaTag className="text-[8px]" /> {item.category}
                </span>
                <h4 className="font-extrabold text-white text-sm leading-snug">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {lightboxIndex !== null && items[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between items-center py-6 px-4 animate-fade-in">
          
          {/* Top panel */}
          <div className="w-full max-w-7xl flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span className="text-forest-500 font-black">{items[lightboxIndex].category}</span>
              <span>/</span>
              <span>{lightboxIndex + 1} of {items.length}</span>
            </div>
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all text-xl cursor-pointer"
              title="Close (Esc)"
            >
              <FaTimes />
            </button>
          </div>

          {/* Active Image */}
          <div className="flex-1 flex justify-center items-center max-w-5xl w-full my-4 relative">
            {/* Left Nav */}
            <button
              onClick={handlePrev}
              className="absolute left-2 z-10 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all text-xl cursor-pointer hidden sm:block"
              title="Previous (Left Arrow)"
            >
              <FaChevronLeft />
            </button>

            <img
              src={getImageUrl(items[lightboxIndex].image)}
              alt={items[lightboxIndex].title}
              className="max-w-full max-h-[70vh] sm:max-h-[75vh] object-contain rounded-2xl shadow-2xl animate-scale-up"
            />

            {/* Right Nav */}
            <button
              onClick={handleNext}
              className="absolute right-2 z-10 p-4 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all text-xl cursor-pointer hidden sm:block"
              title="Next (Right Arrow)"
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Mobile Bottom Swipers */}
          <div className="flex gap-4 sm:hidden pb-2 z-10">
            <button onClick={handlePrev} className="px-4 py-2 bg-white/5 rounded-xl text-white text-sm font-bold flex items-center gap-1.5">
              <FaChevronLeft /> Prev
            </button>
            <button onClick={handleNext} className="px-4 py-2 bg-white/5 rounded-xl text-white text-sm font-bold flex items-center gap-1.5">
              Next <FaChevronRight />
            </button>
          </div>

          {/* Caption */}
          <div className="w-full max-w-3xl text-center space-y-1 relative z-10">
            <h3 className="text-lg md:text-xl font-bold text-white leading-tight">
              {items[lightboxIndex].title}
            </h3>
          </div>

        </div>
      )}

    </div>
  );
};

export default Gallery;
