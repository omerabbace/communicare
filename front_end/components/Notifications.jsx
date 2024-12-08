// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { BASE_URL } from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [userId, setUserId] = useState(null);

//   const fetchUserId = async () => {
//     try {
//       const session = await AsyncStorage.getItem('userSession');
//       if (session) {
//         const { _id } = JSON.parse(session); // Assuming userSession contains userId
//         setUserId(_id);
//       }
//     } catch (error) {
//       console.error('Error fetching user ID from storage:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUserId();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//     }
//   }, [userId]);

//   const fetchNotifications = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/notificationsBackend/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setNotifications(response.data);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     const token = await AsyncStorage.getItem('token');

//     try {
//       await axios.patch(
//         `${BASE_URL}/api/notificationsBackend/${notificationId}`,
//         null,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchNotifications(); // Refresh the list
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {notifications.map((notification) => (
//         <TouchableOpacity
//           key={notification._id}
//           onPress={() => markAsRead(notification._id)}
//           style={[
//             styles.notificationCard,
//             notification.isRead && styles.readNotification,
//           ]}
//         >
//           <Text style={styles.notificationTitle}>{notification.title}</Text>
//           <Text style={styles.notificationBody}>{notification.body}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#f8f9fa',
//     flexGrow: 1,
//   },
//   notificationCard: {
//     backgroundColor: '#ffffff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   readNotification: {
//     backgroundColor: '#e9ecef',
//   },
//   notificationTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   notificationBody: {
//     fontSize: 14,
//     color: '#555',
//   },
// });

// export default Notifications;

//// below is updated code

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import { BASE_URL } from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [userId, setUserId] = useState(null);

//   const fetchUserId = async () => {
//     try {
//       const session = await AsyncStorage.getItem('userSession');
//       if (session) {
//         const { _id } = JSON.parse(session); // Assuming userSession contains userId
//         setUserId(_id);
//       }
//     } catch (error) {
//       console.error('Error fetching user ID from storage:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUserId();
//   }, []);

//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//       const intervalId = setInterval(fetchNotifications, 2000);
//       return () => clearInterval(intervalId); // Clear interval on component unmount
//     }
//   }, [userId]);

//   const fetchNotifications = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/notificationsBackend/${userId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setNotifications(response.data);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     const token = await AsyncStorage.getItem('token');

//     try {
//       await axios.patch(
//         `${BASE_URL}/api/notificationsBackend/${notificationId}`,
//         null,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchNotifications(); // Refresh the list
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {notifications.map((notification) => (
//         <TouchableOpacity
//           key={notification._id}
//           onPress={() => markAsRead(notification._id)}
//           style={[
//             styles.notificationCard,
//             notification.isRead && styles.readNotification,
//           ]}
//         >
//           <Text style={styles.notificationTitle}>{notification.title}</Text>
//           <Text style={styles.notificationBody}>{notification.body}</Text>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//     backgroundColor: '#f4f4f4',
//     flexGrow: 1,
//   },
//   notificationCard: {
//     backgroundColor: '#ffffff',
//     padding: 20,
//     borderRadius: 12,
//     marginBottom: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     transition: 'transform 0.2s ease-in-out',
//   },
//   readNotification: {
//     backgroundColor: '#e3e8f0',
//     borderColor: '#c4cdd5',
//   },
//   notificationTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2c3e50',
//     marginBottom: 8,
//   },
//   notificationBody: {
//     fontSize: 15,
//     color: '#546e7a',
//   },
//   notificationCardHovered: {
//     transform: [{ scale: 1.05 }],
//   },
// });

// export default Notifications;


import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = React.createContext();

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);
  const { setHasUnreadNotifications } = useContext(NotificationContext);

  const fetchUserId = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const { _id } = JSON.parse(session); 
        setUserId(_id);
      }
    } catch (error) {
      console.error('Error fetching user ID from storage:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 2000);
      return () => clearInterval(intervalId); // Clear interval on component unmount
    }
  }, [userId]);

  const fetchNotifications = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        `${BASE_URL}/api/notificationsBackend/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(response.data);

      // Update unread state
      const hasUnread = response.data.some((notif) => !notif.isRead);
      setHasUnreadNotifications(hasUnread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = await AsyncStorage.getItem('token');

    try {
      await axios.patch(
        `${BASE_URL}/api/notificationsBackend/${notificationId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchNotifications(); // Refresh the list
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.noNotifications}>
          <Text style={styles.noNotificationsText}>No notifications</Text>
        </View>
      ) : (
        notifications.map((notification) => (
          <TouchableOpacity
            key={notification._id}
            onPress={() => markAsRead(notification._id)}
            style={[
              styles.notificationCard,
              notification.isRead && styles.readNotification,
            ]}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    transition: 'transform 0.2s ease-in-out',
  },
  readNotification: {
    backgroundColor: '#e3e8f0',
    borderColor: '#c4cdd5',
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  notificationBody: {
    fontSize: 15,
    color: '#546e7a',
  },
  noNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  noNotificationsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
  },
});

export default Notifications;
