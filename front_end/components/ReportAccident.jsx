//  import React, { useState, useEffect, useContext } from 'react';
//   import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     StyleSheet,
//     ActivityIndicator,
//     Modal,
//     FlatList,
//   } from 'react-native';
//   import MapView, { Marker } from 'react-native-maps';
//   import * as Location from 'expo-location';
//   import RNPickerSelect from 'react-native-picker-select';
//   import axios from 'axios';
//   import AsyncStorage from '@react-native-async-storage/async-storage';
//   import { BASE_URL } from '../config';
//   import { AuthContext } from '../helpers/Auth';
//   import { db } from '../firebaseConfig';
//   import { ref, set, remove, onValue, off } from 'firebase/database';
  
//   const ReportAccident = ({ navigation }) => {
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [accidentSeverity, setAccidentSeverity] = useState('');
//     const [location, setLocation] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [mapModalVisible, setMapModalVisible] = useState(false);
//     const [selectedLocation, setSelectedLocation] = useState(null);
//     const [accidentId, setAccidentId] = useState(null);
//     const [serviceProviderDetails, setServiceProviderDetails] = useState(null);
//     const [rideStatus, setRideStatus] = useState('pending');
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
  
//     const { userSession } = useContext(AuthContext);
  
//     useEffect(() => {
//       const fetchStoredAccidentId = async () => {
//         try {
//           const storedAccidentId = await AsyncStorage.getItem('accidentId');
//           if (storedAccidentId) {
//             setAccidentId(storedAccidentId);
//             fetchAccidentDetails(storedAccidentId);
//           }
//         } catch (error) {
//           console.error('Error fetching stored accident ID:', error);
//         }
//       };
  
//       fetchStoredAccidentId();
//     }, []);
//     const fetchAccidentDetails = async (accidentId) => {
//       try {
//         const accidentRef = ref(db, `accidents/${accidentId}`);
//         onValue(accidentRef, (snapshot) => {
//           const accidentData = snapshot.val();
//           if (accidentData) {
//             if (accidentData.selectedBy) {
//               setServiceProviderDetails({
//                 name: accidentData.selectedBy.name,
//                 phoneNumber: accidentData.selectedBy.phoneNumber,
//               });
//             }
//             if (accidentData.rideStatus) {
//               setRideStatus(accidentData.rideStatus);
//               if (accidentData.rideStatus === 'completed') {
//                 Alert.alert('Ride Completed', 'The ride has been completed.');
//               }
//             }
//           }
//         });
//       } catch (error) {
//         console.error('Error fetching accident details:', error);
//       }
//     };
    
//     useEffect(() => {
//       if (accidentId) {
//         const accidentRef = ref(db, `accidents/${accidentId}`);
//         onValue(accidentRef, (snapshot) => {
//           const accidentData = snapshot.val();
//           if (accidentData) {
//             if (accidentData.selectedBy) {
//               setServiceProviderDetails({
//                 name: accidentData.selectedBy.name,
//                 phoneNumber: accidentData.selectedBy.phoneNumber,
//               });
//             }
//             if (accidentData.rideStatus) {
//               setRideStatus(accidentData.rideStatus);
//               if (accidentData.rideStatus === 'completed') {
//                 Alert.alert('Ride Completed', 'The ride has been completed.');
//                 setAccidentId(null);
//                 setServiceProviderDetails(null);
//                 setRideStatus('pending');
//                 AsyncStorage.removeItem('accidentId');
//               }
//             }
//           }
//         });
  
//         return () => {
//           off(accidentRef, 'value');
//         };
//       }
//     }, [accidentId]);
  
//     const openMapWithCurrentLocation = async () => {
//       setMapModalVisible(true);
//       setLoading(true);
  
//       try {
//         const { status } = await Location.requestForegroundPermissionsAsync();
//         if (status !== 'granted') {
//           Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
//           setLoading(false);
//           setMapModalVisible(false);
//           return;
//         }
  
//         const currentLocation = await Location.getCurrentPositionAsync({
//           accuracy: Location.Accuracy.High,
//         });
  
//         setLocation(currentLocation);
//         setSelectedLocation({
//           latitude: currentLocation.coords.latitude,
//           longitude: currentLocation.coords.longitude,
//         });
//         setSearchQuery(''); // Reset search bar
//         setSearchResults([]); // Clear search results
//       } catch (error) {
//         console.error('Error fetching current location:', error);
//         Alert.alert('Error', 'Failed to get current location. Please try again.');
//         setMapModalVisible(false);
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const handleSearch = async (query) => {
//       setSearchQuery(query);
//       if (query.length > 2) {
//         try {
//           const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
//             params: {
//               q: query,
//               format: 'json',
//               addressdetails: 1,
//               limit: 5,
//             },
//           });
//           setSearchResults(response.data);
//         } catch (error) {
//           console.error('Error fetching location data:', error);
//         }
//       } else {
//         setSearchResults([]);
//       }
//     };
//     const handleCloseModal = () => {
//       setMapModalVisible(false);
//       setSelectedLocation(null);
//       setSearchQuery('');
//       setSearchResults([]);
//     };
  
//     const handleSelectLocation = (location) => {
//       setSelectedLocation({
//         latitude: parseFloat(location.lat),
//         longitude: parseFloat(location.lon),
//       });
//       setSearchResults([]);
//       setSearchQuery(location.display_name);
//     };
  
//     const handleSubmit = async () => {
//       if (!/^\d{11}$/.test(phoneNumber)) {
//         Alert.alert('Error', 'Please enter a valid 11-digit phone number.');
//         return;
//       }
  
//       if (!phoneNumber || !accidentSeverity || !selectedLocation) {
//         Alert.alert('Error', 'Please fill in all fields.');
//         return;
//       }
  
//       const accidentReport = {
//         phoneNumber,
//         accidentSeverity,
//         location: {
//           latitude: selectedLocation.latitude.toString(),
//           longitude: selectedLocation.longitude.toString(),
//         },
//         user: userSession._id,
//       };
  
//       try {
//         setLoading(true);
  
//         const response = await axios.post(`${BASE_URL}/api/accidents/report`, accidentReport, {
//           headers: {
//             Authorization: `Bearer ${userSession.token}`,
//           },
//         });
//         if (response.data.success) {
//           const newAccidentId = response.data.data._id;
//           setAccidentId(newAccidentId);
//           await AsyncStorage.setItem('accidentId', newAccidentId);
//           Alert.alert('Success', 'Accident report submitted successfully.');
  
//           const accidentRef = ref(db, `accidents/${newAccidentId}`);
//           await set(accidentRef, {
//             accidentId: newAccidentId,
//             phoneNumber,
//             accidentSeverity,
//             location: {
//               latitude: selectedLocation.latitude.toString(),
//               longitude: selectedLocation.longitude.toString(),
//             },
//             user: userSession._id,
//             selectedBy: null,
//             rideStatus: 'pending',
//           });
//         } else {
//           Alert.alert('Error', response.data.message || 'Failed to submit the accident report.');
//         }
//       } catch (error) {
//         console.error('Error submitting accident report:', error);
//         Alert.alert('Error', 'Failed to store accident report in Firebase.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     const handleCancelReport = async () => {
//       try {
//         if (accidentId) {
//           const accidentRef = ref(db, `accidents/${accidentId}`);
//           await remove(accidentRef);
//           await AsyncStorage.removeItem('accidentId');
//           setAccidentId(null);
//           setServiceProviderDetails(null);
//           setRideStatus('pending');
//           Alert.alert('Success', 'Accident report canceled.');
//         } else {
//           Alert.alert('Error', 'No accident report to cancel.');
//         }
//       } catch (error) {
//         console.error('Error canceling accident report:', error);
//         Alert.alert('Error', 'Failed to cancel accident report.');
//       }
//     };
  
//     const handleConfirmLocation = () => {
//       if (selectedLocation) {
//         setMapModalVisible(false);
//       } else {
//         Alert.alert('Error', 'Please select a location first.');
//       }
//     };
  
//     const handleTrackServiceProvider = () => {
//       if (rideStatus === 'completed') {
//         Alert.alert('Ride Completed', 'Tracking is disabled as the ride has been completed.');
//       } else {
//         navigation.navigate('TrackServiceProvider', {
//           accidentId,
//           serviceProviderDetails,
//         });
//       }
//     };
  
//     return (
    //   <View style={styles.container}>
    //     <View style={styles.card}>
    //       <Text style={styles.title}>Report an Accident</Text>
  
    //       <TextInput
    //         style={styles.input}
    //         placeholder="03391112001"
    //         keyboardType="phone-pad"
    //         value={phoneNumber}
    //         onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
    //         maxLength={11}
    //       />
  
    //       <Text style={styles.label}>Accident Severity:</Text>
    //       <RNPickerSelect
    //         onValueChange={(value) => setAccidentSeverity(value)}
    //         items={[
    //           { label: 'Major', value: 'major' },
    //           { label: 'Minor', value: 'minor' },
    //         ]}
    //         style={pickerSelectStyles}
    //         placeholder={{ label: 'Select severity', value: null }}
    //       />
  
    //       <View style={styles.locationOptions}>
    //         <TouchableOpacity
    //           style={styles.locationButton}
    //           onPress={() => openMapWithCurrentLocation()}
    //         >
    //           <Text style={styles.locationButtonText}>Use My Current Location</Text>
    //         </TouchableOpacity>
    //         <TouchableOpacity
    //           style={styles.locationButton}
    //           onPress={() => {
    //             setMapModalVisible(true);
    //           }}
    //         >
    //           <Text style={styles.locationButtonText}>Select Location on Map</Text>
    //         </TouchableOpacity>
    //       </View>
  
    //       <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
    //         <Text style={styles.submitButtonText}>Submit Report</Text>
    //       </TouchableOpacity>
  
    //       {accidentId && rideStatus === 'pending' && (
    //         <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReport}>
    //           <Text style={styles.cancelButtonText}>Cancel Report</Text>
    //         </TouchableOpacity>
    //       )}
    //     </View>
  
    //     {serviceProviderDetails && rideStatus !== 'completed' && (
    //       <View style={styles.card}>
    //         <TouchableOpacity style={styles.trackButton} onPress={handleTrackServiceProvider}>
    //           <Text style={styles.trackButtonText}>Track Service Provider</Text>
    //         </TouchableOpacity>
    //       </View>
    //     )}
  
    //     {/* Map Modal */}
    //     <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
    //       <View style={styles.modalContainer}>
    //         <View style={styles.mapHeader}>
    //           <TextInput
    //             style={styles.searchBar}
    //             placeholder="Search location"
    //             value={searchQuery}
    //             onChangeText={handleSearch}
    //           />
    //         <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
    //           <Text style={styles.closeButtonText}>X</Text>
    //         </TouchableOpacity>
    //           {searchResults.length > 0 && (
    //             <FlatList
    //               data={searchResults}
    //               keyExtractor={(item) => item.place_id.toString()}
    //               renderItem={({ item }) => (
    //                 <TouchableOpacity onPress={() => handleSelectLocation(item)}>
    //                   <Text style={styles.searchResult}>{item.display_name}</Text>
    //                 </TouchableOpacity>
    //               )}
    //             />
    //           )}
    //         </View>
    //         <MapView
    //           style={styles.map}
    //           region={{
    //             latitude: selectedLocation ? selectedLocation.latitude : location?.coords.latitude || 37.78825,
    //             longitude: selectedLocation ? selectedLocation.longitude : location?.coords.longitude || -122.4324,
    //             latitudeDelta: 0.05,
    //             longitudeDelta: 0.05,
    //           }}
    //           onPress={(e) => {
    //             const { latitude, longitude } = e.nativeEvent.coordinate;
    //             setSelectedLocation({ latitude, longitude });
    //           }}
    //         >
    //           {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
    //         </MapView>
    //         {loading && (
    //           <View style={styles.loadingOverlay}>
    //             <ActivityIndicator size="large" color="#aa18ea" />
    //           </View>
    //         )}
    //         <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
    //           <Text style={styles.confirmButtonText}>Confirm Location</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </Modal>
    //   </View>
    // );
//   };
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: 20,
//       backgroundColor: '#f5f5f5',
//     },
//     card: {
//       backgroundColor: '#ffffff',
//       padding: 15,
//       borderRadius: 10,
//       elevation: 3,
//       marginBottom: 20,
//     },
//     title: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 20,
//       textAlign: 'center',
//     },
//     input: {
//       borderWidth: 1,
//       borderColor: '#ccc',
//       padding: 10,
//       borderRadius: 5,
//       marginBottom: 20,
//       backgroundColor: '#fff',
//     },
//     label: {
//       fontSize: 16,
//       marginBottom: 10,
//     },
//     locationOptions: {
//       flexDirection: 'row',
//       justifyContent: 'space-between',
//       marginBottom: 20,
//     },
//     locationButton: {
//       flex: 1,
//       padding: 10,
//       backgroundColor: '#aa18ea',
//       borderRadius: 5,
//       alignItems: 'center',
//       marginHorizontal: 5,
//     },
//     locationButtonText: {
//       color: '#fff',
//       fontSize: 14,
//     },
//     submitButton: {
//       padding: 15,
//       backgroundColor: '#4caf50',
//       borderRadius: 5,
//       alignItems: 'center',
//       marginTop: 20,
//     },
//     submitButtonText: {
//       color: '#fff',
//       fontSize: 16,
//     },
//     cancelButton: {
//       padding: 15,
//       backgroundColor: '#f44336',
//       borderRadius: 5,
//       alignItems: 'center',
//       marginTop: 10,
//     },
//     cancelButtonText: {
//       color: '#fff',
//       fontSize: 16,
//     },
//     trackButton: {
//       padding: 15,
//       backgroundColor: '#007bff',
//       borderRadius: 5,
//       alignItems: 'center',
//       marginTop: 20,
//     },
//     trackButtonText: {
//       color: '#fff',
//       fontSize: 16,
//     },
//     modalContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       backgroundColor: 'white',
//     },
//     mapHeader: {
//       position: 'absolute',
//       top: 50,
//       left: 20,
//       right: 20,
//       backgroundColor: 'white',
//       padding: 10,
//       borderRadius: 10,
//       zIndex: 1,
//       shadowColor: '#000',
//       shadowOpacity: 0.3,
//       shadowRadius: 10,
//       shadowOffset: { width: 0, height: 2 },
//       elevation: 5,
//     },
//     searchBar: {
//       height: 40,
//       padding: 10,
//       borderRadius: 10,
//       borderColor: '#ccc',
//       borderWidth: 1,
//       backgroundColor: '#f5f5f5',
//     },
//     searchResult: {
//       padding: 10,
//       fontSize: 16,
//     },
//     map: {
//       flex: 1,
//     },
//     confirmButton: {
//       position: 'absolute',
//       bottom: 30,
//       left: 20,
//       right: 20,
//       backgroundColor: '#aa18ea',
//       padding: 15,
//       borderRadius: 10,
//       alignItems: 'center',
//     },
//     confirmButtonText: {
//       color: 'white',
//       fontSize: 18,
//       fontWeight: 'bold',
//     },
//     loadingOverlay: {
//       ...StyleSheet.absoluteFillObject,
//       backgroundColor: 'rgba(255, 255, 255, 0.7)',
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     closeButton: {
//       position: 'absolute',
//       top: 10,
//       right: 10,
//       padding: 10,
//     },
//     closeButtonText: {
//       fontSize: 18,
//       color: '#333',
//     },
//   });
  
//   const pickerSelectStyles = StyleSheet.create({
//     inputIOS: {
//       height: 50,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       padding: 10,
//       borderRadius: 5,
//       backgroundColor: '#fff',
//       marginBottom: 20,
//     },
//     inputAndroid: {
//       height: 50,
//       borderWidth: 1,
//       borderColor: '#ccc',
//       padding: 10,
//       borderRadius: 5,
//       backgroundColor: '#fff',
//       marginBottom: 20,
//     },
//   });
  
//   export default ReportAccident;
  
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { AuthContext } from '../helpers/Auth';
import { db } from '../firebaseConfig';
import { ref, set, remove, onValue, off } from 'firebase/database';

const ReportAccident = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState('');
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [accidentId, setAccidentId] = useState(null);
  const [serviceProviderDetails, setServiceProviderDetails] = useState(null);
  const [rideStatus, setRideStatus] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

  const fetchAccidentDetails = async (accidentId) => {
    try {
      const accidentRef = ref(db, `accidents/${accidentId}`);
      onValue(accidentRef, (snapshot) => {
        const accidentData = snapshot.val();
        if (accidentData) {
          if (accidentData.serviceProviderDetails) {
            setServiceProviderDetails({
              name: accidentData.name,
              phoneNumber: accidentData.phoneNumber,
            });
          }
          // console.log(accidentData.serviceProviderDetails);
          // console.log('detailsss',serviceProviderDetails);
          if (accidentData.rideStatus) {
            setRideStatus(accidentData.rideStatus);
            if (accidentData.rideStatus === 'completed') {
              Alert.alert('Ride Completed', 'The ride has been completed.');
            }
          }
        }
      });
    } catch (error) {
      console.error('Error fetching accident details:', error);
    }
  };

  useEffect(() => {
    if (accidentId) {
      // console.log('idddddd',accidentId);
      const accidentRef = ref(db, `accidents/${accidentId}`);
      onValue(accidentRef, (snapshot) => {
        const accidentData = snapshot.val();
        if (accidentData) {
          if (accidentData.selectedBy) {
            setServiceProviderDetails({
              name: accidentData.selectedBy.name,
              phoneNumber: accidentData.selectedBy.phoneNumber,
            });
          }
          if (accidentData.rideStatus) {
            setRideStatus(accidentData.rideStatus);
            // console.log()
            if (accidentData.rideStatus === 'completed') {
              Alert.alert('Ride Completed', 'The ride has been completed.');
              setAccidentId(null);
              setServiceProviderDetails(null);
              setRideStatus('pending');
              AsyncStorage.removeItem('accidentId');
            }
          }
        }
      });

      return () => {
        off(accidentRef, 'value');
      };
    }
  }, [accidentId]);

  const openMapWithCurrentLocation = async () => {
    setMapModalVisible(true);
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
        setLoading(false);
        setMapModalVisible(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);
      setSelectedLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
      setSearchQuery(''); // Reset search bar
      setSearchResults([]); // Clear search results
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to get current location. Please try again.');
      setMapModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
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

  const handleCloseModal = () => {
    setMapModalVisible(false);
    setSelectedLocation(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation({
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    });
    setSearchResults([]);
    setSearchQuery(location.display_name);
  };

  const handleSubmit = async () => {
    if (!/^\d{11}$/.test(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid 11-digit phone number.');
      return;
    }
  
    if (!phoneNumber || !accidentSeverity || !selectedLocation) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    const accidentReport = {
      phoneNumber,
      accidentSeverity,
      location: {
        latitude: selectedLocation.latitude.toString(),
        longitude: selectedLocation.longitude.toString(),
      },
      user: userSession._id,
    };
  
    try {
      setLoading(true);
  
      const response = await axios.post(`${BASE_URL}/api/accidents/report`, accidentReport, {
        headers: {
          Authorization: `Bearer ${userSession.token}`,
        },
      });
  
      if (response.data.success) {
        const newAccidentId = response.data.data._id; // MongoDB ID from the backend
        setAccidentId(newAccidentId);
        await AsyncStorage.setItem('accidentId', newAccidentId); // Save accident ID to AsyncStorage
        Alert.alert('Success', 'Accident report submitted successfully.');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to submit the accident report.');
      }
    } catch (error) {
      console.error('Error submitting accident report:', error);
      Alert.alert('Error', 'Failed to submit accident report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  


  const handleCancelReport = async () => {

    try {
        if (accidentId) {
            // Get the token from AsyncStorage
            const token = await AsyncStorage.getItem('userSession')
                .then(data => JSON.parse(data)?.token);

            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                return;
            }

            const headers = { Authorization: `Bearer ${token}` };
            // console.log('aciidedcc',accidentId);
            // Call the API to cancel the accident report
            const response = await axios.patch(
                `${BASE_URL}/api/accidents/cancel/${accidentId}`,
                {},
                { headers }
            );

            if (response.data.success) {
                // Clear local state and storage
                await AsyncStorage.removeItem('accidentId');
                setAccidentId(null);
                setServiceProviderDetails(null);
                setRideStatus('pending');

                Alert.alert('Success', 'Accident report canceled successfully.');
            } else {
                Alert.alert('Error', response.data.message || 'Failed to cancel accident report.');
            }
        } else {
            Alert.alert('Error', 'No accident report to cancel.');
        }
    } catch (error) {
        console.error('Error canceling accident report:', error);
        Alert.alert('Error', 'Failed to cancel accident report.');
    }
};


  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setMapModalVisible(false);
    } else {
      Alert.alert('Error', 'Please select a location first.');
    }
  };

  const handleTrackServiceProvider = () => {
    if (rideStatus === 'completed') {
      // Alert.alert('Ride Completed', 'Tracking is disabled as the ride has been completed.');
    } else {
      navigation.navigate('TrackServiceProvider', {
        accidentId,
        serviceProviderDetails,
      });
    }
  };

  return (
    <ScrollView style={styles.scrollContainer}>
       <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Report an Accident</Text>
          <Text style={styles.label}>Contact Number:</Text>

          <TextInput
            style={styles.input}
            placeholder="03391112001"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
            maxLength={11}
          />
  
          <Text style={styles.label}>Accident Severity:</Text>
          <RNPickerSelect
            onValueChange={(value) => setAccidentSeverity(value)}
            items={[
              { label: 'Major', value: 'major' },
              { label: 'Minor', value: 'minor' },
            ]}
            style={pickerSelectStyles}
            placeholder={{ label: 'Select severity', value: null }}
          />
  
          <View style={styles.locationOptions}>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => openMapWithCurrentLocation()}
            >
              <Text style={styles.locationButtonText}>Use My Current Location</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.locationButton}
              onPress={() => {
                setMapModalVisible(true);
              }}
            >
              <Text style={styles.locationButtonText}>Select Location on Map</Text>
            </TouchableOpacity>
          </View>
  
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </TouchableOpacity>
  
          {accidentId && rideStatus === 'pending' && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReport}>
              <Text style={styles.cancelButtonText}>Cancel Report</Text>
            </TouchableOpacity>
          )}
        </View>
  
        {serviceProviderDetails && rideStatus !== 'completed' && (
          <View style={styles.card}>
            <TouchableOpacity style={styles.trackButton} onPress={handleTrackServiceProvider}>
              <Text style={styles.trackButtonText}>Track Service Provider</Text>
            </TouchableOpacity>
          </View>
        )}
  
        {/* Map Modal */}
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
              {searchResults.length > 0 && (
                <FlatList
                  data={searchResults}
                  keyExtractor={(item) => item.place_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelectLocation(item)}>
                      <Text style={styles.searchResult}>{item.display_name}</Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
            <MapView
              style={styles.map}
              region={{
                latitude: selectedLocation ? selectedLocation.latitude : location?.coords.latitude || 37.78825,
                longitude: selectedLocation ? selectedLocation.longitude : location?.coords.longitude || -122.4324,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
              onPress={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setSelectedLocation({ latitude, longitude });
              }}
            >
              {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
            </MapView>
            {loading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#aa18ea" />
              </View>
            )}
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

  const styles = StyleSheet.create({
    scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#f5f5f5',
    },
    container: {
      flex: 1,
      padding: 20,
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 15,
      padding: 20,
      marginVertical: 15,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
      elevation: 5,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
    },
    label: {
      fontSize: 16,
      color: '#555',
      marginBottom: 10,
    },
    locationOptions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    locationButton: {
      flex: 1,
      paddingVertical: 15,
      backgroundColor: '#aa18ea',
      borderRadius: 10,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    locationButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    },
    submitButton: {
      paddingVertical: 15,
      backgroundColor: '#4caf50',
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    cancelButton: {
      paddingVertical: 15,
      backgroundColor: '#f44336',
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    cancelButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    trackButton: {
      paddingVertical: 15,
      backgroundColor: '#007bff',
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    trackButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'white',
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
    },
    map: {
      flex: 1,
    },
    confirmButton: {
      position: 'absolute',
      bottom: 30,
      left: 20,
      right: 20,
      backgroundColor: '#aa18ea',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 10,
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
      backgroundColor: '#f9f9f9',
    },
    inputAndroid: {
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      marginBottom: 20,
      backgroundColor: '#f9f9f9',
    },
  });
  
export default ReportAccident;

