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
import { db } from '../../firebaseConfig';  // Import Firebase database
import { ref, onValue, set } from 'firebase/database';  // Import required methods
import { AuthContext } from '../../helpers/Auth';

const ViewReportedAccidents = () => {
    const [loading, setLoading] = useState(false);
    const [accidents, setAccidents] = useState([]);
    const [location, setLocation] = useState(null);
    const { userSession } = useContext(AuthContext);

    useEffect(() => {
        getLocationAsync();
        fetchAccidents();

        let locationSubscription;

        // Start watching the location
        Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
            (loc) => {
                setLocation(loc.coords);
                updateLocationInFirebase(loc.coords);
            }
        ).then(subscription => {
            locationSubscription = subscription;
        }).catch(error => {
            console.error('Error watching location:', error);
        });

        // Clean up the location watcher when the component unmounts
        return () => {
            if (locationSubscription) {
                locationSubscription.remove();
            }
        };
    }, []);

    const getLocationAsync = async () => {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Location Permission Denied', 'Permission to access location was denied.');
            setLoading(false);
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        setLoading(false);
    };

    const updateLocationInFirebase = async (coords) => {
        const locationRef = ref(db, `locations/${userSession._id}`);
        try {
            await set(locationRef, {
                latitude: coords.latitude.toString(),
                longitude: coords.longitude.toString(),
            });
        } catch (error) {
            console.error('Error updating location in Firebase:', error);
        }
    };

    const fetchAccidents = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userSession')
                .then(data => JSON.parse(data)?.token);

            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                setLoading(false);
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.get(`${BASE_URL}/api/accidents/all`, { headers });
            if (response.data.success) {
                setAccidents(response.data.data);
            } else {
                Alert.alert('Error', 'Failed to fetch accidents.');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching accidents:', error);
            Alert.alert('Error', 'Failed to fetch accidents.');
            setLoading(false);
        }
    };

    const handleSelectAccident = async (accidentId) => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userSession')
                .then(data => JSON.parse(data)?.token);

            if (!token) {
                Alert.alert('Error', 'No authentication token found.');
                setLoading(false);
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                `${BASE_URL}/api/accidents/select/${accidentId}`,
                { serviceProviderLocation: location },  // Pass the service provider's current location
                { headers }
            );

            if (response.data.success) {
                Alert.alert('Success', 'Accident selected successfully.');
                updateAccidentInFirebase(accidentId);
                fetchAccidents();  // Refresh the accident list
            } else {
                Alert.alert('Error', 'Failed to select the accident.');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error selecting accident:', error);
            Alert.alert('Error', 'Failed to select accident.');
            setLoading(false);
        }
    };

    const updateAccidentInFirebase = async (accidentId) => {
        const accidentRef = ref(db, `accidents/${accidentId}`);
        try {
            await set(accidentRef, {
                selectedBy: userSession._id,  // Set the service provider's ID
            });
        } catch (error) {
            console.error('Error updating accident in Firebase:', error);
        }
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
                        <Marker
                            key={accident._id}
                            coordinate={{
                                latitude: parseFloat(accident.location.latitude),
                                longitude: parseFloat(accident.location.longitude),
                            }}
                            pinColor="red"
                            onPress={() => handleSelectAccident(accident._id)}
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
