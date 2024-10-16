import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Function to request permission and get the push token
export async function registerForPushNotificationsAsync() {
  let notiToken; 

  // Check if the device supports push notifications
  if (Constants.isDevice) {
    // Request permission for push notifications
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission is granted, get the push token
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notifications!');
      return;
    }

    notiToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', notiToken);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return notiToken;
}
