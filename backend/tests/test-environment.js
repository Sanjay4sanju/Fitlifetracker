// tests/test-environment.js
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set default test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.DB_NAME = 'fitlifetracker_test';
process.env.DB_USER = 'test_user';
process.env.DB_PASS = 'test_password';
process.env.DB_HOST = 'localhost';
process.env.DB_DIALECT = 'sqlite';