import { Nutrition, Workout, Progress, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export class AnalyticsService {
  static async getDashboardData(userId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [nutritionStats, workoutStats, recentActivities] = await Promise.all([
      this.getNutritionStats(userId, sevenDaysAgo),
      this.getWorkoutStats(userId, sevenDaysAgo),
      this.getRecentActivities(userId)
    ]);

    return {
      nutritionStats,
      workoutStats,
      recentActivities
    };
  }

  static async getNutritionStats(userId, startDate) {
    const stats = await Nutrition.findAll({
      where: {
        userId,
        dateConsumed: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('dateConsumed')), 'date'],
        [sequelize.fn('SUM', sequelize.col('calories')), 'totalCalories'],
        [sequelize.fn('SUM', sequelize.col('protein')), 'totalProtein'],
        [sequelize.fn('SUM', sequelize.col('carbohydrates')), 'totalCarbs'],
        [sequelize.fn('SUM', sequelize.col('fats')), 'totalFats'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalEntries']
      ],
      group: [sequelize.fn('DATE', sequelize.col('dateConsumed'))],
      order: [[sequelize.fn('DATE', sequelize.col('dateConsumed')), 'DESC']]
    });

    return stats;
  }

  static async getWorkoutStats(userId, startDate) {
    const dailyStats = await Workout.findAll({
      where: {
        userId,
        datePerformed: { [Op.gte]: startDate }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('datePerformed')), 'date'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'workoutCount']
      ],
      group: [sequelize.fn('DATE', sequelize.col('datePerformed'))],
      order: [[sequelize.fn('DATE', sequelize.col('datePerformed')), 'DESC']]
    });

    const workoutTypeStats = await Workout.findAll({
      where: {
        userId,
        datePerformed: { [Op.gte]: startDate }
      },
      attributes: [
        'workoutType',
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'workoutCount']
      ],
      group: ['workoutType']
    });

    return { dailyStats, workoutTypeStats };
  }

  static async getRecentActivities(userId, limit = 10) {
    const nutritionActivities = await Nutrition.findAll({
      where: { userId },
      limit: Math.floor(limit / 2),
      order: [['dateConsumed', 'DESC']],
      attributes: ['id', 'foodName', 'calories', 'dateConsumed'],
      raw: true
    });

    const workoutActivities = await Workout.findAll({
      where: { userId },
      limit: Math.floor(limit / 2),
      order: [['datePerformed', 'DESC']],
      attributes: ['id', 'activityName', 'duration', 'caloriesBurned', 'datePerformed'],
      raw: true
    });

    const activities = [
      ...nutritionActivities.map(activity => ({
        ...activity,
        type: 'nutrition',
        timestamp: activity.dateConsumed
      })),
      ...workoutActivities.map(activity => ({
        ...activity,
        type: 'workout',
        timestamp: activity.datePerformed
      }))
    ];

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }
}