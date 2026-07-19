import Order from '../models/Order.js';
import OrderStatusHistory from '../models/OrderStatusHistory.js';
import SchedulerLog from '../models/SchedulerLog.js';

export const runSchedulerLogic = async () => {
    const startedAt = new Date();
    let ordersProcessed = 0;

    try {
        const now = Date.now();

        // Find all orders that are eligible for automated status updates
        const orders = await Order.find({ orderStatus: { $in: ['PLACED', 'PROCESSING'] } });

        for (const order of orders) {
            // Determine the required time interval for the current status
            let requiredDurationMs;
            switch (order.orderStatus) {
                case 'PLACED':
                    requiredDurationMs = 10 * 60 * 1000; // 10 minutes
                    break;
                case 'PROCESSING':
                    requiredDurationMs = 20 * 60 * 1000; // 20 minutes
                    break;
                default:
                    continue; // Skip unrecognized statuses
            }

            // Check if order is older than the required duration (using updatedAt)
            const timeSinceLastUpdate = now - new Date(order.updatedAt).getTime();

            if (timeSinceLastUpdate > requiredDurationMs) {
                const previousStatus = order.orderStatus;
                let newStatus = previousStatus;

                switch (previousStatus) {
                    case 'PLACED':
                        newStatus = 'PROCESSING';
                        break;
                    case 'PROCESSING':
                        newStatus = 'READY_TO_SHIP';
                        break;
                    default:
                        break;
                }

                if (newStatus !== previousStatus) {
                    order.orderStatus = newStatus;

                    await order.save();

                    await OrderStatusHistory.create({
                        orderId: order._id,
                        previousStatus,
                        newStatus
                    });

                    ordersProcessed++;
                }
            }
        }

        await SchedulerLog.create({
            startedAt,
            completedAt: new Date(),
            ordersProcessed,
            status: 'SUCCESS'
        });

    } catch (error) {
        console.error('Scheduler Service Error:', error);

        await SchedulerLog.create({
            startedAt,
            completedAt: new Date(),
            ordersProcessed,
            status: 'FAILED',
            error: error.message
        });

        throw error;
    }
};
