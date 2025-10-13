import { Workout, User, sequelize } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import dayjs from 'dayjs'; 
export const addWorkoutEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      workoutType,
      activityName,
      duration,
      caloriesBurned,
      intensity,
      datePerformed,
      distance,
      distanceUnit,
      sets,
      reps,
      weight,
      weightUnit,
      heartRateAvg,
      heartRateMax,
      notes
    } = req.body;

    // Helper function to convert empty strings to null for numeric fields
    const sanitizeNumericField = (value) => {
      if (value === '' || value === null || value === undefined) {
        return null;
      }
      return value;
    };

    const workoutEntry = await Workout.create({
      userId: req.userId,
      workoutType,
      activityName,
      duration: sanitizeNumericField(duration),
      caloriesBurned: sanitizeNumericField(caloriesBurned),
      intensity: intensity || 'moderate',
      datePerformed: datePerformed || new Date(),
      distance: sanitizeNumericField(distance), // This was the problem field
      distanceUnit: distanceUnit || 'km',
      sets: sanitizeNumericField(sets),
      reps: sanitizeNumericField(reps),
      weight: sanitizeNumericField(weight),
      weightUnit: weightUnit || 'kg',
      heartRateAvg: sanitizeNumericField(heartRateAvg),
      heartRateMax: sanitizeNumericField(heartRateMax),
      notes
    });

    res.status(201).json({
      message: 'Workout entry added successfully',
      entry: workoutEntry
    });
  } catch (error) {
    console.error('Add workout error:', error);
    res.status(500).json({ 
      message: 'Error adding workout entry',
      error: error.message 
    });
  }
};

export const getWorkoutEntries = async (req, res) => {
  try {
    const { date, workoutType, startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { userId: req.userId };

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.datePerformed = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    if (startDate && endDate) {
      where.datePerformed = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (workoutType) {
      where.workoutType = workoutType;
    }

    const offset = (page - 1) * limit;

    const { count, rows: entries } = await Workout.findAndCountAll({
      where,
      order: [['datePerformed', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }]
    });

    const totalCaloriesBurned = await Workout.sum('caloriesBurned', { where }) || 0;
    const totalDuration = await Workout.sum('duration', { where }) || 0;

    res.json({
      entries,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCaloriesBurned,
      totalDuration
    });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ 
      message: 'Error fetching workout entries',
      error: error.message 
    });
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Workout.findAll({
      where: {
        userId: req.userId,
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

    const workoutTypeStats = await Workout.findAll({
      where: {
        userId: req.userId,
        datePerformed: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'workoutType',
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'workoutCount']
      ],
      group: ['workoutType'],
      raw: true
    });

    res.json({
      dailyStats: stats,
      workoutTypeStats,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get workout stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching workout statistics',
      error: error.message 
    });
  }
};

export const updateWorkoutEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const entry = await Workout.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Workout entry not found' });
    }

    await entry.update(req.body);

    res.json({
      message: 'Workout entry updated successfully',
      entry
    });
  } catch (error) {
    console.error('Update workout error:', error);
    res.status(500).json({ 
      message: 'Error updating workout entry',
      error: error.message 
    });
  }
};

export const deleteWorkoutEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Workout.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Workout entry not found' });
    }

    await entry.destroy();

    res.json({ message: 'Workout entry deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ 
      message: 'Error deleting workout entry',
      error: error.message 
    });
  }
};
export const getWeeklyComparison = async (req, res) => {
  try {
    const endDate = dayjs().endOf('day');
    const startDate = endDate.subtract(7, 'day').startOf('day');

    const weeklyData = await Workout.findAll({
      where: {
        userId: req.userId,
        datePerformed: {
          [Op.between]: [startDate.toDate(), endDate.toDate()]
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('datePerformed')), 'date'],
        [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration'],
        [sequelize.fn('SUM', sequelize.col('caloriesBurned')), 'totalCaloriesBurned'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'workoutCount']
      ],
      group: [sequelize.fn('DATE', sequelize.col('datePerformed'))],
      order: [[sequelize.fn('DATE', sequelize.col('datePerformed')), 'ASC']]
    });

    res.json({
      success: true,
      message: 'Weekly workout comparison retrieved successfully',
      data: weeklyData
    });
  } catch (error) {
    console.error('Get weekly comparison error:', error);
    res.status(500).json({
      message: 'Error fetching weekly comparison data',
      error: error.message
    });
  }
};