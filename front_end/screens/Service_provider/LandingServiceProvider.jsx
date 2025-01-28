import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';

const ServiceProviderHome = ({ fullName, serviceCategory, navigation }) => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [delayed, setDelayed] = useState(false);

  useEffect(() => {
    // Introduce a delay before the first fetch
    const delayTimeout = setTimeout(() => {
      setDelayed(true);
    }, 3000); // 3-second delay

    return () => clearTimeout(delayTimeout);
  }, []);

  useEffect(() => {
    if (delayed) {
      fetchStats(); // Fetch stats after delay
      const interval = setInterval(fetchStats, 60000); // Periodically fetch stats every minute
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [delayed]);

  const fetchStats = async () => {
    try {
      const token = await AsyncStorage.getItem('userSession')
        .then((data) => JSON.parse(data)?.token);

      if (!token) {
        Alert.alert('Error', 'Authentication token is missing.');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      if (serviceCategory === 'accidentManagement') {
        // Fetch accident management statistics
        const response = await axios.get(`${BASE_URL}/api/accidents/statistics`, { headers });

        if (response.data.success) {
          const { completedAccidents, totalAccidents, ongoingRides } = response.data.data;
          setStats({
            reported: totalAccidents,
            ongoing: ongoingRides,
            completed: completedAccidents,
          });
        } else {
          Alert.alert('Error', 'Failed to fetch accident statistics.');
        }
      } else if (serviceCategory === 'vehicleAssistance') {
        // Fetch vehicle assistance statistics
        const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/vehicle/stats`, { headers });

        if (response.data.success) {
          const { totalReported, completed, canceled, ongoing } = response.data.stats;

          setStats({
            reported: totalReported,
            completed: completed,
            cancelled: canceled,
            inProgress: ongoing,
          });
        } else {
          Alert.alert('Error', 'Failed to fetch vehicle assistance statistics.');
        }
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      Alert.alert('Error', 'Failed to fetch statistics.');
    } finally {
      setLoading(false); // Only stops loading after the initial fetch
    }
  };

  const services =
  serviceCategory === 'accidentManagement'
    ? [
        {
          label: 'Reported Accidents',
          icon: 'car-crash',
          backgroundColor: '#e94057',
          onPress: () => navigation.navigate('Reported Accidents'),
        },
        {
          label: 'Ongoing Ride',
          icon: 'play-circle',
          backgroundColor: '#aa18ea',
          onPress: () => navigation.navigate('List of accident'),
        },
        {
          label: 'Completed Rides',
          icon: 'check-circle',
          backgroundColor: '#4caf50',
          onPress: () => navigation.navigate('Completed Accidents'),
        },
      ]
    : [
        {
          label: 'Reported Requests',
          icon: 'file-alt',
          backgroundColor: '#e94057',
          onPress: () => navigation.navigate('Vehicle Assistance', { status: 'pending' }),
        },
        // {
        //   label: 'Ongoing Requests',
        //   icon: 'play-circle',
        //   backgroundColor: '#aa18ea',
        //   onPress: () => navigation.navigate('Vehicle Assistance', { status: 'accepted'||'pending approval' }),
        // },
        {
          label: 'Cancelled Requests',
          icon: 'ban',
          backgroundColor: '#f44336',
          onPress: () => navigation.navigate('Vehicle Assistance', { status: 'canceled' }),
        },
        {
          label: 'Completed Requests',
          icon: 'check-circle',
          backgroundColor: '#4caf50',
          onPress: () => navigation.navigate('Vehicle Assistance', { status: 'completed' }),
        },
      ];


  if (!delayed || (loading && Object.keys(stats).length === 0)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statistics</Text>
        <View style={styles.overviewSection}>
          {serviceCategory === 'accidentManagement' ? (
            <>
              <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
                <MaterialIcons name="car-crash" size={40} color="#fff" />
                <Text style={styles.statValue}>{stats.reported ?? '-'}</Text>
                <Text style={styles.statLabel}>Reported Accidents</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#aa18ea' }]}>
                <MaterialIcons name="play-circle" size={40} color="#fff" />
                <Text style={styles.statValue}>{stats.ongoing ?? '-'}</Text>
                <Text style={styles.statLabel}>Ongoing Tasks</Text>
              </View>
              <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
                <MaterialIcons name="check-circle" size={40} color="#fff" />
                <Text style={styles.statValue}>{stats.completed ?? '-'}</Text>
                <Text style={styles.statLabel}>Completed Tasks</Text>
              </View>
            </>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
                  <FontAwesome5 name="file-alt" size={40} color="#fff" />
                  <Text style={styles.statValue}>{stats.reported ?? '-'}</Text>
                  <Text style={styles.statLabel}>Reported</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#aa18ea' }]}>
                  <FontAwesome5 name="play-circle" size={40} color="#fff" />
                  <Text style={styles.statValue}>{stats.inProgress ?? '-'}</Text>
                  <Text style={styles.statLabel}>Ongoing</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#f44336' }]}>
                  <FontAwesome5 name="ban" size={40} color="#fff" />
                  <Text style={styles.statValue}>{stats.cancelled ?? '-'}</Text>
                  <Text style={styles.statLabel}>Cancelled</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
                  <FontAwesome5 name="check-circle" size={40} color="#fff" />
                  <Text style={styles.statValue}>{stats.completed ?? '-'}</Text>
                  <Text style={styles.statLabel}>Completed</Text>
                </View>
              </ScrollView>
            </>
          )}
        </View>
      </View>

      {/* Services Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
              onPress={service.onPress}
            >
              <FontAwesome5 name={service.icon} size={30} color="#fff" />
              <Text style={styles.serviceLabel}>{service.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  overviewSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  statCard: {
    flex: 1,
    height: 125,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 10,
    elevation: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceButton: {
    width: '48%',
    height: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
  },
  serviceLabel: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceProviderHome;
