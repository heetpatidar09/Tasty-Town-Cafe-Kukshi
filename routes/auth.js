const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register a new customer
router.post('/register', async (req, res) => {
    try {
        const { name, phone, username, password } = req.body;
        
        // Create and save the new user to MongoDB
        const newUser = new User({ name, phone, username, password });
        await newUser.save();
        
        res.status(201).json({ user: newUser });
    } catch (err) {
        res.status(400).json({ error: "Username already exists or data is invalid." });
    }
});

// Login for customers and the owner
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hardcoded Owner Login (Since this is a single-owner cafe)
        if (username === 'admin' && password === 'admin123') {
            return res.status(200).json({ success: true, user: { username: 'admin', role: 'owner' } });
        }

        // Customer Login Check in Database
        const user = await User.findOne({ username, password });
        if (user) {
            res.status(200).json({ success: true, user });
        } else {
            res.status(401).json({ success: false, error: "Invalid username or password." });
        }
    } catch (err) {
        res.status(500).json({ error: "Server connection error." });
    }
});

module.exports = router;