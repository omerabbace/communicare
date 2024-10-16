
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useDispatch, useSelector } from 'react-redux';
import { addDonation } from '../../actions/donationActions';

const ProjectDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { project } = route.params;
  const [amount, setAmount] = useState('');
  const dispatch = useDispatch();
  const donations = useSelector(state => state.donation.donations);
  const existingDonation = donations.find(donation => donation.project.id === project._id);

  useEffect(() => {
    // Set amount from existing donation if available
    if (existingDonation) {
      setAmount(existingDonation.amount.toString());
    } else {
      setAmount(''); // Clear amount if no existing donation
    }
  }, [existingDonation]);

  const handleContinue = () => {
    const donationAmount = parseInt(amount);
    if (donationAmount >= 100 && !amount.includes('.')) {
      dispatch(addDonation({ ...project, id: project._id }, donationAmount)); // Use project._id as id
      setAmount(''); // Reset the amount field
      navigation.navigate('DonationConfirmationScreen');
    } else {
      Alert.alert('Minimum donation amount is 100Rs and it should be an integer.');
    }
  };

  const handleOtherProjects = () => {
    const donationAmount = parseInt(amount);
    if (donationAmount >= 100 && !amount.includes('.')) {
      dispatch(addDonation({ ...project, id: project._id }, donationAmount)); // Use project._id as id
      navigation.navigate('Donate');
    } else {
      Alert.alert('Minimum donation amount is 100Rs and it should be an integer.');
    }
  };

  const handleBack = () => {
    navigation.navigate('Donate');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.projectTitle}>{project.title}</Text>
      <AnimatedCircularProgress
        size={120}
        width={15}
        fill={project.progress * 100}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        style={styles.progressCircle}
      />
      <Text style={styles.description}>{project.description}</Text>
      <Text style={styles.label}>Donation Amount (Min 100Rs)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity onPress={handleOtherProjects}>
        <Text style={styles.otherProjectsText}>Do you want to donate to some other projects?</Text>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <Button title="Continue" onPress={handleContinue} />
        <Button title="Back" onPress={handleBack} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  progressCircle: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  description: {
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  otherProjectsText: {
    color: 'blue',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
export default ProjectDetailScreen;
