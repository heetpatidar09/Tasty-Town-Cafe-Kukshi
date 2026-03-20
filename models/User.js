const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // We will hash this later for security
    role: { type: String, default: 'customer' } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);