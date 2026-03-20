const express = require('express');
const router = express.Router();
const Menu = require('../models/Menu');

// Get the current Menu and Stock
router.get('/', async (req, res) => {
    try {
        const menu = await Menu.findOne();
        if (menu) {
            res.status(200).json(menu.menuData);
        } else {
            res.status(404).json(null); // If no menu in DB, frontend uses its default fallback
        }
    } catch (err) {
        res.status(500).json({ error: "Server error fetching menu." });
    }
});

// Owner saves new prices or stock levels
router.post('/', async (req, res) => {
    try {
        const { menuData } = req.body;
        
        let menu = await Menu.findOne();
        if (menu) {
            // Update existing menu
            menu.menuData = menuData;
            await menu.save();
        } else {
            // Create first menu entry
            menu = new Menu({ menuData });
            await menu.save();
        }
        
        // 🚀 REAL-TIME MAGIC: Tell all connected customers the menu changed!
        const io = req.app.get('io');
        io.emit('menu_updated', menuData);
        
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to save menu." });
    }
});

module.exports = router;