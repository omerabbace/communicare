// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
// import { CardForm, useStripe } from '@stripe/stripe-react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { resetDonations } from '../../actions/donationActions';
// import { BASE_URL } from '../../config'; 

// const StripePaymentScreen = ({ route }) => {
//   const { donations, totalAmount } = route.params;
//   const { confirmPayment } = useStripe();
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   const [cardDetails, setCardDetails] = useState();

//   // Function to fetch PaymentIntent clientSecret from the backend
//   const createPaymentIntent = async () => {
//     try {
//       // Retrieve token from AsyncStorage
//       // const user = await AsyncStorage.getItem('userSession');
//       // console.log(user);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Error', 'No token found, please login.');
//         throw new Error('Token not found');
//       }

//       // Generate an array of donations to be sent to the backend
//       const donationDetails = donations.map(donation => ({
//         projectId: donation.project.id, // Use the project ID correctly
//         amount: donation.amount,
//       }));

//       const response = await axios.post(
//         `${BASE_URL}/api/donations/create`,
//         {
//           donations: donationDetails,
//           amount: totalAmount * 100, // Convert to cents for Stripe
//           currency: 'usd',
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Include the token in the header
//           },
//         }
//       );

//       return response.data.clientSecret;
//     } catch (error) {
//       console.error('Error creating payment intent:', error);
//       Alert.alert('Error', 'Unable to create payment intent');
//       throw error;
//     }
//   };

//   // Function to handle payment submission
//   const handlePayment = async () => {
//     try {
//       // Retrieve user session from AsyncStorage and parse it
//       const userSessionString = await AsyncStorage.getItem('userSession');
//       const user = userSessionString ? JSON.parse(userSessionString) : null;
  
//       // Check if card details are complete
//       if (!cardDetails?.complete) {
//         Alert.alert('Error', 'Please complete the card details.');
//         return;
//       }
      
//       // Get client secret from backend
//       const clientSecret = await createPaymentIntent();
//       if (!clientSecret) {
//         throw new Error('Failed to retrieve client secret from backend');
//       }
      
//       // Confirm the payment with the clientSecret and card details
//       const { paymentIntent, error } = await confirmPayment(clientSecret, {
//         paymentMethodType: 'Card', // Specify 'Card' as the payment method type
//         paymentMethodData: {
//           billingDetails: {
//             email: user?.email || 'default@example.com', // Ensure email is valid
//           },
//         },
//       });
      
//       if (error) {
//         console.error('Payment Confirmation Error:', error);
//         Alert.alert('Payment Error', error.message || 'Failed to confirm payment.');
//       } else if (paymentIntent) {
//         Alert.alert(
//           'Donation Successful!',
//           'Thank you for your contribution.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 dispatch(resetDonations());
//                 navigation.navigate('Donate');
//               },
//             },
//           ],
//           { cancelable: false }
//         );
//       }
//     } catch (error) {
//       console.error('Error handling payment:', error);
//       Alert.alert('Error', 'Failed to process payment. Please try again later.');
//     }
//   };
  
  
  

//   const handleCancel = () => {
//     dispatch(resetDonations());
//     navigation.navigate('Donate');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Donation Confirmation</Text>
//       {donations.map((donation, index) => (
//         <View key={index} style={styles.projectContainer}>
//           <Text style={styles.projectTitle}>{donation.project.title}</Text>
//           <Text>Amount: {donation.amount} Rs</Text>
//         </View>
//       ))}
//       <Text style={styles.totalAmount}>Total Amount: {totalAmount} Rs</Text>
//       <CardForm
//         style={styles.cardForm}
//         cardStyle={cardStyles}
//         placeholders={{
//           number: '4242 4242 4242 4242',
//           expiration: 'MM/YY',
//           cvc: 'CVC',
//           postalCode: '12345',
//         }}
//         onFormComplete={(details) => setCardDetails(details)}
//       />
//       <View style={styles.buttonContainer}>
//         <Button title="Proceed with Payment" onPress={handlePayment} />
//         <Button title="Cancel" onPress={handleCancel} color="#ff3333" />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   heading: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   projectContainer: {
//     marginBottom: 20,
//   },
//   projectTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   totalAmount: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 20,
//   },
//   cardForm: {
//     height: 200,
//     marginVertical: 30,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
// });

// const cardStyles = {
//   backgroundColor: '#FFFFFF',
//   textColor: '#000000',
//   fontSize: 16,
//   placeholderColor: '#A9A9A9',
//   borderColor: '#E5E5E5',
//   borderWidth: 1,
//   borderRadius: 8,
// };

// export default StripePaymentScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CardForm, useStripe } from '@stripe/stripe-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetDonations } from '../../actions/donationActions';
import { BASE_URL } from '../../config';

const StripePaymentScreen = ({ route }) => {
  const { donations, totalAmount } = route.params;
  const { confirmPayment } = useStripe();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [cardDetails, setCardDetails] = useState();
  const [loading, setLoading] = useState(false);

  // Function to fetch PaymentIntent clientSecret from the backend
  const createPaymentIntent = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'No token found, please login.');
        throw new Error('Token not found');
      }

      const donationDetails = donations.map((donation) => ({
        projectId: donation.project.id,
        amount: donation.amount,
      }));

      const response = await axios.post(
        `${BASE_URL}/api/donations/create`,
        {
          donations: donationDetails,
          amount: totalAmount * 100, // Convert to cents for Stripe
          currency: 'usd',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      Alert.alert('Error', 'Unable to create payment intent');
      throw error;
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      const userSessionString = await AsyncStorage.getItem('userSession');
      const user = userSessionString ? JSON.parse(userSessionString) : null;

      if (!cardDetails?.complete) {
        Alert.alert('Error', 'Please complete the card details.');
        setLoading(false);
        return;
      }

      const clientSecret = await createPaymentIntent();
      if (!clientSecret) {
        throw new Error('Failed to retrieve client secret from backend');
      }

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: user?.email || 'default@example.com',
          },
        },
      });

      if (error) {
        console.error('Payment Confirmation Error:', error);
        Alert.alert('Payment Error', error.message || 'Failed to confirm payment.');
      } else if (paymentIntent) {
        Alert.alert('Donation Successful!', 'Thank you for your contribution.', [
          {
            text: 'OK',
            onPress: () => {
              dispatch(resetDonations());
              navigation.navigate('Donate');
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error handling payment:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(resetDonations());
    navigation.navigate('Donate');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Donation Confirmation</Text>
      {donations.map((donation, index) => (
        <View key={index} style={styles.projectCard}>
          <Text style={styles.projectTitle}>{donation.project.title}</Text>
          <Text style={styles.projectAmount}>Amount: {donation.amount} Rs</Text>
        </View>
      ))}
      <Text style={styles.totalAmount}>Total Amount: {totalAmount} Rs</Text>
      <CardForm
        style={styles.cardForm}
        cardStyle={cardStyles}
        placeholders={{
          number: '4242 4242 4242 4242',
          expiration: 'MM/YY',
          cvc: 'CVC',
          postalCode: '12345',
        }}
        onFormComplete={(details) => setCardDetails(details)}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#aa18ea" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handlePayment}>
            <Text style={styles.buttonText}>Proceed with Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  projectAmount: {
    fontSize: 16,
    color: '#555',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 20,
    textAlign: 'center',
  },
  cardForm: {
    height: 200,
    marginVertical: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f44336',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const cardStyles = {
  backgroundColor: '#FFFFFF',
  textColor: '#000000',
  fontSize: 16,
  placeholderColor: '#A9A9A9',
  borderColor: '#E5E5E5',
  borderWidth: 1,
  borderRadius: 8,
};

export default StripePaymentScreen;
