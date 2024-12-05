// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';

// const ServiceProviderDetailsScreen = ({ route, navigation }) => {
// const { serviceProvider, requestId, pollingInterval } = route.params;
// console.log(requestId);
// console.log(pollingInterval);


// const cancelRequest = async () => {
//     Alert.alert(
//         "Cancel Request",
//         "Are you sure you want to cancel the request?",
//         [
//         {
//             text: "Yes",
//             onPress: async () => {
//             try {
//                 if (requestId) {
//                 const token = await AsyncStorage.getItem('token'); 
//                 await axios.post(
//                     `${BASE_URL}/api/vehicle-assistance/cancel/${requestId}`,
//                     {},
//                     {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                     }
//                 );
//                 await AsyncStorage.removeItem('acceptedRequest');
//                 // clearInterval(pollingInterval.current); // Clear the interval if canceled
//                 navigation.navigate('Vehicle Assistance');
//                 }
//             } catch (error) {
//                 console.error('Error canceling request:', error);
//                 Alert.alert('Error', 'Failed to cancel request. Please try again.');
//             }
//             },
//         },
//         { text: "No" },
//         ]
//     );
//     };
    

// return (
// <View style={styles.container}>
//     <View style={styles.card}>
//     <Text style={styles.cardTitle}>Service Provider Details</Text>
//     <Text style={styles.cardText}>Name: {serviceProvider.name}</Text>
//     <Text style={styles.cardText}>Phone: {serviceProvider.phone}</Text>
//     <Text style={styles.cardText}>Email: {serviceProvider.email}</Text>
//     <Text style={styles.cardText}>Category: {serviceProvider.serviceCategory}</Text>
//     </View>

//     <TouchableOpacity 
//     style={styles.cancelButton} 
//     onPress={cancelRequest}
//     >
//     <Text style={styles.cancelButtonText}>Cancel Request</Text>
//     </TouchableOpacity>
// </View>
// );
// };

// const styles = StyleSheet.create({
// container: {
// flex: 1,
// justifyContent: 'center',
// alignItems: 'center',
// padding: 20,
// backgroundColor: '#f5f5f5',
// },
// card: {
// width: '100%',
// backgroundColor: '#fff',
// borderRadius: 8,
// padding: 20,
// marginBottom: 20,
// shadowColor: '#000',
// shadowOffset: { width: 0, height: 2 },
// shadowOpacity: 0.2,
// shadowRadius: 5,
// elevation: 3,
// },
// cardTitle: {
// fontSize: 22,
// fontWeight: 'bold',
// marginBottom: 10,
// color: '#333',
// },
// cardText: {
// fontSize: 16,
// marginBottom: 8,
// color: '#555',
// },
// cancelButton: {
// paddingVertical: 15,
// paddingHorizontal: 30,
// backgroundColor: '#aa18ea',
// borderRadius: 5,
// alignItems: 'center',
// },
// cancelButtonText: {
// color: '#fff',
// fontWeight: 'bold',
// fontSize: 16,
// },
// });

// export default ServiceProviderDetailsScreen;

import React, { useState, useEffect,useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../helpers/Auth';
const ServiceProviderDetailsScreen = ({ route, navigation }) => {
  const { userSession } = useContext(AuthContext);
  const {serviceProvider: routeServiceProvider, requestId } = route.params;
  const [serviceProvider, setServiceProvider] = useState(routeServiceProvider);
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true); // Loader for initial state
  const [pollingInterval, setPollingInterval] = useState(null);

// useEffect(() => {
//   // Load initial data and start polling
//   const initializeScreen = async () => {
//     const storedPrice = await AsyncStorage.getItem(`price_${requestId}`);
//     if (storedPrice) {
//       setPrice(storedPrice);
//     } else {
//       startPolling();
//     }
//     setLoading(false); // Stop loader after initial setup
//   };

//   initializeScreen();

//   // Clear the polling interval on component unmount
//   return () => clearInterval(pollingInterval);
// }, []);
useEffect(() => {
  const initializeScreen = async () => {
    try {
      // Check if payment is in progress
      const paymentState = await AsyncStorage.getItem('paymentState');
      if (paymentState) {
        const { inProgress, screen, params } = JSON.parse(paymentState);
        if (inProgress && screen === 'VehiclePayment') {
          navigation.reset({
            index: 0,
            routes: [{ name: screen, params }],
          });
          return; // Stop further execution
        }
      }

      // Proceed with normal initialization if no payment is in progress
      const storedPrice = await AsyncStorage.getItem(`price_${requestId}`);
      if (storedPrice) {
        setPrice(storedPrice);
      } else {
        startPolling();
      }
      setLoading(false);
    } catch (error) {
      console.error('Error initializing screen:', error);
    }
  };

  initializeScreen();

  return () => clearInterval(pollingInterval); // Clear polling on unmount
}, []);


  // Start polling to check if the price is set
  const startPolling = () => {
    const interval = setInterval(async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/get-price/${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && response.data.price) {
          setPrice(response.data.price);
          await AsyncStorage.setItem(`price_${requestId}`, response.data.price.toString()); // Persist price
          clearInterval(interval); // Stop polling once price is retrieved
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
  };

  const cancelRequest = async () => {
    Alert.alert(
      'Cancel Request',
      'Are you sure you want to cancel the request?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (requestId) {
                const token = await AsyncStorage.getItem('token'); 
                await axios.post(
                  `${BASE_URL}/api/vehicle-assistance/cancel/${requestId}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }
                );
                await AsyncStorage.removeItem(`price_${requestId}`);
                await AsyncStorage.removeItem(`acceptedRequest_${userSession._id}`);

                navigation.navigate('Vehicle Assistance');
              }
            } catch (error) {
              console.error('Error canceling request:', error);
              Alert.alert('Error', 'Failed to cancel request. Please try again.');
            }
          },
        },
        { text: 'No' },
      ]
    );
  };

  // const acceptPrice = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     await axios.post(`${BASE_URL}/api/vehicle-assistance/accept-price/${requestId}`, {}, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });

  //     // Navigate to payment screen
  //     navigation.navigate('VehiclePayment', { serviceProvider,requestId, price });
  //   } catch (error) {
  //     console.error('Error accepting price:', error);
  //     Alert.alert('Error', 'Failed to accept price. Please try again.');
  //   }
  // };
  const acceptPrice = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(`${BASE_URL}/api/vehicle-assistance/accept-price/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Save payment progress state to AsyncStorage
      await AsyncStorage.setItem(
        'paymentState',
        JSON.stringify({
          inProgress: true,
          screen: 'VehiclePayment',
          params: { serviceProvider, requestId, price },
        })
      );
  
      // Navigate to the payment screen
      navigation.navigate('VehiclePayment', { serviceProvider, requestId, price });
    } catch (error) {
      console.error('Error accepting price:', error);
      Alert.alert('Error', 'Failed to accept price. Please try again.');
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Service Provider Details</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Name:</Text>
          <Text style={styles.cardValue}>{serviceProvider.name}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Phone:</Text>
          <Text style={styles.cardValue}>{serviceProvider.phone}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Email:</Text>
          <Text style={styles.cardValue}>{serviceProvider.email}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Category:</Text>
          <Text style={styles.cardValue}>{serviceProvider.serviceCategory}</Text>
        </View>
      </View>
  
      {loading ? (
        <ActivityIndicator size="large" color="#aa18ea" style={styles.loader} />
      ) : price ? (
        <View style={styles.priceCard}>
          <Text style={styles.priceText}>Repair Price: ${price}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={acceptPrice}>
              <Text style={styles.buttonText}>Accept Price</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelRequest}>
              <Text style={styles.buttonText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.waitingText}>Waiting for service provider to set the price...</Text>
      )}
    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6f9',
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e3e6ec',
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a4a4a',
    width: 120, // Adjust as needed for label alignment
  },
  cardValue: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    lineHeight: 22,
  },
  priceCard: {
    width: '100%',
    backgroundColor: '#eef6fd',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#cfe2f3',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#5cb85c',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#5cb85c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d9534f',
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#d9534f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  waitingText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  loader: {
    marginTop: 30,
  },
});
  


export default ServiceProviderDetailsScreen;
