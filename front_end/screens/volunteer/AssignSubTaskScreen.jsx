import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
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

  const handleAssignSubTask = async (volunteerId) => {
    const token = await AsyncStorage.getItem('token');
    const subTask = subTasks[volunteerId];

    try {
      const response = await axios.post(
        `${BASE_URL}/api/issueReporting/issues/${issueId}/assign-sub-task`,
        {
          assignedTo: volunteerId,
          description: subTask.description,
          media: []
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === 'Sub-task assigned successfully') {
        alert('Sub-task assigned successfully!');
        setSubTasks((prev) => ({
          ...prev,
          [volunteerId]: { name: '', description: '', images: [] }
        }));
      } else {
        alert(response.data.message || 'Failed to assign sub-task.');
      }
    } catch (error) {
      console.error('Error assigning sub-task:', error);
      alert('An error occurred while assigning the sub-task.');
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
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
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
        style={styles.input}
        multiline
      />
      <Button title="Assign Sub-task" onPress={() => handleAssignSubTask(item._id)} />
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
        <Button
          title="View Assigned Sub-Tasks"
          onPress={() => navigation.navigate('ViewAssignedSubTasksScreen', { issueId })}
        />
      </View>
      <FlatList
        data={volunteers}
        renderItem={renderVolunteer}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f0f0f0' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  header: { fontSize: 20, fontWeight: 'bold' },
  volunteerCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginVertical: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 8, borderColor: '#ddd', borderWidth: 1, marginVertical: 5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#f0f0f0" },
});

export default AssignSubTaskScreen;
