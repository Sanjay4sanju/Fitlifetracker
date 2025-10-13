import { Nutrition, Workout, Progress, User, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.userId;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get workout statistics
    const workoutStats = await Workout.findAll({
      where: {
        userId: userId,
        datePerformed: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalWorkouts'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']
      ],
      raw: true
    });

    // Get nutrition statistics
    const nutritionStats = await Nutrition.findAll({
      where: {
        userId: userId,
        dateConsumed: {
          [Op.gte]: sevenDaysAgo
        }
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalEntries'],
        [sequelize.fn('SUM', sequelize.col('calories')), 'totalCalories'],
        [sequelize.fn('SUM', sequelize.col('protein')), 'totalProtein'],
        [sequelize.fn('SUM', sequelize.col('carbohydrates')), 'totalCarbs'],
        [sequelize.fn('SUM', sequelize.col('fats')), 'totalFats']
      ],
      raw: true
    });

    // Get progress statistics
    const progressStats = await Progress.findAll({
      where: {
        userId: userId
      },
      order: [['progressDate', 'DESC']],
      limit: 2,
      raw: true
    });

    // Calculate goal progress (simplified - you can enhance this based on user goals)
    let goalProgress = 0;
    if (progressStats.length >= 2) {
      const latestWeight = progressStats[0].weight;
      const previousWeight = progressStats[1].weight;
      // Simple progress calculation - adjust based on fitness goal
      goalProgress = Math.min(100, Math.max(0, ((previousWeight - latestWeight) / previousWeight) * 1000));
    }

    // Get recent activities (last 10 entries from all categories)
    const recentWorkouts = await Workout.findAll({
      where: { userId: userId },
      order: [['datePerformed', 'DESC']],
      limit: 5,
      raw: true
    });

    const recentNutrition = await Nutrition.findAll({
      where: { userId: userId },
      order: [['dateConsumed', 'DESC']],
      limit: 5,
      raw: true
    });

    const recentProgress = await Progress.findAll({
      where: { userId: userId },
      order: [['progressDate', 'DESC']],
      limit: 5,
      raw: true
    });

    // Combine and sort recent activities
    const recentActivities = [
      ...recentWorkouts.map(w => ({ ...w, type: 'workout', timestamp: w.datePerformed })),
      ...recentNutrition.map(n => ({ ...n, type: 'nutrition', timestamp: n.dateConsumed })),
      ...recentProgress.map(p => ({ ...p, type: 'progress', timestamp: p.progressDate }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    res.json({
      workoutStats: {
        totalWorkouts: parseInt(workoutStats[0]?.totalWorkouts) || 0,
        totalCaloriesBurned: parseFloat(workoutStats[0]?.totalCaloriesBurned) || 0,
        totalDuration: parseInt(workoutStats[0]?.totalDuration) || 0
      },
      nutritionStats: {
        totalEntries: parseInt(nutritionStats[0]?.totalEntries) || 0,
        totalCalories: parseFloat(nutritionStats[0]?.totalCalories) || 0,
        totalProtein: parseFloat(nutritionStats[0]?.totalProtein) || 0,
        totalCarbs: parseFloat(nutritionStats[0]?.totalCarbs) || 0,
        totalFats: parseFloat(nutritionStats[0]?.totalFats) || 0
      },
      goalProgress: Math.round(goalProgress),
      recentActivities
    });
  } catch (error) {
    console.error('Dashboard data error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard data',
      error: error.message 
    });
  }
};

export const getNutritionAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const userId = req.userId;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Nutrition.findAll({
      where: {
        userId: userId,
        dateConsumed: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('dateConsumed')), 'date'],
        [sequelize.fn('SUM', sequelize.col('calories')), 'totalCalories'],
        [sequelize.fn('SUM', sequelize.col('protein')), 'totalProtein'],
        [sequelize.fn('SUM', sequelize.col('carbohydrates')), 'totalCarbs'],
        [sequelize.fn('SUM', sequelize.col('fats')), 'totalFats']
      ],
      group: [sequelize.fn('DATE', sequelize.col('dateConsumed'))],
      order: [[sequelize.fn('DATE', sequelize.col('dateConsumed')), 'ASC']],
      raw: true
    });

    res.json({
      dailyStats: stats,
      period: `${days} days`
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching nutrition analytics',
      error: error.message 
    });
  }
};

export const getWorkoutAnalytics = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const userId = req.userId;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Workout.findAll({
      where: {
        userId: userId,
        datePerformed: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('datePerformed')), 'date'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'workoutCount']
      ],
      group: [sequelize.fn('DATE', sequelize.col('datePerformed'))],
      order: [[sequelize.fn('DATE', sequelize.col('datePerformed')), 'ASC']],
      raw: true
    });

    res.json({
      dailyStats: stats,
      period: `${days} days`
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching workout analytics',
      error: error.message 
    });
  }
};
export const getWeeklyComparisons = async (req, res) => {
  try {
    const userId = req.userId;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const workouts = await Workout.findAll({
      where: { userId, datePerformed: { [Op.gte]: sevenDaysAgo } },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']
      ],
      raw: true
    });

    const nutrition = await Nutrition.findAll({
      where: { userId, dateConsumed: { [Op.gte]: sevenDaysAgo } },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('calories')), 'totalCalories'],
        [sequelize.fn('SUM', sequelize.col('protein')), 'totalProtein']
      ],
      raw: true
    });

    res.json({ workouts: workouts[0], nutrition: nutrition[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching weekly comparisons', error: error.message });
  }
};
