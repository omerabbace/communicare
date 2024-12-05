// import React, { useState, useEffect, useRef } from 'react';
// import * as Notifications from 'expo-notifications';
// import registerForPushNotificationsAsync from '../lib/notifications';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios'; // Assuming you're using Axios for API requests
// import { BASE_URL } from '../config'; // Your backend's base URL

// // Set notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// // NotificationProvider component
// const NotificationProvider = ({ children }) => {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(null);
//   const notificationListener = useRef();
//   const responseListener = useRef();

//   // Save push notification token to AsyncStorage and MongoDB
//   const savePushNotificationToken = async (token) => {
//     if (!token) return;

//     try {
//       // Retrieve the user session from AsyncStorage
//       const userSessionString = await AsyncStorage.getItem('userSession');
//       if (!userSessionString) {
//         console.log('No user session found');
//         return;
//       }

//       const userSession = JSON.parse(userSessionString);

//       // Update user session with the push token
//       userSession.pushNotificationToken = token;
//       await AsyncStorage.setItem('userSession', JSON.stringify(userSession));

//       // Send the push token to your backend API
//       await axios.post(
//         `${BASE_URL}/api/users/updatePushToken`, // Backend API endpoint
//         { pushNotificationToken: token }, // Request body
//         {
//           headers: {
//             Authorization: `Bearer ${userSession.token}`, // Include user token for authentication
//           },
//         }
//       );

//       console.log('Push token saved successfully');
//     } catch (error) {
//       console.error('Error saving push notification token:', error);
//     }
//   };

//   useEffect(() => {
//     // Register for push notifications
//     registerForPushNotificationsAsync()
//       .then((token) => {
//         if (token) {
//           setExpoPushToken(token);
//           console.log('Push token:', token);
//           savePushNotificationToken(token); // Save the token
//         }
//       })
//       .catch((error) => console.error('Error during notification registration:', error));

//     // Listen for notifications
//     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
//       setNotification(notification);
//       console.log('Notification received:', notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log('Notification response received:', response);
//     });

//     // Cleanup listeners on unmount
//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(notificationListener.current);
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//     };
//   }, []);

//   return <>{children}</>;
// };

// export default NotificationProvider;




// working below is the working code
// import React, { useState, useEffect, useRef } from 'react';
// import * as Notifications from 'expo-notifications';
// import registerForPushNotificationsAsync from '../lib/notifications';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL } from '../config';

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// const NotificationProvider = ({ children }) => {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState(null);
//   const notificationListener = useRef();
//   const responseListener = useRef();
//   const [userSession, setUserSession] = useState(null);

//   // Function to load the user session from AsyncStorage
//   const loadUserSession = async () => {
//     const sessionString = await AsyncStorage.getItem('userSession');
//     if (sessionString) {
//       const session = JSON.parse(sessionString);
//       setUserSession(session);
//     } else {
//       setUserSession(null);
//     }
//   };

//   // Save push notification token to AsyncStorage and MongoDB
//   const savePushNotificationToken = async (token) => {
//     if (!token || !userSession) return;

//     try {
//       // Update user session with the push token
//       const updatedSession = { ...userSession, pushNotificationToken: token };
//       await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));

//       // Send the push token to your backend API
//       await axios.post(
//         `${BASE_URL}/api/users/updatePushToken`, // Backend API endpoint
//         { pushNotificationToken: token }, // Request body
//         {
//           headers: {
//             Authorization: `Bearer ${userSession.token}`, // Include user token for authentication
//           },
//         }
//       );

//       console.log('Push token saved successfully');
//     } catch (error) {
//       console.error('Error saving push notification token:', error);
//     }
//   };

//   useEffect(() => {
//     // Load user session initially
//     loadUserSession();

//     // Listen for push notifications
//     notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
//       setNotification(notification);
//       console.log('Notification received:', notification);
//     });

//     responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log('Notification response received:', response);
//     });

//     // Cleanup listeners on unmount
//     return () => {
//       if (notificationListener.current) {
//         Notifications.removeNotificationSubscription(notificationListener.current);
//       }
//       if (responseListener.current) {
//         Notifications.removeNotificationSubscription(responseListener.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     // Register for push notifications and save the token when the session changes
//     if (userSession) {
//       registerForPushNotificationsAsync()
//         .then((token) => {
//           if (token) {
//             setExpoPushToken(token);
//             console.log('Push token:', token);
//             savePushNotificationToken(token); // Save the token per user session
//           }
//         })
//         .catch((error) => console.error('Error during notification registration:', error));
//     }
//   }, [userSession]); // Re-run whenever userSession changes

//   return <>{children}</>;
// };

// export default NotificationProvider;



import React, { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import registerForPushNotificationsAsync from '../lib/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../config';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [userSession, setUserSession] = useState(null);

  // Function to load the user session from AsyncStorage
  const loadUserSession = async () => {
    const sessionString = await AsyncStorage.getItem('userSession');
    if (sessionString) {
      const session = JSON.parse(sessionString);
      setUserSession(session);
    } else {
      setUserSession(null);
    }
  };

  // Save push notification token to AsyncStorage and MongoDB
  const savePushNotificationToken = async (token) => {
    if (!token || !userSession) return;
  
    try {
      // Check if the token is already saved
      if (userSession.pushNotificationToken === token) {
        console.log('Token already up-to-date, skipping save.');
        return;
      }
  
      // Update user session with the push token
      const updatedSession = { ...userSession, pushNotificationToken: token };
      await AsyncStorage.setItem('userSession', JSON.stringify(updatedSession));
  
      // Send the push token to your backend API
      await axios.post(
        `${BASE_URL}/api/users/updatePushToken`, // Backend API endpoint
        { pushNotificationToken: token }, // Request body
        {
          headers: {
            Authorization: `Bearer ${userSession.token}`, // Include user token for authentication
          },
        }
      );
  
      console.log('Push token saved successfully');
    } catch (error) {
      console.error('Error saving push notification token:', error);
    }
  };
  
  useEffect(() => {
    // Load user session initially
    loadUserSession();

    // Listen for push notifications
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response received:', response);
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    // Register for push notifications and save the token when the session changes
    if (userSession) {
      registerForPushNotificationsAsync()
        .then((token) => {
          if (token) {
            setExpoPushToken(token);
            console.log('Push token:', token);
            savePushNotificationToken(token); // Save the token per user session
          }
        })
        .catch((error) => console.error('Error during notification registration:', error));
    }
  }, [userSession]); // Re-run whenever userSession changes

  return <>{children}</>;
};

export default NotificationProvider;


