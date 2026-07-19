import express from 'express';
import { runScheduler } from '../controllers/schedulerController.js';
import { verifySchedulerSecret } from '../middleware/verifyScheduler.js';

const router = express.Router();

// Route for /api/scheduler/run
router.post('/run', verifySchedulerSecret, runScheduler);

export default router;
