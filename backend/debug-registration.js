import axios from 'axios';

const testRegistration = async () => {
  try {
    console.log('Testing registration...');
    
    const response = await axios.post('http://localhost:5000/api/auth/register', {
      username: 'testuser2',
      firstName: 'Test',
      lastName: 'User', 
      email: 'test2@example.com',
      password: 'Password123!',
      height: 180,
      weight: 75,
      gender: 'male',
      dateOfBirth: '1995-02-10',
      fitnessGoal: 'weight_loss',  // Changed from 'fat_loss' to 'weight_loss'
      activityLevel: 'moderate'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });

    console.log('✅ Registration successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Registration failed:');
    
    if (error.response) {
      // Server responded with error status
      console.log('Status:', error.response.status);
      console.log('Error data:', error.response.data);
      console.log('Error details:', error.response.data.errors || error.response.data.message);
    } else if (error.request) {
      // No response received
      console.log('No response received:', error.request);
    } else {
      // Other error
      console.log('Error:', error.message);
    }
  }
};

testRegistration();