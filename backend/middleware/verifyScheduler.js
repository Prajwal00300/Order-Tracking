export const verifySchedulerSecret = (req, res, next) => {
  try {
    const secretKey = req.headers['x-scheduler-secret'];
    const expectedKey = process.env.SCHEDULER_SECRET;

    if (!secretKey || secretKey !== expectedKey) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Invalid scheduler secret'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error in Scheduler Middleware'
    });
  }
};
