import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebaseConfig'; // Import Firebase config
import { ref, onValue, off } from 'firebase/database';

const TrackServiceProvider = ({ route }) => {
  const { accidentId } = route.params;
  const [serviceProviderLocation, setServiceProviderLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceProviderDetails, setServiceProviderDetails] = useState(null);

  useEffect(() => {
    const accidentRef = ref(db, `accidents/${accidentId}`);
    
    onValue(accidentRef, (snapshot) => {
      const accidentData = snapshot.val();
      if (accidentData && accidentData.selectedBy) {
        setServiceProviderDetails({
          name: accidentData.selectedBy.name, // Assuming the name is stored in the selectedBy field
          phoneNumber: accidentData.selectedBy.phoneNumber, // Assuming the phone number is stored in the selectedBy field
        });

        const locationRef = ref(db, `locations/${accidentData.selectedBy}`);
        onValue(locationRef, (locationSnapshot) => {
          const locationData = locationSnapshot.val();
          setServiceProviderLocation(locationData);
          setLoading(false);
        });
      }
    });

    return () => {
      off(accidentRef);
    };
  }, [accidentId]);

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Provider Details</Text>
      {serviceProviderDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Name: {serviceProviderDetails.name}</Text>
          <Text style={styles.detailText}>Phone: {serviceProviderDetails.phoneNumber}</Text>
        </View>
      )}

      {serviceProviderLocation && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: parseFloat(serviceProviderLocation.latitude),
            longitude: parseFloat(serviceProviderLocation.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          showsUserLocation={true}
        >
          <Marker
            coordinate={{
              latitude: parseFloat(serviceProviderLocation.latitude),
              longitude: parseFloat(serviceProviderLocation.longitude),
            }}
            title="Service Provider"
            pinColor="blue"
          />
        </MapView>
      )}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
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

export default TrackServiceProvider;
