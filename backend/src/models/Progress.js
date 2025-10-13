import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 30,
      max: 300
    }
  },
  bodyFatPercentage: {
    type: DataTypes.FLOAT,
    validate: {
      min: 5,
      max: 50
    }
  },
  muscleMass: {
    type: DataTypes.FLOAT
  },
  waistCircumference: {
    type: DataTypes.FLOAT
  },
  chestCircumference: {
    type: DataTypes.FLOAT
  },
  armCircumference: {
    type: DataTypes.FLOAT
  },
  thighCircumference: {
    type: DataTypes.FLOAT
  },
  progressDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mood: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['very_poor', 'poor', 'neutral', 'good', 'excellent']]
    }
  },
  energyLevel: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isIn: [['very_low', 'low', 'medium', 'high', 'very_high']]
    }
  }
});

export default Progress;