import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get('/auth/me'),
  
  updateProfile: (userData: any) =>
    api.put('/auth/updateprofile', userData),
  
  updatePassword: (passwordData: any) =>
    api.put('/auth/updatepassword', passwordData),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () =>
    api.get('/dashboard/stats'),
  
  getQuickActions: () =>
    api.get('/dashboard/quick-actions'),
};

// Reservations API
export const reservationAPI = {
  getBookings: (params?: any) =>
    api.get('/bookings', { params }),
  
  getBooking: (id: string) =>
    api.get(`/bookings/${id}`),
  
  createBooking: (bookingData: any) =>
    api.post('/bookings', bookingData),
  
  updateBooking: (id: string, bookingData: any) =>
    api.put(`/bookings/${id}`, bookingData),
  
  deleteBooking: (id: string) =>
    api.delete(`/bookings/${id}`),
  
  checkIn: (id: string, checkInData: any) =>
    api.post(`/bookings/${id}/checkin`, checkInData),
  
  checkOut: (id: string, checkOutData: any) =>
    api.post(`/bookings/${id}/checkout`, checkOutData),
  
  cancelBooking: (id: string, cancellationData: any) =>
    api.post(`/bookings/${id}/cancel`, cancellationData),
};

// Rooms API
export const roomAPI = {
  getRooms: (params?: any) =>
    api.get('/rooms', { params }),
  
  getRoom: (id: string) =>
    api.get(`/rooms/${id}`),
  
  createRoom: (roomData: any) =>
    api.post('/rooms', roomData),
  
  updateRoom: (id: string, roomData: any) =>
    api.put(`/rooms/${id}`, roomData),
  
  deleteRoom: (id: string) =>
    api.delete(`/rooms/${id}`),
  
  updateRoomStatus: (id: string, statusData: any) =>
    api.put(`/rooms/${id}/status`, statusData),
  
  markRoomCleaned: (id: string, cleaningData: any) =>
    api.post(`/rooms/${id}/clean`, cleaningData),
};

// Guests API
export const guestAPI = {
  getGuests: (params?: any) =>
    api.get('/guests', { params }),
  
  getGuest: (id: string) =>
    api.get(`/guests/${id}`),
  
  createGuest: (guestData: any) =>
    api.post('/guests', guestData),
  
  updateGuest: (id: string, guestData: any) =>
    api.put(`/guests/${id}`, guestData),
  
  deleteGuest: (id: string) =>
    api.delete(`/guests/${id}`),
  
  addGuestNote: (id: string, noteData: any) =>
    api.post(`/guests/${id}/notes`, noteData),
  
  getGuestBookings: (id: string) =>
    api.get(`/guests/${id}/bookings`),
};

// POS API
export const posAPI = {
  getItems: (params?: any) =>
    api.get('/pos/items', { params }),
  
  getItem: (id: string) =>
    api.get(`/pos/items/${id}`),
  
  createItem: (itemData: any) =>
    api.post('/pos/items', itemData),
  
  updateItem: (id: string, itemData: any) =>
    api.put(`/pos/items/${id}`, itemData),
  
  deleteItem: (id: string) =>
    api.delete(`/pos/items/${id}`),
  
  createOrder: (orderData: any) =>
    api.post('/pos/orders', orderData),
  
  getOrders: (params?: any) =>
    api.get('/pos/orders', { params }),
  
  postToRoom: (orderData: any) =>
    api.post('/pos/post-to-room', orderData),
};

// Billing API
export const billingAPI = {
  getInvoices: (params?: any) =>
    api.get('/invoices', { params }),
  
  getInvoice: (id: string) =>
    api.get(`/invoices/${id}`),
  
  createInvoice: (invoiceData: any) =>
    api.post('/invoices', invoiceData),
  
  updateInvoice: (id: string, invoiceData: any) =>
    api.put(`/invoices/${id}`, invoiceData),
  
  addPayment: (id: string, paymentData: any) =>
    api.post(`/invoices/${id}/payments`, paymentData),
  
  generateInvoicePDF: (id: string) =>
    api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
  
  getGuestFolio: (bookingId: string) =>
    api.get(`/invoices/folio/${bookingId}`),
};

// Reports API
export const reportAPI = {
  getOccupancyReport: (params: any) =>
    api.get('/reports/occupancy', { params }),
  
  getRevenueReport: (params: any) =>
    api.get('/reports/revenue', { params }),
  
  getDailySalesReport: (params: any) =>
    api.get('/reports/daily-sales', { params }),
  
  getGuestReport: (params: any) =>
    api.get('/reports/guests', { params }),
  
  getRoomReport: (params: any) =>
    api.get('/reports/rooms', { params }),
};

export default api;