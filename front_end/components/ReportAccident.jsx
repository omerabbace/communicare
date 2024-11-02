import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { AuthContext } from '../helpers/Auth';
import { db } from '../firebaseConfig';
import { ref, set, onValue, off } from 'firebase/database';

const ReportAccident = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [accidentId, setAccidentId] = useState(null);
  const [serviceProviderDetails, setServiceProviderDetails] = useState(null);
  const [autoSelectCurrentLocation, setAutoSelectCurrentLocation] = useState(false); // State for auto-location selection

  const { userSession } = useContext(AuthContext);

  useEffect(() => {
    const fetchStoredAccidentId = async () => {
      try {
        const storedAccidentId = await AsyncStorage.getItem('accidentId');
        if (storedAccidentId) {
          setAccidentId(storedAccidentId);
          fetchAccidentDetails(storedAccidentId);
        }
      } catch (error) {
        console.error('Error fetching stored accident ID:', error);
      }
    };

    fetchStoredAccidentId();
  }, []);

  useEffect(() => {
    if (accidentId) {
      const accidentRef = ref(db, `accidents/${accidentId}`);
      onValue(accidentRef, (snapshot) => {
        const accidentData = snapshot.val();
        if (accidentData && accidentData.selectedBy) {
          setServiceProviderDetails({
            name: accidentData.serviceProviderName,
            phoneNumber: accidentData.serviceProviderPhone
          });
        }
      });

      return () => {
        off(accidentRef, 'value');
      };
    }
  }, [accidentId]);

  const fetchAccidentDetails = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/accidents/${id}`, {
        headers: {
          Authorization: `Bearer ${userSession.token}`
        }
      });
      if (response.data.success) {
        setServiceProviderDetails(response.data.data.selectedBy ? {
          name: response.data.data.serviceProviderName,
          phoneNumber: response.data.data.serviceProviderPhone
        } : null);
      }
    } catch (error) {
      console.error('Error fetching accident details:', error);
    }
  };

  const getLocationAsync = async () => {
    try {
      setLoading(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(location);
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      console.log('Current Location:', location); // Debug log

    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber || !accidentSeverity || !selectedLocation) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const accidentReport = {
      phoneNumber,
      accidentSeverity,
      location: {
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString()
      },
      user: userSession._id
    };

    try {
      setLoading(true);

      const response = await axios.post(`${BASE_URL}/api/accidents/report`, accidentReport, {
        headers: {
          Authorization: `Bearer ${userSession.token}`
        }
      });
      if (response.data.success) {
        const newAccidentId = response.data.data._id;
        setAccidentId(newAccidentId);
        await AsyncStorage.setItem('accidentId', newAccidentId);
        Alert.alert('Success', 'Accident report submitted successfully.');

        const accidentRef = ref(db, `accidents/${newAccidentId}`);
        await set(accidentRef, {
          accidentId: newAccidentId,
          phoneNumber,
          accidentSeverity,
          location: {
            latitude: selectedLocation.latitude.toString(),
            longitude: selectedLocation.longitude.toString()
          },
          user: userSession._id,
          selectedBy: null
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit the accident report.');
      }
    } catch (error) {
      console.error('Error submitting accident report:', error);
      Alert.alert('Error', 'Failed to store accident report in Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrackServiceProvider = () => {
    navigation.navigate('TrackServiceProvider', {
      accidentId,
      serviceProviderDetails
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Report an Accident</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <Text style={styles.label}>Accident Severity:</Text>
      <RNPickerSelect
        onValueChange={(value) => setAccidentSeverity(value)}
        items={[
          { label: 'Major', value: 'major' },
          { label: 'Minor', value: 'minor' }
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: 'Select severity', value: null }}
      />

      <Text style={styles.label}>Location:</Text>
      <View style={styles.locationOptions}>
        <TouchableOpacity
          style={[styles.locationButton, autoSelectCurrentLocation && styles.activeLocationButton]}
          onPress={() => {
            setAutoSelectCurrentLocation(true);
            getLocationAsync();
            setMapModalVisible(true);
          }}
        >
          <Text style={styles.locationButtonText}>Use My Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.locationButton, !autoSelectCurrentLocation && styles.activeLocationButton]}
          onPress={() => {
            setAutoSelectCurrentLocation(false);
            setMapModalVisible(true);
          }}
        >
          <Text style={styles.locationButtonText}>Select Manually</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={mapModalVisible} animationType="slide">
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: selectedLocation ? selectedLocation.latitude : 37.78825,
              longitude: selectedLocation ? selectedLocation.longitude : -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={
              selectedLocation && {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            }
            onPress={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              setSelectedLocation({ latitude, longitude });
              setMapModalVisible(false);
            }}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Your Location"
              />
            )}
          </MapView>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#aa18ea" />
            </View>
          )}
          <TouchableOpacity style={styles.closeMapButton} onPress={() => setMapModalVisible(false)}>
            <Text style={styles.closeMapButtonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>

      {serviceProviderDetails && (
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackServiceProvider}>
          <Text style={styles.trackButtonText}>Track Service Provider</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  locationOptions: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  locationButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  activeLocationButton: {
    backgroundColor: '#aa18ea',
  },
  locationButtonText: {
    color: '#fff',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#4caf50',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  trackButton: {
    padding: 15,
    backgroundColor: '#aa18ea',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  closeMapButton: {
    padding: 15,
    backgroundColor: '#aa18ea',
    alignItems: 'center',
  },
  closeMapButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  inputAndroid: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
});

export default ReportAccident;
