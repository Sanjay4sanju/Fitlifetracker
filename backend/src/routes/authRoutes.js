import express from 'express';
import { register, login, refreshToken, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/authValidators.js';

const router = express.Router();

console.log('✅ Auth routes loaded - register route available at POST /api/auth/register');

// Public routes
router.post('/register', (req, res, next) => {
  console.log('Register route hit with body:', req.body);
  registerValidator(req, res, (err) => {
    if (err) return next(err);
    register(req, res, next);
  });
});

router.post('/login', (req, res, next) => {
  console.log('Login route hit with body:', req.body);
  loginValidator(req, res, (err) => {
    if (err) return next(err);
    login(req, res, next);
  });
});

router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidator, updateProfile);

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working!' });
});

export default router;