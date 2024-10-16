import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


const VolunteerHome = ({ fullName, navigation }) => {

  useEffect(() => {
    
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcome}>Welcome, {fullName}</Text>
        <Text style={styles.header}>Communi Care</Text>
        <Text style={styles.subHeader}>
             Volunteer
        </Text>
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
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  welcome: {
    fontSize: 18,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
 
});

export default VolunteerHome;
