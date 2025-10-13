import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Nutrition = sequelize.define('Nutrition', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  foodName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  calories: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  protein: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  carbohydrates: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  fats: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  fiber: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  sugar: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  sodium: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  mealType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['breakfast', 'lunch', 'dinner', 'snack']]
    }
  },
  dateConsumed: {
    type: DataTypes.DATE,
    allowNull: false
  },
  portionSize: {
    type: DataTypes.FLOAT,
    defaultValue: 1
  },
  portionUnit: {
    type: DataTypes.STRING,
    defaultValue: 'serving'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

export default Nutrition;