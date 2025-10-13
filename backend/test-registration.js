import axios from 'axios';

const testRegistration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'Password123',
      height: 180,
      weight: 75,
      gender: 'male',
      dateOfBirth: '1990-01-01',
      fitnessGoal: 'muscle_gain',
      activityLevel: 'active'
    });

    console.log('✅ Registration successful:', response.data);
  } catch (error) {
    console.log('❌ Registration failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

testRegistration();