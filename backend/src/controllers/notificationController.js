import { Notification, User, UserPreferences, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get stored notifications from database
    const storedNotifications = await Notification.findAll({
      where: { 
        userId,
        expiresAt: {
          [Op.or]: [
            { [Op.gte]: new Date() },
            { [Op.is]: null }
          ]
        }
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Generate real-time notifications based on current data
    const realTimeNotifications = await generateRealTimeNotifications(userId);
    
    // Combine and deduplicate notifications
    const allNotifications = [...storedNotifications, ...realTimeNotifications];
    const uniqueNotifications = allNotifications.reduce((acc, current) => {
      const x = acc.find(item => item.key === current.key);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    // Sort by priority and date
    const sortedNotifications = uniqueNotifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] - priorityOrder[a.priority]) || 
             (new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp));
    });

    const unreadCount = sortedNotifications.filter(n => !n.isRead).length;

    res.json({
      notifications: sortedNotifications,
      unreadCount
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      message: 'Error fetching notifications',
      error: error.message 
    });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const notification = await Notification.findOne({
      where: { id, userId }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.markAsRead();
    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating notification',
      error: error.message 
    });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const count = await Notification.markAllAsRead(userId);
    
    res.json({ 
      message: `${count} notifications marked as read`,
      markedCount: count
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error marking notifications as read',
      error: error.message 
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const result = await Notification.destroy({
      where: { id, userId }
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting notification',
      error: error.message 
    });
  }
};

// Real-time notification generation
const generateRealTimeNotifications = async (userId) => {
  const notifications = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Get user preferences for notification settings
  const user = await User.findByPk(userId);
  const preferences = await user.getPreferences();
  
  if (!preferences.goalReminders) {
    return notifications; // Skip if user disabled goal reminders
  }

  // Get recent data
  const [recentWorkouts, recentNutrition, progressEntries] = await Promise.all([
    import('./Workout.js').then(m => m.default.findAll({
      where: { userId },
      order: [['datePerformed', 'DESC']],
      limit: 50
    })),
    import('./Nutrition.js').then(m => m.default.findAll({
      where: { userId },
      order: [['dateConsumed', 'DESC']],
      limit: 50
    })),
    import('./Progress.js').then(m => m.default.findAll({
      where: { userId },
      order: [['progressDate', 'DESC']],
      limit: 10
    }))
  ]);

  // Workout reminder
  const hasWorkoutToday = recentWorkouts.some(workout => 
    new Date(workout.datePerformed) >= today
  );

  if (!hasWorkoutToday && preferences.goalReminders) {
    notifications.push({
      key: `workout-reminder-${today.toISOString().split('T')[0]}`,
      type: 'reminder',
      title: 'Time for a workout!',
      message: "You haven't logged any exercise today. Stay consistent with your fitness goals.",
      priority: 'high',
      isRead: false,
      timestamp: now,
      metadata: { reminderType: 'daily_workout' }
    });
  }

  // Nutrition balance check
  const todayNutrition = recentNutrition.filter(nutrition => 
    new Date(nutrition.dateConsumed) >= today
  );

  const totalProtein = todayNutrition.reduce((sum, entry) => sum + (parseFloat(entry.protein) || 0), 0);
  if (totalProtein > 0 && totalProtein < 50 && preferences.goalReminders) {
    notifications.push({
      key: `protein-reminder-${today.toISOString().split('T')[0]}`,
      type: 'nutrition',
      title: 'Protein Intake Low',
      message: `You've consumed ${totalProtein.toFixed(1)}g protein today. Aim for at least 50g for optimal muscle recovery.`,
      priority: 'medium',
      isRead: false,
      timestamp: now,
      metadata: { currentProtein: totalProtein, goalProtein: 50 }
    });
  }

  // Progress tracking reminder
  const lastProgress = progressEntries[0];
  if (lastProgress && preferences.goalReminders) {
    const lastProgressDate = new Date(lastProgress.progressDate);
    const daysSinceProgress = Math.floor((now - lastProgressDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceProgress >= 7) {
      notifications.push({
        key: `progress-reminder-${lastProgressDate.toISOString().split('T')[0]}`,
        type: 'progress',
        title: 'Progress Check',
        message: `It's been ${daysSinceProgress} days since your last progress update. Track your measurements to see your progress!`,
        priority: 'medium',
        isRead: false,
        timestamp: now,
        metadata: { daysSinceLastProgress: daysSinceProgress }
      });
    }
  }

  // Weekly goal achievement
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weeklyWorkouts = recentWorkouts.filter(workout => 
    new Date(workout.datePerformed) >= weekStart
  );

  if (weeklyWorkouts.length >= preferences.weeklyWorkoutGoal && preferences.weeklyReports) {
    notifications.push({
      key: `weekly-goal-${weekStart.toISOString().split('T')[0]}`,
      type: 'achievement',
      title: 'Weekly Goal Achieved!',
      message: `Great job! You've completed ${weeklyWorkouts.length} workouts this week (goal: ${preferences.weeklyWorkoutGoal}). Keep up the momentum!`,
      priority: 'low',
      isRead: false,
      timestamp: now,
      metadata: { completedWorkouts: weeklyWorkouts.length, weeklyGoal: preferences.weeklyWorkoutGoal }
    });
  }

  return notifications;
};