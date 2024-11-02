import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

const ViewAssignedSubTasksScreen = ({ route }) => {
  const { issueId } = route.params;
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubTask, setSelectedSubTask] = useState(null); // Store selected sub-task for modal
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [reportLoading, setReportLoading] = useState(false); // Loading state for report data
  const [reportData, setReportData] = useState(null); // Store report data for the selected sub-task

  useEffect(() => {
    const fetchSubTasks = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubTasks(response.data.subTasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sub-tasks:', error);
        setIsLoading(false);
      }
    };
    fetchSubTasks();
  }, [issueId]);

  // Fetch report data for a specific sub-task
  const fetchReportData = async (subTaskId) => {
    const token = await AsyncStorage.getItem('token');
    setReportLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks/${subTaskId}/volunteer-reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(response.data.reports);
      setReportData(response.data.reports);
      setReportLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setReportLoading(false);
    }
  };

  // Handle opening the modal and fetching report data
  const handleViewReport = (subTaskId) => {
    setSelectedSubTask(subTaskId);
    fetchReportData(subTaskId);
    setModalVisible(true);
  };

  const renderSubTask = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Assigned To:</Text>
      <Text style={styles.cardText}>{item.assignedTo?.name || 'N/A'}</Text>
      <Text style={styles.cardTitle}>Description:</Text>
      <Text style={styles.cardText}>{item.description || 'No description provided'}</Text>
      <Text style={styles.cardTitle}>Status:</Text>
      <Text style={styles.status}>{item.status}</Text>
      <TouchableOpacity style={styles.viewReportButton} onPress={() => handleViewReport(item._id)}>
        <Text style={styles.viewReportButtonText}>View Report</Text>
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
      <Text style={styles.header}>Assigned Sub-Tasks</Text>
      <FlatList
        data={subTasks}
        renderItem={renderSubTask}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal to show report details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {reportLoading ? (
              <ActivityIndicator size="large" color="#aa18ea" />
            ) : (
              <ScrollView>
                <Text style={styles.modalHeader}>Report Details</Text>
                {reportData && reportData.length > 0 ? (
                  reportData.map((report, index) => (
                    <View key={index} style={styles.reportCard}>
                      <Text style={styles.reportText}>Reported By: {report.updatedBy.name}</Text>
                      <Text style={styles.reportText}>Description: {report.description}</Text>
                      <Text style={styles.reportText}>Date: {new Date(report.date).toLocaleString()}</Text>
                      {/* Render media if any */}
                      {report.media && report.media.length > 0 && (
                        <View>
                          <Text style={styles.reportText}>Media:</Text>
                          {report.media.map((mediaUri, i) => (
                            <Text key={i} style={styles.mediaText}>{mediaUri}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.noReportText}>No reports available for this sub-task.</Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 3,
  },
  cardText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 10,
  },
  status: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#aa18ea',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  viewReportButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  viewReportButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  reportCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reportText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  mediaText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  noReportText: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  closeButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ViewAssignedSubTasksScreen;
