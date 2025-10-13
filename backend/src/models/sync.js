import { sequelize, User, Nutrition, Workout, Progress, UserPreferences, Notification } from './index.js';

const syncDatabase = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models
    if (process.env.NODE_ENV === 'production') {
      // In production, be more careful - don't force recreate
      await sequelize.sync({ alter: false });
      console.log('✅ Production database synchronized safely.');
    } else {
      // In development, use alter for convenience
      await sequelize.sync({ alter: true });
      console.log('✅ Development database synchronized with alterations.');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to sync database:', error);
    return false;
  }
};

export default syncDatabase;