const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    customerUsername: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    type: { type: String, required: true }, // 'Dine-in' or 'Takeaway'
    items: [{
        name: String,
        price: Number,
        qty: Number,
        category: String
    }],
    preOrderFee: { type: Number, default: 0 },
    parcelCharge: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: { type: String, default: 'Pending' }, // Pending, Preparing, Completed, Delivered
    otp: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);