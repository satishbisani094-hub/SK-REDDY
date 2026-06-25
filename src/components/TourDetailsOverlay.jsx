import React, { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, FaClock, FaUserAlt, FaTag, FaCalendarAlt, 
  FaCheckCircle, FaTimesCircle, FaPaperPlane, FaTimes 
} from 'react-icons/fa';
import { getTourById, createEnquiry, getImageUrl } from '../services/api';
import { TourDetailSkeleton } from './SkeletonLoader';
import Toast from './Toast';

const TourDetailsOverlay = ({ tourId, onClose }) => {
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Enquiry form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Disable body scroll when overlay is open
    document.body.style.overflow = 'hidden';

    // Escape key listener to close overlay
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);

    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await getTourById(tourId);
        setTour(data);
        setActiveImage(data.coverImage);
        
        // Pre-populate default enquiry message
        const dateStr = new Date(data.tourDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        setMessage(`Hi SK Reddy Adventures, I am interested in joining the "${data.title}" starting on ${dateStr}. Please share details about availability and booking.`);
      } catch (err) {
        console.error('Error fetching tour details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [tourId, onClose]);

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      showToast('Please fill in all enquiry fields', 'error');
      return;
    }

    setFormLoading(true);
    try {
      await createEnquiry({ name, phone, email, message });
      showToast('Your enquiry has been sent! We will contact you shortly.', 'success');
      setName('');
      setEmail('');
      setPhone('');
    } catch (error) {
      showToast('Submission failed. Please try again later.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const inclusions = [
    'Professional certified high-altitude trek guide (SK Reddy / Associate Guide)',
    'Accommodation: Luxury tents during trek, homestays/guest house on triple sharing',
    'Nutritious meals (Veg & Egg) during trek (Breakfast, Lunch, Snacks, Dinner)',
    'All necessary forest permits, entry fees, and camping charges',
    'High-altitude medical kit, oxygen cylinders, and stretcher support',
    'All safety equipment: Crampons, gaiters, harnesses as required'
  ];

  const exclusions = [
    'Travel insurance / High-altitude rescue evacuation fees',
    'Personal gear (Trekking poles, warm jacket, backpack offloading charges)',
    'Meals during transit (stops along roadways before/after basecamp)',
    'Tips for porters, kitchen staff, and local transport drivers',
    'Any cost arising due to natural calamity, roadblocks, or landslide'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-dark-bg/95 backdrop-blur-md overflow-y-auto flex justify-center items-start py-10 px-4 animate-fade-in">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="w-full max-w-7xl glass rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all text-xl cursor-pointer z-10"
          title="Close (Esc)"
        >
          <FaTimes />
        </button>

        {loading ? (
          <div className="py-20">
            <TourDetailSkeleton />
          </div>
        ) : !tour ? (
          <div className="text-center py-20 space-y-4">
            <h3 className="text-xl font-bold text-white">Tour details could not be loaded.</h3>
            <button onClick={onClose} className="px-6 py-2.5 bg-forest-800 text-white rounded-xl font-bold">
              Close Window
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
            
            {/* Left Column: Media & Info (8 cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight">{tour.title}</h1>
                <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1.5"><FaMapMarkerAlt className="text-forest-500" /> {tour.location}</span>
                  <span className="flex items-center gap-1.5"><FaClock className="text-mountain-700" /> {tour.duration}</span>
                </div>
              </div>

              {/* Gallery Viewer */}
              <div className="space-y-3">
                {/* Active Image */}
                <div className="h-[250px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/5 shadow-xl relative">
                  <img
                    src={getImageUrl(activeImage)}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-forest-800/90 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-forest-600/30 backdrop-blur-sm">
                    {tour.difficulty}
                  </span>
                </div>

                {/* Thumbnails */}
                {[tour.coverImage, ...tour.galleryImages].length > 1 && (
                  <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                    {[tour.coverImage, ...tour.galleryImages].map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:opacity-100 ${
                          activeImage === img ? 'border-forest-500 opacity-100 scale-95 shadow-md' : 'border-transparent opacity-60'
                        }`}
                      >
                        <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl text-center space-y-1">
                  <FaCalendarAlt className="text-forest-500 mx-auto text-lg" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Start Date</span>
                  <span className="text-sm font-bold text-white block">
                    {new Date(tour.tourDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl text-center space-y-1">
                  <FaClock className="text-mountain-700 mx-auto text-lg" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Duration</span>
                  <span className="text-sm font-bold text-white block">{tour.duration}</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl text-center space-y-1">
                  <FaMapMarkerAlt className="text-forest-500 mx-auto text-lg" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Terrain</span>
                  <span className="text-sm font-bold text-white block truncate">{tour.location.split(',')[0]}</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl text-center space-y-1">
                  <FaUserAlt className="text-mountain-700 mx-auto text-lg" />
                  <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Availability</span>
                  <span className="text-sm font-bold text-white block">
                    {tour.seats > 0 ? `${tour.seats} Slots` : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-white border-l-2 border-forest-500 pl-3">Expedition Details</h3>
                <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </div>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-400" /> What's Included
                  </h4>
                  <ul className="space-y-2">
                    {inclusions.map((inc, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 shrink-0">•</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <FaTimesCircle className="text-red-400" /> What's Excluded
                  </h4>
                  <ul className="space-y-2">
                    {exclusions.map((exc, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-red-400 shrink-0">•</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            {/* Right Column: Enquiry Form */}
            <div className="lg:col-span-4 lg:sticky lg:top-10 space-y-6">
              <div className="bg-white/5 p-6 md:p-8 rounded-3xl border border-white/5 space-y-6 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Price Per Person</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white">₹{tour.price.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-500">all inclusive</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Book/Enquire Now</h4>
                  
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                      required
                    />

                    <input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                      required
                    />

                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                      required
                    />

                    <textarea
                      rows="4"
                      placeholder="Write your details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                      required
                    ></textarea>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50"
                    >
                      {formLoading ? 'Sending...' : 'Send Booking Enquiry'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TourDetailsOverlay;
