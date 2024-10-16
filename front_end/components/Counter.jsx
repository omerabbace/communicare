// Counter.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Counter = ({ label, count }) => {
  return (
    <View style={styles.counterContainer}>
      <TouchableOpacity>
        <Text style={styles.countText}>{count}</Text>
        <Text style={styles.labelText}>{label}</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  counterContainer: {
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 5,
    flex: 1,
  },
  countText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 16,
    color: '#666',
  },
});

export default Counter;
