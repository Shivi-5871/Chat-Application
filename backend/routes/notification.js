// routes/notification.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const Notification = require('../Models/notificationModel');
const router = express.Router();

// Route to create a notification
router.post('/', protect, async (req, res) => {
    const { user, chat, message } = req.body;

    try {
        const notification = await Notification.create({ user, chat, message });
        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get notifications for a user
router.get('/:userId', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.params.userId }).populate('chat');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
