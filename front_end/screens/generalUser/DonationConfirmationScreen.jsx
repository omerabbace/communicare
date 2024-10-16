import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { resetDonations } from '../../actions/donationActions';

const DonationConfirmationScreen = () => {
  const navigation = useNavigation();
  const donations = useSelector(state => state.donation.donations);
  const totalAmount = useSelector(state => state.donation.totalAmount);
  const dispatch = useDispatch();

  const handleContinue = () => {
    // Navigate to payment screen with correct donations and total amount
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
        <View key={`${donation.project.id}-${index}`} style={styles.projectContainer}>
          <Text style={styles.projectTitle}>{donation.project.title}</Text>
          <Text>Amount: {donation.amount} Rs</Text>
        </View>
      ))}
      <Text style={styles.totalAmount}>Total Amount: {totalAmount} Rs</Text>
      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} />
        <Button title="Cancel" onPress={handleCancel} color="#ff3333" />
      </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
  flexGrow: 1,
  padding: 20,
  backgroundColor: '#fff',
  },
  heading: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 20,
  },
  projectContainer: {
  marginBottom: 20,
  },
  projectTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  },
  totalAmount: {
  fontSize: 16,
  fontWeight: 'bold',
  marginVertical: 20,
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 20,
  },
  });

export default DonationConfirmationScreen;
