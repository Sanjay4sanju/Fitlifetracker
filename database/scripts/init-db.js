import dotenv from 'dotenv';
dotenv.config();

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Import after dotenv config
    const { sequelize } = await import('../src/models/index.js');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
    console.log('🎉 Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();