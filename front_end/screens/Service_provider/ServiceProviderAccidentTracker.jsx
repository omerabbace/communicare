import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { db } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import * as Location from 'expo-location';
import axios from 'axios';
import { AuthContext } from '../../helpers/Auth';

const ServiceProviderAccidentTracker = ({ route }) => {
  const { accident } = route.params;
  const [serviceProviderLocation, setServiceProviderLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userSession } = useContext(AuthContext);

  const OPEN_ROUTE_API_KEY = '5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5';

  useEffect(() => {
    if (!accident) {
      Alert.alert('Error', 'No accident data found.');
      return;
    }

    let locationSubscription;

    const startLocationTracking = async () => {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to track your location.');
        setLoading(false);
        return;
      }

      // Start location tracking
      locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        async (location) => {
          const currentCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          // Update Firebase
          const locationRef = ref(db, `locations/${userSession._id}`);
          set(locationRef, currentCoords).catch((error) => {
            console.error('Error updating location in Firebase:', error);
          });

          // Update state
          setServiceProviderLocation(currentCoords);

          // Fetch route directions
          fetchRouteDirections(
            currentCoords.latitude,
            currentCoords.longitude,
            parseFloat(accident.location.latitude),
            parseFloat(accident.location.longitude)
          );
        }
      );
    };

    const fetchRouteDirections = async (startLat, startLon, endLat, endLon) => {
      try {
        const response = await axios.get(
          `https://api.openrouteservice.org/v2/directions/driving-car`,
          {
            params: {
              api_key: OPEN_ROUTE_API_KEY,
              start: `${startLon},${startLat}`,
              end: `${endLon},${endLat}`,
            },
          }
        );

        if (response.data && response.data.features.length > 0) {
          const coordinates = response.data.features[0].geometry.coordinates.map((coord) => ({
            latitude: coord[1],
            longitude: coord[0],
          }));
          setRouteCoordinates(coordinates);
        }
      } catch (error) {
        console.error('Error fetching route directions:', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    startLocationTracking().catch((error) => {
      console.error('Error starting location tracking:', error);
      Alert.alert('Error', 'Failed to start location tracking.');
      setLoading(false);
    });

    return () => {
      if (locationSubscription) locationSubscription.remove();
    };
  }, [userSession, accident]);

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accident Tracker</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(accident.location.latitude),
          longitude: parseFloat(accident.location.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: parseFloat(accident.location.latitude),
            longitude: parseFloat(accident.location.longitude),
          }}
          title="Accident Location"
          pinColor="red"
        />
        {serviceProviderLocation && (
          <Marker
            coordinate={serviceProviderLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#007bff"
            strokeWidth={5}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
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

export default ServiceProviderAccidentTracker;
