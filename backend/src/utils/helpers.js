import moment from 'moment';

export const formatResponse = (data, message = 'Success', statusCode = 200) => {
  return {
    success: statusCode < 400,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

export const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

export const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  return bmr * (multipliers[activityLevel] || 1.2);
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

export const generateRandomCode = (length = 6) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};