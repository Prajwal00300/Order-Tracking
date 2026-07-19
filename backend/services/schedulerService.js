import Order from '../models/Order.js';
import OrderStatusHistory from '../models/OrderStatusHistory.js';
import SchedulerLog from '../models/SchedulerLog.js';

export const runSchedulerLogic = async () => {
    const startedAt = new Date();
    let ordersProcessed = 0;

    try {
        const TEN_MINUTES = 10 * 60 * 1000;
        const now = Date.now();

        const orders = await Order.find({ orderStatus: { $ne: 'DELIVERED' } });

        for (const order of orders) {
            const timeSinceLastUpdate = now - new Date(order.updatedAt).getTime();

            if (timeSinceLastUpdate > TEN_MINUTES) {
                const previousStatus = order.orderStatus;
                let newStatus = previousStatus;

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
