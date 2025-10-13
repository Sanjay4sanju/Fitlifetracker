import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 30],
      is: /^[a-zA-Z0-9._-]+$/
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 100]
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
      is: /^[a-zA-Z\s]+$/
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 50],
      is: /^[a-zA-Z\s]+$/
    }
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: false
  },
  height: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 100,
      max: 250
    }
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 30,
      max: 300
    }
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['male', 'female', 'other']]
    }
  },
  fitnessGoal: {
    type: DataTypes.STRING,
    defaultValue: 'maintenance',
    validate: {
      isIn: [['weight_loss', 'muscle_gain', 'maintenance', 'endurance']]
    }
  },
  activityLevel: {
    type: DataTypes.STRING,
    defaultValue: 'moderate',
    validate: {
      isIn: [['sedentary', 'light', 'moderate', 'active', 'very_active']]
    }
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
  // Removed paranoid: true and deletedAt
});

User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default User;