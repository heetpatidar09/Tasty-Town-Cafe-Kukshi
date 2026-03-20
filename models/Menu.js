const mongoose = require('mongoose');

// We use a generic Object type here because your frontend sends the entire nested masterMenu JSON
const menuSchema = new mongoose.Schema({
    menuData: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);