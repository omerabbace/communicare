// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import { BASE_URL } from '../../config';

// const AssignSubTaskScreen = ({ route }) => {
//   const { issueId } = route.params;
//   const [volunteers, setVolunteers] = useState([]);
//   const [subTasks, setSubTasks] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const fetchVolunteers = async () => {
//       const token = await AsyncStorage.getItem('token');
//       try {
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/issue/${issueId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setVolunteers(response.data.issue.assignedVolunteers); 
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching volunteers:', error);
//         setIsLoading(false);
//       }
//     };
//     fetchVolunteers();
//   }, [issueId]);

//   const handleAssignSubTask = async (volunteerId) => {
//     const token = await AsyncStorage.getItem('token');
//     const subTask = subTasks[volunteerId];

//     try {
//       const response = await axios.post(
//         `${BASE_URL}/api/issueReporting/issues/${issueId}/assign-sub-task`,
//         {
//           assignedTo: volunteerId,
//           description: subTask.description,
//           media: []
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.message === 'Sub-task assigned successfully') {
//         alert('Sub-task assigned successfully!');
//         setSubTasks((prev) => ({
//           ...prev,
//           [volunteerId]: { name: '', description: '', images: [] }
//         }));
//       } else {
//         alert(response.data.message || 'Failed to assign sub-task.');
//       }
//     } catch (error) {
//       console.error('Error assigning sub-task:', error);
//       alert('An error occurred while assigning the sub-task.');
//     }
//   };

//   const handleInputChange = (volunteerId, field, value) => {
//     setSubTasks((prev) => ({
//       ...prev,
//       [volunteerId]: {
//         ...prev[volunteerId],
//         [field]: value,
//       },
//     }));
//   };

//   const renderVolunteer = ({ item }) => (
//     <View style={styles.volunteerCard}>
//       <Text>Name: {item.name}</Text>
//       <Text>Email: {item.email}</Text>
//       <TextInput
//         placeholder="Sub-task Name"
//         value={subTasks[item._id]?.name || ''}
//         onChangeText={(text) => handleInputChange(item._id, 'name', text)}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Description"
//         value={subTasks[item._id]?.description || ''}
//         onChangeText={(text) => handleInputChange(item._id, 'description', text)}
//         style={styles.input}
//         multiline
//       />
//       <Button title="Assign Sub-task" onPress={() => handleAssignSubTask(item._id)} />
//     </View>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.header}>Assign Sub-tasks</Text>
//         <Button
//           title="View Assigned Sub-Tasks"
//           onPress={() => navigation.navigate('View Assigned SubTasks', { issueId })}
//         />
//       </View>
//       <FlatList
//         data={volunteers}
//         renderItem={renderVolunteer}
//         keyExtractor={(item) => item._id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
//   headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
//   header: { fontSize: 20, fontWeight: 'bold' },
//   volunteerCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginVertical: 10 },
//   input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderColor: '#ddd', borderWidth: 1, marginVertical: 5 },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f0f0f0" },
// });

// export default AssignSubTaskScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config';

const AssignSubTaskScreen = ({ route }) => {
  const { issueId } = route.params;
  const [volunteers, setVolunteers] = useState([]);
  const [subTasks, setSubTasks] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/issue/${issueId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVolunteers(response.data.issue.assignedVolunteers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        setIsLoading(false);
      }
    };
    fetchVolunteers();
  }, [issueId]);

  // const handleAssignSubTask = async (volunteerId) => {
  //   const token = await AsyncStorage.getItem('token');
  //   const subTask = subTasks[volunteerId];

  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/api/issueReporting/issues/${issueId}/assign-sub-task`,
  //       {
  //         assignedTo: volunteerId,
  //         description: subTask.description,
  //         media: [],
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     if (response.data.message === 'Sub-task assigned successfully') {
  //       Alert.alert('Success', 'Sub-task assigned successfully!');
  //       setSubTasks((prev) => ({
  //         ...prev,
  //         [volunteerId]: { name: '', description: '', images: [] },
  //       }));
  //     } else {
  //       Alert.alert('Error', response.data.message || 'Failed to assign sub-task.');
  //     }
  //   } catch (error) {
  //     console.error('Error assigning sub-task:', error);
  //     Alert.alert('Error', 'An error occurred while assigning the sub-task.');
  //   }
  // };
  const handleAssignSubTask = async (volunteerId) => {
    const token = await AsyncStorage.getItem('token');
    const subTask = subTasks[volunteerId];
  
    try {
      // Assign the sub-task
      const response = await axios.post(
        `${BASE_URL}/api/issueReporting/issues/${issueId}/assign-sub-task`,
        {
          assignedTo: volunteerId,
          description: subTask.description,
          media: [],
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.message === 'Sub-task assigned successfully') {
        Alert.alert('Success', 'Sub-task assigned successfully!');
        setSubTasks((prev) => ({
          ...prev,
          [volunteerId]: { name: '', description: '', images: [] },
        }));
  
        // Send individual notification
        await sendNotification(volunteerId, subTask.description);
  
      } else {
        Alert.alert('Error', response.data.message || 'Failed to assign sub-task.');
      }
    } catch (error) {
      console.error('Error assigning sub-task:', error);
      Alert.alert('Error', 'An error occurred while assigning the sub-task.');
    }
  };
  
  // Helper function to send a notification
  const sendNotification = async (volunteerId, description) => {
    const token = await AsyncStorage.getItem('token');
  
    try {
      const notificationResponse = await axios.post(
        `${BASE_URL}/api/notificationsBackend`, // Backend endpoint to create notification
        {
          userId: volunteerId, // The volunteer ID
          title: 'New Sub-task Assigned',
          body: `A new sub-task has been assigned: "${description}".`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log('Notification sent:', notificationResponse.data);
    } catch (error) {
      console.error('Error sending notification:', error);
      Alert.alert('Error', 'An error occurred while sending the notification.');
    }
  };
  

  const handleInputChange = (volunteerId, field, value) => {
    setSubTasks((prev) => ({
      ...prev,
      [volunteerId]: {
        ...prev[volunteerId],
        [field]: value,
      },
    }));
  };

  const renderVolunteer = ({ item }) => (
    <View style={styles.volunteerCard}>
      <Text style={styles.volunteerName}>{item.name}</Text>
      <Text style={styles.volunteerEmail}>{item.email}</Text>
      <TextInput
        placeholder="Sub-task Name"
        value={subTasks[item._id]?.name || ''}
        onChangeText={(text) => handleInputChange(item._id, 'name', text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={subTasks[item._id]?.description || ''}
        onChangeText={(text) => handleInputChange(item._id, 'description', text)}
        style={[styles.input, styles.descriptionInput]}
        multiline
      />
      <TouchableOpacity
        style={styles.assignButton}
        onPress={() => handleAssignSubTask(item._id)}
      >
        <Text style={styles.assignButtonText}>Assign Sub-task</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Assign Sub-tasks</Text>
        <TouchableOpacity
          style={styles.viewSubTasksButton}
          onPress={() => navigation.navigate('View Assigned SubTasks', { issueId })}
        >
          <Text style={styles.viewSubTasksButtonText}>View Sub-Tasks</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={volunteers}
        renderItem={renderVolunteer}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  viewSubTasksButton: {
    backgroundColor: '#aa18ea',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewSubTasksButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 80, // Space for bottom padding
  },
  volunteerCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  volunteerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  volunteerEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  descriptionInput: {
    height: Platform.OS === 'ios' ? 80 : 100,
    textAlignVertical: 'top',
  },
  assignButton: {
    backgroundColor: '#aa18ea',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
});

export default AssignSubTaskScreen;
