import express from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    getOrderHistory
} from '../controllers/orderController.js';

const router = express.Router();

router.route('/')
    .post(createOrder)
    .get(getOrders);

router.route('/:id')
    .get(getOrderById)
    .put(updateOrder)
    .delete(deleteOrder);

router.route('/:id/history')
    .get(getOrderHistory);

export default router;
