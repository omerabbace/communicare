// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// import Counter from '../../components/Counter'; // Adjust the import path as necessary

// const UserHome = ({ fullName, navigation }) => {
//   const [complaints, setComplaints] = useState({
//     total: 7,
//     inProgress: 2,
//     resolved: 1,
//     pendingFeedbacks: 5,
//     droppedFeedbacks: 5,
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.welcome}>Welcome, {fullName}</Text>
//         <Text style={styles.header}>Communi Care</Text>
//       </View>

//       <View style={styles.complaintsContainer}>
//         <Text style={styles.complaintsHeader}>My Complaints</Text>

//         <View style={styles.countersContainer}>
//           <Counter label="Total Complaints" count={complaints.total} />
//           <Counter label="In Progress" count={complaints.inProgress} />
//           <Counter label="Resolved" count={complaints.resolved} />
//         </View>
//       </View>

//       <TouchableOpacity onPress={() => navigation.navigate('Report an Issue')} style={styles.newComplaintButton}>
//         <Text style={styles.newComplaintButtonText}>Report an Issue</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   welcome: {
//     fontSize: 18,
//     marginBottom: 10,
//   },
//   complaintsContainer: {
//     backgroundColor: '#f9f9f9',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   complaintsHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   countersContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },
//   newComplaintButton: {
//     backgroundColor: '#aa18ea',
//     paddingVertical: 12,
//     borderRadius: 20,
//     alignItems: 'center',
//   },
//   newComplaintButtonText: {
//     fontSize: 18,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default UserHome;
// import React from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const UserHome = () => {
//   const navigation = useNavigation();

//   const stats = [
//     { label: 'Reported Issues', value: 20, icon: 'report-problem', backgroundColor: '#e94057' },
//     { label: 'Submitted Issues', value: 15, icon: 'assignment', backgroundColor: '#aa18ea' },
//     { label: 'Completed Issues', value: 12, icon: 'check-circle', backgroundColor: '#4caf50' },
//   ];

//   const services = [
//     { label: 'Issue Report', icon: 'file-alt', backgroundColor: '#aa18ea', screen: 'Report an Issue' },
//     { label: 'Donation', icon: 'heart', backgroundColor: '#f27121', screen: 'Donate' },
//     { label: 'Report Accident', icon: 'car-crash', backgroundColor: '#4caf50', screen: 'Report an Accident' },
//     { label: 'Vehicle Assistance', icon: 'wrench', backgroundColor: '#2196f3', screen: 'Vehicle Assistance' },
//     { label: 'Discussion Forum', icon: 'comments', backgroundColor: '#ff5722', screen: 'Discussion Forums' },
//   ];

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {/* Stats Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Statistics</Text>
//         <View style={styles.overviewSection}>
//           {stats.map((stat, index) => (
//             <View key={index} style={[styles.statCard, { backgroundColor: stat.backgroundColor }]}>
//               <MaterialIcons name={stat.icon} size={40} color="#fff" />
//               <Text style={styles.statValue}>{stat.value}</Text>
//               <Text style={styles.statLabel}>{stat.label}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Services Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Services</Text>
//         <View style={styles.servicesGrid}>
//           {services.map((service, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
//               onPress={() => navigation.navigate(service.screen)}
//             >
//               <FontAwesome5 name={service.icon} size={30} color="#fff" />
//               <Text style={styles.serviceLabel}>{service.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   overviewSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     flex: 1,
//     height: 125,
//     borderRadius: 15,
//     padding: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     elevation: 4,
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 7, // Adjusted for better visibility
//   },
//   servicesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   serviceButton: {
//     width: '48%',
//     height: 120,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 4,
//   },
//   serviceLabel: {
//     fontSize: 16,
//     color: '#fff',
//     marginTop: 10,
//     textAlign: 'center',
//   },
// });

// export default UserHome;

// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserHome = () => {
//   const navigation = useNavigation();
//   const [stats, setStats] = useState({
//     reportedIssues: 0,
//     cancelledIssues: 0,
//     completedIssues: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/user/stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats({
//           reportedIssues: response.data.stats.reportedIssuesCount,
//           cancelledIssues: response.data.stats.canceledIssuesCount,
//           completedIssues: response.data.stats.completedIssuesCount,
//         });
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const services = [
//     { label: 'Issue Report', icon: 'file-alt', backgroundColor: '#aa18ea', screen: 'Report an Issue' },
//     { label: 'Donation', icon: 'heart', backgroundColor: '#f27121', screen: 'Donate' },
//     { label: 'Report Accident', icon: 'car-crash', backgroundColor: '#4caf50', screen: 'Report an Accident' },
//     { label: 'Vehicle Assistance', icon: 'wrench', backgroundColor: '#2196f3', screen: 'Vehicle Assistance' },
//     { label: 'Discussion Forum', icon: 'comments', backgroundColor: '#ff5722', screen: 'Discussion Forums' },
//   ];

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {/* Stats Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Statistics</Text>
//         <View style={styles.overviewSection}>
//           <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
//             <MaterialIcons name="report-problem" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.reportedIssues}</Text>
//             <Text style={styles.statLabel}>Reported Issues</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#aa18ea' }]}>
//             <MaterialIcons name="assignment" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.cancelledIssues}</Text>
//             <Text style={styles.statLabel}>Cancelled Issues</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
//             <MaterialIcons name="check-circle" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.completedIssues}</Text>
//             <Text style={styles.statLabel}>Completed Issues</Text>
//           </View>
//         </View>
//       </View>

//       {/* Services Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Services</Text>
//         <View style={styles.servicesGrid}>
//           {services.map((service, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
//               onPress={() => navigation.navigate(service.screen)}
//             >
//               <FontAwesome5 name={service.icon} size={30} color="#fff" />
//               <Text style={styles.serviceLabel}>{service.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   overviewSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     flex: 1,
//     height: 125,
//     borderRadius: 15,
//     padding: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     elevation: 4,
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   servicesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   serviceButton: {
//     width: '48%',
//     height: 120,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 4,
//   },
//   serviceLabel: {
//     fontSize: 16,
//     color: '#fff',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default UserHome;

// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserHome = () => {
//   const navigation = useNavigation();
//   const [stats, setStats] = useState({
//     reportedIssues: 0,
//     cancelledIssues: 0,
//     completedIssues: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [delayed, setDelayed] = useState(false);

//   useEffect(() => {
//     // Introduce a delay before the first fetch
//     const delayTimeout = setTimeout(() => {
//       setDelayed(true);
//     }, 3000); // 3-second delay

//     return () => clearTimeout(delayTimeout);
//   }, []);

//   useEffect(() => {
//     let interval;

//     const fetchStats = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         if (!token) {
//           console.warn('Token is missing. Redirecting to login.');
//           navigation.navigate('Login');
//           return;
//         }

//         const response = await axios.get(`${BASE_URL}/api/issueReporting/user/stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setStats({
//           reportedIssues: response.data.stats.reportedIssuesCount,
//           cancelledIssues: response.data.stats.canceledIssuesCount,
//           completedIssues: response.data.stats.completedIssuesCount,
//         });
//       } catch (error) {
//         console.error('Error fetching stats:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (delayed) {
//       fetchStats(); // Initial fetch after delay

//       // Periodic update every 30 seconds
//       interval = setInterval(fetchStats, 30000);
//     }

//     return () => clearInterval(interval);
//   }, [delayed]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   const services = [
//     { label: 'Issue Report', icon: 'file-alt', backgroundColor: '#aa18ea', screen: 'Report an Issue' },
//     { label: 'Donation', icon: 'heart', backgroundColor: '#f27121', screen: 'Donate' },
//     { label: 'Report Accident', icon: 'car-crash', backgroundColor: '#4caf50', screen: 'Report an Accident' },
//     { label: 'Vehicle Assistance', icon: 'wrench', backgroundColor: '#2196f3', screen: 'Vehicle Assistance' },
//     { label: 'Discussion Forum', icon: 'comments', backgroundColor: '#ff5722', screen: 'Discussion Forums' },
//   ];

//   return (
//     <ScrollView contentContainerStyle={styles.scrollContainer}>
//       {/* Stats Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Statistics</Text>
//         <View style={styles.overviewSection}>
//           <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
//             <MaterialIcons name="report-problem" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.reportedIssues}</Text>
//             <Text style={styles.statLabel}>Reported Issues</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#f44336' }]}>
//             {/* Updated Icon, Color, and Text for Rejected Issues */}
//             <MaterialIcons name="cancel" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.cancelledIssues}</Text>
//             <Text style={styles.statLabel}>Rejected Issues</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
//             <MaterialIcons name="check-circle" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.completedIssues}</Text>
//             <Text style={styles.statLabel}>Completed Issues</Text>
//           </View>
//         </View>
//       </View>

//       {/* Services Section */}
//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Services</Text>
//         <View style={styles.servicesGrid}>
//           {services.map((service, index) => (
//             <TouchableOpacity
//               key={index}
//               style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
//               onPress={() => navigation.navigate(service.screen)}
//             >
//               <FontAwesome5 name={service.icon} size={30} color="#fff" />
//               <Text style={styles.serviceLabel}>{service.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     shadowOffset: { width: 0, height: 5 },
//     elevation: 5,
//   },
//   cardTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//   },
//   overviewSection: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     flex: 1,
//     height: 125,
//     borderRadius: 15,
//     padding: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginHorizontal: 5,
//     elevation: 4,
//   },
//   statValue: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#fff',
//     textAlign: 'center',
//   },
//   servicesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   serviceButton: {
//     width: '48%',
//     height: 120,
//     borderRadius: 15,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 15,
//     elevation: 4,
//   },
//   serviceLabel: {
//     fontSize: 16,
//     color: '#fff',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default UserHome;


import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserHome = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    reportedIssues: 0,
    cancelledIssues: 0,
    completedIssues: 0,
    inProgressIssues: 0,
  });
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
    let interval;

    const fetchStats = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          console.warn('Token is missing. Redirecting to login.');
          navigation.navigate('Login');
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/issueReporting/user/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          reportedIssues: response.data.stats.reportedIssuesCount,
          cancelledIssues: response.data.stats.canceledIssuesCount,
          completedIssues: response.data.stats.completedIssuesCount,
          inProgressIssues: response.data.stats.inProgressIssuesCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (delayed) {
      fetchStats(); // Initial fetch after delay

      // Periodic update every 30 seconds
      interval = setInterval(fetchStats, 30000);
    }

    return () => clearInterval(interval);
  }, [delayed]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  const services = [
    { label: 'Issue Report', icon: 'file-alt', backgroundColor: '#aa18ea', screen: 'Report an Issue' },
    { label: 'Donation', icon: 'heart', backgroundColor: '#f27121', screen: 'Donate' },
    { label: 'Report Accident', icon: 'car-crash', backgroundColor: '#4caf50', screen: 'Report an Accident' },
    { label: 'Vehicle Assistance', icon: 'wrench', backgroundColor: '#2196f3', screen: 'Vehicle Assistance' },
    { label: 'Discussion Forum', icon: 'comments', backgroundColor: '#ff5722', screen: 'Discussion Forums' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statistics</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsScroll}
        >
          <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
            <MaterialIcons name="report-problem" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.reportedIssues}</Text>
            <Text style={styles.statLabel}>Reported Issues</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f44336' }]}>
            <MaterialIcons name="cancel" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.cancelledIssues}</Text>
            <Text style={styles.statLabel}>Rejected Issues</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
            <MaterialIcons name="check-circle" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.completedIssues}</Text>
            <Text style={styles.statLabel}>Completed Issues</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ff9800' }]}>
            <MaterialIcons name="hourglass-top" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.inProgressIssues}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
        </ScrollView>
      </View>

      {/* Services Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
              onPress={() => navigation.navigate(service.screen)}
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
  statsScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCard: {
    width: 105, // Adjust width for swipeable design
    height: 150,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10, // Add spacing between cards
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

export default UserHome;
