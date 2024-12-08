import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const RequestDetailsScreen = ({ navigation, route }) => {
  const { reportId, description, price } = route.params;
  const [loading, setLoading] = useState(false);

  const handleAcceptRequest = async () => {
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/vehicle-assistance/accept`, { reportId });
      await AsyncStorage.setItem('acceptedRequest', JSON.stringify({ reportId, description, price }));
      navigation.navigate('PaymentScreen', { reportId, price });
    } catch (error) {
      Alert.alert('Error', 'Failed to accept the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue Details</Text>
      <Text style={styles.description}>{description}</Text>
      <Text style={styles.price}>Price: {price}</Text>
      <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptRequest} disabled={loading}>
        <Text style={styles.acceptButtonText}>Accept Request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, marginBottom: 20 },
  price: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  acceptButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 5 },
  acceptButtonText: { color: '#fff', textAlign: 'center' },
});

export default RequestDetailsScreen;
