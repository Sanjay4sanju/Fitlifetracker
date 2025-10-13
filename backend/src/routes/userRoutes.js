import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { 
  exportUserData, 
  deleteAccount, 
  updatePreferences, 
  changePassword, 
  getPreferences 
} from '../controllers/userController.js';
import { validatePreferences, validateChangePassword } from '../validators/userValidators.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/preferences', getPreferences);
router.put('/preferences', validatePreferences, updatePreferences);
router.post('/change-password', validateChangePassword, changePassword);
router.get('/export', exportUserData);
router.delete('/account', deleteAccount);

export default router;