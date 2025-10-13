import { Nutrition, User, sequelize } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import dayjs from 'dayjs';

export const addNutritionEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      foodName,
      calories,
      protein,
      carbohydrates,
      fats,
      fiber,
      sugar,
      sodium,
      mealType,
      dateConsumed,
      portionSize,
      portionUnit,
      notes
    } = req.body;

    const nutritionEntry = await Nutrition.create({
      userId: req.userId,
      foodName,
      calories,
      protein,
      carbohydrates,
      fats,
      fiber,
      sugar,
      sodium,
      mealType,
      dateConsumed,
      portionSize,
      portionUnit,
      notes
    });

    res.status(201).json({
      message: 'Nutrition entry added successfully',
      entry: nutritionEntry
    });
  } catch (error) {
    next(error);
  }
};

export const getNutritionEntries = async (req, res, next) => {
  try {
    const { date, mealType, startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { userId: req.userId };

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      where.dateConsumed = {
        [Op.between]: [startOfDay, endOfDay]
      };
    }

    if (startDate && endDate) {
      where.dateConsumed = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const offset = (page - 1) * limit;

    const { count, rows: entries } = await Nutrition.findAndCountAll({
      where,
      order: [['dateConsumed', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }]
    });

    const totalCalories = await Nutrition.sum('calories', { where });

    res.json({
      entries,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalCalories: totalCalories || 0
    });
  } catch (error) {
    next(error);
  }
};

export const getNutritionStats = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const stats = await Nutrition.findAll({
      where: {
        userId: req.userId,
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
      order: [[sequelize.fn('DATE', sequelize.col('dateConsumed')), 'ASC']]
    });

    const mealTypeStats = await Nutrition.findAll({
      where: {
        userId: req.userId,
        dateConsumed: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'mealType',
        [sequelize.fn('SUM', sequelize.col('calories')), 'totalCalories'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'entryCount']
      ],
      group: ['mealType']
    });

    res.json({
      dailyStats: stats,
      mealTypeStats,
      period: `${days} days`
    });
  } catch (error) {
    next(error);
  }
};

export const updateNutritionEntry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const entry = await Nutrition.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }

    await entry.update(req.body);

    res.json({
      message: 'Nutrition entry updated successfully',
      entry
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNutritionEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const entry = await Nutrition.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }

    await entry.destroy();

    res.json({ message: 'Nutrition entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
export const getWeeklyComparison = async (req, res, next) => {
  try {
    const userId = req.userId;

    // Define current week
    const startOfWeek = dayjs().startOf('week').toDate();
    const endOfWeek = dayjs().endOf('week').toDate();

    // Define last week
    const startOfLastWeek = dayjs().subtract(1, 'week').startOf('week').toDate();
    const endOfLastWeek = dayjs().subtract(1, 'week').endOf('week').toDate();

    // Fetch entries for both weeks
    const [currentWeekEntries, lastWeekEntries] = await Promise.all([
      Nutrition.findAll({
        where: {
          userId,
          dateConsumed: { [Op.between]: [startOfWeek, endOfWeek] }
        }
      }),
      Nutrition.findAll({
        where: {
          userId,
          dateConsumed: { [Op.between]: [startOfLastWeek, endOfLastWeek] }
        }
      })
    ]);

    // Helper functions to aggregate nutrition data
    const sumField = (entries, field) =>
      entries.reduce((sum, entry) => sum + (entry[field] || 0), 0);

    const summarize = (entries) => ({
      calories: sumField(entries, 'calories'),
      protein: sumField(entries, 'protein'),
      carbohydrates: sumField(entries, 'carbohydrates'),
      fats: sumField(entries, 'fats')
    });

    const currentWeek = summarize(currentWeekEntries);
    const lastWeek = summarize(lastWeekEntries);

    res.json({ currentWeek, lastWeek });
  } catch (error) {
    console.error('Error fetching weekly comparison:', error);
    next(error);
  }
};