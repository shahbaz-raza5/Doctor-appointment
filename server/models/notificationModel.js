const mongoose = require('mongoose');

// Notification Schema
const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user
        ref: 'users',
        required: true,
    },
    notifications: {
        type: [String],  // Array of unseen notifications
        default: [],
    },
    seenNotifications: {
        type: [String],  // Array of seen notifications
        default: [],
    },
});

// Create and export the notification model
const notificationModel = mongoose.model('notifications', notificationSchema);
module.exports = notificationModel;
