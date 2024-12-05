// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   StyleSheet,
// } from 'react-native';
// import * as Location from 'expo-location';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialIcons } from '@expo/vector-icons';
// import RNPickerSelect from 'react-native-picker-select';
// import MapView, { Marker } from 'react-native-maps';
// import axios from 'axios';
// import { Video } from 'expo-av'; // Ensure Video is imported
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const IssueReport = ({ issueCategories }) => {
//   const [selectedIssue, setSelectedIssue] = useState('');
//   const [details, setDetails] = useState('');
//   const [location, setLocation] = useState(null);
//   const [media, setMedia] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [mapVisible, setMapVisible] = useState(false); // Controls map modal visibility
//   const [initialRegion, setInitialRegion] = useState(null); // Controls initial region for map
//   const [isCurrentLocation, setIsCurrentLocation] = useState(false); // Checks if using current location
//   const [mapLoading, setMapLoading] = useState(true); // Add map loading state
  
//   useEffect(() => {
//     if (isCurrentLocation) {
//       getCurrentLocation();
//     }
//   }, [isCurrentLocation]);

//   const getCurrentLocation = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
//       return;
//     }

//     try {
//       let location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//         timeout: 5000,
//       });
//       const region = {
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       };
//       setInitialRegion(region); // Set the region for the map to show the current location
//       setLocation({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//       });
//     } catch (error) {
//       Alert.alert('Error', 'Error getting current location.');
//     }
//   };
//   const handleSearch = async (query) => {
//     setSearchQuery(query);
//     if (query.length > 2) {
//       try {
//         const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
//           params: {
//             q: query,
//             format: 'json',
//             addressdetails: 1,
//             limit: 5,
//           },
//         });
//         setSearchResults(response.data);
//       } catch (error) {
//         console.error('Error fetching location data:', error);
//       }
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const openMapForManualSelection = async () => {
//     let { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
//       return;
//     }

//     try {
//       let location = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.Balanced,
//         timeout: 5000,
//       });
//       const region = {
//         latitude: location.coords.latitude, // Initial region centered in the user's current area
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.1, // Wider area to let the user select nearby locations
//         longitudeDelta: 0.1,
//       };
//       setInitialRegion(region); // Set the region for manual selection
//     } catch (error) {
//       Alert.alert('Error', 'Error getting current location.');
//     }
//     setMapVisible(true); // Open the map modal for manual selection
//     setMapLoading(true); // Start the loader
//   };

//   const pickMedia = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       alert('Permission to access media library is required!');
//       return;
//     }
  
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });
  
//     console.log('Selected Media:', result);
  
//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const selectedAsset = result.assets[0]; // Get the first media from the assets array
//       setMedia([...media, { uri: selectedAsset.uri, type: selectedAsset.type }]); // Store uri and type
//     }
//   };

//   const removeMedia = (index) => {
//     setMedia(media.filter((_, i) => i !== index));
//   };

//   const submitReport = async () => {
//     if (media.length === 0) {
//       Alert.alert('Error', 'No media selected');
//       return;
//     }
  
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const userSession = await AsyncStorage.getItem('userSession');
//       const user = JSON.parse(userSession);
//       setLoading(true);
  
//       const formData = new FormData();
  
//       // Add issue details
//       formData.append('reportedBy', user._id);
//       formData.append('issueType', selectedIssue);
//       formData.append('description', details);
  
//       // Add location
//       formData.append('latitude', location.latitude);
//       formData.append('longitude', location.longitude);
  
//       // Add media files to formData
//       media.forEach((item, index) => {
//         const fileType = item.type === 'video' ? 'video/mp4' : 'image/jpeg';
//         const fileName = `media_${index}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
//         formData.append('media', {
//           uri: item.uri,
//           type: fileType,
//           name: fileName,
//         });
//       });
  
//       // Send the request
//       await axios.post(`${BASE_URL}/api/issueReporting/report`, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
  
//       Alert.alert('Report Submitted', 'Your issue report has been submitted successfully.');
//       setSelectedIssue('');
//       setDetails('');
//       setLocation(null);
//       setMedia([]);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to submit the report.');
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const cancelReport = () => {
//     setSelectedIssue('');
//     setDetails('');
//     setLocation(null);
//     setMedia([]);
//   };

//   const openLocationOptions = () => {
//     Alert.alert(
//       'Choose Location Option',
//       'How would you like to select the location?',
//       [
//         {
//           text: 'Use Current Location',
//           onPress: () => {
//             setIsCurrentLocation(true); // Set flag for current location
//             setMapVisible(true); // Show map modal
//             setMapLoading(true); // Start the loader
//           },
//         },
//         {
//           text: 'Select Manually',
//           onPress: () => {
//             setIsCurrentLocation(false); // Unset flag
//             openMapForManualSelection(); // Show map for manual selection
//           },
//         },
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.innerContainer}>
//         <Text style={styles.label}>Select Issue:</Text>
//         <RNPickerSelect
//           value={selectedIssue}
//           onValueChange={(itemValue) => setSelectedIssue(itemValue)}
//           items={issueCategories}
//           style={pickerSelectStyles}
//           placeholder={{ label: 'Select an issue...', value: null }}
//         />

//         <Text style={styles.label}>Enter Details:</Text>
//         <TextInput
//           style={styles.textArea}
//           placeholder="Enter detailed description here"
//           value={details}
//           onChangeText={(text) => setDetails(text)}
//           multiline
//         />

//         <TouchableOpacity onPress={openLocationOptions} style={styles.locationButton}>
//           <MaterialIcons name="place" size={24} color="white" />
//           <Text style={styles.locationButtonText}>Select Location</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={pickMedia} style={styles.attachButton}>
//           <MaterialIcons name="photo-library" size={24} color="white" />
//           <Text style={styles.attachButtonText}>Attach Media</Text>
//         </TouchableOpacity>

//         <ScrollView horizontal contentContainerStyle={styles.imageContainer}>
//           {media.length > 0 ? (
//             media.map((item, index) => (
//               <View key={index} style={styles.mediaItem}>
//                 {item.type === 'video' ? (
//                   <Video
//                     source={{ uri: item.uri }}
//                     style={styles.media}
//                     resizeMode="cover"
//                     useNativeControls
//                   />
//                 ) : (
//                   <Image source={{ uri: item.uri }} style={styles.media} />
//                 )}
//                 <TouchableOpacity onPress={() => removeMedia(index)} style={styles.removeButton}>
//                   <Text style={styles.removeButtonText}>Remove</Text>
//                 </TouchableOpacity>
//               </View>
//             ))
//           ) : (
//             <Text>No media selected</Text>
//           )}
//         </ScrollView>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity onPress={submitReport} style={styles.submitButton}>
//             <Text style={styles.buttonText}>Submit Report</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={cancelReport} style={styles.cancelButton}>
//             <Text style={styles.buttonText}>Cancel Report</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Full-screen Map Modal */}
//       <Modal visible={mapVisible} animationType="slide">
//         <View style={styles.mapContainer}>
//           {mapLoading && <ActivityIndicator size="large" color="#aa18ea" style={styles.loader} />} 
//           {initialRegion && (
//             <MapView
//               style={styles.fullScreenMap}
//               initialRegion={initialRegion}
//               onMapReady={() => setMapLoading(false)} // Hide the loader when the map is ready
//               onPress={(e) => setLocation(e.nativeEvent.coordinate)}
//             >
//               {location && <Marker coordinate={location} />}
//             </MapView>
//           )}
//           <View style={styles.mapButtons}>
//             <TouchableOpacity
//               onPress={() => setMapVisible(false)}
//               style={styles.mapCloseButton}
//             >
//               <Text style={styles.mapButtonText}>Cancel</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setMapVisible(false)}
//               style={styles.mapConfirmButton}
//             >
//               <Text style={styles.mapButtonText}>Confirm Location</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Loading Indicator for Report Submission */}
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <ActivityIndicator size="large" color="#aa18ea" />
//         </View>
//       )}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   innerContainer: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   textArea: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 15,
//     borderRadius: 10,
//     height: 120,
//     marginBottom: 20,
//     backgroundColor: '#f5f5f5',
//     textAlignVertical: 'top',
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#aa18ea',
//     padding: 12,
//     borderRadius: 10,
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   locationButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   attachButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#aa18ea',
//     padding: 12,
//     borderRadius: 10,
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   attachButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     marginBottom: 20,
//   },
//   mediaItem: {
//     position: 'relative',
//   },
//   media: {
//     width: 120,
//     height: 120,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   removeButton: {
//     position: 'absolute',
//     top: 5,
//     right: 5,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     padding: 5,
//     borderRadius: 5,
//   },
//   removeButtonText: {
//     color: '#fff',
//     fontSize: 12,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   submitButton: {
//     backgroundColor: '#4caf50',
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//     padding: 15,
//     borderRadius: 10,
//     flex: 1,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   // Map Modal styles
//   mapContainer: {
//     flex: 1,
//   },
//   fullScreenMap: {
//     flex: 1,
//   },
//   loader: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     zIndex: 10,
//     transform: [{ translateX: -20 }, { translateY: -20 }],
//   },
//   mapButtons: {
//     position: 'absolute',
//     bottom: 20,
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//   },
//   mapCloseButton: {
//     backgroundColor: '#f44336',
//     padding: 15,
//     borderRadius: 10,
//   },
//   mapConfirmButton: {
//     backgroundColor: '#4caf50',
//     padding: 15,
//     borderRadius: 10,
//   },
//   mapButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   // Loading Overlay for Report Submission
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// const pickerSelectStyles = StyleSheet.create({
//   inputIOS: {
//     height: 50,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//     borderRadius: 10,
//     backgroundColor: '#f5f5f5',
//   },
//   inputAndroid: {
//     height: 50,
//     width: '100%',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 20,
//     borderRadius: 10,
//     backgroundColor: '#f5f5f5',
//   },
// });

// export default IssueReport;



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
  FlatList,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import { Video } from 'expo-av';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IssueReport = ({ issueCategories }) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [details, setDetails] = useState('');
  const [location, setLocation] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null); // Controls initial region for map
  const [isCurrentLocation, setIsCurrentLocation] = useState(false); // Checks if using current location
  const [mapLoading, setMapLoading] = useState(true); // Add map loading state


  

  useEffect(() => {
    if (isCurrentLocation && mapModalVisible) {
      fetchCurrentLocation();
    }
  }, [isCurrentLocation, mapModalVisible]);

  const fetchCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync();
      const region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setInitialRegion(region);
      setSelectedLocation(region);
      setMapLoading(false);
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to get current location.');
    }
  };

  const openMapForManualSelection = async () => {
    setMapLoading(true);
    setMapModalVisible(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        setMapModalVisible(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 5000,
      });

      const region = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

      setInitialRegion(region);
    } catch (error) {
      console.error('Error fetching current location for manual selection:', error);
      Alert.alert('Error', 'Failed to fetch location.');
    } finally {
      setMapLoading(false);
    }
  };


  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: query,
            format: 'json',
            addressdetails: 1,
            limit: 5,
          },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = (location) => {
    const selected = {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setSelectedLocation(selected);
    setSearchQuery(location.display_name);
    setSearchResults([]);
  };

  const handleCloseModal = () => {
    setMapModalVisible(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedLocation(null);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setLocation(selectedLocation);
      setMapModalVisible(false);
    } else {
      Alert.alert('Error', 'Please select a location.');
    }
  };


  const pickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setMedia([...media, { uri: selectedAsset.uri, type: selectedAsset.type }]);
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
  
      const formData = new FormData();
  
      // Add issue details
      formData.append('reportedBy', user._id);
      formData.append('issueType', selectedIssue);
      formData.append('description', details);
  
      // Add location
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
  
      // Add media files to formData
      media.forEach((item, index) => {
        const fileType = item.type === 'video' ? 'video/mp4' : 'image/jpeg';
        const fileName = `media_${index}.${item.type === 'video' ? 'mp4' : 'jpg'}`;
        formData.append('media', {
          uri: item.uri,
          type: fileType,
          name: fileName,
        });
      });
  
      // Send the request
      await axios.post(`${BASE_URL}/api/issueReporting/report`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
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
            setMapModalVisible(true); // Show map modal
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
            media.map((item, index) => (
              <View key={index} style={styles.mediaItem}>
                {item.type === 'video' ? (
                  <Video source={{ uri: item.uri }} style={styles.media} useNativeControls />
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.media} />
                )}
                <TouchableOpacity
                  onPress={() => setMedia(media.filter((_, i) => i !== index))}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text>No media selected</Text>
          )}
        </ScrollView>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.buttonText}>Submit Report</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={cancelReport}>
          <Text style={styles.buttonText}>Cancel Report</Text>
        </TouchableOpacity>
      </View>
      </View>
      <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.mapHeader}>
            <TextInput
              style={styles.searchBar}
              placeholder="Search location"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>

          {mapLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator style={styles.loader} size="large" color="#aa18ea" />
            </View>
          )}

          {!mapLoading && (
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
            >
              {selectedLocation && <Marker coordinate={selectedLocation} />}
            </MapView>
          )}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 10,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
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
  mediaItem: {
    position: 'relative',
    marginRight: 10,
  },
  media: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  mapHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    zIndex: 1,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchBar: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#f5f5f5',
  },
  searchResult: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  map: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  confirmButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  inputAndroid: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
});


export default IssueReport;


