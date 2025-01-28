// ViewReportedAccidents.js
import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import { db } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { AuthContext } from '../../helpers/Auth';
import { useNavigation } from '@react-navigation/native';

const ViewReportedAccidents = () => {
    const [loading, setLoading] = useState(false);
    const [accidents, setAccidents] = useState([]);
    const [location, setLocation] = useState(null);
    const [locationSubscription, setLocationSubscription] = useState(null); // Add state for subscription
    const { userSession } = useContext(AuthContext);
    const navigation = useNavigation();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        getLocationAsync();
        fetchAccidents();

        const startLocationUpdates = async () => {
            const subscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
                (loc) => {
                    setLocation(loc.coords);
                    updateLocationInFirebase(loc.coords);
                }
            );
            setLocationSubscription(subscription); // Save subscription to state
        };

        startLocationUpdates().catch(error => console.error('Error watching location:', error));

        return () => {
            // Clean up location subscription if it exists
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    const getLocationAsync = async () => {
        try {
            setLoading(true);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied.');
                setLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location.coords);
        } catch (error) {
            console.error('Error getting location:', error);
            Alert.alert('Error', 'Failed to get current location.');
        } finally {
            setLoading(false);
        }
    };

    const updateLocationInFirebase = async (coords) => {
        try {
            const locationRef = ref(db, `locations/${userSession._id}`);
            await set(locationRef, {
                latitude: coords.latitude.toString(),
                longitude: coords.longitude.toString(),
            });
        } catch (error) {
            console.error('Error updating location in Firebase:', error);
        }
    };
    // const fetchAccidents = async () => {
    //     try {   
    //         setLoading(true);
    //         const token = await AsyncStorage.getItem('userSession')
    //             .then(data => JSON.parse(data)?.token);
    
    //         if (!token) {
    //             Alert.alert('Error', 'No authentication token found.');
    //             return;
    //         }
    
    //         const headers = {
    //             Authorization: `Bearer ${token}`,
    //         };
    
    //         const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });
    //         console.log('API Response:', response.data); // Log the full response
    //         if (response.data.success) {
    //             setAccidents(response.data.data);
    //             console.log('Accidentsddsfsfs:', accidents);

    //             console.log('Accidents:', response.data.data);
    //         } else {
    //             Alert.alert('Error', 'Failed to fetch accidents.');
    //         }
    //     } catch (error) {
    //         console.error('Error fetching accidents:', error);
    //         Alert.alert('Error', 'Failed to fetch accidents.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    
//     const fetchAccidents = async () => {
//         try {
//             setLoading(true); // Set loading state
//             const token = await AsyncStorage.getItem('userSession')
//                 .then(data => JSON.parse(data)?.token);
    
//             if (!token) {
//                 Alert.alert('Error', 'No authentication token found.');
//                 return;
//             }
    
//             const headers = {
//                 Authorization: `Bearer ${token}`,
//             };
    
//             const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });
//             console.log('API Response:', response.data); // Log the full response
//             if (response.data.success && response.data.data.length > 0) {
//                 setAccidents(response.data.data); // Update state with fetched data
//                 console.log('Accidents fetched:', response.data.data);
//             } else {
//                 setAccidents([]); // Explicitly set as empty array if no data
//                 Alert.alert('No accidents', 'No accident data found.');
//             }
//         } catch (error) {
//             console.error('Error fetching accidents:', error);
//             Alert.alert('Error', 'Failed to fetch accidents.');
//         } finally {
//             setLoading(false); // End loading state
//         }
//     };
    
//     useEffect(() => {
//         fetchAccidents(); // Fetch accidents on component mount
//     }, []);
    
//     useEffect(() => {
//         if (accidents.length === 0) {
//             console.log('No accident data found.');
//         } else {
//             console.log('Updated accidents:', accidents);
//         }
//     }, [accidents]);
    
//     // const fetchAccidents = async () => {
//     //     try {   
//     //         setLoading(true);
//     //         const token = await AsyncStorage.getItem('userSession')
//     //             .then(data => JSON.parse(data)?.token);

//     //         if (!token) {
//     //             Alert.alert('Error', 'No authentication token found.');
//     //             return;
//     //         }

//     //         const headers = {
//     //             Authorization: `Bearer ${token}`,
//     //         };

//     //         const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });
//     //         if (response.data.success) {
//     //             setAccidents(response.data.data);
//     //             console.log('aciiidede',accidents);
//     //         } else {
//     //             Alert.alert('Error', 'Failed to fetch accidents.');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching accidents:', error);
//     //         Alert.alert('Error', 'Failed to fetch accidents.');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

//     // const handleSelectAccident = async (accidentId) => {
//     //     try {
//     //         setLoading(true);
//     //         const token = await AsyncStorage.getItem('userSession')
//     //             .then(data => JSON.parse(data)?.token);

//     //         if (!token) {
//     //             Alert.alert('Error', 'No authentication token found.');
//     //             return;
//     //         }

//     //         const headers = {
//     //             Authorization: `Bearer ${token}`,
//     //         };

//     //         const response = await axios.post(
//     //             `${BASE_URL}/api/accidents/select/${accidentId}`,
//     //             { serviceProviderLocation: location },
//     //             { headers }
//     //         );

//     //         if (response.data.success) {
//     //             Alert.alert('Success', 'Accident selected successfully.');
//     //             navigation.navigate('Track Accidents', { accidentId });
//     //         } else {
//     //             Alert.alert('Error', 'Failed to select the accident.');
//     //         }
//     //     } catch (error) {
//     //         console.error('Error selecting accident:', error);
//     //         Alert.alert('Error', 'Failed to select accident.');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };
// const handleSelectAccident = async (accidentId) => {
//     if (isProcessing) return; // Prevent multiple calls
//     setIsProcessing(true);

//     if (!accidentId) {
//         Alert.alert('Error', 'No accident data found.');
//         setIsProcessing(false);
//         return;
//     }

//     // Show confirmation dialog before proceeding
//     Alert.alert(
//         'Confirm Selection',
//         'Do you want to select this accident?',
//         [
//             {
//                 text: 'Cancel',
//                 onPress: () => setIsProcessing(false), // Reset processing if canceled
//                 style: 'cancel',
//             },
//             {
//                 text: 'Select',
//                 onPress: async () => {
//                     try {
//                         setLoading(true); // Show loading indicator
//                         const token = await AsyncStorage.getItem('userSession')
//                             .then((data) => JSON.parse(data)?.token);

//                         if (!token) {
//                             Alert.alert('Error', 'No authentication token found.');
//                             setLoading(false);
//                             setIsProcessing(false);
//                             return;
//                         }

//                         const headers = { Authorization: `Bearer ${token}` };
//                         const response = await axios.post(
//                             `${BASE_URL}/api/accidents/select/${accidentId}`,
//                             { serviceProviderLocation: location },
//                             { headers }
//                         );

//                         if (response.data.success) {
//                             setLoading(false);
//                             setIsProcessing(false);
//                             Alert.alert('Success', 'Accident selected successfully.', [
//                                 {
//                                     text: 'OK',
//                                     onPress: () => {
//                                         navigation.navigate('Track Accidents', { accidentId });
//                                     },
//                                 },
//                             ]);
//                         } else {
//                             setLoading(false);
//                             setIsProcessing(false);
//                             Alert.alert('Error', 'Failed to select the accident.');
//                         }
//                     } catch (error) {
//                         console.error('Error selecting accident:', error);
//                         Alert.alert('Error', 'Failed to select accident.');
//                         setLoading(false);
//                         setIsProcessing(false);
//                     }
//                 },
//             },
//         ]
//     );
// };

const fetchAccidents = async () => {
    try {
        setLoading(true); // Set loading state
        const token = await AsyncStorage.getItem('userSession')
            .then(data => JSON.parse(data)?.token);

        if (!token) {
            Alert.alert('Error', 'No authentication token found.');
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });
        console.log('API Response:', response.data); // Log the full response

        if (response.data.success && response.data.data.length > 0) {
            setAccidents(response.data.data); // Update state with fetched data
            console.log('Accidents fetched:', response.data.data);
        } else {
            console.log('No accident data found directly from response.');
            setAccidents([]); // Explicitly set as empty array if no data
        }
    } catch (error) {
        console.error('Error fetching accidents:', error);
        Alert.alert('Error', 'Failed to fetch accidents.');
    } finally {
        setLoading(false); // End loading state
    }
};

useEffect(() => {
    fetchAccidents(); // Fetch accidents on component mount
}, []);

useEffect(() => {
    console.log('Updated accidents from state:', accidents);
}, [accidents]);

const handleSelectAccident = async (accidentId) => {
    if (isProcessing) return; // Prevent multiple calls
    setIsProcessing(true);

    if (!accidentId) {
        Alert.alert('Error', 'No accident data found.');
        setIsProcessing(false);
        return;
    }

    Alert.alert(
        'Confirm Selection',
        'Do you want to select this accident?',
        [
            {
                text: 'Cancel',
                onPress: () => setIsProcessing(false), // Reset processing if canceled
                style: 'cancel',
            },
            {
                text: 'Select',
                onPress: async () => {
                    try {
                        setLoading(true); // Show loading indicator
                        const token = await AsyncStorage.getItem('userSession')
                            .then((data) => JSON.parse(data)?.token);

                        if (!token) {
                            Alert.alert('Error', 'No authentication token found.');
                            setLoading(false);
                            setIsProcessing(false);
                            return;
                        }

                        const headers = { Authorization: `Bearer ${token}` };
                        const response = await axios.post(
                            `${BASE_URL}/api/accidents/select/${accidentId}`,
                            { serviceProviderLocation: location },
                            { headers }
                        );

                        if (response.data.success) {
                            setAccidents((prev) =>
                                prev.filter((acc) => acc._id !== accidentId)
                            ); // Remove selected accident from the list
                            Alert.alert('Success', 'Accident selected successfully.', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.navigate('List of accident', { accidentId });
                                    },
                                },
                            ]);
                        } else {
                            Alert.alert('Error', 'Failed to select the accident.');
                        }
                    } catch (error) {
                        console.error('Error selecting accident:', error);
                        Alert.alert('Error', 'Failed to select accident.');
                    } finally {
                        setLoading(false);
                        setIsProcessing(false);
                    }
                },
            },
        ]
    );
};

    
    return (
        <View style={styles.container}>
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    showsUserLocation={true}
                >
                    {accidents.map((accident) => (
                        // <Marker
                        //     key={accident._id}
                        //     coordinate={{
                        //         latitude: parseFloat(accident.location.latitude),
                        //         longitude: parseFloat(accident.location.longitude),
                        //     }}
                        //     pinColor="red"
                        //     onPress={() => handleSelectAccident(accident._id)}
                        // >
                        //     <Callout>
                        //         <Text>{`Severity: ${accident.accidentSeverity}`}</Text>
                        //         <Text>{`Phone: ${accident.phoneNumber}`}</Text>
                        //     </Callout>
                        // </Marker>
                        <Marker
    key={accident._id}
    coordinate={{
        latitude: parseFloat(accident.location.latitude),
        longitude: parseFloat(accident.location.longitude),
    }}
    pinColor="red"
    onPress={() => handleSelectAccident(accident._id)} // Pass the correct accidentId
>
    <Callout>
        <Text>{`Severity: ${accident.accidentSeverity}`}</Text>
        <Text>{`Phone: ${accident.phoneNumber}`}</Text>
    </Callout>
</Marker>

                    ))}
                </MapView>
            )}

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#aa18ea" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    map: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ViewReportedAccidents;

// import React, { useState, useEffect, useContext } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     ActivityIndicator,
//     Alert,
// } from 'react-native';
// import MapView, { Marker, Callout } from 'react-native-maps';
// import axios from 'axios';
// import * as Location from 'expo-location';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';
// import { AuthContext } from '../../helpers/Auth';
// import { useNavigation } from '@react-navigation/native';

// const ViewReportedAccidents = () => {
//     const [loading, setLoading] = useState(false);
//     const [accidents, setAccidents] = useState([]);
//     const [location, setLocation] = useState(null);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const { userSession } = useContext(AuthContext);
//     const navigation = useNavigation();

//     useEffect(() => {
//         initializeLocationAndFetchAccidents();
//     }, []);

//     const initializeLocationAndFetchAccidents = async () => {
//         try {
//             await getLocationAsync();
//             await fetchAccidents();
//         } catch (error) {
//             console.error('Error initializing data:', error);
//         }
//     };

//     const getLocationAsync = async () => {
//         try {
//             setLoading(true);
//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 Alert.alert('Permission Denied', 'Permission to access location was denied.');
//                 return;
//             }
//             const currentLocation = await Location.getCurrentPositionAsync({});
//             setLocation(currentLocation.coords);
//         } catch (error) {
//             console.error('Error getting location:', error);
//             Alert.alert('Error', 'Failed to get current location.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAccidents = async () => {
//         try {
//             setLoading(true);
//             const token = await AsyncStorage.getItem('userSession')
//                 .then((data) => JSON.parse(data)?.token);

//             if (!token) {
//                 Alert.alert('Error', 'No authentication token found.');
//                 return;
//             }

//             const headers = { Authorization: `Bearer ${token}` };
//             const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });

//             if (response.data.success && response.data.data.length > 0) {
//                 setAccidents(response.data.data);
//             } else {
//                 setAccidents([]);
//                 console.log('No accident data found in response.');
//             }
//         } catch (error) {
//             console.error('Error fetching accidents:', error);
//             Alert.alert('Error', 'Failed to fetch accidents.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSelectAccident = async (accidentId) => {
//         console.log('i am selected accident id ', accidentId);
//         if (isProcessing) return; // Prevent duplicate calls
//         setIsProcessing(true);
    
//         if (!accidentId) {
//             Alert.alert('Error', 'No accident data found.');
//             setIsProcessing(false);
//             return;
//         }
    
//         // Show confirmation dialog before proceeding
//         Alert.alert(
//             'Confirm Selection',
//             'Do you want to select this accident?',
//             [
//                 {
//                     text: 'Cancel',
//                     onPress: () => setIsProcessing(false), // Reset processing if canceled
//                     style: 'cancel',
//                 },
//                 {
//                     text: 'Select',
//                     onPress: async () => {
//                         try {
//                             setLoading(true); // Show loading indicator
    
//                             const token = await AsyncStorage.getItem('userSession')
//                                 .then((data) => JSON.parse(data)?.token);
    
//                             if (!token) {
//                                 Alert.alert('Error', 'No authentication token found.');
//                                 setLoading(false);
//                                 setIsProcessing(false);
//                                 return;
//                             }
    
//                             console.log('i am selected accident id twoo', accidentId);
    
//                             const headers = { Authorization: `Bearer ${token}` };
//                             const response = await axios.post(
//                                 `${BASE_URL}/api/accidents/select/${accidentId}`,
//                                 { serviceProviderLocation: location },
//                                 { headers }
//                             );
    
//                             if (response.data.success) {
//                                 // Temporarily store the selected accident ID
//                                 const selectedAccidentId = accidentId;
    
//                                 // Update the state to remove the selected accident
//                                 setAccidents((prev) =>
//                                     prev.filter((acc) => acc._id !== accidentId)
//                                 );
    
//                                 console.log('i am selected accident id three', selectedAccidentId);
    
//                                 // Navigate to the next screen after a small delay to ensure state updates
//                                 setTimeout(() => {
//                                     navigation.navigate('List of accident', { accidentId: selectedAccidentId });
//                                 }, 100); // Delay navigation slightly to prevent interference
//                             } else {
//                                 Alert.alert('Error', 'Failed to select the accident.');
//                             }
//                         } catch (error) {
//                             console.error('Error selecting accident:', error);
//                             Alert.alert('Error', 'Failed to select accident.');
//                         } finally {
//                             setLoading(false);
//                             setIsProcessing(false);
//                         }
//                     },
//                 },
//             ]
//         );
//     };
    
    

//     return (
//         <View style={styles.container}>
//             {location && (
//                 <MapView
//                     style={styles.map}
//                     initialRegion={{
//                         latitude: location.latitude,
//                         longitude: location.longitude,
//                         latitudeDelta: 0.0922,
//                         longitudeDelta: 0.0421,
//                     }}
//                     showsUserLocation={true}
//                 >
//                     {accidents.map((accident) => (
//                         <Marker
//                             key={accident._id}
//                             coordinate={{
//                                 latitude: parseFloat(accident.location.latitude),
//                                 longitude: parseFloat(accident.location.longitude),
//                             }}
//                             pinColor="red"
//                             onPress={() => handleSelectAccident(accident._id)}
//                         >
//                             <Callout>
//                                 <Text>{`Severity: ${accident.accidentSeverity}`}</Text>
//                                 <Text>{`Phone: ${accident.phoneNumber}`}</Text>
//                             </Callout>
//                         </Marker>
//                     ))}
//                 </MapView>
//             )}

//             {loading && (
//                 <View style={styles.loadingOverlay}>
//                     <ActivityIndicator size="large" color="#aa18ea" />
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     map: {
//         flex: 1,
//     },
//     loadingOverlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: 'rgba(255, 255, 255, 0.7)',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
// });

// export default ViewReportedAccidents;
