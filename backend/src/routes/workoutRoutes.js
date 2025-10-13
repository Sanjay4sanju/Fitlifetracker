import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  addWorkoutEntry, 
  getWorkoutEntries, 
  getWorkoutStats, 
  updateWorkoutEntry, 
  deleteWorkoutEntry,
  getWeeklyComparison 
} from '../controllers/workoutController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', addWorkoutEntry);
router.get('/', getWorkoutEntries);
router.get('/stats', getWorkoutStats);
router.get('/weekly-comparison', getWeeklyComparison);
router.put('/:id', updateWorkoutEntry);
router.delete('/:id', deleteWorkoutEntry);

export default router;