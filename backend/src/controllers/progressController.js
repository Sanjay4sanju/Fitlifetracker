import { Progress, User } from '../models/index.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';

export const addProgressEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      weight,
      bodyFatPercentage,
      muscleMass,
      waistCircumference,
      chestCircumference,
      armCircumference,
      thighCircumference,
      progressDate,
      notes,
      mood,
      energyLevel
    } = req.body;

    const progressEntry = await Progress.create({
      userId: req.userId,
      weight,
      bodyFatPercentage,
      muscleMass,
      waistCircumference,
      chestCircumference,
      armCircumference,
      thighCircumference,
      progressDate: progressDate || new Date(),
      notes,
      mood,
      energyLevel
    });

    res.status(201).json({
      message: 'Progress entry added successfully',
      entry: progressEntry
    });
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({ 
      message: 'Error adding progress entry',
      error: error.message 
    });
  }
};

export const getProgressEntries = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 20 } = req.query;
    const where = { userId: req.userId };

    if (startDate && endDate) {
      where.progressDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: entries } = await Progress.findAndCountAll({
      where,
      order: [['progressDate', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: User,
        attributes: ['firstName', 'lastName']
      }]
    });

    res.json({
      entries,
      totalCount: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ 
      message: 'Error fetching progress entries',
      error: error.message 
    });
  }
};

export const updateProgressEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const entry = await Progress.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    await entry.update(req.body);

    res.json({
      message: 'Progress entry updated successfully',
      entry
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      message: 'Error updating progress entry',
      error: error.message 
    });
  }
};

export const deleteProgressEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Progress.findOne({
      where: { id, userId: req.userId }
    });

    if (!entry) {
      return res.status(404).json({ message: 'Progress entry not found' });
    }

    await entry.destroy();

    res.json({ message: 'Progress entry deleted successfully' });
  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ 
      message: 'Error deleting progress entry',
      error: error.message 
    });
  }
};
export const getWeeklyComparison = async (req, res) => {
  try {
    const { userId } = req;

    const now = new Date();
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay());
    const startOfPreviousWeek = new Date(startOfCurrentWeek);
    startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
    const endOfPreviousWeek = new Date(startOfCurrentWeek);

    const [prevWeekStats, currentWeekStats] = await Promise.all([
      Progress.findAll({
        where: {
          userId,
          progressDate: { [Op.between]: [startOfPreviousWeek, endOfPreviousWeek] }
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('weight')), 'avgWeight'],
          [sequelize.fn('AVG', sequelize.col('bodyFatPercentage')), 'avgBodyFat']
        ],
        raw: true
      }),
      Progress.findAll({
        where: {
          userId,
          progressDate: { [Op.gte]: startOfCurrentWeek }
        },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('weight')), 'avgWeight'],
          [sequelize.fn('AVG', sequelize.col('bodyFatPercentage')), 'avgBodyFat']
        ],
        raw: true
      })
    ]);

    res.json({
      previousWeek: prevWeekStats[0] || { avgWeight: 0, avgBodyFat: 0 },
      currentWeek: currentWeekStats[0] || { avgWeight: 0, avgBodyFat: 0 },
      message: 'Weekly progress comparison retrieved successfully'
    });
  } catch (error) {
    console.error('Get weekly progress comparison error:', error);
    res.status(500).json({
      message: 'Error fetching weekly progress comparison',
      error: error.message
    });
  }
};
