const express = require('express');
const mongoose = require('mongoose');
const Notification = require('./NotificationModel');
const notificationValidation = require('./NotificationValidation');
const { createClient } = require('redis');

const router = express.Router();
const redisClient = createClient();

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Failed to connect to Redis:', err.message);
    }
})();

// Search notifications with filters
router.get('/v1/notifications/search', async (req, res) => {
    try {
        const searchQuery = {};
        if (req.query.postId) searchQuery.postId = mongoose.Types.ObjectId(req.query.postId);
        if (req.query.userName) searchQuery.userName = { $regex: req.query.userName, $options: 'i' };
        if (req.query.userId) searchQuery.userId = mongoose.Types.ObjectId(req.query.userId);
        if (req.query.createdAt) searchQuery.createdAt = new Date(req.query.createdAt);

        const notifications = await Notification.find(searchQuery)
            .populate('postId userId read')
            .sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err.message);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// Create and broadcast a new notification
router.post('/v1/notifications/', async (req, res) => {
    const { error } = notificationValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const notification = new Notification(req.body);
        await notification.save();

        await redisClient.publish('new-notification', JSON.stringify(notification));
        res.status(201).json(notification);
    } catch (err) {
        console.error('Error creating notification:', err.message);
        res.status(500).json({ error: 'Failed to create notification' });
    }
});

// Fetch all notifications sorted by most recent
router.get('/v1/notifications/', async (req, res) => {
    try {
        const notifications = await Notification.find().sort({createdAt: -1}).populate('postId userId read');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch a specific notification by ID
router.get('/v1/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
            .populate('postId userId read');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (err) {
        console.error('Error fetching notification:', err.message);
        res.status(500).json({ error: 'Failed to fetch notification' });
    }
});

// Update notification details
router.put('/v1/notifications/:id', async (req, res) => {
    const { error } = notificationValidation(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('postId userId read');

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        res.status(200).json(notification);
    } catch (err) {
        console.error('Error updating notification:', err.message);
        res.status(500).json({ error: 'Failed to update notification' });
    }
});

// Mark a notification as read
router.put('/v1/notifications/:id/read', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (!notification.read.includes(req.body.userId)) {
            notification.read.push(req.body.userId);
            await notification.save();
        }

        res.status(200).json(notification);
    } catch (err) {
        console.error('Error marking notification as read:', err.message);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// Delete a notification
router.delete('/v1/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error('Error deleting notification:', err.message);
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});

module.exports = router;
