// import React from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const PaymentScreen = ({ route, navigation }) => {
//   const { requestId, price } = route.params;

//   // Handle payment based on selected method (cash or card)
//   const handlePayment = async (method) => {
//     if (method === 'cash') {
//       Alert.alert('Payment Success', `Paid $${price} in cash.`);
//       completePayment();
//     } else {
//       // Integrate actual card payment API call here
//       // For now, display a success message and complete payment
//       Alert.alert('Payment Success', `Paid $${price} via card.`);
//       completePayment();
//     }
//   };

//   // Complete the payment process and clear persistent data
//   const completePayment = async () => {
//     try {
//       // Clear the accepted request state from AsyncStorage
//       await AsyncStorage.removeItem('acceptedRequest');
//       await AsyncStorage.removeItem(`price_${requestId}`);
      
//       // Navigate back to the report screen after payment completion
//       navigation.navigate('ReportVehicleIssueScreen');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to complete the payment process.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Choose Payment Method</Text>
//       <Text style={styles.price}>Amount: ${price}</Text>
      
//       <TouchableOpacity style={styles.paymentButton} onPress={() => handlePayment('cash')}>
//         <Text style={styles.paymentButtonText}>Pay with Cash</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.paymentButton} onPress={() => handlePayment('card')}>
//         <Text style={styles.paymentButtonText}>Pay with Card</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//   },
//   price: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 30,
//     color: '#555',
//   },
//   paymentButton: {
//     backgroundColor: '#007bff',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//     marginVertical: 10,
//     alignItems: 'center',
//     width: '80%',
//   },
//   paymentButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });

// export default PaymentScreen;

// import React, { useState,useContext } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { CardForm, useStripe } from '@stripe/stripe-react-native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import { AuthContext } from '../../helpers/Auth';
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// const PaymentScreen = ({ route, navigation }) => {
//   const { serviceProvider,requestId, price } = route.params;
//   const {userSession} = useContext(AuthContext);
// //   console.log(serviceProvider);
//   const { confirmPayment } = useStripe();
//   const [loading, setLoading] = useState(false);
//   const [cardDetails, setCardDetails] = useState();

//   // Handle payment based on selected method (cash or card)
//   const handlePayment = async (method) => {
//     if (method === 'cash') {
//       try {
//         setLoading(true);
//         await fetchPaymentIntentClientSecret('cash'); // Notify backend
//         Alert.alert('Payment Success', `Paid $${price} in cash.`);
//         completePayment();
//       } catch (error) {
//         Alert.alert('Error', 'Failed to process cash payment.');
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       await handleCardPayment();
//     }
//   };
  


// // Fetch client secret from backend for card payment
// const fetchPaymentIntentClientSecret = async (method) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const response = await axios.post(
//       `${BASE_URL}/api/payments/create`,
//       {
//         amount: price * 100, // Convert amount to cents
//         currency: 'usd',
//         serviceProviderId: serviceProvider.id,
//         paymentMethod: method,
//       },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data.clientSecret;
//   } catch (error) {
//     console.error('Error fetching payment intent:', error);
//     Alert.alert('Error', 'Unable to initiate payment. Please try again.');
//   }
// };

//   // Handle card payment through Stripe
//   const handleCardPayment = async () => {
//     if (!cardDetails?.complete) {
//       Alert.alert('Error', 'Please complete the card details.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const clientSecret = await fetchPaymentIntentClientSecret();
//       if (!clientSecret) throw new Error('Payment Intent client secret not found');

//       const { paymentIntent, error } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card',
//         paymentMethodData: {
//           billingDetails: {
//             email: userSession.email, // Replace with actual user email if available
//           },
//         },
//       });

//       if (error) {
//         console.error('Payment Confirmation Error:', error);
//         Alert.alert('Payment Error', error.message || 'Failed to confirm payment.');
//       } else if (paymentIntent) {
//         Alert.alert('Payment Success', `Paid $${price} via card.`);
//         await notifyBackend('card');
//         completePayment();
//       }
//     } catch (error) {
//       console.error('Error during card payment:', error);
//       Alert.alert('Error', 'Failed to complete the payment.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Notify the backend about successful payment
//   const notifyBackend = async (method) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.post(
//         `${BASE_URL}/api/payments/complete-payment`,
//         {
//           requestId: userSession._id,
//           paymentMethod: method,
//           amount: price,
//           status: 'completed'
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//     } catch (error) {
//       console.error('Error notifying backend:', error);
//       Alert.alert('Error', 'Failed to update payment status on server.');
//     }
//   };

//   // Complete the payment process and clear persistent data
//   const completePayment = async () => {
//     try {
//       // Clear payment progress state
//       await AsyncStorage.removeItem('paymentState');
//       await AsyncStorage.removeItem(`acceptedRequest_${userSession._id}`);
//       await AsyncStorage.removeItem(`price_${requestId}`);
//       navigation.navigate('Vehicle Assistance');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to complete the payment process.');
//     }
//   };
  
//   const handleCancel = async () => {
//     try {
//       // Clear payment progress state
//       await AsyncStorage.removeItem('paymentState');
//       navigation.navigate('Vehicle Assistance');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to cancel the payment process.');
//     }
//   };
  

//   return (
//     <View style={styles.container}>

//       <Text style={styles.title}>Choose Payment Method</Text>
//       <Text style={styles.price}>Amount: ${price}</Text>

//       <TouchableOpacity style={styles.paymentButton} onPress={() => handlePayment('cash')} disabled={loading}>
//         <Text style={styles.paymentButtonText}>Pay with Cash</Text>
//       </TouchableOpacity>

//       <Text style={styles.orText}>OR</Text>

//       <CardForm
//         style={styles.cardForm}
//         onFormComplete={(details) => setCardDetails(details)}
//         placeholders={{
//           number: '4242 4242 4242 4242',
//           expiration: 'MM/YY',
//           cvc: 'CVC',
//           postalCode: '12345',
//         }}
//       />

//       <TouchableOpacity style={styles.paymentButton} onPress={() => handlePayment('card')} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.paymentButtonText}>Pay with Card</Text>
//         )}
//       </TouchableOpacity>
//     </View>

   
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#333',
//     textAlign: 'center',
//   },
//   price: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#007bff',
//     marginBottom: 30,
//     textAlign: 'center',
//   },
//   paymentButton: {
//     backgroundColor: '#aa18ea',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 5,
//   },
//   paymentButtonText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     textAlign: 'center',
//   },
//   orText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#555',
//     marginVertical: 20,
//     textAlign: 'center',
//   },
//   cardFormContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 3 },
//     elevation: 4,
//     marginBottom: 20,
//   },
//   cardForm: {
//     width: '100%',
//     height: 200,
//   },
//   cancelButton: {
//     backgroundColor: '#f44336',
//     paddingVertical: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginVertical: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 5,
//   },
// });



// export default PaymentScreen;


import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { AuthContext } from '../../helpers/Auth';
import Dialog from 'react-native-dialog'; // Importing Sweet Alert-like library

const PaymentScreen = ({ route, navigation }) => {
  const { serviceProvider, requestId, price } = route.params;
  const { userSession } = useContext(AuthContext);
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState();
  const [dialogVisible, setDialogVisible] = useState(false); // Sweet Alert visibility state
  const [paymentMethod, setPaymentMethod] = useState(null); // To store the selected payment method

  // Show Sweet Alert for confirmation
  const showConfirmationDialog = (method) => {
    setPaymentMethod(method);
    setDialogVisible(true);
  };

  const handleConfirmPayment = async () => {
    setDialogVisible(false);
    if (paymentMethod === 'cash') {
      await handleCashPayment();
    } else {
      await handleCardPayment();
    }
  };

  // Handle cash payment
  const handleCashPayment = async () => {
    try {
      setLoading(true);
      await fetchPaymentIntentClientSecret('cash'); // Notify backend
      Alert.alert('Payment Success', `Paid $${price} in cash.`);
      completePayment();
    } catch (error) {
      Alert.alert('Error', 'Failed to process cash payment.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch client secret from backend for card payment
  const fetchPaymentIntentClientSecret = async (method) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `${BASE_URL}/api/payments/create`,
        {
          amount: price * 100, // Convert amount to cents
          currency: 'usd',
          serviceProviderId: serviceProvider.id,
          paymentMethod: method,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Error', 'Unable to initiate payment. Please try again.');
    }
  };

  // Handle card payment through Stripe
  const handleCardPayment = async () => {
    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please complete the card details.');
      return;
    }
    setLoading(true);
    try {
      const clientSecret = await fetchPaymentIntentClientSecret('card');
      if (!clientSecret) throw new Error('Payment Intent client secret not found');

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: userSession.email,
          },
        },
      });

      if (error) {
        console.error('Payment Confirmation Error:', error);
        Alert.alert('Payment Error', error.message || 'Failed to confirm payment.');
      } else if (paymentIntent) {
        Alert.alert('Payment Success', `Paid $${price} via card.`);
        await notifyBackend('card');
        completePayment();
      }
    } catch (error) {
      console.error('Error during card payment:', error);
      Alert.alert('Error', 'Failed to complete the payment.');
    } finally {
      setLoading(false);
    }
  };

  // Notify the backend about successful payment
  const notifyBackend = async (method) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/api/payments/complete-payment`,
        {
          requestId: userSession._id,
          paymentMethod: method,
          amount: price,
          status: 'completed',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error('Error notifying backend:', error);
      Alert.alert('Error', 'Failed to update payment status on server.');
    }
  };

  // Complete the payment process and clear persistent data
  const completePayment = async () => {
    try {
      await AsyncStorage.removeItem('paymentState');
      await AsyncStorage.removeItem(`acceptedRequest_${userSession._id}`);
      await AsyncStorage.removeItem(`price_${requestId}`);
      navigation.navigate('Vehicle Assistance');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete the payment process.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Method</Text>
      <Text style={styles.price}>Amount: ${price}</Text>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => showConfirmationDialog('cash')}
        disabled={loading}
      >
        <Text style={styles.paymentButtonText}>Pay with Cash</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <CardForm
        style={styles.cardForm}
        onFormComplete={(details) => setCardDetails(details)}
        placeholders={{
          number: '4242 4242 4242 4242',
          expiration: 'MM/YY',
          cvc: 'CVC',
          postalCode: '12345',
        }}
      />

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={() => showConfirmationDialog('card')}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.paymentButtonText}>Pay with Card</Text>
        )}
      </TouchableOpacity>

      {/* Sweet Alert Confirmation Dialog */}
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Confirm Payment</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to proceed with the payment of ${price} using{' '}
          {paymentMethod === 'cash' ? 'Cash' : 'Card'}?
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Confirm" onPress={handleConfirmPayment} />
      </Dialog.Container>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#007bff',
    marginBottom: 30,
    textAlign: 'center',
  },
  paymentButton: {
    backgroundColor: '#aa18ea',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  orText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginVertical: 20,
    textAlign: 'center',
  },
  cardForm: {
    width: '100%',
    height: 200,
  },
});

export default PaymentScreen;
