    // import React, { useState, useContext } from 'react';
    // import {
    // View,
    // Text,
    // TextInput,
    // Alert,
    // StyleSheet,
    // TouchableOpacity,
    // Keyboard,
    // TouchableWithoutFeedback,
    // Modal,
    // ActivityIndicator,
    // FlatList,
    // Platform,
    // } from 'react-native';
    // import axios from 'axios';
    // import { BASE_URL } from '../../config';
    // import { AuthContext } from '../../helpers/Auth';
    // import * as Location from 'expo-location';
    // import MapView, { Marker } from 'react-native-maps';

    // const ReportVehicleIssueScreen = () => {
    // const { userSession } = useContext(AuthContext);
    // const [vehicleRegNo, setVehicleRegNo] = useState('');
    // const [confirmRegNo, setConfirmRegNo] = useState('');
    // const [issueDescription, setIssueDescription] = useState('');
    // const [phone, setPhone] = useState(userSession.phone || '');
    // const [location, setLocation] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [mapLoading, setMapLoading] = useState(false);
    // const [mapModalVisible, setMapModalVisible] = useState(false);
    // const [selectedLocation, setSelectedLocation] = useState(null);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [searchResults, setSearchResults] = useState([]);
    // const [nearbyPlaces, setNearbyPlaces] = useState([]); // State to store nearby places
    // const handleReportIssue = async () => {
    //     if (!vehicleRegNo || !confirmRegNo || !phone || !issueDescription || !location) {
    //     Alert.alert('Error', 'All fields are required.');
    //     return;
    //     }

    //     if (vehicleRegNo !== confirmRegNo) {
    //     Alert.alert('Error', 'Vehicle registration numbers do not match.');
    //     return;
    //     }

    //     if (phone.length !== 11) {
    //     Alert.alert('Error', 'Phone number must be exactly 11 digits.');
    //     return;
    //     }

    //     const reportData = {
    //     userId: userSession._id,
    //     name: userSession.name,
    //     phone,
    //     email: userSession.email,
    //     vehicleRegNo,
    //     confirmRegNo,
    //     issueDescription,
    //     location,
    //     };

    //     try {
    //         // console.log(reportData);
    //         setLoading(true);
    //         const response = await axios.post(
    //           `${BASE_URL}/api/vehicle-assistance/report`,
    //           reportData,
    //           {
    //             headers: {
    //               Authorization: `Bearer ${userSession.token}`,
    //             },
    //           }
    //         );
    //         if (response.data.success) {
    //           Alert.alert('Success', 'Issue reported successfully');
    //         }
    //       } catch (error) {
    //         console.error('Error reporting issue:', error);
    //         Alert.alert('Error', 'Failed to report issue.');
    //       } finally {
    //         setLoading(false);
    //       }
          
    // };

    // const openLocationOptions = () => {
    //     Alert.alert(
    //     "Select Location",
    //     "Choose your current location or select manually",
    //     [
    //         { text: "Use My Current Location", onPress: fetchCurrentLocation },
    //         { text: "Select Manually", onPress: fetchCurrentLocation },
    //         { text: "Cancel", style: "cancel" }
    //     ]
    //     );
    // };

    // const fetchCurrentLocation = async () => {
    //     setLoading(true);
    //     try {
    //     const { status } = await Location.requestForegroundPermissionsAsync();
    //     if (status !== 'granted') {
    //         Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
    //         setLoading(false);
    //         return;
    //     }

    //     const currentLocation = await Location.getCurrentPositionAsync({});
    //     const { latitude, longitude } = currentLocation.coords;
    //     setSelectedLocation({ latitude, longitude });
    //     setLocation({ latitude, longitude });
    //     openMapWithLoader(); // Open map modal with loader
    //     } catch (error) {
    //     console.error('Error fetching current location:', error);
    //     Alert.alert('Error', 'Failed to get current location. Please try again.');
    //     } finally {
    //     setLoading(false);
    //     }
    // };

    // const openMapWithLoader = () => {
    //     setMapLoading(true);
    //     setMapModalVisible(true);
    //     setTimeout(() => setMapLoading(false), 500); // Small delay to ensure smooth transition
    // };

    // //   const openMapWithNearbyPlaces = async () => {
    // //     setMapLoading(true);
    // //     try {
    // //       const { status } = await Location.requestForegroundPermissionsAsync();
    // //       if (status !== 'granted') {
    // //         Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
    // //         setMapLoading(false);
    // //         return;
    // //       }

    // //       const currentLocation = await Location.getCurrentPositionAsync({});
    // //       const { latitude, longitude } = currentLocation.coords;
    // //       setSelectedLocation({ latitude, longitude });

    // //       // Fetch nearby places using the Nominatim API
    // //       const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
    // //         params: {
    // //           lat: latitude,
    // //           lon: longitude,
    // //           format: 'json',
    // //           zoom: 10, // City-level accuracy
    // //           addressdetails: 1,
    // //         },
    // //       });

    // //       const nearbyPlacesResponse = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    // //         params: {
    // //           q: response.data.address.city,
    // //           format: 'json',
    // //           limit: 5,
    // //         },
    // //       });

    // //       // Save nearby places to state
    // //       setNearbyPlaces(nearbyPlacesResponse.data);
    // //       setMapModalVisible(true);
    // //     } catch (error) {
    // //       console.error('Error fetching nearby places:', error);
    // //       Alert.alert('Error', 'Failed to load nearby places. Please try again.');
    // //     } finally {
    // //       setMapLoading(false);
    // //     }
    // //   };

    // const handleSearch = async (query) => {
    //     setSearchQuery(query);
    //     if (query.length > 2) {
    //     try {
    //         const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
    //         params: {
    //             q: query,
    //             format: 'json',
    //             addressdetails: 1,
    //             limit: 5,
    //         },
    //         });
    //         setSearchResults(response.data);
    //     } catch (error) {
    //         console.error('Error fetching location data:', error);
    //     }
    //     } else {
    //     setSearchResults([]);
    //     }
    // };

    // const handleSelectLocation = (location) => {
    //     setSelectedLocation({
    //     latitude: parseFloat(location.lat),
    //     longitude: parseFloat(location.lon),
    //     });
    //     setSearchQuery(location.display_name);
    //     setSearchResults([]);
    // };

    // const handleConfirmLocation = () => {
    //     if (selectedLocation) {
    //     setLocation(selectedLocation);
    //     setMapModalVisible(false);
    //     } else {
    //     Alert.alert('Error', 'Please select a location first.');
    //     }
    // };

    // const closeModalAndResetSearch = () => {
    //     setSearchQuery('');
    //     setSearchResults([]);
    //     setMapModalVisible(false);
    // };

    // return (
    //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //     <View style={styles.container}>
    //         <Text style={styles.title}>Report Vehicle Assistance</Text>

    //         <View style={styles.card}>
    //         <Text style={styles.label}>Vehicle Registration Number</Text>
    //         <TextInput
    //             placeholder="Enter Vehicle Registration Number"
    //             style={styles.input}
    //             value={vehicleRegNo}
    //             onChangeText={setVehicleRegNo}
    //         />

    //         <Text style={styles.label}>Confirm Registration Number</Text>
    //         <TextInput
    //             placeholder="Re-enter Registration Number"
    //             style={styles.input}
    //             value={confirmRegNo}
    //             onChangeText={setConfirmRegNo}
    //         />

    //         <Text style={styles.label}>Contact Number</Text>
    //         <TextInput
    //             placeholder="Enter Contact Number"
    //             style={styles.input}
    //             value={phone}
    //             onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
    //             keyboardType="phone-pad"
    //             maxLength={11}
    //         />

    //         <Text style={styles.label}>Issue Description</Text>
    //         <TextInput
    //             placeholder="Describe the issue"
    //             style={[styles.input, styles.textArea]}
    //             value={issueDescription}
    //             onChangeText={setIssueDescription}
    //             multiline
    //         />

    //         <TouchableOpacity style={styles.button} onPress={openLocationOptions}>
    //             <Text style={styles.buttonText}>Select Location</Text>
    //         </TouchableOpacity>
    //         </View>

    //         <TouchableOpacity style={styles.submitButton} onPress={handleReportIssue} disabled={loading}>
    //         <Text style={styles.submitButtonText}>Report Issue</Text>
    //         </TouchableOpacity>

    //         {/* Loading Spinner for Map Modal Opening */}
    //         {(loading || mapLoading) && (
    //         <View style={styles.loadingOverlay}>
    //             <ActivityIndicator size="large" color="#aa18ea" />
    //         </View>
    //         )}

    //         {/* Map Modal */}
    //         <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
    //         <View style={styles.modalContainer}>
    //             <View style={styles.mapHeader}>
    //             <TextInput
    //                 style={styles.searchBar}
    //                 placeholder="Search location"
    //                 value={searchQuery}
    //                 onChangeText={handleSearch}
    //             />
    //             <TouchableOpacity onPress={closeModalAndResetSearch} style={styles.closeButton}>
    //                 <Text style={styles.closeButtonText}>X</Text>
    //             </TouchableOpacity>
    //             {searchResults.length > 0 && (
    //                 <FlatList
    //                 data={searchResults}
    //                 keyExtractor={(item, index) => index.toString()}
    //                 renderItem={({ item }) => (
    //                     <TouchableOpacity onPress={() => handleSelectLocation(item)}>
    //                     <Text style={styles.searchResult}>{item.display_name || item.road || 'Nearby place'}</Text>
    //                     </TouchableOpacity>
    //                 )}
    //                 />
    //             )}
    //             </View>
    //             <MapView
    //             style={styles.map}
    //             region={{
    //                 latitude: selectedLocation ? selectedLocation.latitude : 37.78825,
    //                 longitude: selectedLocation ? selectedLocation.longitude : -122.4324,
    //                 latitudeDelta: 0.05,
    //                 longitudeDelta: 0.05,
    //             }}
    //             onPress={(e) => {
    //                 const { latitude, longitude } = e.nativeEvent.coordinate;
    //                 setSelectedLocation({ latitude, longitude });
    //             }}
    //             >
    //             {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
    //             {nearbyPlaces.map((place, index) => (
    //                 <Marker
    //                 key={index}
    //                 coordinate={{
    //                     latitude: parseFloat(place.lat),
    //                     longitude: parseFloat(place.lon),
    //                 }}
    //                 title={place.display_name || "Nearby Place"}
    //                 />
    //             ))}
    //             </MapView>
    //             <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
    //             <Text style={styles.confirmButtonText}>Confirm Location</Text>
    //             </TouchableOpacity>
    //         </View>
    //         </Modal>
    //     </View>
    //     </TouchableWithoutFeedback>
    // );
    // };

    // const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     padding: 20,
    //     backgroundColor: '#f5f5f5',
    // },
    // title: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     marginBottom: 20,
    //     textAlign: 'center',
    // },
    // card: {
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     padding: 15,
    //     marginBottom: 20,
    //     elevation: 3,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 2,
    // },
    // label: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     marginBottom: 5,
    // },
    // input: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     padding: 10,
    //     borderRadius: 5,
    //     marginBottom: 15,
    // },
    // textArea: {
    //     height: 100,
    //     textAlignVertical: 'top',
    // },
    // button: {
    //     padding: 15,
    //     backgroundColor: '#aa18ea',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     marginVertical: 10,
    // },
    // buttonText: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    // },
    // submitButton: {
    //     padding: 15,
    //     backgroundColor: '#aa18ea',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     marginTop: 10,
    // },
    // submitButtonText: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    // },
    // modalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     backgroundColor: 'white',
    // },
    // mapHeader: {
    //     position: 'absolute',
    //     top: Platform.OS === 'ios' ? 50 : 20,
    //     left: 20,
    //     right: 20,
    //     backgroundColor: 'white',
    //     padding: 10,
    //     borderRadius: 10,
    //     zIndex: 1,
    //     shadowColor: '#000',
    //     shadowOpacity: 0.3,
    //     shadowRadius: 10,
    //     shadowOffset: { width: 0, height: 2 },
    //     elevation: 5,
    // },
    // searchBar: {
    //     height: 40,
    //     padding: 10,
    //     borderRadius: 10,
    //     borderColor: '#ccc',
    //     borderWidth: 1,
    //     backgroundColor: '#f5f5f5',
    // },
    // searchResult: {
    //     padding: 10,
    //     fontSize: 16,
    // },
    // map: {
    //     flex: 1,
    // },
    // confirmButton: {
    //     position: 'absolute',
    //     bottom: 30,
    //     left: 20,
    //     right: 20,
    //     backgroundColor: '#aa18ea',
    //     padding: 15,
    //     borderRadius: 10,
    //     alignItems: 'center',
    // },
    // confirmButtonText: {
    //     color: 'white',
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    // loadingOverlay: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: 'rgba(255, 255, 255, 0.7)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // },
    // closeButton: {
    //     position: 'absolute',
    //     top: 10,
    //     right: 10,
    //     padding: 10,
    // },
    // closeButtonText: {
    //     fontSize: 18,
    //     color: '#333',
    // },
    // });

    // export default ReportVehicleIssueScreen;



    // import React, { useState, useEffect, useContext } from 'react';
    // import {
    //   View,
    //   Text,
    //   TextInput,
    //   Alert,
    //   StyleSheet,
    //   TouchableOpacity,
    //   Keyboard,
    //   TouchableWithoutFeedback,
    //   Modal,
    //   ActivityIndicator,
    //   FlatList,
    //   Platform,
    // } from 'react-native';
    // import axios from 'axios';
    // import { BASE_URL } from '../../config';
    // import { AuthContext } from '../../helpers/Auth';
    // import * as Location from 'expo-location';
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    // import MapView, { Marker } from 'react-native-maps';
    
    // const ReportVehicleIssueScreen = ({ navigation }) => {
    //   const { userSession } = useContext(AuthContext);
    //   const [vehicleRegNo, setVehicleRegNo] = useState('');
    //   const [confirmRegNo, setConfirmRegNo] = useState('');
    //   const [issueDescription, setIssueDescription] = useState('');
    //   const [phone, setPhone] = useState(userSession.phone || '');
    //   const [location, setLocation] = useState(null);
    //   const [loading, setLoading] = useState(false);
    //   const [mapLoading, setMapLoading] = useState(false);
    //   const [mapModalVisible, setMapModalVisible] = useState(false);
    //   const [selectedLocation, setSelectedLocation] = useState(null);
    //   const [searchQuery, setSearchQuery] = useState('');
    //   const [searchResults, setSearchResults] = useState([]);
    //   const [nearbyPlaces, setNearbyPlaces] = useState([]);
    
    //   useEffect(() => {
    //     const checkForAcceptedRequest = async () => {
    //       const storedRequest = await AsyncStorage.getItem('acceptedRequest');
    //       if (storedRequest) {
    //         navigation.replace('RequestVehicleDetails', JSON.parse(storedRequest));
    //       }
    //     };
    //     checkForAcceptedRequest();
    //   }, []);
    
    //   const handleReportIssue = async () => {
    //     if (!vehicleRegNo || !confirmRegNo || !phone || !issueDescription || !location) {
    //       Alert.alert('Error', 'All fields are required.');
    //       return;
    //     }
    
    //     if (vehicleRegNo !== confirmRegNo) {
    //       Alert.alert('Error', 'Vehicle registration numbers do not match.');
    //       return;
    //     }
    
    //     if (phone.length !== 11) {
    //       Alert.alert('Error', 'Phone number must be exactly 11 digits.');
    //       return;
    //     }
    
    //     const reportData = {
    //       userId: userSession._id,
    //       name: userSession.name,
    //       phone,
    //       email: userSession.email,
    //       vehicleRegNo,
    //       confirmRegNo,
    //       issueDescription,
    //       location,
    //     };
    
    //     try {
    //       setLoading(true);
    //       const response = await axios.post(
    //         `${BASE_URL}/api/vehicle-assistance/report`,
    //         reportData,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${userSession.token}`,
    //           },
    //         }
    //       );
    //       if (response.data.success) {
    //         const requestId = response.data.requestId;
    //         Alert.alert('Success', 'Issue reported successfully');
    //         checkReportStatus(requestId);
    //       }
    //     } catch (error) {
    //       console.error('Error reporting issue:', error);
    //       Alert.alert('Error', 'Failed to report issue.');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    
    //   const checkReportStatus = async (requestId) => {
    //     console.log(requestId);
    //     try {
    //       const response = await axios.get(
    //         `${BASE_URL}/api/vehicle-assistance/request-status/${requestId}`,
    //         {
    //           headers: {
    //             Authorization: `Bearer ${userSession.token}`,
    //           },
    //         }
    //       );
    //       if (response.data.success && response.data.isAccepted) {
    //         await AsyncStorage.setItem('acceptedRequest', JSON.stringify(response.data));
    //         navigation.replace('RequestVehicleDetails', response.data);
    //       }
    //     } catch (error) {
    //       console.error('Error checking request status:', error);
    //     }
    //   };
    
    //   const openLocationOptions = () => {
    //     Alert.alert(
    //       "Select Location",
    //       "Choose your current location or select manually",
    //       [
    //         { text: "Use My Current Location", onPress: fetchCurrentLocation },
    //         { text: "Select Manually", onPress: fetchCurrentLocation },
    //         { text: "Cancel", style: "cancel" }
    //       ]
    //     );
    //   };
    
    //   const fetchCurrentLocation = async () => {
    //     setLoading(true);
    //     try {
    //       const { status } = await Location.requestForegroundPermissionsAsync();
    //       if (status !== 'granted') {
    //         Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
    //         setLoading(false);
    //         return;
    //       }
    
    //       const currentLocation = await Location.getCurrentPositionAsync({});
    //       const { latitude, longitude } = currentLocation.coords;
    //       setSelectedLocation({ latitude, longitude });
    //       setLocation({ latitude, longitude });
    //       openMapWithLoader();
    //     } catch (error) {
    //       console.error('Error fetching current location:', error);
    //       Alert.alert('Error', 'Failed to get current location. Please try again.');
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    
    //   const openMapWithLoader = () => {
    //     setMapLoading(true);
    //     setMapModalVisible(true);
    //     setTimeout(() => setMapLoading(false), 500);
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
    
    //   const handleSelectLocation = (location) => {
    //     setSelectedLocation({
    //       latitude: parseFloat(location.lat),
    //       longitude: parseFloat(location.lon),
    //     });
    //     setSearchQuery(location.display_name);
    //     setSearchResults([]);
    //   };
    
    //   const handleConfirmLocation = () => {
    //     if (selectedLocation) {
    //       setLocation(selectedLocation);
    //       setMapModalVisible(false);
    //     } else {
    //       Alert.alert('Error', 'Please select a location first.');
    //     }
    //   };
    
    //   const closeModalAndResetSearch = () => {
    //     setSearchQuery('');
    //     setSearchResults([]);
    //     setMapModalVisible(false);
    //   };
    
    //   return (
    //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    //       <View style={styles.container}>
    //         <Text style={styles.title}>Report Vehicle Assistance</Text>
    
    //         <View style={styles.card}>
    //           <Text style={styles.label}>Vehicle Registration Number</Text>
    //           <TextInput
    //             placeholder="Enter Vehicle Registration Number"
    //             style={styles.input}
    //             value={vehicleRegNo}
    //             onChangeText={setVehicleRegNo}
    //           />
    
    //           <Text style={styles.label}>Confirm Registration Number</Text>
    //           <TextInput
    //             placeholder="Re-enter Registration Number"
    //             style={styles.input}
    //             value={confirmRegNo}
    //             onChangeText={setConfirmRegNo}
    //           />
    
    //           <Text style={styles.label}>Contact Number</Text>
    //           <TextInput
    //             placeholder="Enter Contact Number"
    //             style={styles.input}
    //             value={phone}
    //             onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
    //             keyboardType="phone-pad"
    //             maxLength={11}
    //           />
    
    //           <Text style={styles.label}>Issue Description</Text>
    //           <TextInput
    //             placeholder="Describe the issue"
    //             style={[styles.input, styles.textArea]}
    //             value={issueDescription}
    //             onChangeText={setIssueDescription}
    //             multiline
    //           />
    
    //           <TouchableOpacity style={styles.button} onPress={openLocationOptions}>
    //             <Text style={styles.buttonText}>Select Location</Text>
    //           </TouchableOpacity>
    //         </View>
    
    //         <TouchableOpacity style={styles.submitButton} onPress={handleReportIssue} disabled={loading}>
    //           <Text style={styles.submitButtonText}>Report Issue</Text>
    //         </TouchableOpacity>
    
    //         {(loading || mapLoading) && (
    //           <View style={styles.loadingOverlay}>
    //             <ActivityIndicator size="large" color="#aa18ea" />
    //           </View>
    //         )}
    
    //         <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
    //           <View style={styles.modalContainer}>
    //             <View style={styles.mapHeader}>
    //               <TextInput
    //                 style={styles.searchBar}
    //                 placeholder="Search location"
    //                 value={searchQuery}
    //                 onChangeText={handleSearch}
    //               />
    //               <TouchableOpacity onPress={closeModalAndResetSearch} style={styles.closeButton}>
    //                 <Text style={styles.closeButtonText}>X</Text>
    //               </TouchableOpacity>
    //               {searchResults.length > 0 && (
    //                 <FlatList
    //                   data={searchResults}
    //                   keyExtractor={(item, index) => index.toString()}
    //                   renderItem={({ item }) => (
    //                     <TouchableOpacity onPress={() => handleSelectLocation(item)}>
    //                       <Text style={styles.searchResult}>{item.display_name || item.road || 'Nearby place'}</Text>
    //                     </TouchableOpacity>
    //                   )}
    //                 />
    //               )}
    //             </View>
    //             <MapView
    //               style={styles.map}
    //               region={{
    //                 latitude: selectedLocation ? selectedLocation.latitude : 37.78825,
    //                 longitude: selectedLocation ? selectedLocation.longitude : -122.4324,
    //                 latitudeDelta: 0.05,
    //                 longitudeDelta: 0.05,
    //               }}
    //               onPress={(e) => {
    //                 const { latitude, longitude } = e.nativeEvent.coordinate;
    //                 setSelectedLocation({ latitude, longitude });
    //               }}
    //             >
    //               {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
    //               {nearbyPlaces.map((place, index) => (
    //                 <Marker
    //                   key={index}
    //                   coordinate={{
    //                     latitude: parseFloat(place.lat),
    //                     longitude: parseFloat(place.lon),
    //                   }}
    //                   title={place.display_name || "Nearby Place"}
    //                 />
    //               ))}
    //             </MapView>
    //             <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
    //               <Text style={styles.confirmButtonText}>Confirm Location</Text>
    //             </TouchableOpacity>
    //           </View>
    //         </Modal>
    //       </View>
    //     </TouchableWithoutFeedback>
    //   );
    // };
    
    // const styles = StyleSheet.create({
    //   container: {
    //     flex: 1,
    //     padding: 20,
    //     backgroundColor: '#f5f5f5',
    //   },
    //   title: {
    //     fontSize: 24,
    //     fontWeight: 'bold',
    //     marginBottom: 20,
    //     textAlign: 'center',
    //   },
    //   card: {
    //     backgroundColor: '#fff',
    //     borderRadius: 8,
    //     padding: 15,
    //     marginBottom: 20,
    //     elevation: 3,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 2,
    //   },
    //   label: {
    //     fontSize: 16,
    //     fontWeight: 'bold',
    //     marginBottom: 5,
    //   },
    //   input: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     padding: 10,
    //     borderRadius: 5,
    //     marginBottom: 15,
    //   },
    //   textArea: {
    //     height: 100,
    //     textAlignVertical: 'top',
    //   },
    //   button: {
    //     padding: 15,
    //     backgroundColor: '#aa18ea',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     marginVertical: 10,
    //   },
    //   buttonText: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    //   },
    //   submitButton: {
    //     padding: 15,
    //     backgroundColor: '#aa18ea',
    //     borderRadius: 5,
    //     alignItems: 'center',
    //     marginTop: 10,
    //   },
    //   submitButtonText: {
    //     color: '#fff',
    //     fontWeight: 'bold',
    //   },
    //   modalContainer: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     backgroundColor: 'white',
    //   },
    //   mapHeader: {
    //     position: 'absolute',
    //     top: Platform.OS === 'ios' ? 50 : 20,
    //     left: 20,
    //     right: 20,
    //     backgroundColor: 'white',
    //     padding: 10,
    //     borderRadius: 10,
    //     zIndex: 1,
    //     shadowColor: '#000',
    //     shadowOpacity: 0.3,
    //     shadowRadius: 10,
    //     shadowOffset: { width: 0, height: 2 },
    //     elevation: 5,
    //   },
    //   searchBar: {
    //     height: 40,
    //     padding: 10,
    //     borderRadius: 10,
    //     borderColor: '#ccc',
    //     borderWidth: 1,
    //     backgroundColor: '#f5f5f5',
    //   },
    //   searchResult: {
    //     padding: 10,
    //     fontSize: 16,
    //   },
    //   map: {
    //     flex: 1,
    //   },
    //   confirmButton: {
    //     position: 'absolute',
    //     bottom: 30,
    //     left: 20,
    //     right: 20,
    //     backgroundColor: '#aa18ea',
    //     padding: 15,
    //     borderRadius: 10,
    //     alignItems: 'center',
    //   },
    //   confirmButtonText: {
    //     color: 'white',
    //     fontSize: 18,
    //     fontWeight: 'bold',
    //   },
    //   loadingOverlay: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: 'rgba(255, 255, 255, 0.7)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //   },
    //   closeButton: {
    //     position: 'absolute',
    //     top: 10,
    //     right: 10,
    //     padding: 10,
    //   },
    //   closeButtonText: {
    //     fontSize: 18,
    //     color: '#333',
    //   },
    // });
    
    // export default ReportVehicleIssueScreen;
    

    ////
    import React, { useState, useEffect, useContext } from 'react';
    import {
      View,
      Text,
      TextInput,
      Alert,
      StyleSheet,
      TouchableOpacity,
      Keyboard,
      TouchableWithoutFeedback,
      Modal,
      ActivityIndicator,
      FlatList,
      Platform,
    } from 'react-native';
    import axios from 'axios';
    import { BASE_URL } from '../../config';
    import { AuthContext } from '../../helpers/Auth';
    import * as Location from 'expo-location';
    import MapView, { Marker } from 'react-native-maps';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { useIsFocused } from '@react-navigation/native';
    
    const ReportVehicleIssueScreen = ({ navigation }) => {
      const { userSession } = useContext(AuthContext);
      const [vehicleRegNo, setVehicleRegNo] = useState('');
      const [confirmRegNo, setConfirmRegNo] = useState('');
      const [issueDescription, setIssueDescription] = useState('');
      const [phone, setPhone] = useState(userSession.phone || '');
      const [location, setLocation] = useState(null);
      const [loading, setLoading] = useState(false);
      const [mapLoading, setMapLoading] = useState(false);
      const [initialLoading, setInitialLoading] = useState(true); // Loader for initial check
      const [mapModalVisible, setMapModalVisible] = useState(false);
      const [selectedLocation, setSelectedLocation] = useState(null);
      const [searchQuery, setSearchQuery] = useState('');
      const [searchResults, setSearchResults] = useState([]);
      const [nearbyPlaces, setNearbyPlaces] = useState([]); // State to store nearby places
    
      const isFocused = useIsFocused();
    
      useEffect(() => {
        // const checkForPendingRequest = async () => {
        //   setInitialLoading(true); // Start loader for initial check
        //   try {
        //     // const storedRequest = await AsyncStorage.getItem('acceptedRequest');
        //     const storedRequest = await AsyncStorage.getItem(`acceptedRequest_${userSession._id}`);

        //     if (storedRequest) {
        //       const parsedRequest = JSON.parse(storedRequest);
        //       // Navigate directly to the waiting screen without rendering ReportVehicleIssueScreen
        //       navigation.reset({
        //         index: 0,
        //         routes: [{ name: 'RequestWaiting', params: parsedRequest }],
        //       });
        //       return;
        //     }
        //   } finally {
        //     setInitialLoading(false); // Stop loader after check is complete
        //   }
        // };
        const checkForPendingRequest = async () => {
          setInitialLoading(true); // Start loader for initial check
          try {
            const storedRequest = await AsyncStorage.getItem(`acceptedRequest_${userSession._id}`);
            if (storedRequest) {
              const parsedRequest = JSON.parse(storedRequest);
              navigation.reset({
                index: 0,
                routes: [{ name: 'RequestWaiting', params: parsedRequest }],
              });
              return;
            }
          } finally {
            setInitialLoading(false); // Stop loader after check is complete
          }
        };
        
    
        // Check for pending request when the screen gains focus
        if (isFocused) {
          checkForPendingRequest();
        }
      }, [isFocused]);
    
      // Render the screen only if there is no pending request
      if (initialLoading) {
        return (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#aa18ea" />
          </View>
        );
      }
    
      const handleReportIssue = async () => {
        if (!vehicleRegNo || !confirmRegNo || !phone || !issueDescription || !location) {
          Alert.alert('Error', 'All fields are required.');
          return;
        }
    
        if (vehicleRegNo !== confirmRegNo) {
          Alert.alert('Error', 'Vehicle registration numbers do not match.');
          return;
        }
    
        if (phone.length !== 11) {
          Alert.alert('Error', 'Phone number must be exactly 11 digits.');
          return;
        }
    
        const reportData = {
          userId: userSession._id,
          name: userSession.name,
          phone,
          email: userSession.email,
          vehicleRegNo,
          confirmRegNo,
          issueDescription,
          location,
        };
    
        try {
          setLoading(true);
          const response = await axios.post(
            `${BASE_URL}/api/vehicle-assistance/report`,
            reportData,
            {
              headers: {
                Authorization: `Bearer ${userSession.token}`,
              },
            }
          );
          if (response.data.success) {
            const requestId = response.data.requestId;
            // await AsyncStorage.setItem('acceptedRequest', JSON.stringify({ requestId, accepted: false }));
            await AsyncStorage.setItem(
              `acceptedRequest_${userSession._id}`,
              JSON.stringify({ requestId, accepted: false })
            );
            
            navigation.navigate('RequestWaiting', { requestId });
          }
        } catch (error) {
          console.error('Error reporting issue:', error);
          Alert.alert('Error', 'Failed to report issue.');
        } finally {
          setLoading(false);
        }
      };
    
      const openLocationOptions = () => {
        Alert.alert(
          "Select Location",
          "Choose your current location or select manually",
          [
            { text: "Use My Current Location", onPress: fetchCurrentLocation },
            { text: "Select Manually", onPress: fetchCurrentLocation },
            { text: "Cancel", style: "cancel" }
          ]
        );
      };
    
      const fetchCurrentLocation = async () => {
        setLoading(true);
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
            setLoading(false);
            return;
          }
    
          const currentLocation = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = currentLocation.coords;
          setSelectedLocation({ latitude, longitude });
          setLocation({ latitude, longitude });
          openMapWithLoader();
        } catch (error) {
          console.error('Error fetching current location:', error);
          Alert.alert('Error', 'Failed to get current location. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    
      const openMapWithLoader = () => {
        setMapLoading(true);
        setMapModalVisible(true);
        setTimeout(() => setMapLoading(false), 500);
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
    
      const handleSelectLocation = (location) => {
        setSelectedLocation({
          latitude: parseFloat(location.lat),
          longitude: parseFloat(location.lon),
        });
        setSearchQuery(location.display_name);
        setSearchResults([]);
      };
    
      const handleConfirmLocation = () => {
        if (selectedLocation) {
          setLocation(selectedLocation);
          setMapModalVisible(false);
        } else {
          Alert.alert('Error', 'Please select a location first.');
        }
      };
    
      const closeModalAndResetSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setMapModalVisible(false);
      };
    
      return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.title}>Report Vehicle Assistance</Text>
    
            {initialLoading ? (
              <ActivityIndicator size="large" color="#aa18ea" />
            ) : (
              <View style={styles.card}>
                <Text style={styles.label}>Vehicle Registration Number</Text>
                <TextInput
                  placeholder="Enter Vehicle Registration Number"
                  style={styles.input}
                  value={vehicleRegNo}
                  onChangeText={setVehicleRegNo}
                />
    
                <Text style={styles.label}>Confirm Registration Number</Text>
                <TextInput
                  placeholder="Re-enter Registration Number"
                  style={styles.input}
                  value={confirmRegNo}
                  onChangeText={setConfirmRegNo}
                />
    
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  placeholder="Enter Contact Number"
                  style={styles.input}
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                  keyboardType="phone-pad"
                  maxLength={11}
                />
    
                <Text style={styles.label}>Issue Description</Text>
                <TextInput
                  placeholder="Describe the issue"
                  style={[styles.input, styles.textArea]}
                  value={issueDescription}
                  onChangeText={setIssueDescription}
                  multiline
                />
    
                <TouchableOpacity style={styles.button} onPress={openLocationOptions}>
                  <Text style={styles.buttonText}>Select Location</Text>
                </TouchableOpacity>
              </View>
            )}
    
            <TouchableOpacity style={styles.submitButton} onPress={handleReportIssue} disabled={loading}>
              <Text style={styles.submitButtonText}>Report Issue</Text>
            </TouchableOpacity>
    
            {(loading || mapLoading) && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#aa18ea" />
              </View>
            )}
    
            <Modal visible={mapModalVisible} animationType="slide" transparent={true}>
              <View style={styles.modalContainer}>
                <View style={styles.mapHeader}>
                  <TextInput
                    style={styles.searchBar}
                    placeholder="Search location"
                    value={searchQuery}
                    onChangeText={handleSearch}
                  />
                  <TouchableOpacity onPress={closeModalAndResetSearch} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>X</Text>
                  </TouchableOpacity>
                  {searchResults.length > 0 && (
                    <FlatList
                      data={searchResults}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleSelectLocation(item)}>
                          <Text style={styles.searchResult}>{item.display_name || item.road || 'Nearby place'}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
                <MapView
                  style={styles.map}
                  region={{
                    latitude: selectedLocation ? selectedLocation.latitude : 37.78825,
                    longitude: selectedLocation ? selectedLocation.longitude : -122.4324,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  onPress={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setSelectedLocation({ latitude, longitude });
                  }}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} title="Selected Location" />}
                  {nearbyPlaces.map((place, index) => (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: parseFloat(place.lat),
                        longitude: parseFloat(place.lon),
                      }}
                      title={place.display_name || "Nearby Place"}
                    />
                  ))}
                </MapView>
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
                  <Text style={styles.confirmButtonText}>Confirm Location</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
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
        textAlign: 'center',
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
      },
      textArea: {
        height: 100,
        textAlignVertical: 'top',
      },
      button: {
        padding: 15,
        backgroundColor: '#aa18ea',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
      },
      buttonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      submitButton: {
        padding: 15,
        backgroundColor: '#aa18ea',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
      },
      submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
      },
      mapHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : 20,
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
    
    export default ReportVehicleIssueScreen;
    