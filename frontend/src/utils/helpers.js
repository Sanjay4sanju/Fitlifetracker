import { format, parseISO } from 'date-fns';

export const formatDate = (date, formatStr = 'MMM d, yyyy') => {
  if (!date) return '';
  return format(parseISO(date), formatStr);
};

export const formatTime = (date) => {
  if (!date) return '';
  return format(parseISO(date), 'HH:mm');
};

export const calculateMacroPercentages = (protein, carbs, fats) => {
  const total = protein + carbs + fats;
  if (total === 0) return { protein: 0, carbs: 0, fats: 0 };
  
  return {
    protein: Math.round((protein / total) * 100),
    carbs: Math.round((carbs / total) * 100),
    fats: Math.round((fats / total) * 100)
  };
};

export const getCalorieGoal = (user) => {
  if (!user) return 2000;
  
  const baseCalories = {
    weight_loss: 1800,
    muscle_gain: 2500,
    maintenance: 2200,
    endurance: 2800
  };
  
  return baseCalories[user.fitnessGoal] || 2000;
};

export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};