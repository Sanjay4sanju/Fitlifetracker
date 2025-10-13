import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  addProgressEntry, 
  getProgressEntries, 
  updateProgressEntry, 
  deleteProgressEntry,
  getWeeklyComparison 
} from '../controllers/progressController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', addProgressEntry);
router.get('/', getProgressEntries);
router.get('/weekly-comparison', getWeeklyComparison);
router.put('/:id', updateProgressEntry);
router.delete('/:id', deleteProgressEntry);

export default router;