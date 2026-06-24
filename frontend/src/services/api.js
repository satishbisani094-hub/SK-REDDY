import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Services
// Auth Services
export const sendOTP = async (phoneNumber) => {
  const response = await api.post('/auth/send-otp', { phoneNumber });
  return response.data;
};

export const verifyOTP = async (phoneNumber, otp) => {
  const response = await api.post('/auth/verify-otp', { phoneNumber, otp });
  if (response.data && response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
    localStorage.setItem('adminUser', JSON.stringify({ phoneNumber: response.data.phoneNumber }));
  }
  return response.data;
};


export const logout = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

// Tours Services
export const getTours = async (search = '', difficulty = 'All') => {
  let url = '/tours';
  const params = [];
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  if (difficulty && difficulty !== 'All') params.push(`difficulty=${encodeURIComponent(difficulty)}`);

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  const response = await api.get(url);
  return response.data;
};

export const getTourById = async (id) => {
  const response = await api.get(`/tours/${id}`);
  return response.data;
};

export const createTour = async (tourData) => {
  const response = await api.post('/tours', tourData);
  return response.data;
};

export const updateTour = async (id, tourData) => {
  const response = await api.put(`/tours/${id}`, tourData);
  return response.data;
};

export const deleteTour = async (id) => {
  const response = await api.delete(`/tours/${id}`);
  return response.data;
};

// Gallery Services
export const getGalleryItems = async (category = 'All') => {
  let url = '/gallery';
  if (category && category !== 'All') {
    url += `?category=${encodeURIComponent(category)}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const createGalleryItems = async (galleryData) => {
  const response = await api.post('/gallery', galleryData);
  return response.data;
};

export const deleteGalleryItem = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};

// Enquiries Services
export const createEnquiry = async (enquiryData) => {
  const response = await api.post('/enquiries', enquiryData);
  return response.data;
};

export const getEnquiries = async () => {
  const response = await api.get('/enquiries');
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/enquiries/${id}`);
  return response.data;
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  // Remove '/api' from the base URL to get the server root URL
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/${imagePath}`;
};

