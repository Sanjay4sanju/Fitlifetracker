import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload.user,
        token: action.payload.token
      };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, user: null, token: null };
    case 'LOGOUT':
      return { ...state, user: null, token: null, error: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      // Verify token and get user profile on app start
      verifyToken();
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authAPI.getProfile(state.token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.data.user, token: state.token }
      });
    } catch (error) {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

// In your AuthContext, update the register function:
const register = async (userData) => {
  dispatch({ type: 'LOGIN_START' });
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Registration data received:', userData);
    
    // Validate required fields
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      throw new Error('Please fill in all required fields');
    }

    const mockUser = {
      id: 'user-' + Date.now(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      height: userData.height || 175,
      weight: userData.weight || 70,
      gender: userData.gender || 'other',
      dateOfBirth: userData.dateOfBirth || '1990-01-01',
      fitnessGoal: userData.fitnessGoal || 'maintenance',
      activityLevel: userData.activityLevel || 'moderate'
    };
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    
    localStorage.setItem('token', mockToken);
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user: mockUser, token: mockToken }
    });
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.message || 'Registration failed';
    console.error('Registration error:', errorMessage);
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    return { success: false, error: errorMessage };
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData, state.token);
      dispatch({ type: 'UPDATE_USER', payload: response.data.user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};