// index.js
const express = require('express');
require("dotenv").config();
const cors = require('cors');
const mongoConnection = require("./util/mongoConnection");
const users = require('./User/UserController');
const posts = require('./Posts/PostController');
const notifications = require('./Notifications/NotificationRouter');
const { checkBucket } = require('./util/minioConnection');
const { createClient } = require('redis');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
mongoConnection();
checkBucket();

// Routes
app.get('/', (req, res) => res.send('server is running'));
app.use('/api', users);
app.use('/api', posts);
app.use('/api', notifications);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Listen for new notifications in Redis
(async function subscribeToRedis() {
    const subscriber = redisClient.duplicate();
    await subscriber.connect();

    // Subscribe to new-notification events
    await subscriber.subscribe('new-notification', (message) => {
        const notification = JSON.parse(message);
        io.emit('new-notification', notification);
    });

    // Subscribe to read-notification events
    await subscriber.subscribe('read-notification', (message) => {
        const notification = JSON.parse(message);
        io.emit('read-notification', notification); // Emit the read notification event
    });
})();


server.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}...`));
