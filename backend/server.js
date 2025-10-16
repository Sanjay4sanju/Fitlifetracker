import dotenv from 'dotenv';
import app from './src/app.js';

dotenv.config();

const PORT = process.env.PORT || 10000;

// Database Connection and Server Start
const startServer = async () => {
  try {
    try {
      const { sequelize } = await import('./src/models/index.js');
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
      
      // Only sync database in development, not in production
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized for development');
      } else if (process.env.NODE_ENV === 'production' && process.env.RUN_DB_SYNC === 'true') {
        console.log('🔄 Running production database sync...');
        await sequelize.sync({ alter: false });
        console.log('✅ Production database sync completed');
      }
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      if (process.env.NODE_ENV === 'production') {
        console.log('⚠️ Starting without database connection');
      } else {
        throw dbError;
      }
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`❤️ Health Check: http://localhost:${PORT}/health`);
      console.log(`🔐 Register: http://localhost:${PORT}/api/auth/register`);
      console.log(`🔐 Direct Test: http://localhost:${PORT}/api/direct-test`);
      console.log('✅ Routes mounted: /api/auth, /api/users, /api/nutrition, /api/workouts, etc.');
      console.log('🌐 CORS Enabled for:');
      console.log('   - fitlifetracker-v1.vercel.app');
      console.log('   - fitlifetracker-v1-git-main-john-devs-projects-dc2575c3.vercel.app');
      console.log('   - fitlifetracker-v1-6g8r5vj32-john-devs-projects-dc2575c3.vercel.app');
      console.log('   - fit-lifetracker2.vercel.app');
      console.log('   - fit-lifetracker2-git-main-john-devs-projects-dc2575c3.vercel.app');
      console.log('   - fit-lifetracker2-ia797omnc-john-devs-projects-dc2575c3.vercel.app');
      console.log('   - fitlifetracke-r-b2cd.vercel.app');
      console.log('   - All Vercel domains (.vercel.app)');
      console.log('   - Localhost:3000 and :5173');
      
      if (process.env.NODE_ENV === 'production') {
        console.log('🔒 Production mode: Database auto-sync disabled for safety');
        console.log('🔄 Set RUN_DB_SYNC=true to enable database synchronization');
      }
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
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