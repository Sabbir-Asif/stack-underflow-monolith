const express = require('express');
const mongoose = require('mongoose');
const Notification = require('./NotificationModel');
const notificationValidation = require('./NotificationValidation');
const router = express.Router();


router.get('/v1/notifications/search', async (req, res) => {
    try {
        const searchQuery = {};
        if (req.query.postId) searchQuery.postId = mongoose.Types.ObjectId(req.query.postId);
        if (req.query.userName) searchQuery.userName = { $regex: req.query.userName, $options: 'i' };
        if (req.query.userId) searchQuery.userId = mongoose.Types.ObjectId(req.query.userId);
        if (req.query.createdAt) searchQuery.createdAt = new Date(req.query.createdAt);
        const notifications = await Notification.find(searchQuery).populate('postId userId read');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post('/v1/notifications/', async (req, res) => {
    const { error } = notificationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/v1/notifications/', async (req, res) => {
    try {
        const notifications = await Notification.find().populate('postId userId read');
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.get('/v1/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id).populate('postId userId read');
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.put('/v1/notifications/:id', async (req, res) => {
    const { error } = notificationValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).populate('postId userId read');

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        res.status(200).json(notification);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


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
        res.status(500).json({ error: err.message });
    }
});


router.delete('/v1/notifications/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
