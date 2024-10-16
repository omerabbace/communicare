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
  const [autoSelectCurrentLocation, setAutoSelectCurrentLocation] = useState(false);
  const [accidentId, setAccidentId] = useState(null);
  const [serviceProviderAccepted, setServiceProviderAccepted] = useState(false);

  const { userSession } = useContext(AuthContext);

  useEffect(() => {
    console.log('Component mounted or accidentId changed:', accidentId);
    console.log('User session:', userSession);

    if (autoSelectCurrentLocation) {
      getLocationAsync();
    }

    if (accidentId) {
      console.log('Setting up Firebase listener for accidentId:', accidentId);
      const accidentRef = ref(db, `accidents/${accidentId}`);
      
      onValue(accidentRef, (snapshot) => {
        const accidentData = snapshot.val();
        console.log('Firebase accident data:', accidentData);
        if (accidentData && accidentData.selectedBy) {
          setServiceProviderAccepted(true);
          console.log('Service provider accepted the accident.');
        } else {
          console.log('Service provider has not accepted the accident yet.');
        }
      });

      return () => {
        console.log('Cleaning up Firebase listener');
        off(accidentRef, 'value');
      };
    }
  }, [autoSelectCurrentLocation, accidentId, userSession]);

  const getLocationAsync = async () => {
    setLoading(true);
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
      setLoading(false);
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setSelectedLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    setLoading(false);
  };

  const handleSelectLocation = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setMapModalVisible(false);
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
        setAccidentId(response.data.data._id); // Set accidentId for further tracking
        Alert.alert('Success', 'Accident report submitted successfully.');

        const accidentRef = ref(db, `accidents/${response.data.data._id}`);
        await set(accidentRef, {
          accidentId: response.data.data._id,
          phoneNumber,
          accidentSeverity,
          location: {
            latitude: selectedLocation.latitude.toString(),
            longitude: selectedLocation.longitude.toString()
          },
          user: userSession._id,
          selectedBy: null  // This will be updated by the service provider later
        });
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit the accident report.');
      }
    } catch (firebaseError) {
      console.error('Firebase Error:', firebaseError.code, firebaseError.message, firebaseError);
      Alert.alert('Error', `Failed to store accident report in Firebase: ${firebaseError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    setAutoSelectCurrentLocation(true);
    setMapModalVisible(true);
  };

  const handleSelectManually = () => {
    setAutoSelectCurrentLocation(false);
    setMapModalVisible(true);
  };

  const handleTrackServiceProvider = () => {
    navigation.navigate('TrackServiceProvider', { accidentId });
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
          onPress={handleUseCurrentLocation}
        >
          <Text style={styles.locationButtonText}>Use My Current Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.locationButton, !autoSelectCurrentLocation && styles.activeLocationButton]}
          onPress={handleSelectManually}
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
            region={selectedLocation ? {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : null}
            onPress={handleSelectLocation}
          >
            {selectedLocation && (
              <Marker
                coordinate={selectedLocation}
                title="Selected Location"
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

      {serviceProviderAccepted && (
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
