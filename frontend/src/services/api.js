import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fitlifetracker-1.onrender.com/api';

console.log('🚀 API Base URL:', API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token with logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('🔄 API Request:', config.method?.toUpperCase(), config.url);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ No token found in localStorage');
    }
    
    console.log('📤 Request headers:', config.headers);
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced logging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response success:', response.status, response.config.url);
    console.log('📥 Response data:', response.data);
    
    // Return the full response for auth endpoints, just data for others
    if (response.config.url.includes('/auth/')) {
      return response;
    }
    return response.data;
  },
  (error) => {
    console.error('❌ API Response error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - Removing token and redirecting');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.log('🔐 403 Forbidden - Token may be invalid');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Return the error response data if available
    return Promise.reject(error.response?.data || error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => {
    console.log('🔑 Login API call with:', credentials.email);
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    console.log('👤 Register API call with:', userData.email);
    return api.post('/auth/register', userData);
  },
  getProfile: () => {
    console.log('📋 Get profile API call');
    return api.get('/auth/profile');
  },
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

// Nutrition API
export const nutritionAPI = {
  getEntries: (params) => {
    console.log('🥗 Get nutrition entries:', params);
    return api.get('/nutrition', { params });
  },
  getStats: (params) => api.get('/nutrition/stats', { params }),
  getWeeklyComparison: (params) => api.get('/nutrition/weekly-comparison', { params }),
  addEntry: (data) => api.post('/nutrition', data),
  updateEntry: (id, data) => api.put(`/nutrition/${id}`, data),
  deleteEntry: (id) => api.delete(`/nutrition/${id}`)
};

// Workout API
export const workoutAPI = {
  getEntries: (params) => {
    console.log('💪 Get workout entries:', params);
    return api.get('/workouts', { params });
  },
  getStats: (params) => api.get('/workouts/stats', { params }),
  getWeeklyComparison: (params) => api.get('/workouts/weekly-comparison', { params }),
  addEntry: (data) => api.post('/workouts', data),
  updateEntry: (id, data) => api.put(`/workouts/${id}`, data),
  deleteEntry: (id) => api.delete(`/workouts/${id}`)
};

// Progress API
export const progressAPI = {
  getEntries: (params) => {
    console.log('📊 Get progress entries:', params);
    return api.get('/progress', { params });
  },
  getWeeklyComparison: (params) => api.get('/progress/weekly-comparison', { params }),
  addEntry: (data) => api.post('/progress', data),
  updateEntry: (id, data) => api.put(`/progress/${id}`, data),
  deleteEntry: (id) => api.delete(`/progress/${id}`)
};

// Analytics API
export const analyticsAPI = {
  getDashboardData: () => {
    console.log('📈 Get dashboard data');
    return api.get('/analytics/dashboard');
  },
  getWeeklyComparisons: () => {
    console.log('📊 Get weekly comparisons');
    return api.get('/analytics/weekly-comparisons');
  },
  getNutritionAnalytics: (params) => api.get('/analytics/nutrition', { params }),
  getWorkoutAnalytics: (params) => api.get('/analytics/workouts', { params })
};

// Notification API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

export default api;
