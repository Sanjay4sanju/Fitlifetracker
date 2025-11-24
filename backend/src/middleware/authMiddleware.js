import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    console.log('🔐 Auth Middleware - Headers:', req.headers);
    
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('🔐 Extracted token:', token ? 'Present' : 'Missing');

    if (!token) {
      console.log('❌ No token provided for route:', req.method, req.path);
      return res.status(401).json({ 
        message: 'Access token required',
        success: false
      });
    }

    console.log('🔐 Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);

    const user = await User.findByPk(decoded.userId);
    console.log('🔍 User found:', user ? `ID: ${user.id}` : 'Not found');

    if (!user) {
      console.log('❌ User not found for token');
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        success: false
      });
    }

    req.user = user;
    req.userId = user.id;
    
    console.log('✅ Authentication successful for user:', user.id);
    next();
  } catch (error) {
    console.log('❌ Auth middleware error:', error.name, error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        message: 'Invalid token format',
        success: false
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        message: 'Token expired',
        success: false
      });
    } else if (error.name === 'SequelizeConnectionError') {
      return res.status(503).json({ 
        message: 'Database connection error',
        success: false
      });
    }
    
    console.error('Unexpected auth error:', error);
    return res.status(500).json({ 
      message: 'Authentication failed',
      success: false
    });
  }
};
