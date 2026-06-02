import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auto attach token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (data) => 
  api.post('/auth/login', data);

export const registerUser = (data) => 
  api.post('/auth/register/user', data);

export const registerAdmin = (data) => 
  api.post('/auth/register/admin', data);

export const logoutUser = () => 
  api.post('/auth/logout');

export const getMe = () => 
  api.get('/auth/me');

// Parking APIs
export const getAllParkings = (params) => 
  api.get('/parking/all', { params });

export const getParkingById = (id) => 
  api.get(`/parking/${id}`);

export const getParkingSlots = (id) => 
  api.get(`/parking/${id}/slots`);

// Booking APIs
export const createBooking = (data) => 
  api.post('/booking/create', data);

export const getMyBookings = () => 
  api.get('/booking/my-bookings');

export const getBookingHistory = () => 
  api.get('/booking/history');

export const cancelBooking = (id) => 
  api.put(`/booking/${id}/cancel`);

// Admin APIs
export const getBookingRequests = () => 
  api.get('/booking/requests');

export const approveBooking = (id) => 
  api.put(`/booking/${id}/approve`);

export const rejectBooking = (id, reason) => 
  api.put(`/booking/${id}/reject`, { reason });

// Notification APIs
export const getNotifications = () => 
  api.get('/notifications');

export const markNotificationRead = (id) => 
  api.put(`/notifications/${id}/read`);

// Review APIs
export const addReview = (data) => 
  api.post('/reviews/add', data);

export const getReviews = (parkingId) => 
  api.get(`/reviews/${parkingId}`);

export default api;
