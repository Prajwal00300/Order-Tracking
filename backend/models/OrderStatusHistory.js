import mongoose from 'mongoose';

const OrderStatusHistorySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  previousStatus: {
    type: String,
    required: true
  },
  newStatus: {
    type: String,
    required: true
  },
  changedAt: {
    type: Date,
    default: Date.now
  }
});

const OrderStatusHistory = mongoose.model('OrderStatusHistory', OrderStatusHistorySchema);

export default OrderStatusHistory;
