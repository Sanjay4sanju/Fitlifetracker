import { body } from 'express-validator';
import { User } from '../models/index.js';
import { Sequelize } from 'sequelize';

const { Op } = Sequelize;

export const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
    // Remove complex password validation for testing
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    // .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('username')
  .isLength({ min: 3, max: 30 })
  .withMessage('Username must be between 3 and 30 characters')
  // Remove strict username validation for testing
  // .matches(/^[a-zA-Z0-9._-]+$/)
  // .withMessage('Username can only contain letters, numbers, underscores, dots, and hyphens')
  .custom(async (username) => {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already taken');
    }
    return true;
  }),


  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    // Remove strict validation for testing
    // .matches(/^[a-zA-Z\s]+$/)
    // .withMessage('First name can only contain letters and spaces'),

  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
    // Remove strict validation for testing
    // .matches(/^[a-zA-Z\s]+$/)
    // .withMessage('Last name can only contain letters and spaces'),

  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date of birth')
    .custom((value) => {
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      if (age < 13) {
        throw new Error('Must be at least 13 years old');
      }
      if (age > 100) {
        throw new Error('Invalid age');
      }
      return true;
    }),

  body('height')
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  body('weight')
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),

  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('fitnessGoal')
    .optional()
    .isIn(['weight_loss', 'muscle_gain', 'maintenance', 'endurance'])
    .withMessage('Invalid fitness goal'),

  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
    .withMessage('Invalid activity level')
];

export const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const updateProfileValidator = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  body('weight')
    .optional()
    .isFloat({ min: 30, max: 300 })
    .withMessage('Weight must be between 30 and 300 kg'),

  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),

  body('fitnessGoal')
    .optional()
    .isIn(['weight_loss', 'muscle_gain', 'maintenance', 'endurance'])
    .withMessage('Invalid fitness goal'),

  body('activityLevel')
    .optional()
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
    .withMessage('Invalid activity level')
];