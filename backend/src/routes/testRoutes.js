import express from 'express';
import { testAPI, testDatabase, testAuth } from '../controllers/testController.js';

const router = express.Router();

router.get('/test', testAPI);
router.get('/test-db', testDatabase);
router.get('/auth-test', testAuth);

export default router;