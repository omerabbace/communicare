const express = require('express');
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
} = require('../controllers/notificationBackend');
const { isLogin } = require('../middlewares/isLogin');

const router = express.Router();

// Route to create a notification
router.post('/',isLogin, createNotification);

// Route to get notifications for a specific user
router.get('/:userId',isLogin, getUserNotifications);

// Route to mark a notification as read
router.patch('/:id',isLogin, markNotificationAsRead);

module.exports = router;
