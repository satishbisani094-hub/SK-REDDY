import React, { useState, useEffect } from 'react';
import { 
  FaPlus, FaEdit, FaTrash, FaEnvelopeOpen, FaRoute, FaImages, 
  FaCalendarAlt, FaTag, FaChair, FaImage, FaMapMarkerAlt, 
  FaCheckCircle, FaTrashAlt, FaSignOutAlt, FaEye, FaChevronRight 
} from 'react-icons/fa';
import { 
  isAuthenticated, getTours, createTour, updateTour, deleteTour, 
  getGalleryItems, createGalleryItems, deleteGalleryItem, 
  getEnquiries, deleteEnquiry, getImageUrl 
} from '../services/api';
import AdminLayout from '../components/AdminLayout';
import Toast from '../components/Toast';

const AdminDashboard = ({ onViewChange, onLogout }) => {
  const [currentTab, setCurrentTab] = useState('overview');
  const [toast, setToast] = useState(null);

  // Stats state
  const [stats, setStats] = useState({
    totalTours: 0,
    upcomingTours: 0,
    galleryImages: 0,
    totalEnquiries: 0
  });

  // Data states
  const [toursList, setToursList] = useState([]);
  const [galleryList, setGalleryList] = useState([]);
  const [enquiriesList, setEnquiriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms state
  const [tourFormOpen, setTourFormOpen] = useState(false);
  const [editTourId, setEditTourId] = useState(null);
  
  // Tour form fields
  const [tourTitle, setTourTitle] = useState('');
  const [tourLocation, setTourLocation] = useState('');
  const [tourDescription, setTourDescription] = useState('');
  const [tourDuration, setTourDuration] = useState('');
  const [tourDifficulty, setTourDifficulty] = useState('Easy');
  const [tourPrice, setTourPrice] = useState('');
  const [tourSeats, setTourSeats] = useState('');
  const [tourDate, setTourDate] = useState('');
  const [tourCoverUrl, setTourCoverUrl] = useState('');
  const [tourGalleryUrls, setTourGalleryUrls] = useState('');
  const [tourExistingGallery, setTourExistingGallery] = useState([]);
  const [tourFormLoading, setTourFormLoading] = useState(false);

  // Gallery form fields
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('Trekking');
  const [galleryUrls, setGalleryUrls] = useState('');
  const [galleryFormLoading, setGalleryFormLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      onLogout();
      return;
    }
    fetchDashboardData();
  }, [onLogout]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const tours = await getTours();
      const gallery = await getGalleryItems();
      const enquiries = await getEnquiries();

      const toursArray = Array.isArray(tours) ? tours : [];
      const galleryArray = Array.isArray(gallery) ? gallery : [];
      const enquiriesArray = Array.isArray(enquiries) ? enquiries : [];

      setToursList(toursArray);
      setGalleryList(galleryArray);
      setEnquiriesList(enquiriesArray);

      // Calculate stats
      const today = new Date();
      const upcoming = toursArray.filter(t => new Date(t.tourDate) >= today).length;

      setStats({
        totalTours: toursArray.length,
        upcomingTours: upcoming,
        galleryImages: galleryArray.length,
        totalEnquiries: enquiriesArray.length
      });
    } catch (error) {
      showToast('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Reset tour form
  const resetTourForm = () => {
    setEditTourId(null);
    setTourTitle('');
    setTourLocation('');
    setTourDescription('');
    setTourDuration('');
    setTourDifficulty('Easy');
    setTourPrice('');
    setTourSeats('');
    setTourDate('');
    setTourCoverUrl('');
    setTourGalleryUrls('');
    setTourExistingGallery([]);
    setTourFormOpen(false);
  };

  // Open edit tour form
  const handleEditTourClick = (tour) => {
    setEditTourId(tour._id);
    setTourTitle(tour.title);
    setTourLocation(tour.location);
    setTourDescription(tour.description);
    setTourDuration(tour.duration);
    setTourDifficulty(tour.difficulty);
    setTourPrice(tour.price);
    setTourSeats(tour.seats);
    // Format date for datetime-local input (YYYY-MM-DD)
    const formattedDate = new Date(tour.tourDate).toISOString().substring(0, 10);
    setTourDate(formattedDate);
    setTourCoverUrl(tour.coverImage || '');
    setTourGalleryUrls('');
    setTourExistingGallery(tour.galleryImages || []);
    setTourFormOpen(true);
  };

  // Handle tour form submit
  const handleTourSubmit = async (e) => {
    e.preventDefault();
    
    if (!tourTitle || !tourLocation || !tourDescription || !tourDuration || !tourPrice || !tourSeats || !tourDate) {
      showToast('Please fill all text fields', 'error');
      return;
    }

    setTourFormLoading(true);
    
    const newGallery = tourGalleryUrls
      ? tourGalleryUrls.split(',').map(url => url.trim()).filter(Boolean)
      : [];

    const finalCoverUrl = tourCoverUrl.trim() || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80';

    const tourData = {
      title: tourTitle,
      location: tourLocation,
      description: tourDescription,
      duration: tourDuration,
      difficulty: tourDifficulty,
      price: Number(tourPrice),
      seats: Number(tourSeats),
      tourDate: tourDate,
      coverImage: finalCoverUrl,
      galleryImages: editTourId ? [...tourExistingGallery, ...newGallery] : newGallery
    };

    try {
      if (editTourId) {
        await updateTour(editTourId, tourData);
        showToast('Tour updated successfully!');
      } else {
        await createTour(tourData);
        showToast('Tour created successfully!');
      }
      resetTourForm();
      fetchDashboardData();
    } catch (error) {
      const msg = error.response?.data?.message || 'Error processing tour';
      showToast(msg, 'error');
    } finally {
      setTourFormLoading(false);
    }
  };

  // Delete Tour
  const handleDeleteTour = async (id) => {
    if (window.confirm('Are you sure you want to delete this adventure tour? This will delete all associated uploads.')) {
      try {
        await deleteTour(id);
        showToast('Tour deleted successfully!');
        fetchDashboardData();
      } catch (error) {
        showToast('Failed to delete tour', 'error');
      }
    }
  };

  // Delete gallery image from tour existing gallery
  const handleRemoveExistingGalleryImage = (imgUrl) => {
    setTourExistingGallery(tourExistingGallery.filter(img => img !== imgUrl));
  };

  // Gallery Upload
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryUrls) {
      showToast('Please enter at least one image URL', 'error');
      return;
    }

    setGalleryFormLoading(true);
    const galleryData = {
      title: galleryTitle,
      category: galleryCategory,
      image: galleryUrls
    };

    try {
      await createGalleryItems(galleryData);
      showToast('Images added to gallery successfully!');
      setGalleryTitle('');
      setGalleryUrls('');
      fetchDashboardData();
    } catch (error) {
      showToast('Gallery upload failed', 'error');
    } finally {
      setGalleryFormLoading(false);
    }
  };

  // Delete gallery image
  const handleDeleteGalleryItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this gallery photo?')) {
      try {
        await deleteGalleryItem(id);
        showToast('Gallery image deleted!');
        fetchDashboardData();
      } catch (error) {
        showToast('Failed to delete image', 'error');
      }
    }
  };

  // Delete Enquiry
  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Delete this enquiry record?')) {
      try {
        await deleteEnquiry(id);
        showToast('Enquiry deleted');
        fetchDashboardData();
      } catch (error) {
        showToast('Failed to delete enquiry', 'error');
      }
    }
  };

  return (
    <AdminLayout 
      currentTab={currentTab} 
      setCurrentTab={setCurrentTab}
      onViewChange={onViewChange}
      onLogout={onLogout}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <svg className="animate-spin h-10 w-10 text-forest-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-400 font-medium">Loading panel data...</span>
        </div>
      ) : (
        <>
          {/* Tab 1: Overview */}
          {currentTab === 'overview' && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
                <p className="text-sm text-gray-400 mt-1">Real-time statistics and summary of your travel website.</p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-forest-500">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Total Tours</span>
                    <h3 className="text-3xl font-black text-white">{stats.totalTours}</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-forest-800/40 text-forest-500 text-2xl">
                    <FaRoute />
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-sky-500">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Upcoming Tours</span>
                    <h3 className="text-3xl font-black text-white">{stats.upcomingTours}</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-sky-800/40 text-sky-400 text-2xl">
                    <FaCalendarAlt />
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-amber-500">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Gallery Photos</span>
                    <h3 className="text-3xl font-black text-white">{stats.galleryImages}</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-800/40 text-amber-400 text-2xl">
                    <FaImages />
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-purple-500">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">Total Enquiries</span>
                    <h3 className="text-3xl font-black text-white">{stats.totalEnquiries}</h3>
                  </div>
                  <div className="p-4 rounded-xl bg-purple-800/40 text-purple-400 text-2xl">
                    <FaEnvelopeOpen />
                  </div>
                </div>
              </div>

              {/* Latest Enquiries */}
              <div className="glass rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white">Recent Enquiries</h3>
                  <button onClick={() => setCurrentTab('enquiries')} className="text-xs text-forest-500 font-semibold hover:underline flex items-center gap-1">
                    View All <FaChevronRight className="text-[8px]" />
                  </button>
                </div>

                {enquiriesList.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">No inquiries submitted yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-white/5">
                        <tr>
                          <th className="py-3 px-4">Name</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Message</th>
                          <th className="py-3 px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiriesList.slice(0, 5).map((enq) => (
                          <tr key={enq._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                            <td className="py-3.5 px-4 font-semibold text-white">{enq.name}</td>
                            <td className="py-3.5 px-4">
                              <span className="block text-white text-xs">{enq.email}</span>
                              <span className="block text-[11px] text-gray-400 mt-0.5">{enq.phone}</span>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs truncate">{enq.message}</td>
                            <td className="py-3.5 px-4 text-xs text-gray-400">
                              {new Date(enq.createdAt).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Manage Tours */}
          {currentTab === 'tours' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight">Manage Tours</h1>
                  <p className="text-sm text-gray-400 mt-1">Create, view, update, or remove adventure tours.</p>
                </div>
                {!tourFormOpen && (
                  <button 
                    onClick={() => setTourFormOpen(true)}
                    className="flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg border border-forest-600/30 text-sm cursor-pointer"
                  >
                    <FaPlus className="text-xs" /> Add New Tour
                  </button>
                )}
              </div>

              {/* Add/Edit Form */}
              {tourFormOpen && (
                <div className="glass rounded-3xl p-6 md:p-8 animate-fade-in border border-forest-800/10">
                  <h3 className="text-xl font-extrabold mb-6 border-b border-white/5 pb-4 text-gradient">
                    {editTourId ? 'Edit Adventure Tour' : 'Create New Adventure Tour'}
                  </h3>

                  <form onSubmit={handleTourSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tour Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Kedarkantha Trek Expedition"
                          value={tourTitle}
                          onChange={(e) => setTourTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</label>
                        <input
                          type="text"
                          placeholder="e.g. Uttarkashi, Uttarakhand"
                          value={tourLocation}
                          onChange={(e) => setTourLocation(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tour Description</label>
                      <textarea
                        rows="4"
                        placeholder="Write details about itinerary, inclusions, exclusions, and overall adventure experiences..."
                        value={tourDescription}
                        onChange={(e) => setTourDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                        required
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 6 Days / 5 Nights"
                          value={tourDuration}
                          onChange={(e) => setTourDuration(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Difficulty Level</label>
                        <select
                          value={tourDifficulty}
                          onChange={(e) => setTourDifficulty(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                        >
                          <option value="Easy" className="bg-[#0b0f19]">Easy</option>
                          <option value="Medium" className="bg-[#0b0f19]">Medium</option>
                          <option value="Hard" className="bg-[#0b0f19]">Hard</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Price (INR)</label>
                        <input
                          type="number"
                          placeholder="Price in ₹"
                          value={tourPrice}
                          onChange={(e) => setTourPrice(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Available Seats</label>
                        <input
                          type="number"
                          placeholder="Available slots"
                          value={tourSeats}
                          onChange={(e) => setTourSeats(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tour Starting Date</label>
                        <input
                          type="date"
                          value={tourDate}
                          onChange={(e) => setTourDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Cover Image URL (Optional)</label>
                          <span className="text-[11px] text-gray-500 block mt-1 leading-normal">
                            Enter the URL of the main display image. If left blank, a beautiful default adventure landscape will be used automatically.
                          </span>
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. https://images.unsplash.com/photo-... (Optional)"
                          value={tourCoverUrl}
                          onChange={(e) => setTourCoverUrl(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                        />
                        {tourCoverUrl && (
                          <div className="mt-3 relative w-full h-32 rounded-xl overflow-hidden border border-white/10">
                            <img 
                              src={getImageUrl(tourCoverUrl)} 
                              alt="Cover Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'; }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery Images Section */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Add Tour Gallery Image URLs (Optional, comma-separated)</label>
                        <span className="text-[11px] text-gray-500 block mt-1 leading-normal">
                          Provide public URLs of photos for this specific tour's gallery (e.g., hosted on Imgur, Unsplash, etc.). Separate multiple links using commas.
                        </span>
                      </div>
                      <textarea
                        rows="2"
                        placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                        value={tourGalleryUrls}
                        onChange={(e) => setTourGalleryUrls(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                      ></textarea>

                      {/* Display existing gallery images for editing */}
                      {editTourId && tourExistingGallery.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <span className="text-xs font-semibold text-gray-500 block">Existing Gallery Images:</span>
                          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {tourExistingGallery.map((imgUrl, i) => (
                              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-white/5">
                                <img src={getImageUrl(imgUrl)} alt="Existing" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExistingGalleryImage(imgUrl)}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white p-1 rounded-full text-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Form Controls */}
                    <div className="flex gap-4 pt-4 border-t border-white/5 justify-end">
                      <button
                        type="button"
                        onClick={resetTourForm}
                        className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={tourFormLoading}
                        className="px-6 py-3 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg border border-forest-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {tourFormLoading ? 'Processing...' : editTourId ? 'Update Tour' : 'Create Tour'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tours List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {toursList.map((tour) => (
                  <div key={tour._id} className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col group">
                    <div className="h-48 overflow-hidden relative shrink-0">
                      <img src={getImageUrl(tour.coverImage)} alt={tour.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-dark-bg/80 backdrop-blur-sm text-xs font-semibold px-2 py-0.5 rounded text-gray-300 border border-white/10">
                        {tour.difficulty}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-bold text-white line-clamp-1">{tour.title}</h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <FaMapMarkerAlt className="text-forest-500" />
                          <span>{tour.location}</span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-2">{tour.description}</p>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-white/5 mt-auto">
                        <span className="text-sm font-black text-white">₹{tour.price.toLocaleString('en-IN')}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTourClick(tour)}
                            className="p-2 bg-forest-800/50 hover:bg-forest-800 text-forest-500 hover:text-white rounded-lg transition-all text-xs"
                            title="Edit Tour"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour._id)}
                            className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all text-xs"
                            title="Delete Tour"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Manage Gallery */}
          {currentTab === 'gallery' && (
            <div className="space-y-10">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Manage Gallery</h1>
                <p className="text-sm text-gray-400 mt-1">Add past adventure pictures and catalog them by categories.</p>
              </div>

              {/* Uploader Form */}
              <div className="glass rounded-3xl p-6 border border-forest-800/10">
                <h3 className="text-lg font-bold text-white mb-6">Upload Past Adventure Photos</h3>

                <form onSubmit={handleGallerySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Image Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Tents under the stars"
                        value={galleryTitle}
                        onChange={(e) => setGalleryTitle(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</label>
                      <select
                        value={galleryCategory}
                        onChange={(e) => setGalleryCategory(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                      >
                        <option value="Trekking" className="bg-[#0b0f19]">Trekking</option>
                        <option value="Camping" className="bg-[#0b0f19]">Camping</option>
                        <option value="Hiking" className="bg-[#0b0f19]">Hiking</option>
                        <option value="Water Adventures" className="bg-[#0b0f19]">Water Adventures</option>
                        <option value="Mountain Tours" className="bg-[#0b0f19]">Mountain Tours</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Photo URL(s) (comma-separated)</label>
                        <span className="text-[11px] text-gray-500 block mt-1 leading-normal">
                          Enter one or more public image URLs (separated by commas) to catalog under this gallery category.
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                        value={galleryUrls}
                        onChange={(e) => setGalleryUrls(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-forest-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={galleryFormLoading}
                      className="px-6 py-3 bg-forest-800 hover:bg-forest-700 text-white rounded-xl font-semibold text-sm transition-all shadow-lg border border-forest-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {galleryFormLoading ? 'Uploading...' : 'Upload to Gallery'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Gallery Items Grid */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Existing Gallery Items</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryList.map((item) => (
                    <div key={item._id} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/5 glass">
                      <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-dark-bg/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-between">
                        <div>
                          <span className="inline-block text-[9px] bg-forest-800 text-forest-50 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h5 className="font-semibold text-white text-xs mt-2 line-clamp-2">{item.title}</h5>
                        </div>
                        <button
                          onClick={() => handleDeleteGalleryItem(item._id)}
                          className="flex items-center gap-1.5 justify-center py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg w-full transition-colors cursor-pointer"
                        >
                          <FaTrashAlt className="text-[10px]" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Enquiries */}
          {currentTab === 'enquiries' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Customer Enquiries</h1>
                <p className="text-sm text-gray-400 mt-1">Review contact inquiries submitted by potential travelers.</p>
              </div>

              <div className="glass rounded-3xl overflow-hidden border border-white/5">
                {enquiriesList.length === 0 ? (
                  <p className="text-sm text-gray-400 py-12 text-center">No enquiries records found in the database.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead className="text-xs uppercase tracking-wider text-gray-400 border-b border-white/5 bg-white/5">
                        <tr>
                          <th className="py-4 px-6">Name</th>
                          <th className="py-4 px-6">Email</th>
                          <th className="py-4 px-6">Mobile Number</th>
                          <th className="py-4 px-6">Message</th>
                          <th className="py-4 px-6">Submitted Date</th>
                          <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiriesList.map((enq) => (
                          <tr key={enq._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                            <td className="py-4 px-6 font-bold text-white">{enq.name}</td>
                            <td className="py-4 px-6 text-gray-300">{enq.email}</td>
                            <td className="py-4 px-6 font-mono text-gray-300">{enq.phone}</td>
                            <td className="py-4 px-6 max-w-sm whitespace-pre-line text-xs text-gray-300 leading-relaxed">
                              {enq.message}
                            </td>
                            <td className="py-4 px-6 text-xs text-gray-400">
                              {new Date(enq.createdAt).toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button
                                onClick={() => handleDeleteEnquiry(enq._id)}
                                className="p-2 bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                                title="Delete Record"
                              >
                                <FaTrashAlt />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
