import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

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

// CORS Configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Body Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import and use routes with error handling
const setupRoutes = async () => {
  try {
    console.log('🔄 Loading routes...');
    
    // Import all routes
    const { default: authRoutes } = await import('./routes/authRoutes.js');
    const { default: userRoutes } = await import('./routes/userRoutes.js');
    const { default: nutritionRoutes } = await import('./routes/nutritionRoutes.js');
    const { default: workoutRoutes } = await import('./routes/workoutRoutes.js');
    const { default: progressRoutes } = await import('./routes/progressRoutes.js');
    const { default: analyticsRoutes } = await import('./routes/analyticsRoutes.js');
    const { default: notificationRoutes } = await import('./routes/notificationRoutes.js');
    const { default: testRoutes } = await import('./routes/testRoutes.js');
    
    // Use routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/nutrition', nutritionRoutes);
    app.use('/api/workouts', workoutRoutes);
    app.use('/api/progress', progressRoutes);
    app.use('/api/analytics', analyticsRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/test', testRoutes);
    
    console.log('✅ All routes loaded successfully!');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
    process.exit(1);
  }
};

// Initialize routes
setupRoutes();

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV
  });
});

// API Welcome Route
app.get('/api', (req, res) => {
  res.json({
    message: 'FitLifeTracker API v1.0',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    documentation: 'https://github.com/your-username/fitlifetracker',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      nutrition: '/api/nutrition',
      workouts: '/api/workouts',
      progress: '/api/progress',
      analytics: '/api/analytics',
      notifications: '/api/notifications'
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.redirect('/api');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    message: `Route ${req.originalUrl} not found`,
    success: false,
    availableEndpoints: [
      'GET /api',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/test/auth-test'
    ]
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);

  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      message: 'CORS policy: Request not allowed',
      success: false
    });
  }

  // Rate limit errors
  if (err.status === 429) {
    return res.status(429).json({
      message: 'Too many requests, please try again later.',
      success: false
    });
  }

  // Default error response
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