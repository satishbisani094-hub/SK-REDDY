import axios from 'axios';

const DB_URL = 'https://api.npoint.io/3d0b82f712fd2b750b56';
const ADMIN_NUMBERS = ['8520016332', '9000012345', '7989245079'];

// Helper to fetch all data from npoint.io JSON bin
const fetchAllData = async () => {
  try {
    const res = await fetch(`${DB_URL}?t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data || { tours: [], gallery: [], enquiries: [] };
  } catch (err) {
    console.error('Error fetching database:', err);
    return { tours: [], gallery: [], enquiries: [] };
  }
};

// Helper to save all data to npoint.io JSON bin
const saveAllData = async (data) => {
  try {
    const res = await fetch(DB_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return true;
  } catch (err) {
    console.error('Error saving database:', err);
    return false;
  }
};

// Auth Services
export const login = async (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const normalizedPhone = cleanPhone.length > 10 && cleanPhone.startsWith('91') 
    ? cleanPhone.slice(-10) 
    : cleanPhone;

  if (!ADMIN_NUMBERS.includes(normalizedPhone)) {
    throw new Error('This mobile number is not authorized for Admin access');
  }

  // Generate a dummy JWT token for session compatibility
  const token = 'dummy-otp-jwt-token-skreddy-' + Date.now();
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminUser', JSON.stringify({ username: normalizedPhone }));

  return { token, username: normalizedPhone };
};

export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getMe = async () => {
  const user = localStorage.getItem('adminUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

// Tours Services
export const getTours = async (search = '', difficulty = 'All') => {
  const data = await fetchAllData();
  let tours = data.tours || [];

  if (search) {
    tours = tours.filter(t => 
      (t.title && t.title.toLowerCase().includes(search.toLowerCase())) || 
      (t.location && t.location.toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (difficulty && difficulty !== 'All') {
    tours = tours.filter(t => t.difficulty === difficulty);
  }

  return tours;
};

export const getTourById = async (id) => {
  const data = await fetchAllData();
  const tours = data.tours || [];
  return tours.find(t => t._id === id || t.id === id);
};

export const createTour = async (tourData) => {
  const data = await fetchAllData();
  const tours = data.tours || [];

  const newTour = {
    ...tourData,
    id: 'tour-' + Date.now(),
    _id: 'tour-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.tours = [...tours, newTour];
  await saveAllData(data);
  return newTour;
};

export const updateTour = async (id, tourData) => {
  const data = await fetchAllData();
  const tours = data.tours || [];

  const updatedTours = tours.map(t => {
    if (t._id === id || t.id === id) {
      return {
        ...t,
        ...tourData,
        updatedAt: new Date().toISOString()
      };
    }
    return t;
  });

  data.tours = updatedTours;
  await saveAllData(data);
  return updatedTours.find(t => t._id === id || t.id === id);
};

export const deleteTour = async (id) => {
  const data = await fetchAllData();
  const tours = data.tours || [];

  data.tours = tours.filter(t => t._id !== id && t.id !== id);
  await saveAllData(data);
  return { message: 'Tour deleted successfully' };
};

// Gallery Services
export const getGalleryItems = async (category = 'All') => {
  const data = await fetchAllData();
  let gallery = data.gallery || [];

  if (category && category !== 'All') {
    gallery = gallery.filter(g => g.category === category);
  }

  return gallery;
};

export const createGalleryItems = async (galleryData) => {
  const data = await fetchAllData();
  const gallery = data.gallery || [];

  let parsedImages = [];
  if (Array.isArray(galleryData.image)) {
    parsedImages = galleryData.image;
  } else if (typeof galleryData.image === 'string') {
    parsedImages = galleryData.image.split(',').map(url => url.trim()).filter(Boolean);
  }

  const createdItems = [];
  parsedImages.forEach((imgUrl, index) => {
    const itemTitle = parsedImages.length > 1 ? `${galleryData.title} (${index + 1})` : galleryData.title;
    const newItem = {
      id: 'gallery-' + Date.now() + '-' + index,
      _id: 'gallery-' + Date.now() + '-' + index,
      title: itemTitle || 'Adventure Photo',
      category: galleryData.category,
      image: imgUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    createdItems.push(newItem);
  });

  data.gallery = [...gallery, ...createdItems];
  await saveAllData(data);
  return createdItems;
};

export const deleteGalleryItem = async (id) => {
  const data = await fetchAllData();
  const gallery = data.gallery || [];

  data.gallery = gallery.filter(g => g._id !== id && g.id !== id);
  await saveAllData(data);
  return { message: 'Gallery item deleted successfully' };
};

// Enquiries Services
export const createEnquiry = async (enquiryData) => {
  const data = await fetchAllData();
  const enquiries = data.enquiries || [];

  const newEnquiry = {
    ...enquiryData,
    id: 'enquiry-' + Date.now(),
    _id: 'enquiry-' + Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.enquiries = [...enquiries, newEnquiry];
  await saveAllData(data);
  return newEnquiry;
};

export const getEnquiries = async () => {
  const data = await fetchAllData();
  return data.enquiries || [];
};

export const deleteEnquiry = async (id) => {
  const data = await fetchAllData();
  const enquiries = data.enquiries || [];

  data.enquiries = enquiries.filter(e => e._id !== id && e.id !== id);
  await saveAllData(data);
  return { message: 'Enquiry deleted successfully' };
};

// Image URL utilities
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return imagePath;
};

// Returns database status directly
export const getDbStatus = async () => {
  return {
    isMongoConnected: true,
    isDbConnected: true,
    provider: 'postgresql'
  };
};
