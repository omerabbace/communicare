const { Expo } = require('expo-server-sdk');
const User = require('../model/User');

// Create a new Expo SDK client
let expo = new Expo();

// Function to notify all volunteers using Expo Push Notifications
const notifyAllVolunteers = async (issueId) => {
  try {
    // Fetch all volunteers from the database
    const volunteers = await User.find({ role: 'volunteer' });

    // Create an array of messages to send to users
    const messages = volunteers
      .filter((volunteer) => Expo.isExpoPushToken(volunteer.expoPushToken)) // Ensure they have a valid Expo push token
      .map((volunteer) => ({
        to: volunteer.expoPushToken,
        sound: 'default',
        title: 'New Volunteer Request',
        body: 'A new issue requires volunteers. Tap to join!',
        data: { issueId: issueId.toString() },
      }));

    if (messages.length === 0) {
      console.log('No volunteers with valid Expo push tokens found.');
      return;
    }

    // Send notifications in chunks (Expo allows 100 notifications per chunk)
    const chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log('Expo push notification sent:', ticketChunk);
      } catch (error) {
        console.error('Error sending Expo push notifications:', error);
      }
    }
  } catch (error) {
    console.error('Error in notifying volunteers:', error);
  }
};

module.exports = { notifyAllVolunteers };
