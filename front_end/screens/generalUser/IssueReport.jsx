import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { Video } from 'expo-av'; // Ensure Video is imported
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const IssueReport = ({ issueCategories }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapVisible, setMapVisible] = useState(false); // Controls map modal visibility
  const [initialRegion, setInitialRegion] = useState(null); // Controls initial region for map
  const [isCurrentLocation, setIsCurrentLocation] = useState(false); // Checks if using current location
  const [mapLoading, setMapLoading] = useState(true); // Add map loading state
  
  useEffect(() => {
    if (isCurrentLocation) {
      getCurrentLocation();
    }
  }, [isCurrentLocation]);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 5000,
      });
      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(region); // Set the region for the map to show the current location
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      Alert.alert('Error', 'Error getting current location.');
    }
  };

  const openMapForManualSelection = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
      return;
    }

    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000,
      });
      const region = {
        latitude: location.coords.latitude, // Initial region centered in the user's current area
        longitude: location.coords.longitude,
        latitudeDelta: 0.1, // Wider area to let the user select nearby locations
        longitudeDelta: 0.1,
      };
      setInitialRegion(region); // Set the region for manual selection
    } catch (error) {
      Alert.alert('Error', 'Error getting current location.');
    }
    setMapVisible(true); // Open the map modal for manual selection
    setMapLoading(true); // Start the loader
  };

  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    console.log('Selected Media:', result);
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0]; // Get the first media from the assets array
      setMedia([...media, { uri: selectedAsset.uri, type: selectedAsset.type }]); // Store uri and type
    }
  };
  

  const submitReport = async () => {
    if (media.length === 0) {
      Alert.alert('Error', 'No media selected');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const userSession = await AsyncStorage.getItem('userSession');
      const user = JSON.parse(userSession);
      setLoading(true);
      const reportData = {
        reportedBy: user._id,
        issueType: selectedIssue,
        description: details,
        location,
        media,
      };
      console.log(reportData);


      await axios.post(`${BASE_URL}/api/issueReporting/report`, reportData,
        {
          headers: {
            Authorization : `Bearer ${token}`,

        }}
      );
      Alert.alert('Report Submitted', 'Your issue report has been submitted successfully.');
      setSelectedIssue('');
      setDetails('');
      setLocation(null);
      setMedia([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit the report.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelReport = () => {
    setSelectedIssue('');
    setDetails('');
    setLocation(null);
    setMedia([]);
  };

  const openLocationOptions = () => {
    Alert.alert(
      'Choose Location Option',
      'How would you like to select the location?',
      [
        {
          text: 'Use Current Location',
          onPress: () => {
            setIsCurrentLocation(true); // Set flag for current location
            setMapVisible(true); // Show map modal
            setMapLoading(true); // Start the loader
          },
        },
        {
          text: 'Select Manually',
          onPress: () => {
            setIsCurrentLocation(false); // Unset flag
            openMapForManualSelection(); // Show map for manual selection
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>Select Issue:</Text>
        <RNPickerSelect
          value={selectedIssue}
          onValueChange={(itemValue) => setSelectedIssue(itemValue)}
          items={issueCategories}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select an issue...', value: null }}
        />

        <Text style={styles.label}>Enter Details:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter detailed description here"
          value={details}
          onChangeText={(text) => setDetails(text)}
          multiline
        />

        <TouchableOpacity onPress={openLocationOptions} style={styles.locationButton}>
          <MaterialIcons name="place" size={24} color="white" />
          <Text style={styles.locationButtonText}>Select Location</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickMedia} style={styles.attachButton}>
          <MaterialIcons name="photo-library" size={24} color="white" />
          <Text style={styles.attachButtonText}>Attach Media</Text>
        </TouchableOpacity>

        <ScrollView horizontal contentContainerStyle={styles.imageContainer}>
  {media.length > 0 ? (
    media.map((item, index) => {
      if (item && item.uri) {
        if (item.type === 'video') {
          return (
            <Video
              key={index}
              source={{ uri: item.uri }}
              style={styles.media}
              resizeMode="cover"
              useNativeControls
            />
          );
        } else {
          return <Image key={index} source={{ uri: item.uri }} style={styles.media} />;
        }
      } else {
        return <Text key={index}>Invalid media selected</Text>;
      }
    })
  ) : (
    <Text>No media selected</Text>
  )}
</ScrollView>



        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={submitReport} style={styles.submitButton}>
            <Text style={styles.buttonText}>Submit Report</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelReport} style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel Report</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Full-screen Map Modal */}
      <Modal visible={mapVisible} animationType="slide">
        <View style={styles.mapContainer}>
          {mapLoading && <ActivityIndicator size="large" color="#aa18ea" style={styles.loader} />} 
          {initialRegion && (
            <MapView
              style={styles.fullScreenMap}
              initialRegion={initialRegion}
              onMapReady={() => setMapLoading(false)} // Hide the loader when the map is ready
              onPress={(e) => setLocation(e.nativeEvent.coordinate)}
            >
              {location && <Marker coordinate={location} />}
            </MapView>
          )}
          <View style={styles.mapButtons}>
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              style={styles.mapCloseButton}
            >
              <Text style={styles.mapButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMapVisible(false)}
              style={styles.mapConfirmButton}
            >
              <Text style={styles.mapButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Indicator for Report Submission */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#aa18ea" />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 10,
    height: 120,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
    textAlignVertical: 'top',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aa18ea',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  locationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#aa18ea',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  attachButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  media: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Map Modal styles
  mapContainer: {
    flex: 1,
  },
  fullScreenMap: {
    flex: 1,
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 10,
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  mapButtons: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  mapCloseButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 10,
  },
  mapConfirmButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Loading Overlay for Report Submission
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  inputAndroid: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
});

export default IssueReport;
