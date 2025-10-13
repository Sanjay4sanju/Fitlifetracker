import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Database Connection and Server Start
const startServer = async () => {
  try {
    try {
      const { sequelize } = await import('./src/models/index.js');
      await sequelize.authenticate();
      console.log(' Database connected successfully');
      
      // Only sync database in development, not in production
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log(' Database synchronized for development');
      } else if (process.env.NODE_ENV === 'production' && process.env.RUN_DB_SYNC === 'true') {
        // Only sync in production if explicitly enabled
        console.log(' Running production database sync...');
        await sequelize.sync({ alter: false });
        console.log(' Production database sync completed');
      }
    } catch (dbError) {
      console.error(' Database connection failed:', dbError.message);
      // Don't exit in production - the app might work without DB temporarily
      if (process.env.NODE_ENV === 'production') {
        console.log('  Starting without database connection');
      } else {
        throw dbError;
      }
    }
    
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` API URL: http://localhost:${PORT}/api`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log(` Auth Test: http://localhost:${PORT}/api/test/auth-test`);
      
      if (process.env.NODE_ENV === 'production') {
        console.log(' Production mode: Database auto-sync disabled for safety');
        console.log(' Set RUN_DB_SYNC=true to enable database synchronization');
      }
    });
  } catch (error) {
    console.error(' Unable to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;
