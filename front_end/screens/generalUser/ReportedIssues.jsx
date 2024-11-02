import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import FullReportModal from './FullReportModal';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

const UserReportedIssuesScreen = ({ navigation }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchReportedIssues = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/user/reported-issues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(response.data.issues);
      } catch (error) {
        console.error('Error fetching reported issues:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportedIssues();
  }, []);

  const openReportModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const getFilteredIssues = () => {
    return issues.filter(issue => 
      (!filteredStatus || issue.status === filteredStatus) &&
      issue.description.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const renderIssueCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text style={styles.info}>Status: {item.status}</Text>
      <Text style={styles.info}>Reported On: {new Date(item.createdAt).toLocaleDateString()}</Text>
      {item.adminReport ? (
        <View style={styles.reportSection}>
          <Text style={styles.reportTitle}>Admin Report</Text>
          <Text style={styles.reportDescription}>{item.adminReport.description}</Text>
          <Text style={styles.reportDate}>Date: {new Date(item.adminReport.date).toLocaleDateString()}</Text>
        </View>
      ) : (
        <Text style={styles.noReportText}>No admin report available</Text>
      )}
      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => openReportModal(item.adminReport)}
      >
        <Text style={styles.detailsButtonText}>View Full Details</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#aa18ea" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar with Filter Icon */}
      <View style={styles.searchContainer}>

        <TextInput
          style={styles.searchBar}
          placeholder="Search issues..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.filterIcon} onPress={() => setDropdownOpen(!dropdownOpen)}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown */}
      {dropdownOpen && (
        <DropDownPicker
          open={dropdownOpen}
          value={filteredStatus}
          items={[
            { label: 'All', value: null },
            { label: 'Complete', value: 'completed' },
            { label: 'In Progress', value: 'in progress' },
            { label: 'Rejected', value: 'rejected' },
          ]}
          setOpen={setDropdownOpen}
          setValue={setFilteredStatus}
          placeholder="Filter by Status"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
        />
      )}

      {/* Issue List */}
      <FlatList
        data={getFilteredIssues()}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.noIssuesText}>No issues reported yet.</Text>}
      />

      {/* Full Report Modal */}
      {selectedReport && (
        <FullReportModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          adminReport={selectedReport}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterIcon: {
    padding: 8,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    marginBottom: 10,
    width: '100%',
    zIndex: 1000,
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
  },
  list: {
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  reportSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  reportDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 12,
    color: '#888',
  },
  noReportText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    fontStyle: 'italic',
  },
  detailsButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#aa18ea',
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
  noIssuesText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
});

export default UserReportedIssuesScreen;
