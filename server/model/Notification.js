const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // User ID to associate the notification
  title: { type: String, required: true },  // Notification title
  body: { type: String, required: true },   // Notification message
  isRead: { type: Boolean, default: false }, // Whether the notification has been read
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = Notification;
