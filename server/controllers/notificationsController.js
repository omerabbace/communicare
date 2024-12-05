const User = require('../model/User');
const fetch = require('node-fetch'); // Import fetch for server-side requests

// const sendPushNotification = async (req, res) => {
//   const { userId, title, body, data } = req.body;

//   if (!userId || !title || !body) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   try {
//     // Retrieve the user's push notification token
//     const user = await User.findById(userId);

//     if (!user || !user.pushNotificationToken) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not found or does not have a push notification token',
//       });
//     }

//     const expoPushToken = user.pushNotificationToken;

//     // Construct the push notification message
//     const message = {
//       to: expoPushToken,
//       sound: 'default',
//       title: title,
//       body: body,
//       data: data || {}, // Optional additional data
//     };

//     // Send the push notification using Expo's service
//     const response = await fetch('https://exp.host/--/api/v2/push/send', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//         'Accept-encoding': 'gzip, deflate',
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(message),
//     });

//     if (!response.ok) {
//       const errorResponse = await response.json();
//       console.error('Error sending push notification:', errorResponse);
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to send push notification',
//         error: errorResponse,
//       });
//     }

//     res.json({ success: true, message: 'Push notification sent successfully' });
//   } catch (error) {
//     console.error('Error in sendPushNotification:', error);
//     res.status(500).json({ success: false, message: 'Internal server error' });
//   }
// };


// const sendPushNotification = async ({ userId, title, body, data }) => {
//     try {
//         // Retrieve the user's push notification token
//         const user = await User.findById(userId);

//         if (!user || !user.pushNotificationToken) {
//             console.error('User not found or no push notification token');
//             throw new Error('User not found or no push notification token');
//         }

//         const expoPushToken = user.pushNotificationToken; // Correctly get the Expo push token

//         // Send the push notification using Expo's service
//         const response = await fetch('https://exp.host/--/api/v2/push/send', {
//             method: 'POST',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 to: expoPushToken,  // Use the Expo push token
//                 sound: 'default',
//                 title: title,
//                 body: body,
//                 data: data || {}, // Optional additional data
//             }),
//         });

//         const responseData = await response.json(); // Read the response body

//         if (!response.ok) {
//             console.error('Error sending push notification:', responseData);
//             throw new Error(responseData.error || 'Unknown error');
//         }

//         console.log('Push notification sent successfully:', responseData);
//         return responseData; // Return response data for successful notification
//     } catch (error) {
//         console.error('Failed to send notification:', error);
//         throw error; // Re-throw to be caught by the calling function
//     }
// };


const sendPushNotification = async ({ userId, title, body, data }) => {
    try {
        const user = await User.findById(userId);

        if (!user || !user.pushNotificationToken) {
            throw new Error('User not found or no push notification token');
        }

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: user.pushNotificationToken,  // Send to the specific user's token
                sound: 'default',
                title,
                body,
                data,
            }),
        });
        

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error || 'Error sending notification');
        }

        console.log('Notification sent successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Failed to send notification:', error);
        throw error;
    }
};


module.exports = { sendPushNotification };
