import { runSchedulerLogic } from '../services/schedulerService.js';


export const runScheduler = async (req, res) => {
    try {
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

/**
 * @desc    Get scheduler execution logs
 * @route   GET /api/scheduler/logs
 * @access  Public (or protected if needed)
 */
export const getSchedulerLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Import here to avoid circular dependency issues if any, or just at top
    // Since we didn't import SchedulerLog at the top of this controller, we can do it dynamically or add the import.
    // Let's assume we will add the import at the top of the file.
    
    // Using dynamic import since we can't easily replace the top of the file without knowing its exact state,
    // actually we know the state: it only imports runSchedulerLogic. Let's just import SchedulerLog inside for safety.
    const { default: SchedulerLog } = await import('../models/SchedulerLog.js');
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const logs = await SchedulerLog.find()
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
      
    const total = await SchedulerLog.countDocuments();
    
    return res.status(200).json({
      success: true,
      count: logs.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: logs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch logs",
      error: error.message
    });
  }
};
