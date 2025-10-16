import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes synchronously
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS Configuration - UPDATED WITH ALL NEW DOMAINS
const corsOptions = {
  origin: function (origin, callback) {
    console.log('🔄 CORS checking origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ Allowing request without origin');
      return callback(null, true);
    }
    
    // Allow all Vercel domains, localhost, and your specific domains
    const allowedDomains = [
      'localhost:3000',
      'localhost:5173',
      'fit-lifetracker2.vercel.app',
      'fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd.vercel.app',
      'fitlifetracke-r-b2cd-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd-onewioyrw-john-devs-projects-dc2575c3.vercel.app'
    ];
    
    const isAllowed = allowedDomains.some(domain => origin.includes(domain)) || 
                     origin.includes('.vercel.app') ||
                     origin.includes('vercel.app');
    
    if (isAllowed) {
      console.log('✅ Allowing origin:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

console.log('🔄 Mounting routes...');

// Mount routes synchronously
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', testRoutes);

console.log('✅ All routes mounted successfully!');

// Test route
app.post('/api/test-route', (req, res) => {
  console.log('Test route hit with body:', req.body);
  res.json({ message: 'Test route working!', body: req.body });
});

// TEMPORARY DIRECT ROUTES FOR TESTING
app.post('/api/direct-register', (req, res) => {
  console.log('🎯 DIRECT REGISTER hit with body:', req.body);
  res.json({ 
    message: 'Direct registration working!', 
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/direct-login', (req, res) => {
  console.log('🔑 DIRECT LOGIN hit with body:', req.body);
  res.json({ 
    message: 'Direct login working!', 
    received: req.body,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/direct-test', (req, res) => {
  res.json({ 
    message: 'Direct test route working!',
    cors: 'CORS should be working now',
    timestamp: new Date().toISOString(),
    allowedDomains: [
      'fit-lifetracker2.vercel.app',
      'fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd.vercel.app',
      'localhost:3000',
      'localhost:5173'
    ]
  });
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    cors: 'Enabled for all Vercel domains',
    allowedDomains: [
      'fit-lifetracker2.vercel.app',
      'fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd.vercel.app'
    ]
  });
});

// API Welcome Route
app.get('/api', (req, res) => {
  res.json({
    message: 'FitLifeTracker API v1.0',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    cors: 'Enabled for Vercel deployments',
    allowedOrigins: [
      'fit-lifetracker2.vercel.app',
      'fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd.vercel.app',
      'fitlifetracke-r-b2cd-git-main-john-devs-projects-dc2575c3.vercel.app',
      'fitlifetracke-r-b2cd-onewioyrw-john-devs-projects-dc2575c3.vercel.app',
      'localhost:3000',
      'localhost:5173'
    ],
    documentation: 'https://github.com/johnchire827/FitLifetracker2',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      nutrition: '/api/nutrition',
      workouts: '/api/workouts',
      progress: '/api/progress',
      analytics: '/api/analytics',
      notifications: '/api/notifications',
      test: '/api/direct-test'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/api');
});

// 404 Handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    success: false,
    availableEndpoints: [
      'GET /api',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/test',
      'POST /api/test-route',
      'POST /api/direct-register',
      'POST /api/direct-login',
      'GET /api/direct-test'
    ]
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS policy: Request not allowed',
      success: false,
      details: 'Your origin is not in the allowed list',
      allowedOrigins: [
        'fit-lifetracker2.vercel.app',
        'fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app',
        'fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app',
        'fitlifetracke-r-b2cd.vercel.app',
        'All Vercel domains (.vercel.app)',
        'localhost:3000',
        'localhost:5173'
      ]
    });
  }

  if (err.status === 429) {
    return res.status(429).json({
      message: 'Too many requests, please try again later.',
      success: false
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Something went wrong!' 
    : err.message;

  res.status(statusCode).json({
    message,
    success: false,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;