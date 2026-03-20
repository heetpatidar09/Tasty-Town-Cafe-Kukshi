const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize App
const app = express();
const server = http.createServer(app);

// Initialize Socket.io for Real-Time Updates
const io = new Server(server, {
    cors: {
        origin: "*", // Allows your frontend to connect
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON data

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Database'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err);
        // On local Wi-Fi, this might still show an error, 
        // but it will work once it's on Render!
    });

// Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`💤 Client disconnected: ${socket.id}`);
    });
});

// Basic Test Route
app.get('/', (req, res) => {
    res.send('<h1 class="zstudent_class_18">Tasty Bites API is running...</h1>');
});

// Make 'io' accessible to our routes for real-time alerts
app.set('io', io);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});