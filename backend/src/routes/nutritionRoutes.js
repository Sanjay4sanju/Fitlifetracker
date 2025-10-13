import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  addNutritionEntry, 
  getNutritionEntries, 
  getNutritionStats, 
  updateNutritionEntry, 
  deleteNutritionEntry,
  getWeeklyComparison 
} from '../controllers/nutritionController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', addNutritionEntry);
router.get('/', getNutritionEntries);
router.get('/stats', getNutritionStats);
router.get('/weekly-comparison', getWeeklyComparison);
router.put('/:id', updateNutritionEntry);
router.delete('/:id', deleteNutritionEntry);

export default router;