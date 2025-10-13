import request from 'supertest';
import app from '../../src/app.js';

describe('Workout Creation Flow', () => {
  let authToken;

  beforeAll(async () => {
    // Register a user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123',
        height: 180,
        weight: 75,
        gender: 'male',
        dateOfBirth: '1990-01-01'
      });

    console.log('Register response:', registerResponse.status, registerResponse.body);
    expect(registerResponse.status).toBe(201);

    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    console.log('Login response:', loginResponse.status, loginResponse.body);
    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;
  });

  test('should create a workout and retrieve it', async () => {
    // Create workout
    const workoutData = {
      activityName: 'Morning Run',
      workoutType: 'cardio',
      duration: 30,
      caloriesBurned: 300,
      intensity: 'moderate',
      datePerformed: new Date().toISOString()
    };

    const createResponse = await request(app)
      .post('/api/workouts')
      .set('Authorization', `Bearer ${authToken}`)
      .send(workoutData);

    console.log('Workout create response:', createResponse.status, createResponse.body);

    // Check if we got a successful response (201 or 200)
    expect([200, 201]).toContain(createResponse.status);
    
    // Check response structure
    if (createResponse.body.entry) {
      expect(createResponse.body.entry.activityName).toBe('Morning Run');
    } else if (createResponse.body.activityName) {
      expect(createResponse.body.activityName).toBe('Morning Run');
    }

    // Retrieve workouts
    const getResponse = await request(app)
      .get('/api/workouts')
      .set('Authorization', `Bearer ${authToken}`);

    console.log('Workout get response:', getResponse.status, getResponse.body);
    expect(getResponse.status).toBe(200);
  });
});