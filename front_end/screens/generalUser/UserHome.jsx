import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Counter from '../../components/Counter'; // Adjust the import path as necessary

const UserHome = ({ fullName, navigation }) => {
  const [complaints, setComplaints] = useState({
    total: 7,
    inProgress: 2,
    resolved: 1,
    pendingFeedbacks: 5,
    droppedFeedbacks: 5,
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcome}>Welcome, {fullName}</Text>
        <Text style={styles.header}>Communi Care</Text>
      </View>

      <View style={styles.complaintsContainer}>
        <Text style={styles.complaintsHeader}>My Complaints</Text>

        <View style={styles.countersContainer}>
          <Counter label="Total Complaints" count={complaints.total} />
          <Counter label="In Progress" count={complaints.inProgress} />
          <Counter label="Resolved" count={complaints.resolved} />
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('Report an Issue')} style={styles.newComplaintButton}>
        <Text style={styles.newComplaintButtonText}>Report an Issue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 10,
  },
  complaintsContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  complaintsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  countersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  newComplaintButton: {
    backgroundColor: '#aa18ea',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  newComplaintButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default UserHome;
