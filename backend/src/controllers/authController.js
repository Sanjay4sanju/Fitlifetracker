import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { Sequelize } from 'sequelize';

const { Op } = Sequelize;

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  
  // Validate JWT secret configuration
  if (!secret || secret === 'fallback-secret' || secret.includes('your_super_secure')) {
    console.error('💥 JWT_SECRET not properly configured:', secret);
    throw new Error('JWT_SECRET not properly configured in environment variables');
  }
  
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

const generateRefreshToken = (userId) => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  // Validate JWT refresh secret configuration
  if (!secret || secret === 'fallback-refresh-secret' || secret.includes('your_super_secure')) {
    console.error('💥 JWT_REFRESH_SECRET not properly configured:', secret);
    throw new Error('JWT_REFRESH_SECRET not properly configured in environment variables');
  }
  
  return jwt.sign({ userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

export const register = async (req, res, next) => {
  try {
    console.log('🎯 Registration controller called with body:', req.body);
    
    // Skip validation for testing
    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      dateOfBirth, 
      height, 
      weight, 
      gender, 
      fitnessGoal = 'maintenance', 
      activityLevel = 'moderate' 
    } = req.body;

    console.log('Creating user with:', { email, username, firstName, lastName });

    // Check for existing user
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      console.log('User already exists:', existingUser.email);
      return res.status(400).json({ 
        message: 'User already exists with this email or username' 
      });
    }

    // Validate JWT configuration before proceeding
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('your_super_secure')) {
      console.error('❌ JWT_SECRET not configured for registration');
      return res.status(500).json({
        message: 'Server configuration error - authentication not configured',
        error: 'JWT_SECRET environment variable missing or invalid'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender,
      fitnessGoal: fitnessGoal === 'muscle gain' ? 'muscle_gain' : fitnessGoal,
      activityLevel
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log('✅ User registered successfully:', userResponse.email);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      refreshToken,
      user: userResponse
    });
  } catch (error) {
    console.error('💥 Registration error:', error);
    
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({
        message: 'Server authentication configuration error',
        error: 'JWT secret not properly configured'
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error during registration',
      error: error.message 
    });
  }
};

export const login = async (req, res, next) => {
  try {
    console.log('🔑 Login controller called with body:', req.body);
    
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate JWT configuration
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('your_super_secure')) {
      console.error('❌ JWT_SECRET not configured for login');
      return res.status(500).json({
        message: 'Server configuration error - authentication not configured',
        error: 'JWT_SECRET environment variable missing'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Return user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    console.log('✅ User logged in successfully:', userResponse.email);
    
    res.json({
      message: 'Login successful',
      token,
      refreshToken,
      user: userResponse
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({
        message: 'Server authentication configuration error',
        error: 'JWT secret not properly configured'
      });
    }
    
    res.status(500).json({ 
      message: 'Internal server error during login',
      error: error.message 
    });
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    // Validate refresh secret configuration
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.includes('your_super_secure')) {
      console.error('❌ JWT_REFRESH_SECRET not configured');
      return res.status(500).json({
        message: 'Server configuration error',
        error: 'JWT refresh secret not configured'
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    
    if (error.message.includes('JWT_SECRET')) {
      return res.status(500).json({
        message: 'Server configuration error',
        error: 'JWT secrets not properly configured'
      });
    }
    
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, height, weight, gender, fitnessGoal, activityLevel } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      firstName,
      lastName,
      dateOfBirth,
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender,
      fitnessGoal,
      activityLevel
    });

    // Return updated user without password
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json({
      message: 'Profile updated successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};
