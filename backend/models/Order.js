import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
    {

        customerName: {
            type: String,
            required: [true, 'Customer name is required'],
            trim: true,
        },


        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },

        productName: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
        },

        amount: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount cannot be less than 0'],
        },

        paymentStatus: {
            type: String,
            enum: ['PENDING', 'PAID'],
            default: 'PENDING',
        },

        orderStatus: {
            type: String,
            enum: ['PLACED', 'PROCESSING', 'READY_TO_SHIP'],
            default: 'PLACED',
        },
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', OrderSchema);

export default Order;
