// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import { Alert } from 'react-native';

// // Function to request permission and get the push token
// export async function registerForPushNotificationsAsync(userId) {
//   let notiToken; 

//   // Check if the device supports push notifications
//   if (Constants.isDevice) {
//     try {
//       // Request permission for push notifications
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       console.log('Existing permission status:', existingStatus);
      
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       // If permission is granted, get the push token
//       if (finalStatus !== 'granted') {
//         Alert.alert('Failed to get push token for push notifications!');
//         console.log('Notification permissions were not granted.');
//         return;
//       }

//       // Get the Expo push token
//       notiToken = (await Notifications.getExpoPushTokenAsync()).data;
//       console.log('Expo Push Token:', notiToken);

//       if (notiToken) {
//         // Send the push token to your backend for the user
//         await sendPushTokenToServer(notiToken, userId);
//       } else {
//         console.log('Expo push token not available.');
//       }

//     } catch (error) {
//       console.error('Error getting push notification token:', error);
//     }
//   } else {
//     Alert.alert('Must use physical device for Push Notifications');
//   }

//   return notiToken;
// }

// // Function to send the push token to the server
// const sendPushTokenToServer = async (token, userId) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/users/save-push-token`, {
//       userId,
//       token
//     });
//     console.log('Push token saved successfully:', response.data);
//   } catch (error) {
//     console.error('Error saving push token:', error);
//   }
// };


import { messaging } from '../firebaseConfig'; // Import Firebase configuration
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to request permission and get FCM token
export async function registerForPushNotificationsAsync() {
  let fcmToken;

  // Request permission for notifications
  try {
    if (Platform.OS === 'android') {
      await messaging.requestPermission();
    } else if (Platform.OS === 'ios') {
      const authStatus = await messaging.requestPermission({
        alert: true,
        badge: true,
        sound: true,
      });
      if (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('Notification authorization status:', authStatus);
      } else {
        Alert.alert('Permission not granted for push notifications.');
        return;
      }
    }

    // Get the FCM token
    fcmToken = await messaging.getToken();
    console.log('FCM Token:', fcmToken);

    // Save the token to AsyncStorage
    await AsyncStorage.setItem('fcmToken', fcmToken);

  } catch (error) {
    console.error('Error getting FCM token:', error);
  }

  return fcmToken;
}
