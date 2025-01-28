import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../helpers/Auth';
import { LinearGradient } from 'expo-linear-gradient';

const statusList = ['pending', 'accepted', 'pending approval', 'approved', 'canceled', 'completed'];

const VehicleIssuesList = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const navigation = useNavigation();
  const route = useRoute(); // Access route params
  const { userSession } = useContext(AuthContext);

  useEffect(() => {
    // Set the initial statusFilter from the navigation parameter
    const initialStatus = route.params?.status || 'pending';
    setStatusFilter(initialStatus);
  }, [route.params]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
          headers: { Authorization: `Bearer ${userSession.token}` },
        });

        if (response.data.success && response.data.data) {
          const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setReports(reportsArray);

          await AsyncStorage.setItem('reports', JSON.stringify(reportsArray));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        Alert.alert('Error', 'Failed to load reports. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [userSession.token]);

  const handleSelectReport = (reportId, status) => {
    navigation.navigate('ReportDetails', { reportId, category: status });
  };

  const filteredReports = reports.filter((report) => report.status === statusFilter);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vehicle Assistance Requests</Text>

      {/* Status List */}
      <View style={styles.filterWrapper}>
        <FlatList
          data={statusList}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === item && styles.selectedFilterButton,
              ]}
              onPress={() => setStatusFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === item && styles.selectedFilterButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Gap Between Filters and Cards */}
      <View style={styles.gap} />

      {/* Report Cards */}
      <View style={styles.cardContainer}>
        {filteredReports.length === 0 ? (
          <Text style={styles.noReportsText}>
            No reports available for {statusFilter} status.
          </Text>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reportCard}
                onPress={() => handleSelectReport(item.id, statusFilter)}
              >
                <LinearGradient
                  colors={['#aa18ea', '#e94057', '#f27121']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBackground}
                >
                  <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
                  <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
                  <Text style={styles.reportTextTitle}>Issue</Text>
                  <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  filterWrapper: {
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  gap: {
    height: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  selectedFilterButton: {
    backgroundColor: '#aa18ea',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedFilterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  gradientBackground: {
    padding: 20,
    borderRadius: 15,
  },
  reportTextTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 5,
  },
  reportTextValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  noReportsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleIssuesList;
