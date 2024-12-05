// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// function handleRegistrationError(errorMessage: string) {
//     alert(errorMessage);
//     throw new Error(errorMessage);
//   }
  
//   async function registerForPushNotificationsAsync() {
//     if (Platform.OS === 'android') {
//       Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//       });
//     }
  
//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;
//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }
//       if (finalStatus !== 'granted') {
//         handleRegistrationError('Permission not granted to get push token for push notification!');
//         return;
//       }
//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
//       if (!projectId) {
//         handleRegistrationError('Project ID not found');
//       }
//       try {
//         const pushTokenString = (
//           await Notifications.getExpoPushTokenAsync({
//             projectId,
//           })
//         ).data;
//         console.log(pushTokenString);
//         return pushTokenString;
//       } catch (e: unknown) {
//         handleRegistrationError(`${e}`);
//       }
//     } else {
//       handleRegistrationError('Must use physical device for push notifications');
//     }
//   }

//   export default registerForPushNotificationsAsync;

// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';

// function handleRegistrationError(errorMessage) {
//   alert(errorMessage);
//   throw new Error(errorMessage);
// }

// async function registerForPushNotificationsAsync() {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       handleRegistrationError('Permission not granted to get push token for push notifications!');
//       return;
//     }

//     const projectId =
//       Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;

//     if (!projectId) {
//       handleRegistrationError('Project ID not found');
//       return;
//     }

//     try {
//       const pushTokenString = (
//         await Notifications.getExpoPushTokenAsync({ projectId })
//       ).data;

//       console.log(pushTokenString);
//       return pushTokenString;
//     } catch (error) {
//       handleRegistrationError(`Error fetching push token: ${error}`);
//     }
//   } else {
//     handleRegistrationError('Must use a physical device for push notifications');
//   }
// }

// export default registerForPushNotificationsAsync;


import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Helper function for error handling
function handleRegistrationError(errorMessage) {
  alert(errorMessage);
  console.error(errorMessage);
}

// Function to register for push notifications
async function registerForPushNotificationsAsync() {
  // Set notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Ensure the device is physical
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      handleRegistrationError('Permission not granted for push notifications!');
      return null;
    }

    // Get the push token
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;

    if (!projectId) {
      handleRegistrationError('Expo Project ID not found!');
      return null;
    }

    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      return pushTokenString;
    } catch (error) {
      handleRegistrationError(`Failed to get push token: ${error}`);
      return null;
    }
  } else {
    handleRegistrationError('Must use a physical device for push notifications!');
    return null;
  }
}

export default registerForPushNotificationsAsync;

