const express = require('express');
require("dotenv").config();
const cors = require('cors');
const mongoConnection = require("./util/mongoConnection");
const users = require('./User/UserController');
const posts = require('./Posts/PostController');
const notifications = require('./Notifications/NotificationRouter');
const cron = require('node-cron');
const Notification = require('./Notifications/NotificationModel');
const { checkBucket } = require('./util/minioConnection');
const redis = require('redis');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Redis client configuration
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST || 'redis', // Ensure the service name is used as host
        port: parseInt(process.env.REDIS_PORT) || 6379
    }
});

// Handle Redis connection events
redisClient.on('error', (err) => console.log('Redis Client Error:', err));
redisClient.on('connect', () => console.log('Connected to Redis successfully'));

// Connect to Redis
(async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

app.use(express.json());
app.use(cors());

mongoConnection();
checkBucket();

app.get('/', (req, res) => res.send('server is running'));
app.use('/api', users);
app.use('/api', posts);
app.use('/api', notifications);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

(async function subscribeToRedis() {
    const subscriber = redisClient.duplicate();
    try {
        await subscriber.connect();
        
        await subscriber.subscribe('new-notification', (message) => {
            const notification = JSON.parse(message);
            io.emit('new-notification', notification);
        });

        await subscriber.subscribe('read-notification', (message) => {
            const notification = JSON.parse(message);
            io.emit('read-notification', notification);
        });
    } catch (error) {
        console.error('Error subscribing to Redis:', error);
    }
})();

cron.schedule('0 0 * * *', async () => {
    try {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = await Notification.deleteMany({ createdAt: { $lt: yesterday } });
        console.log(`Deleted ${result.deletedCount} old notifications`);
    } catch (err) {
        console.error('Error deleting old notifications:', err.message);
    }
});

server.listen(port, '0.0.0.0', () => console.log(`Server is running on port ${port}...`));
