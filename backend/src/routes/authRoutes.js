import express from 'express';
import { register, login, refreshToken, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log('✅ Auth router initialized');

// Debug middleware
router.use((req, res, next) => {
  console.log(`🔐 Auth route: ${req.method} ${req.path}`);
  next();
});

// Public routes - SIMPLIFIED WITHOUT VALIDATORS FOR NOW
router.post('/register', async (req, res, next) => {
  console.log('🎯 REGISTER endpoint hit with body:', req.body);
  try {
    await register(req, res, next);
  } catch (error) {
    console.error('Route register error:', error);
    res.status(500).json({ message: 'Registration route error', error: error.message });
  }
});

router.post('/login', async (req, res, next) => {
  console.log('🔑 LOGIN endpoint hit with body:', req.body);
  try {
    await login(req, res, next);
  } catch (error) {
    console.error('Route login error:', error);
    res.status(500).json({ message: 'Login route error', error: error.message });
  }
});

router.post('/refresh-token', refreshToken);

// Test route
router.get('/test', (req, res) => {
  console.log('✅ Auth test route hit');
  res.json({ message: 'Auth routes working!' });
});

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;