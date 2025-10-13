import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  workoutType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['cardio', 'strength', 'flexibility', 'sports', 'other']]
    }
  },
  activityName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  caloriesBurned: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  intensity: {
    type: DataTypes.STRING,
    defaultValue: 'moderate',
    validate: {
      isIn: [['low', 'moderate', 'high', 'very_high']]
    }
  },
  datePerformed: {
    type: DataTypes.DATE,
    allowNull: false
  },
  distance: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  distanceUnit: {
    type: DataTypes.STRING,
    defaultValue: 'km'
  },
  sets: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reps: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  weightUnit: {
    type: DataTypes.STRING,
    defaultValue: 'kg'
  },
  heartRateAvg: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  heartRateMax: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Workout;