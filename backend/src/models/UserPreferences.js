import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const UserPreferences = sequelize.define('UserPreferences', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  theme: {
    type: DataTypes.STRING,
    defaultValue: 'light',
    validate: {
      isIn: [['light', 'dark', 'auto']]
    }
  },
  weeklyReports: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  goalReminders: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en'
  },
  timezone: {
    type: DataTypes.STRING,
    defaultValue: 'UTC'
  },
  measurementSystem: {
    type: DataTypes.STRING,
    defaultValue: 'metric',
    validate: {
      isIn: [['metric', 'imperial']]
    }
  },
  dailyCalorieGoal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  dailyProteinGoal: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weeklyWorkoutGoal: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
});

export default UserPreferences;