import express from 'express';
import { register, login, refreshToken, getProfile, updateProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator, updateProfileValidator } from '../validators/authValidators.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidator, updateProfile);

export default router;