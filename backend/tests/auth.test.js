import request from 'supertest';
import app from '../src/app.js';

describe('Authentication API', () => {
  beforeEach(async () => {
    // Clean up will be handled by the force sync in setup.js
  });

  test('POST /api/auth/register should create a new user', async () => {
    const userData = {
      username: 'johndoe',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123',
      height: 180,
      weight: 75,
      gender: 'male',
      dateOfBirth: '1990-01-01'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    console.log('Register response:', response.status, response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('john@example.com');
  });

  test('POST /api/auth/login should authenticate user', async () => {
    // First create a user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'johndoe2',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john2@example.com',
        password: 'Password123',
        height: 180,
        weight: 75,
        gender: 'male',
        dateOfBirth: '1990-01-01'
      });

    expect(registerResponse.status).toBe(201);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john2@example.com',
        password: 'Password123'
      });

    console.log('Login response:', response.status, response.body);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});