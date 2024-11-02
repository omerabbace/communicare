// exports.getNotificationsForVolunteer = asyncHandler(async (req, res, next) => {
//     const notifications = await Notification.find({ sentTo: req.user._id })
//       .sort({ sentAt: -1 }); // Sort by most recent
  
//     res.status(200).json({
//       success: true,
//       notifications,
//     });
//   });
  
//in issuereporting saving notfications in db 
// const Notification = require('../models/Notification'); // Assuming you have a Notification model

// async function notifyAllVolunteers(issueId) {
//   const volunteers = await Volunteer.find(); // Fetch all volunteers
//   const issue = await Issue.findById(issueId);

//   const message = {
//     title: 'New Volunteer Task',
//     body: `New task available for issue: ${issue.description}`,
//     data: { issueId: issue._id },
//   };

//   // Store notification in database
//   const notification = new Notification({
//     title: message.title,
//     body: message.body,
//     issueId: issue._id,
//     sentTo: volunteers.map(v => v._id),
//     sentAt: new Date(),
//   });
//   await notification.save();

//   // Send push notifications to volunteers using Expo or FCM
//   volunteers.forEach(volunteer => {
//     sendPushNotification(volunteer.expoPushToken, message); // You can use Expo SDK here
//   });
// }

// function sendPushNotification(expoPushToken, message) {
//   // Implementation of Expo push notification sending
// }
