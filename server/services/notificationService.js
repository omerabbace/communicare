const admin = require('../firebase'); // Import Firebase Admin instance
const User = require('../model/User');

// Function to notify all volunteers using Firebase Cloud Messaging (FCM)
const notifyAllVolunteers = async (issueId) => {
  try {
    // Fetch all volunteers from the database
    const volunteers = await User.find({ role: 'volunteer' });

    // Get FCM tokens from volunteers and filter out empty tokens
    const tokens = volunteers
      .map(volunteer => volunteer.fcmToken) // Assume the FCM token is stored as fcmToken
      .filter(Boolean); // Filter out undefined or null tokens

    if (tokens.length === 0) {
      console.log('No volunteers with valid FCM tokens found.');
      return;
    }

    // Create the payload for the push notifications
    const payload = {
      notification: {
        title: 'New Volunteer Request',
        body: 'A new issue requires volunteers. Tap to join!',
      },
      data: { issueId: issueId.toString() }, // Custom data
    };

    // Send notifications via FCM
    const response = await admin.messaging().sendToDevice(tokens, payload);
    console.log('FCM notifications sent:', response);

  } catch (error) {
    console.error('Error in notifying volunteers:', error);
  }
};

module.exports = { notifyAllVolunteers };
