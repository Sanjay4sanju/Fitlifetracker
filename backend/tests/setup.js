import dotenv from 'dotenv';
import { sequelize } from '../src/models/index.js';

// Load environment variables
dotenv.config();

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.JWT_EXPIRES_IN = '1h';

// Global test timeout
jest.setTimeout(30000);

beforeAll(async () => {
  try {
    console.log('Setting up test database...');
    
    // Sync all models
    await sequelize.sync({ force: true });
    
    console.log('Test database setup completed successfully');
  } catch (error) {
    console.error('Test database setup error:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Close database connection
    await sequelize.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
});