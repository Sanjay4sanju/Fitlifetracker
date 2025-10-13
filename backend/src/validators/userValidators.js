import { body } from 'express-validator';

export const validatePreferences = [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('weeklyReports').optional().isBoolean(),
  body('goalReminders').optional().isBoolean(),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('timezone').optional().isLength({ min: 1, max: 50 }),
  body('measurementSystem').optional().isIn(['metric', 'imperial']),
  body('dailyCalorieGoal').optional().isInt({ min: 500, max: 10000 }),
  body('dailyProteinGoal').optional().isInt({ min: 0, max: 500 }),
  body('weeklyWorkoutGoal').optional().isInt({ min: 0, max: 20 })
];

export const validateChangePassword = [
  body('currentPassword').isLength({ min: 1 }).withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];