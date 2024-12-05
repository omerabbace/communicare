// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
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
//         // console.log(session);
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
//     console.log(userId);
//     try {
//       const response = await axios.get(`${BASE_URL}/api/notificationsBackend/${userId}`,
//         {
//             headers: { Authorization: `Bearer ${token}` }
//         }
//        );
//       setNotifications(response.data);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     const token = await AsyncStorage.getItem('token');

//     try {
//       await axios.patch(`${BASE_URL}/api/notifications/${notificationId}`,
//         {
//             headers: { Authorization: `Bearer ${token}` }
//         }
//        );
      
//       fetchNotifications(); // Refresh the list
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   return (
//     <ScrollView>
//       {notifications.map((notification) => (
//         <TouchableOpacity
//           key={notification._id}
//           onPress={() => markAsRead(notification._id)}
//         >
//           <View
//             style={{
//               padding: 10,
//               backgroundColor: notification.isRead ? '#ddd' : '#fff',
//               marginBottom: 10,
//               borderRadius: 5,
//             }}
//           >
//             <Text style={{ fontWeight: 'bold' }}>{notification.title}</Text>
//             <Text>{notification.body}</Text>
//           </View>
//         </TouchableOpacity>
//       ))}
//     </ScrollView>
//   );
// };

// export default Notifications;



import React, { useEffect, useState } from 'react';
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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  const fetchUserId = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const { _id } = JSON.parse(session); // Assuming userSession contains userId
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
      {notifications.map((notification) => (
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
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  readNotification: {
    backgroundColor: '#e9ecef',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  notificationBody: {
    fontSize: 14,
    color: '#555',
  },
});

export default Notifications;
