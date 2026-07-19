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
