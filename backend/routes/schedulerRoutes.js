import express from 'express';
import { runScheduler, getSchedulerLogs } from '../controllers/schedulerController.js';
import { verifySchedulerSecret } from '../middleware/verifyScheduler.js';

const router = express.Router();

// Route for /api/scheduler/run
router.post('/run', verifySchedulerSecret, runScheduler);

// Route for /api/scheduler/logs
router.get('/logs', getSchedulerLogs);

export default router;
