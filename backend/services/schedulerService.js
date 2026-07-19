import Order from '../models/Order.js';
import OrderStatusHistory from '../models/OrderStatusHistory.js';
import SchedulerLog from '../models/SchedulerLog.js';

export const runSchedulerLogic = async () => {
  const startedAt = new Date();
  let ordersProcessed = 0;
  
  try {
    // 10 minutes in milliseconds
    const TEN_MINUTES = 10 * 60 * 1000;
    const now = Date.now();

    // Find all orders that are not DELIVERED
    const orders = await Order.find({ orderStatus: { $ne: 'DELIVERED' } });

    for (const order of orders) {
      // Check if order is older than 10 minutes (using updatedAt)
      const timeSinceLastUpdate = now - new Date(order.updatedAt).getTime();
      
      if (timeSinceLastUpdate > TEN_MINUTES) {
        const previousStatus = order.orderStatus;
        let newStatus = previousStatus;

        // Determine next status in flow
        switch (previousStatus) {
          case 'PLACED':
            newStatus = 'PROCESSING';
            break;
          case 'PROCESSING':
            newStatus = 'READY_TO_SHIP';
            break;
          case 'READY_TO_SHIP':
            newStatus = 'SHIPPED';
            break;
          case 'SHIPPED':
            newStatus = 'DELIVERED';
            break;
          default:
            // Do nothing if it's an unrecognized status or already DELIVERED
            break;
        }

        // If a state transition occurred
        if (newStatus !== previousStatus) {
          order.orderStatus = newStatus;
          
          // Using save() to ensure timestamps are updated automatically by Mongoose
          await order.save();

          // Log the status history
          await OrderStatusHistory.create({
            orderId: order._id,
            previousStatus,
            newStatus
          });

          ordersProcessed++;
        }
      }
    }

    // Record success log
    await SchedulerLog.create({
      startedAt,
      completedAt: new Date(),
      ordersProcessed,
      status: 'SUCCESS'
    });

  } catch (error) {
    console.error('Scheduler Service Error:', error);
    
    // Record failure log
    await SchedulerLog.create({
      startedAt,
      completedAt: new Date(),
      ordersProcessed,
      status: 'FAILED',
      error: error.message
    });

    throw error; // Let controller handle the error response
  }
};
