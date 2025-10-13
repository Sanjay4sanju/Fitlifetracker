import sequelize from '../config/database.js';

// Import models
import User from './User.js';
import UserPreferences from './UserPreferences.js';
import Notification from './Notification.js';
import Nutrition from './Nutrition.js';
import Workout from './Workout.js';
import Progress from './Progress.js';

// Define associations
User.hasOne(UserPreferences, { foreignKey: 'userId', as: 'preferences' });
UserPreferences.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Nutrition, { foreignKey: 'userId' });
Nutrition.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Workout, { foreignKey: 'userId' });
Workout.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Progress, { foreignKey: 'userId' });
Progress.belongsTo(User, { foreignKey: 'userId' });

const models = {
  User,
  UserPreferences,
  Notification,
  Nutrition,
  Workout,
  Progress
};

export { 
  sequelize, 
  User, 
  UserPreferences, 
  Notification, 
  Nutrition, 
  Workout, 
  Progress 
};

export default models;