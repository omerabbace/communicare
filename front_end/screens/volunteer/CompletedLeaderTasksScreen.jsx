import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

const CompletedLeaderTasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch completed leader tasks
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/leader/completed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data.issues);
        setTasks(response.data.issues);
      } catch (error) {
        console.error('Error fetching completed tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  // Render each task as a card
  const renderTaskCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text style={styles.info}>Leader: {item.leader?.name || 'N/A'}</Text>
      <Text style={styles.info}>Status: {item.status}</Text>
      <Text style={styles.info}>Volunteers:</Text>
      {item.assignedVolunteers.map((volunteer) => (
        <Text key={volunteer._id} style={styles.volunteerInfo}>
          - {volunteer.name} ({volunteer.email})
        </Text>
      ))}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
      > 
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.noTasksText}>No completed tasks found.</Text>}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  volunteerInfo: {
    fontSize: 14,
    color: '#444',
    marginLeft: 10,
  },
  detailsButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default CompletedLeaderTasksScreen;
