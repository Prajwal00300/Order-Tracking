import Order from '../models/Order.js';
import OrderStatusHistory from '../models/OrderStatusHistory.js';


export const createOrder = async (req, res) => {
    try {
        const { customerName, phone, productName, amount, paymentStatus, orderStatus } = req.body;

        const newOrder = new Order({
            customerName,
            phone,
            productName,
            amount,
            paymentStatus,
            orderStatus
        });


        const savedOrder = await newOrder.save();

        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: savedOrder
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};


export const getOrders = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 5 } = req.query;

        const query = {};
        if (status) {
            query.orderStatus = status;
        }
        
        if (search) {
            // Check if search string is a valid MongoDB ObjectId (24 hex characters)
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
            
            if (isObjectId) {
                query.$or = [
                    { _id: search },
                    { customerName: { $regex: search, $options: 'i' } }
                ];
            } else {
                query.customerName = { $regex: search, $options: 'i' };
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
        const total = await Order.countDocuments(query);

        return res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / parseInt(limit)),
            currentPage: parseInt(page),
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch orders',
            error: error.message
        });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch order',
            error: error.message
        });
    }
};


export const updateOrder = async (req, res) => {
    try {

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found for update'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            data: updatedOrder
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Failed to update order',
            error: error.message
        });
    }
};


export const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found for deletion'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            data: {}
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: Could not delete order',
            error: error.message
        });
    }
};

export const getOrderHistory = async (req, res) => {
    try {
        const history = await OrderStatusHistory.find({ orderId: req.params.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch order history',
            error: error.message
        });
    }
};
