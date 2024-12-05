// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';

// const VolunteerManagementScreen = ({isLeader}) => {
// //   const { issueId } = route.params;
// //   const { isLeader } = route.params;
// // console.log(isLeader);
//   const [volunteers, setVolunteers] = useState([]);
// //   const [isLeader, setIsLeader] = useState(false); // To check if the user is the team leader
//   const [subTask, setSubTask] = useState({
//     name: '',
//     description: '',
//     images: [],
//   });

// //   useEffect(() => {
// //     const fetchVolunteers = async () => {
// //       const token = await AsyncStorage.getItem('token');
// //       try {
// //         const response = await fetch(`${BASE_URL}/api/issueReporting/issue/${issueId}`, {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
        
// //         const data = await response.json();
// //         // console.log("dataaa", data);
// //         setVolunteers(data.issue.assignedVolunteers); // Assuming assignedVolunteers contains the volunteers
// //         setIsLeader(data.issue.leader === data.userId); // Check if the current user is the leader
// //       } catch (error) {
// //         console.error('Error fetching volunteers:', error);
// //       }
// //     };

// //     fetchVolunteers();
// //   }, [issueId]);

//   const handleAssignSubTask = async (volunteerId) => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const response = await fetch(`${BASE_URL}/api/issueReporting/assign-subtask`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           issueId,
//           volunteerId,
//           subTask,
//         }),
//       });

//       if (response.ok) {
//         alert('Sub-task assigned successfully!');
//         setSubTask({ name: '', description: '', images: [] }); // Clear sub-task fields
//       } else {
//         alert('Failed to assign sub-task.');
//       }
//     } catch (error) {
//       console.error('Error assigning sub-task:', error);
//     }
//   };

//   const renderVolunteer = ({ item }) => (
//     <View style={styles.volunteerCard}>
//       <Text>Name: {item.name}</Text>
//       <Text>Email: {item.email}</Text>
//       {isLeader && (
//         <View>
//           <TextInput
//             placeholder="Sub-task Name"
//             value={subTask.name}
//             onChangeText={(text) => setSubTask({ ...subTask, name: text })}
//             style={styles.input}
//           />
//           <TextInput
//             placeholder="Description"
//             value={subTask.description}
//             onChangeText={(text) => setSubTask({ ...subTask, description: text })}
//             style={styles.input}
//             multiline
//           />
//           {/* Add option for images here if needed */}
//           <Button
//             title="Assign Sub-task"
//             onPress={() => handleAssignSubTask(item._id)} // Assign sub-task to this volunteer
//           />
//         </View>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Volunteers</Text>
//       <FlatList
//         data={volunteers}
//         renderItem={renderVolunteer}
//         keyExtractor={(item) => item._id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: '#f0f0f0',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   volunteerCard: {
//     backgroundColor: 'white',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 2,
//     elevation: 4,
//   },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     borderRadius: 8,
//     marginVertical: 5,
//     borderColor: '#ddd',
//     borderWidth: 1,
//   },
// });

// export default VolunteerManagementScreen;
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const VolunteerManagementScreen = () => {
  const [volunteerIssues, setVolunteerIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const fetchVolunteerIssues = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(`${BASE_URL}/api/issueReporting/volunteer-issues`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerIssues(response.data.issues || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching volunteer issues:', error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchVolunteerIssues();
    }, [])
  );

  useEffect(() => {
    fetchVolunteerIssues();
    const interval = setInterval(fetchVolunteerIssues, 20000);
    return () => clearInterval(interval);
  }, []);

  const renderIssueCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Required Volunteers: {item.requiredVolunteers}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
      <TouchableOpacity
        style={styles.viewTasksButton}
        onPress={() => navigation.navigate('Volunteer SubTasks', { issueId: item._id })}
      >
        <Text style={styles.viewTasksButtonText}>View Tasks</Text>
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
      <Text style={styles.header}>Volunteer Tasks</Text>
      {volunteerIssues.length === 0 ? (
        <Text style={styles.noTasksText}>No volunteer tasks found</Text>
      ) : (
        <FlatList
          data={volunteerIssues}
          renderItem={renderIssueCard}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f0f0f0" },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f0f0f0" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  noTasksText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  viewTasksButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewTasksButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default VolunteerManagementScreen;
