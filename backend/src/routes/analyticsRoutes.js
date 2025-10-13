import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  getDashboardData, 
  getNutritionAnalytics, 
  getWorkoutAnalytics, 
  getWeeklyComparisons 
} from '../controllers/analyticsController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/dashboard', getDashboardData);
router.get('/nutrition', getNutritionAnalytics);
router.get('/workouts', getWorkoutAnalytics);
router.get('/weekly-comparisons', getWeeklyComparisons);

export default router;