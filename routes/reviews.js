const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Customer submits a new review
router.post('/', async (req, res) => {
    try {
        const { name, rating, comment } = req.body;
        
        const newReview = new Review({ name, rating, comment });
        await newReview.save();

        // 🚀 REAL-TIME MAGIC: Update the review feeds instantly
        const io = req.app.get('io');
        io.emit('new_review');

        res.status(201).json({ success: true, review: newReview });
    } catch (err) {
        res.status(500).json({ error: "Failed to submit review." });
    }
});

// Fetch all reviews for both Customer and Owner pages
router.get('/', async (req, res) => {
    try {
        // Fetch reviews sorted by newest first
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.status(200).json(reviews);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reviews." });
    }
});

module.exports = router;