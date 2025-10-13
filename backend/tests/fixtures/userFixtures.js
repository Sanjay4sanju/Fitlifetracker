export const mockUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Password123',
  firstName: 'Test',
  lastName: 'User',
  dateOfBirth: '1990-01-01',
  height: 175,
  weight: 70,
  gender: 'male',
  fitnessGoal: 'maintenance',
  activityLevel: 'moderate'
};

export const mockNutritionEntry = {
  foodName: 'Test Food',
  calories: 300,
  protein: 25,
  carbohydrates: 40,
  fats: 10,
  mealType: 'lunch',
  dateConsumed: new Date().toISOString()
};

export const mockWorkoutEntry = {
  workoutType: 'cardio',
  activityName: 'Running',
  duration: 30,
  caloriesBurned: 300,
  intensity: 'moderate',
  datePerformed: new Date().toISOString()
};