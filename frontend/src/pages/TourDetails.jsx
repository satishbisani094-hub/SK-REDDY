import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaClock, FaUserAlt, FaTag, FaCalendarAlt, 
  FaCheckCircle, FaTimesCircle, FaPaperPlane, FaChevronRight 
} from 'react-icons/fa';
import { getTourById, createEnquiry, getImageUrl } from '../services/api';
import { TourDetailSkeleton } from '../components/SkeletonLoader';
import Toast from '../components/Toast';

const TourDetails = () => {
  const { id } = useParams();
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
    const fetchTour = async () => {
      setLoading(true);
      try {
        const data = await getTourById(id);
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
  }, [id]);

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

  if (loading) {
    return <TourDetailSkeleton />;
  }

  if (!tour) {
    return (
      <div className="pt-40 pb-20 text-center space-y-6 max-w-md mx-auto px-6">
        <h2 className="text-2xl font-bold text-white">Tour Not Found</h2>
        <p className="text-gray-400">The adventure tour you are looking for might have been removed or rescheduled.</p>
        <Link to="/tours" className="inline-block bg-forest-800 hover:bg-forest-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
          Back to Tours
        </Link>
      </div>
    );
  }

  // Generate all images array (Cover + Gallery)
  const allImages = [tour.coverImage, ...tour.galleryImages];

  // Dummy inclusions and exclusions for premium travel website standard
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
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6 space-y-12">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <FaChevronRight className="text-[8px]" />
        <Link to="/tours" className="hover:text-white transition-colors">Tours</Link>
        <FaChevronRight className="text-[8px]" />
        <span className="text-forest-500 font-bold">{tour.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Media & Info (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Gallery Viewer */}
          <div className="space-y-3">
            {/* Active Image View */}
            <div className="h-[350px] sm:h-[480px] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
              <img
                src={getImageUrl(activeImage)}
                alt={tour.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-forest-800/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg border border-forest-600/30 backdrop-blur-sm">
                {tour.difficulty}
              </span>
            </div>

            {/* Thumbnails grid */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:opacity-100 ${
                      activeImage === img ? 'border-forest-500 opacity-100 scale-95 shadow-lg' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specifications */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass p-4 rounded-2xl text-center space-y-1">
              <FaMapMarkerAlt className="text-forest-500 mx-auto text-lg" />
              <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Location</span>
              <span className="text-sm font-bold text-white block truncate">{tour.location}</span>
            </div>

            <div className="glass p-4 rounded-2xl text-center space-y-1">
              <FaClock className="text-mountain-700 mx-auto text-lg" />
              <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Duration</span>
              <span className="text-sm font-bold text-white block">{tour.duration}</span>
            </div>

            <div className="glass p-4 rounded-2xl text-center space-y-1">
              <FaCalendarAlt className="text-forest-500 mx-auto text-lg" />
              <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Start Date</span>
              <span className="text-sm font-bold text-white block">
                {new Date(tour.tourDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </span>
            </div>

            <div className="glass p-4 rounded-2xl text-center space-y-1">
              <FaUserAlt className="text-mountain-700 mx-auto text-lg" />
              <span className="text-[10px] text-gray-500 uppercase font-semibold block tracking-wider">Available Slots</span>
              <span className="text-sm font-bold text-white block">
                {tour.seats > 0 ? `${tour.seats} Seats` : 'Sold Out'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-extrabold text-white border-l-2 border-forest-500 pl-3">Tour Expedition Overview</h2>
            <div className="text-sm text-gray-400 leading-relaxed whitespace-pre-line space-y-4">
              {tour.description}
            </div>
          </div>

          {/* Itinerary */}
          <div className="space-y-6 pt-4">
            <h2 className="text-2xl font-extrabold text-white border-l-2 border-forest-500 pl-3">Standard Expedition Plan</h2>
            
            <div className="relative border-l border-white/10 ml-4 pl-8 py-2 space-y-8">
              <div className="relative group">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-forest-500 border-4 border-forest-800/80"></div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase">Day 1: Arrival & Transport to Basecamp</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Arrive at assembly point. Briefing session with Chief Guide SK Reddy, kit inspection, and drive to the base camp village. Overnight stay at the homestay.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-forest-500 border-4 border-forest-800/80"></div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase">Day 2-4: Acclimatization, Trekking, & High Altitude Camping</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Daily trek starts after breakfast. Gradual elevation gain, crossing forest ridges, meadows, and pitching tents in wild camping sites. Enjoy sunset campfire chats.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-forest-500 border-4 border-forest-800/80"></div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white uppercase">Day 5: Summit Ascent & Return Trek</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Early morning pre-dawn start for the summit push. Experience breathtaking sunrise views from the highest point. Descend back to lower camps.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions and Exclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Inclusions */}
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400 text-sm" /> Cost Inclusions
              </h3>
              <ul className="space-y-2">
                {inclusions.map((inc, i) => (
                  <li key={i} className="text-xs text-gray-400 flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 shrink-0">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div className="glass p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FaTimesCircle className="text-red-400 text-sm" /> Cost Exclusions
              </h3>
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

        {/* Right Column: Pricing & Booking Form (4 cols) */}
        <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
          
          {/* Reservation Card */}
          <div className="glass p-6 md:p-8 rounded-3xl border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
            {/* Ambient blur */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-forest-800/10 rounded-full blur-2xl"></div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Price Per Person</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">₹{tour.price.toLocaleString('en-IN')}</span>
                <span className="text-xs text-gray-500">all inclusive</span>
              </div>
            </div>

            {/* Booking Enquiry Form */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Send Booking Enquiry</h3>
              
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="email"
                    placeholder="Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="tel"
                    placeholder="Your Mobile Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <textarea
                    rows="4"
                    placeholder="Your Message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-forest-500"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3.5 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-bold transition-all shadow-lg border border-forest-600/30 flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-50"
                >
                  {formLoading ? (
                    'Sending...'
                  ) : (
                    <>
                      <FaPaperPlane className="text-[10px]" /> Send Enquiry
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TourDetails;
