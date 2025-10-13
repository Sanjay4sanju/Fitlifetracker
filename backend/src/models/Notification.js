import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['reminder', 'nutrition', 'progress', 'achievement', 'system']]
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium',
    validate: {
      isIn: [['low', 'medium', 'high']]
    }
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

Notification.prototype.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

Notification.getUnreadCount = function(userId) {
  return this.count({
    where: {
      userId,
      isRead: false
    }
  });
};

Notification.markAllAsRead = function(userId) {
  return this.update(
    { isRead: true },
    { where: { userId, isRead: false } }
  );
};

export default Notification;