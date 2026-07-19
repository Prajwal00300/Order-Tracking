import { runSchedulerLogic } from '../services/schedulerService.js';

/**
 * @desc    Run the order status scheduler
 * @route   POST /api/scheduler/run
 * @access  Private (Protected by x-scheduler-secret)
 */
export const runScheduler = async (req, res) => {
  try {
    // Business logic is fully encapsulated in the service
    await runSchedulerLogic();

    return res.status(200).json({
      success: true,
      message: "Scheduler executed successfully"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Scheduler execution failed",
      error: error.message
    });
  }
};
