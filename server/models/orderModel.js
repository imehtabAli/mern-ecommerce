const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true },
    },
    paymentStatus: {
        type: String, enum: ['pending', 'paid', 'failed'], default: 'pending'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    orderStatus: {
        type: String, enum: ['processing', 'shipped', 'delivered', 'cancelled'], default: 'processing'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);