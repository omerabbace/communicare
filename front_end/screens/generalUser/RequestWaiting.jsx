import React, { useEffect, useState, useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../helpers/Auth';

const RequestWaitingScreen = ({ navigation }) => {
  const { userSession } = useContext(AuthContext);
  const [requestId, setRequestId] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pollingInterval = useRef(null);
  useEffect(() => {
    const initializeRequestId = async () => {
      try {
        const storedRequest = await AsyncStorage.getItem(`acceptedRequest_${userSession._id}`);
  
        if (storedRequest) {
          const { requestId, accepted, serviceProvider } = JSON.parse(storedRequest);
          setRequestId(requestId);
  
          if (accepted) {
            // Navigate immediately if accepted is true
            navigation.reset({
              index: 0,
              routes: [{ name: 'ServiceProviderDetails', params: { serviceProvider, requestId } }],
            });
            return; // Prevent further execution
          } else {
            startPolling(requestId); // Start polling for updates
          }
        }
      } catch (error) {
        console.error('Error initializing request:', error);
      } finally {
        setIsLoading(false); // Ensure loading state is cleared
      }
    };
  
    initializeRequestId();
  
    // Clear interval when component unmounts
    return () => clearInterval(pollingInterval.current);
  }, []);
  

  const startPolling = (requestId) => {
    pollingInterval.current = setInterval(async () => {
      try {
        // console.log("hey");
        const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/request-details/${requestId}`, {
          headers: { Authorization: `Bearer ${userSession.token}` },
        });
        
        if (response.data.success && (response.data.request.status === "accepted" || response.data.request.status === "pending approval")) {
            // console.log("hey");
            // console.log(response.data.request.status);
            // console.log(response.data.request);

          const providerDetails = response.data.serviceProvider;

          // Set accepted state, save in AsyncStorage, and navigate
          setIsAccepted(true);
          // await AsyncStorage.setItem(
          //   'acceptedRequest',
          //   JSON.stringify({ requestId, accepted: true, serviceProvider: providerDetails })
          // );
          await AsyncStorage.setItem(
            `acceptedRequest_${userSession._id}`,
            JSON.stringify({ requestId, accepted: true, serviceProvider: providerDetails })
          );
          

          clearInterval(pollingInterval.current); // Stop polling once accepted

          // Navigate to ServiceProviderDetailsScreen
          navigation.reset({
            index: 0,
            routes: [{ name: 'ServiceProviderDetails', params: { serviceProvider: providerDetails, requestId } }],
          });
        }
      } catch (error) {
        console.error('Error checking request status:', error);
      }
    }, 5000);
  };

  const cancelRequest = async () => {
    Alert.alert(
      "Cancel Request",
      "Are you sure you want to cancel the request?",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              if (requestId) {
                await axios.post(`${BASE_URL}/api/vehicle-assistance/cancel/${requestId}`, {}, {
                  headers: { Authorization: `Bearer ${userSession.token}` },
                });
                await AsyncStorage.removeItem(`acceptedRequest_${userSession._id}`);

                if (pollingInterval.current) clearInterval(pollingInterval.current); // Clear interval if it exists
                navigation.navigate('Vehicle Assistance');
              }
            } catch (error) {
              console.error('Error canceling request:', error);
              Alert.alert('Error', 'Failed to cancel request. Please try again.');
            }
          },
        },
        { text: "No" }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isAccepted && (
        <>
          <Text style={styles.message}>Waiting for a service provider to accept your request...</Text>
          <ActivityIndicator size="large" color="#aa18ea" style={styles.spinner} />
          <TouchableOpacity style={styles.cancelButton} onPress={cancelRequest}>
            <Text style={styles.cancelButtonText}>Cancel Request</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  message: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#aa18ea',
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  waitingAnimation: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#aa18ea',
    textAlign: 'center',
    marginBottom: 10,
  },
  spinner: {
    marginVertical: 20,
  },
});


export default RequestWaitingScreen;
