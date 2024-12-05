import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import FullReportModal from './FullReportModal'; // Adjust path as necessary

const CompletedLeaderTasksScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

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

  // Function to open the modal with the selected report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

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
        onPress={() => handleViewReport(item.adminReport)} // Replace with actual report field
      >
        <Text style={styles.detailsButtonText}>View Admin Report</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => navigation.navigate('TaskDetails', { taskId: item._id })}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity> */}
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#aa18ea" style={styles.loader} />;
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
      <FullReportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        adminReport={selectedReport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    elevation: 4, // Shadow for Android
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    fontWeight: 'bold', // Bold labels
    color: '#444',
    marginBottom: 8,
    lineHeight: 22,
  },
  volunteerInfo: {
    fontSize: 15,
    color: '#555',
    marginLeft: 15,
    marginBottom: 5,
    fontStyle: 'italic',
  },
  detailsButton: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#aa18ea', 
    alignItems: 'center',
    shadowColor: '#000', // Shadow properties for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // Shadow for Android
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTasksText: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
    fontSize: 18,
    fontStyle: 'italic',
  },
});


export default CompletedLeaderTasksScreen;
