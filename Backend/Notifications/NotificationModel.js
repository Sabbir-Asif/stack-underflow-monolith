const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StackUser',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
