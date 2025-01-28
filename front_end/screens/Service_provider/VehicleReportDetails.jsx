import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../helpers/Auth';

// Helper function to delay requests
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch directions with throttling and caching
const fetchDirectionsWithThrottle = async (location, report, setDirectionCoords, updateReport) => {
  if (!location || !report?.location) {
    console.error('Missing location or report data.');
    return;
  }

  try {
    if (report.directionCoords?.length) {
      setDirectionCoords(report.directionCoords);
      return;
    }

    await delay(1000);

    const apiKey = '5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5';
    const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
      params: {
        api_key: apiKey,
        start: `${location.longitude},${location.latitude}`,
        end: `${report.location.longitude},${report.location.latitude}`,
      },
    });

    const coords = response.data.features[0].geometry.coordinates.map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

    const updatedReport = { ...report, directionCoords: coords };
    await updateReport(updatedReport);
    setDirectionCoords(coords);
  } catch (error) {
    console.error('Error fetching directions:', error);
    Alert.alert('Error', 'Failed to fetch directions.');
  }
};

const ReportDetailsScreen = ({ route, navigation }) => {
  const { reportId } = route.params;
  const { userSession } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [location, setLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [directionCoords, setDirectionCoords] = useState([]);
  const [price, setPrice] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [hasActiveRequest, setHasActiveRequest] = useState(false);

  // Check if service provider already has an active request
  useEffect(() => {
    const checkActiveRequest = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/vehicle-assistance/check-active-request`,
          {
            headers: { Authorization: `Bearer ${userSession.token}` },
          }
        );

        if (response.data.success) {
          setHasActiveRequest(response.data.hasActiveRequest);
        }
      } catch (error) {
        console.error('Error checking active request:', error);
        Alert.alert('Error', 'Failed to check active request status.');
      }
    };

    checkActiveRequest();
  }, [userSession.token]);

  // Fetch the report details from AsyncStorage
  useEffect(() => {
    const loadReport = async () => {
      try {
        const cachedReports = await AsyncStorage.getItem('reports');
        const reports = cachedReports ? JSON.parse(cachedReports) : [];
        const selectedReport = reports.find((r) => r.id === reportId);

        if (selectedReport) {
          setReport(selectedReport);
          setPrice(selectedReport.price || '');
          setIssueDescription(selectedReport.issueDescription || '');
          setDirectionCoords([]);
        } else {
          Alert.alert('Error', 'Report not found.');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Error loading report:', error);
        Alert.alert('Error', 'Failed to load report.');
      }
    };

    loadReport();
  }, [reportId]);

  // Fetch the current location and address
  useEffect(() => {
    const fetchLocationAndAddress = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required.');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        setLocation({ latitude, longitude });

        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: { lat: latitude, lon: longitude, format: 'json' },
        });
        setPickupAddress(response.data.display_name);
      } catch (error) {
        console.error('Error fetching location or address:', error);
        Alert.alert('Error', 'Failed to fetch location.');
      } finally {
        setMapLoading(false);
      }
    };

    fetchLocationAndAddress();
  }, []);

  // Update report in AsyncStorage and local state
  const updateReport = async (updatedReport) => {
    try {
      const cachedReports = await AsyncStorage.getItem('reports');
      const reports = cachedReports ? JSON.parse(cachedReports) : [];
      const updatedReports = reports.map((r) => (r.id === updatedReport.id ? updatedReport : r));
      await AsyncStorage.setItem('reports', JSON.stringify(updatedReports));
      setReport(updatedReport);
    } catch (error) {
      console.error('Error updating report in AsyncStorage:', error);
    }
  };

  // Handle status change
  // const handleStatusChange = async (newStatus) => {
  //   try {
  //     setLoading(true);

  //     if (newStatus === 'accepted' && hasActiveRequest) {
  //       Alert.alert(
  //         'Request Conflict',
  //         'You already have an active request. Complete it before accepting a new one.'
  //       );
  //       return;
  //     }

  //     let endpoint;
  //     let updatedReport = { ...report, status: newStatus, serviceProviderId: userSession._id };

  //     switch (newStatus) {
  //       case 'accepted':
  //         endpoint = `/select/${report.id}`;
  //         break;

  //       case 'pending approval':
  //         if (!price || isNaN(price)) {
  //           Alert.alert('Validation Error', 'Please enter a valid numeric price.');
  //           return;
  //         }
  //         endpoint = `/set-price/${report.id}`;
  //         updatedReport = { ...updatedReport, price: parseFloat(price), issueDescription };
  //         break;

  //       case 'inspection':
  //         updatedReport = { ...updatedReport, status: 'inspection' };
  //         await updateReport(updatedReport);
  //         Alert.alert('Success', 'Status updated to inspection');
  //         return;

  //       case 'completed':
  //         endpoint = `/complete/${report.id}`;
  //         break;

  //       default:
  //         throw new Error('Invalid status change');
  //     }

  //     const response = await axios.post(`${BASE_URL}/api/vehicle-assistance${endpoint}`, updatedReport, {
  //       headers: { Authorization: `Bearer ${userSession.token}` },
  //     });

  //     if (response.data.success) {
  //       await updateReport(updatedReport);
  //       Alert.alert('Success', `Status updated to ${newStatus}`);
  //     } else {
  //       throw new Error(response.data.message || 'Unknown server error');
  //     }
  //   } catch (error) {
  //     console.error(`Error updating status to ${newStatus}:`, error.response?.data || error.message);
  //     Alert.alert('Error', `Failed to update status to ${newStatus}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleStatusChange = async (newStatus) => {
    try {
      setLoading(true);
  
      if (newStatus === 'accepted' && hasActiveRequest) {
        Alert.alert(
          'Request Conflict',
          'You already have an active request. Complete it before accepting a new one.'
        );
        return;
      }
  
      let endpoint;
      let updatedReport = { ...report, status: newStatus, serviceProviderId: userSession._id };
  
      switch (newStatus) {
        case 'accepted':
          endpoint = `/select/${report.id}`;
          break;
  
        case 'pending approval':
          if (!price || isNaN(price)) {
            Alert.alert('Validation Error', 'Please enter a valid numeric price.');
            return;
          }
          endpoint = `/set-price/${report.id}`;
          updatedReport = { ...updatedReport, price: parseFloat(price), issueDescription };
          break;
  
        case 'inspection':
          updatedReport = { ...updatedReport, status: 'inspection' };
          await updateReport(updatedReport);
          Alert.alert('Success', 'Status updated to inspection');
          return;
  
        case 'completed':
          endpoint = `/complete/${report.id}`;
          break;
  
        default:
          throw new Error('Invalid status change');
      }
  
      const response = await axios.post(`${BASE_URL}/api/vehicle-assistance${endpoint}`, updatedReport, {
        headers: { Authorization: `Bearer ${userSession.token}` },
      });
  
      if (response.data.success) {
        // Update the local report state
        await updateReport(updatedReport);
        setReport(updatedReport);
  
        // Refresh the global reports in AsyncStorage
        const cachedReports = await AsyncStorage.getItem('reports');
        const reports = cachedReports ? JSON.parse(cachedReports) : [];
        const updatedReports = reports.map((r) =>
          r.id === updatedReport.id ? updatedReport : r
        );
  
        await AsyncStorage.setItem('reports', JSON.stringify(updatedReports));
  
        Alert.alert('Success', `Status updated to ${newStatus}`);
      } else {
        throw new Error(response.data.message || 'Unknown server error');
      }
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error.response?.data || error.message);
      Alert.alert('Error', `Failed to update status to ${newStatus}`);
    } finally {
      setLoading(false);
    }
  };
  

  // Render status buttons
  const renderStatusButton = () => {
    if (!report) return null;

    if (hasActiveRequest && report.status === 'pending') {
      return (
        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledButtonText}>
            You have an active request. Complete it first.
          </Text>
        </TouchableOpacity>
      );
    }

    switch (report.status) {
      case 'pending':
        return (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleStatusChange('accepted')}
            disabled={loading}
          >
            <Text style={styles.acceptButtonText}>Accept Request</Text>
          </TouchableOpacity>
        );

      case 'accepted':
        if (!directionCoords.length && location) {
          fetchDirectionsWithThrottle(location, report, setDirectionCoords, updateReport);
        }
        return (
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleStatusChange('inspection')}
            disabled={loading}
          >
            <Text style={styles.acceptButtonText}>Start Inspection</Text>
          </TouchableOpacity>
        );

      case 'inspection':
        return (
          <View style={styles.issueCard}>
            <TextInput
              placeholder="Describe issue"
              style={styles.input}
              value={issueDescription}
              onChangeText={setIssueDescription}
            />
            <TextInput
              placeholder="Enter repair price"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => handleStatusChange('pending approval')}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>Submit for Approval</Text>
            </TouchableOpacity>
          </View>
        );

      case 'pending approval':
        return <Text style={styles.statusMessage}>Request Pending Approval</Text>;

      case 'approved': // Show "Complete Work" button when approved
        return (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleStatusChange('completed')}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>Complete Work</Text>
          </TouchableOpacity>
        );

      case 'completed':
        return <Text style={styles.statusMessage}>Task Completed</Text>;

      default:
        return null;
    }
  };

  if (!report) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }
  const isInspectionStarted = report.status === 'inspection';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          {mapLoading ? (
            <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#aa18ea" />
          </View>
          ) : (
            <MapView
              style={styles.map}
              region={{
                latitude: location ? location.latitude : 37.78825,
                longitude: location ? location.longitude : -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {location && <Marker coordinate={location} title="Your Location" description={pickupAddress} />}
              {report.location && <Marker coordinate={report.location} title="Reported Location" />}
              {directionCoords.length > 0 && <Polyline coordinates={directionCoords} strokeWidth={3} strokeColor="blue" />}
            </MapView>
          )}
        </View>

        {/* <View style={[styles.detailsContainer, isInspectionStarted ? styles.inspectionStyle : styles.defaultStyle]}> */}
        <View style={[ isInspectionStarted ? styles.inspectionStyle : styles.detailsContainer]}>
          <Text style={styles.detailText}>Pickup Address: {pickupAddress || 'Loading...'}</Text>
          <Text style={styles.detailText}>Name: {report.name || 'N/A'}</Text>
          <Text style={styles.detailText}>Phone: {report.phone || 'N/A'}</Text>
          <Text style={styles.detailText}>Vehicle Reg No: {report.vehicleRegNo || 'N/A'}</Text>
          <Text style={styles.detailText}>Issue: {report.issueDescription || 'N/A'}</Text>
        </View>

        {renderStatusButton()}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  mapContainer: {
    height: '55%',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: 40,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  inspectionStyle: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginHorizontal: 15,
    marginTop: -95,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#4a4a4a',
    lineHeight: 22,
  },
  acceptButton: {
    backgroundColor: '#aa18ea',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  issueCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fafafa',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statusMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginHorizontal: 20,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  completeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  disabledButtonText: {
    color: '#777',
    fontSize: 16,
    fontWeight: '600',
  },
});


export default ReportDetailsScreen;
