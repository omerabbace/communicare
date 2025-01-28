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

//workin one below
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



// import { Platform } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // For managing stored tokens

// // Helper function for error handling
// function handleRegistrationError(errorMessage) {
//   alert(errorMessage);
//   console.error(errorMessage);
// }

// // Function to clear existing token for the user
// async function clearExistingToken(userId) {
//   try {
//     await AsyncStorage.removeItem(`pushToken_${userId}`);
//   } catch (error) {
//     console.error(`Failed to clear existing token for user ${userId}:`, error);
//   }
// }

// // Function to register for push notifications
// async function registerForPushNotificationsAsync(userId) {
//   // Validate the user ID
//   if (!userId) {
//     handleRegistrationError('User ID is required for push notification registration!');
//     return null;
//   }

//   // Set notification channel for Android
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   // Ensure the device is physical
//   if (Device.isDevice) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     // Request permissions if not already granted
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//       handleRegistrationError('Permission not granted for push notifications!');
//       return null;
//     }

//     // Get the push token
//     const projectId =
//       Constants?.expoConfig?.extra?.eas?.projectId || Constants?.easConfig?.projectId;

//     if (!projectId) {
//       handleRegistrationError('Expo Project ID not found!');
//       return null;
//     }

//     try {
//       // Clear existing token for the user (if needed)
//       await clearExistingToken(userId);

//       // Generate a new push token
//       const pushTokenString = (
//         await Notifications.getExpoPushTokenAsync({ projectId })
//       ).data;

//       // Save the token to AsyncStorage for reference
//       await AsyncStorage.setItem(`pushToken_${userId}`, pushTokenString);

//       console.log(`Generated new token for user ${userId}:`, pushTokenString);
//       return pushTokenString;
//     } catch (error) {
//       handleRegistrationError(`Failed to get push token: ${error}`);
//       return null;
//     }
//   } else {
//     handleRegistrationError('Must use a physical device for push notifications!');
//     return null;
//   }
// }

// // Function to retrieve the stored push token for a user
// async function getStoredPushToken(userId) {
//   try {
//     const token = await AsyncStorage.getItem(`pushToken_${userId}`);
//     return token;
//   } catch (error) {
//     console.error(`Failed to retrieve token for user ${userId}:`, error);
//     return null;
//   }
// }

// export { registerForPushNotificationsAsync, getStoredPushToken };
