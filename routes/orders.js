const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Customer places a new order
router.post('/', async (req, res) => {
    try {
        const { customerUsername, name, phone, type, items, preOrderFee, parcelCharge, total } = req.body;
        
        // Generate a random 4-digit OTP for delivery verification
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Generate a unique Order ID (e.g., ORD-8472)
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

        const newOrder = new Order({
            orderId, customerUsername, name, phone, type, items, preOrderFee, parcelCharge, total, otp
        });

        await newOrder.save();

        // 🚀 REAL-TIME MAGIC: Alert the owner dashboard instantly!
        const io = req.app.get('io');
        io.emit('new_order');

        res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
        res.status(500).json({ error: "Failed to place order." });
    }
});

// Owner fetches all live orders
router.get('/', async (req, res) => {
    try {
        // Fetch all orders sorted by newest first
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch orders." });
    }
});

// Customer fetches their own order history
router.get('/history/:username', async (req, res) => {
    try {
        const orders = await Order.find({ customerUsername: req.params.username }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history." });
    }
});

// Owner updates the order status (Pending -> Preparing -> Completed -> Delivered)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        // Using returnDocument: 'after' to prevent the Mongoose warning
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { returnDocument: 'after' } 
        );
        
        if (order) {
            // 🚀 REAL-TIME MAGIC: Tell everyone the status changed
            const io = req.app.get('io');
            io.emit('order_status_updated');
            res.status(200).json({ success: true, order });
        } else {
            res.status(404).json({ error: "Order not found." });
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update status." });
    }
});

module.exports = router;