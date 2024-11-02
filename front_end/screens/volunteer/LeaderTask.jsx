import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';

const LeaderTaskScreen = () => {
  const [leaderIssues, setLeaderIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  // Fetch issues where the user is the leader
  useEffect(() => {
    const fetchLeaderIssues = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/leader-issues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeaderIssues(response.data.issues);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching leader issues:', error);
        setIsLoading(false);
      }
    };

    fetchLeaderIssues();
  }, []);

  const renderIssueCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Required Volunteers: {item.requiredVolunteers}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => navigation.navigate('assignSubtask', { issueId: item._id })}
        >
          <Text style={styles.buttonText}>Assign Task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportTaskScreen', { issueId: item._id })}
        >
          <Text style={styles.buttonText}>Report to Admin</Text>
        </TouchableOpacity>
      </View>
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
      <Text style={styles.header}>Leader Tasks</Text>
      <FlatList
        data={leaderIssues}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  assignButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  reportButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f0f0f0" },

});

export default LeaderTaskScreen;
