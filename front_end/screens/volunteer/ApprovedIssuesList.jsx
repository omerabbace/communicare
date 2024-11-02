import React, { useEffect, useState,useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../helpers/Auth';
const IssueListScreen = () => {
  const navigation = useNavigation();
  const { setIsLeader, userSession } = useContext(AuthContext); 
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null); // To hold the selected issue details
  const [modalVisible, setModalVisible] = useState(false); // To manage modal visibility
  const [loading, setLoading] = useState(false); // To manage loading state for modal

  // Fetching data from backend (list of issues)
  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/issueReporting/issues/requiring-volunteers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIssues(data.issues); // Assuming the issues array is nested inside the data object
    };

    // Initial data fetch
    fetchData();

    // Set up interval to fetch data periodically 
    const interval = setInterval(() => {
      fetchData();
    }, 20000); 

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to handle issue card press and fetch details for the modal
  const handlePress = async (issueId) => {
    setLoading(true); // Set loading to true while fetching data
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/issueReporting/issue/${issueId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setSelectedIssue(data.issue); // Set the selected issue with full details
      setLoading(false); // Stop loading
      setModalVisible(true); // Open the modal
    } catch (error) {
      console.error('Error fetching issue details:', error);
      setLoading(false);
    }
  };

  // Function to handle "Accept" action
  const handleAccept = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/api/issueReporting/accept-volunteer`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ issueId: selectedIssue._id }),
      });
      
      const result = await response.json();
      if (response.ok) {
        alert('Issue accepted successfully!');
        setModalVisible(false);

        const currentUserId = userSession?._id; // Assuming userSession contains the current user's ID
        if (result.issue && result.issue.leader === currentUserId) {
          setIsLeader(true); // Set user as leader in context
          await AsyncStorage.setItem('isLeader', 'true'); // Store leader status in AsyncStorage
          navigation.navigate('pending Leader Tasks'); // Navigate to Leader Tasks screen
        } else {
          navigation.navigate('Manage Volunteers', { issueId: selectedIssue._id });
        }
      } else {
        alert(result.message || 'Failed to accept the issue.');
      }
    } catch (error) {
      console.error('Error accepting issue:', error);
    }
  };

  // Card component for each issue
  const renderCard = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item._id)} style={styles.card}>
      <Text style={styles.title}>Description: {item.description}</Text>
      <Text>Required Volunteers: {item.requiredVolunteers}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Created At: {new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={issues}
        renderItem={renderCard}
        keyExtractor={(item) => item._id}
      />

      {/* Modal for displaying issue details */}
      {selectedIssue && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)} // Close the modal on back press
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {loading ? (
                <ActivityIndicator size="large" color="#aa18ea" /> // Show loading indicator while fetching details
              ) : (
                <ScrollView>
                  <Text style={styles.modalTitle}>Issue Details</Text>
                  <Text>Issue Type: {selectedIssue.issueType}</Text>
                  <Text>Description: {selectedIssue.description}</Text>
                  <Text>Reported By: {selectedIssue.reportedBy.name}</Text>
                  <Text>Email: {selectedIssue.reportedBy.email}</Text>
                  <Text>Location: {selectedIssue.location.address}</Text>

                  {/* Media section */}
                  {selectedIssue.media && selectedIssue.media.length > 0 && (
                    <View>
                      <Text>Media:</Text>
                      {selectedIssue.media.map((file, index) => {
                        // Normalize the file URI by replacing backslashes with forward slashes
                        const normalizedUri = file.uri.replace(/\\/g, '/');
                        return (
                          <TouchableOpacity key={index} onPress={() => console.log({ uri: `${BASE_URL}/${normalizedUri}` })}>
                            <Image source={{ uri: `${BASE_URL}/${normalizedUri}` }} style={styles.mediaIcon} />
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* Accept and Close buttons */}
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleAccept} style={styles.acceptButton}>
                      <Text style={styles.buttonText}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mediaIcon: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: '#28a745', // Green for accept
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default IssueListScreen;
