export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_ENTRY: 'Entry already exists',
  DATABASE_ERROR: 'Database error occurred',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INTERNAL_SERVER_ERROR: 'Internal server error'
};

export const SUCCESS_MESSAGES = {
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESSFUL: 'Login successful',
  LOGOUT_SUCCESSFUL: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  ENTRY_CREATED: 'Entry created successfully',
  ENTRY_UPDATED: 'Entry updated successfully',
  ENTRY_DELETED: 'Entry deleted successfully'
};

export const NUTRITION_GOALS = {
  weight_loss: { protein: 30, carbs: 40, fats: 30 },
  muscle_gain: { protein: 35, carbs: 45, fats: 20 },
  maintenance: { protein: 25, carbs: 50, fats: 25 },
  endurance: { protein: 20, carbs: 60, fats: 20 }
};

export const WORKOUT_INTENSITY_MULTIPLIERS = {
  low: 3.5,
  moderate: 5.0,
  high: 7.0,
  very_high: 9.0
};

export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
};