// index.js
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
const { createClient } = require('redis');
const http = require('http');
const socketIo = require('socket.io');

const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });


const redisClient = createClient();
redisClient.connect().catch(console.error);

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
    await subscriber.connect();

    await subscriber.subscribe('new-notification', (message) => {
        const notification = JSON.parse(message);
        io.emit('new-notification', notification);
    });

    await subscriber.subscribe('read-notification', (message) => {
        const notification = JSON.parse(message);
        io.emit('read-notification', notification);
    });
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
