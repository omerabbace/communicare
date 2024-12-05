// import React from 'react';
// import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useSelector, useDispatch } from 'react-redux';
// import { resetDonations } from '../../actions/donationActions';

// const DonationConfirmationScreen = () => {
//   const navigation = useNavigation();
//   const donations = useSelector(state => state.donation.donations);
//   const totalAmount = useSelector(state => state.donation.totalAmount);
//   const dispatch = useDispatch();

//   const handleContinue = () => {
//     // Navigate to payment screen with correct donations and total amount
//     navigation.navigate('StripePaymentScreen', { donations, totalAmount });
//   };

//   const handleCancel = () => {
//     dispatch(resetDonations());
//     navigation.navigate('Donate');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.heading}>Confirm Your Donations</Text>
//       {donations.map((donation, index) => (
//         <View key={`${donation.project.id}-${index}`} style={styles.projectContainer}>
//           <Text style={styles.projectTitle}>{donation.project.title}</Text>
//           <Text>Amount: {donation.amount} Rs</Text>
//         </View>
//       ))}
//       <Text style={styles.totalAmount}>Total Amount: {totalAmount} Rs</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Continue" onPress={handleContinue} />
//         <Button title="Cancel" onPress={handleCancel} color="#ff3333" />
//       </View>
//     </ScrollView>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//   flexGrow: 1,
//   padding: 20,
//   backgroundColor: '#fff',
//   },
//   heading: {
//   fontSize: 18,
//   fontWeight: 'bold',
//   marginBottom: 20,
//   },
//   projectContainer: {
//   marginBottom: 20,
//   },
//   projectTitle: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   },
//   totalAmount: {
//   fontSize: 16,
//   fontWeight: 'bold',
//   marginVertical: 20,
//   },
//   buttonContainer: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   marginTop: 20,
//   },
//   });

// export default DonationConfirmationScreen;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { resetDonations } from '../../actions/donationActions';

const DonationConfirmationScreen = () => {
  const navigation = useNavigation();
  const donations = useSelector((state) => state.donation.donations);
  const totalAmount = useSelector((state) => state.donation.totalAmount);
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (donations.length === 0) {
      Alert.alert('No Donations', 'You have no donations to proceed with.');
      return;
    }
    navigation.navigate('StripePaymentScreen', { donations, totalAmount });
  };

  const handleCancel = () => {
    dispatch(resetDonations());
    navigation.navigate('Donate');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Confirm Your Donations</Text>

      {donations.map((donation, index) => (
        <View key={`${donation.project.id}-${index}`} style={styles.projectCard}>
          <Text style={styles.projectTitle}>{donation.project.title}</Text>
          <Text style={styles.projectAmount}>Amount: {donation.amount} Rs</Text>
        </View>
      ))}

      <View style={styles.totalAmountContainer}>
        <Text style={styles.totalAmountLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>{totalAmount} Rs</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.continueButton]} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 10,
  },
  projectAmount: {
    fontSize: 16,
    color: '#555',
  },
  totalAmountContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  totalAmountLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  continueButton: {
    backgroundColor: '#4caf50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DonationConfirmationScreen;
