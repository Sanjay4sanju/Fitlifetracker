import { User, UserPreferences, Nutrition, Workout, Progress, Notification, sequelize } from '../models/index.js';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';

export const exportUserData = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all user data
    const [user, preferences, nutrition, workouts, progress, notifications] = await Promise.all([
      User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        raw: true
      }),
      UserPreferences.findOne({ where: { userId }, raw: true }),
      Nutrition.findAll({ where: { userId }, raw: true }),
      Workout.findAll({ where: { userId }, raw: true }),
      Progress.findAll({ where: { userId }, raw: true }),
      Notification.findAll({ where: { userId }, raw: true })
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        ...user,
        preferences
      },
      data: {
        nutrition: {
          count: nutrition.length,
          entries: nutrition
        },
        workouts: {
          count: workouts.length,
          entries: workouts
        },
        progress: {
          count: progress.length,
          entries: progress
        },
        notifications: {
          count: notifications.length,
          entries: notifications
        }
      },
      summary: {
        totalEntries: nutrition.length + workouts.length + progress.length,
        accountCreated: user.createdAt,
        lastLogin: user.lastLogin
      }
    };

    // Set headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="fitlifetracker-data-${userId}-${Date.now()}.json"`);
    
    res.send(JSON.stringify(exportData, null, 2));
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ 
      message: 'Error exporting user data',
      error: error.message 
    });
  }
};

export const deleteAccount = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const userId = req.userId;
    const { confirmation } = req.body;

    if (!confirmation || confirmation !== 'DELETE MY ACCOUNT') {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'Confirmation phrase is required to delete account. Please type "DELETE MY ACCOUNT" to confirm.' 
      });
    }

    // Find user first
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Permanently delete all user data in correct order to respect foreign key constraints
    await Notification.destroy({ where: { userId }, transaction });
    await Nutrition.destroy({ where: { userId }, transaction });
    await Workout.destroy({ where: { userId }, transaction });
    await Progress.destroy({ where: { userId }, transaction });
    await UserPreferences.destroy({ where: { userId }, transaction });
    
    // Finally, permanently delete the user
    await User.destroy({ 
      where: { id: userId },
      transaction 
    });

    await transaction.commit();

    res.json({ 
      message: 'Account and all associated data have been permanently deleted.',
      success: true
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Delete account error:', error);
    res.status(500).json({ 
      message: 'Error deleting account',
      error: error.message 
    });
  }
};

export const updatePreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    const preferences = await UserPreferences.findOne({ where: { userId } });
    if (!preferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    // Validate and update preferences
    const allowedFields = [
      'theme', 'weeklyReports', 'goalReminders', 'language', 
      'timezone', 'measurementSystem', 'dailyCalorieGoal', 
      'dailyProteinGoal', 'weeklyWorkoutGoal'
    ];

    const validUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        validUpdates[key] = updates[key];
      }
    });

    await preferences.update(validUpdates);

    res.json({ 
      message: 'Preferences updated successfully',
      preferences 
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ 
      message: 'Error updating preferences',
      error: error.message 
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Error changing password',
      error: error.message 
    });
  }
};

export const getPreferences = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const preferences = await user.getPreferences();
    res.json({ preferences });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ 
      message: 'Error fetching preferences',
      error: error.message 
    });
  }
};