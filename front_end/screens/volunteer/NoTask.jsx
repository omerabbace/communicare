import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NoTasksScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>There are no tasks to show.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9', // Optional: Set a light background color
  },
  text: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default NoTasksScreen;
