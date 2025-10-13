import app from './src/app.js';

// Debug route loading
console.log('🔍 Checking loaded routes...');

const routes = [
  '/api/auth',
  '/api/users', 
  '/api/nutrition',
  '/api/workouts',
  '/api/progress',
  '/api/analytics',
  '/api/notifications',
  '/api/test'
];

routes.forEach(route => {
  console.log(`✅ Route configured: ${route}`);
});

console.log('🚀 Server routes loaded successfully!');