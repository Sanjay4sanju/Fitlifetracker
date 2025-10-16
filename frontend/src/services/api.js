import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (response.config.url.includes('/auth/')) {
      return response;
    }
    return response.data;
  },
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
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken })
};

// User API
export const userAPI = {
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data) => api.put('/users/preferences', data),
  changePassword: (data) => api.post('/users/change-password', data),
  exportData: () => api.get('/users/export', { responseType: 'blob' }),
  deleteAccount: (data) => api.delete('/users/account', { data })
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

// Nutrition API
export const nutritionAPI = {
  getEntries: (params) => api.get('/nutrition', { params }),
  getStats: (params) => api.get('/nutrition/stats', { params }),
  getWeeklyComparison: (params) => api.get('/nutrition/weekly-comparison', { params }),
  addEntry: (data) => api.post('/nutrition', data),
  updateEntry: (id, data) => api.put(`/nutrition/${id}`, data),
  deleteEntry: (id) => api.delete(`/nutrition/${id}`)
};

// Workout API
export const workoutAPI = {
  getEntries: (params) => api.get('/workouts', { params }),
  getStats: (params) => api.get('/workouts/stats', { params }),
  getWeeklyComparison: (params) => api.get('/workouts/weekly-comparison', { params }),
  addEntry: (data) => api.post('/workouts', data),
  updateEntry: (id, data) => api.put(`/workouts/${id}`, data),
  deleteEntry: (id) => api.delete(`/workouts/${id}`)
};

// Progress API
export const progressAPI = {
  getEntries: (params) => api.get('/progress', { params }),
  getWeeklyComparison: (params) => api.get('/progress/weekly-comparison', { params }),
  addEntry: (data) => api.post('/progress', data),
  updateEntry: (id, data) => api.put(`/progress/${id}`, data),
  deleteEntry: (id) => api.delete(`/progress/${id}`)
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: () => api.get('/analytics/dashboard'),
  getWeeklyComparisons: () => api.get('/analytics/weekly-comparisons'),
  getNutritionAnalytics: (params) => api.get('/analytics/nutrition', { params }),
  getWorkoutAnalytics: (params) => api.get('/analytics/workouts', { params })
};

export default api;