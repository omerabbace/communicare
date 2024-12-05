// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';


// const VolunteerHome = ({ fullName, navigation }) => {

//   useEffect(() => {
    
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <Text style={styles.welcome}>Welcome, {fullName}</Text>
//         <Text style={styles.header}>Communi Care</Text>
//         <Text style={styles.subHeader}>
//              Volunteer
//         </Text>
//       </View>
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
//   subHeader: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 10,
//   },
 
// });

// export default VolunteerHome;
// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const VolunteerHome = ({ navigation, isLeader }) => {
// const [stats, setStats] = useState({
//   completedTasks: 0,
//   pendingTasks: 0,
//   ongoingTasks: 0,
// });
// const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const fetchStats = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       const response = await axios.get(`${BASE_URL}/api/volunteer/stats`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setStats(response.data);
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchStats();
// }, []);

// const services = [
//   { label: 'Reported Issues', icon: 'hourglass-half', backgroundColor: '#e94057', screen: 'Issues List' },
//   { label: 'My Tasks', icon: 'tasks', backgroundColor: '#aa18ea', screen: 'Manage Volunteers' },
//   ...(isLeader
//     ? [
//         { label: 'Ongoing Leader Tasks', icon: 'play-circle', backgroundColor: '#2196f3', screen: 'pending Leader Tasks' },
//         { label: 'Completed Leader Tasks', icon: 'check-circle', backgroundColor: '#4caf50', screen: 'Completed Leader Tasks' },
//       ]
//     : []),
//   { label: 'Discussion Forums', icon: 'comments', backgroundColor: '#f27121', screen: 'Discussion Forums' },
// ];

// if (loading) {
//   return (
//     <View style={styles.loadingContainer}>
//       <ActivityIndicator size="large" color="#aa18ea" />
//     </View>
//   );
// }

// return (
//   <ScrollView contentContainerStyle={styles.scrollContainer}>
//     {/* Stats Section */}
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>Statistics</Text>
//       <View style={styles.overviewSection}>
//         <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
//           <MaterialIcons name="check-circle" size={40} color="#fff" />
//           <Text style={styles.statValue}>{stats.completedTasks}</Text>
//           <Text style={styles.statLabel}>Completed Tasks</Text>
//         </View>
//         <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
//           <MaterialIcons name="hourglass-empty" size={40} color="#fff" />
//           <Text style={styles.statValue}>{stats.pendingTasks}</Text>
//           <Text style={styles.statLabel}>Pending Tasks</Text>
//         </View>
//         <View style={[styles.statCard, { backgroundColor: '#2196f3' }]}>
//           <MaterialIcons name="play-circle" size={40} color="#fff" />
//           <Text style={styles.statValue}>{stats.ongoingTasks}</Text>
//           <Text style={styles.statLabel}>Ongoing Tasks</Text>
//         </View>
//       </View>
//     </View>

//     {/* Services Section */}
//     <View style={styles.card}>
//       <Text style={styles.cardTitle}>Services</Text>
//       <View style={styles.servicesGrid}>
//         {services.map((service, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[styles.serviceButton, { backgroundColor: service.backgroundColor }]}
//             onPress={() => navigation.navigate(service.screen)}
//           >
//             <FontAwesome5 name={service.icon} size={30} color="#fff" />
//             <Text style={styles.serviceLabel}>{service.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   </ScrollView>
// );
// };

// const styles = StyleSheet.create({
// scrollContainer: {
//   flexGrow: 1,
//   padding: 20,
//   backgroundColor: '#f5f5f5',
// },
// card: {
//   backgroundColor: '#fff',
//   borderRadius: 15,
//   padding: 15,
//   marginBottom: 20,
//   shadowColor: '#000',
//   shadowOpacity: 0.1,
//   shadowRadius: 10,
//   shadowOffset: { width: 0, height: 5 },
//   elevation: 5,
// },
// cardTitle: {
//   fontSize: 22,
//   fontWeight: 'bold',
//   color: '#333',
//   marginBottom: 20,
// },
// overviewSection: {
//   flexDirection: 'row',
//   justifyContent: 'space-between',
// },
// statCard: {
//   flex: 1,
//   height: 125,
//   borderRadius: 15,
//   padding: 15,
//   justifyContent: 'space-between',
//   alignItems: 'center',
//   marginHorizontal: 5,
//   elevation: 4,
// },
// statValue: {
//   fontSize: 28,
//   fontWeight: 'bold',
//   color: '#fff',
// },
// statLabel: {
//   fontSize: 14,
//   color: '#fff',
//   textAlign: 'center',
//   marginBottom: 7,
// },
// servicesGrid: {
//   flexDirection: 'row',
//   flexWrap: 'wrap',
//   justifyContent: 'space-between',
// },
// serviceButton: {
//   width: '48%',
//   height: 120,
//   borderRadius: 15,
//   justifyContent: 'center',
//   alignItems: 'center',
//   marginBottom: 15,
//   elevation: 4,
// },
// serviceLabel: {
//   fontSize: 16,
//   color: '#fff',
//   marginTop: 10,
//   textAlign: 'center',
// },
// loadingContainer: {
//   flex: 1,
//   justifyContent: 'center',
//   alignItems: 'center',
// },
// });

// export default VolunteerHome;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
// import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const VolunteerHome = ({ navigation, isLeader }) => {
//   const [stats, setStats] = useState({
//     completedLeaderTasks: 0,
//     pendingLeaderTasks: 0,
//     assignedSubTasks: 0,
//     unresolvedIssues: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token');
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/volunteer-leader/stats`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // console.log(response.data.stats);
//         setStats({
//           completedLeaderTasks: response.data.stats.completedTasksCount,
//           pendingLeaderTasks: response.data.stats.pendingTasksCount,
//           assignedSubTasks: response.data.stats.subTasksCount,
//           unresolvedIssues: response.data.stats.notCompletedIssuesCount,
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
//     { label: 'All Reported Issues', icon: 'file-alt', backgroundColor: '#e94057', screen: 'Issues List' },
//     { label: 'My Tasks', icon: 'tasks', backgroundColor: '#aa18ea', screen: 'Manage Volunteers' },
//     ...(isLeader
//       ? [
//           { label: 'Ongoing Leader Tasks', icon: 'play-circle', backgroundColor: '#2196f3', screen: 'pending Leader Tasks' },
//           { label: 'Completed Leader Tasks', icon: 'check-circle', backgroundColor: '#4caf50', screen: 'Completed Leader Tasks' },
//         ]
//       : []),
//     { label: 'Discussion Forums', icon: 'comments', backgroundColor: '#f27121', screen: 'Discussion Forums' },
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
//         <View style={styles.statsGrid}>
//           <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
//             <MaterialIcons name="check-circle" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.completedLeaderTasks}</Text>
//             <Text style={styles.statLabel}>Completed Leader Tasks</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
//             <MaterialIcons name="hourglass-empty" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.pendingLeaderTasks}</Text>
//             <Text style={styles.statLabel}>Pending Leader Tasks</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#2196f3' }]}>
//             <MaterialIcons name="assignment" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.assignedSubTasks}</Text>
//             <Text style={styles.statLabel}>Assigned Subtasks</Text>
//           </View>
//           <View style={[styles.statCard, { backgroundColor: '#ff9800' }]}>
//             <MaterialIcons name="error" size={40} color="#fff" />
//             <Text style={styles.statValue}>{stats.unresolvedIssues}</Text>
//             <Text style={styles.statLabel}>Unresolved Issues</Text>
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
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCard: {
//     width: '48%',
//     height: 125,
//     borderRadius: 15,
//     padding: 15,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
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

// export default VolunteerHome;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const VolunteerHome = ({ navigation, isLeader }) => {
  const [stats, setStats] = useState({
    completedLeaderTasks: 0,
    pendingLeaderTasks: 0,
    assignedSubTasks: 0,
    unresolvedIssues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [delayed, setDelayed] = useState(false); // Tracks if the delay has passed

  // Delay before fetching the token
  useEffect(() => {
    const delayBeforeFetch = setTimeout(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem('token');
          setToken(storedToken);
        } catch (error) {
          console.error('Error fetching token:', error);
        } finally {
          setDelayed(true); // Mark delayed as true after fetching the token
        }
      };

      fetchToken();
    }, 1000); 

    return () => clearTimeout(delayBeforeFetch);
  }, []);

  // Fetch stats when the token is available
  const fetchStats = async () => {
    // if (!token) {
    //   console.warn('Token is missing. Navigating to Login.');
    //   // navigation.navigate('Login');
    //   return;
    // }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/issueReporting/volunteer-leader/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats({
        completedLeaderTasks: response.data.stats.completedTasksCount,
        pendingLeaderTasks: response.data.stats.pendingTasksCount,
        assignedSubTasks: response.data.stats.subTasksCount,
        unresolvedIssues: response.data.stats.notCompletedIssuesCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);

      if (error.response && error.response.status === 401) {
        console.warn('Unauthorized access. Token expired or invalid.');
        await AsyncStorage.removeItem('token');
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (delayed && token) {
        fetchStats();
      }
    }, [delayed, token])
  );

  // Show a loader until both the delay and token fetching are complete
  if (!delayed || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  const services = [
    { label: 'All Reported Issues', icon: 'file-alt', backgroundColor: '#e94057', screen: 'Reported Issues' },
    { label: 'My Tasks', icon: 'tasks', backgroundColor: '#aa18ea', screen: 'Volunteer Tasks' },
    ...(isLeader
      ? [
          { label: 'Ongoing Leader Tasks', icon: 'play-circle', backgroundColor: '#2196f3', screen: 'Leader Tasks' },
          { label: 'Completed Leader Tasks', icon: 'check-circle', backgroundColor: '#4caf50', screen: 'Completed Leader Tasks' },
        ]
      : []),
    { label: 'Discussion Forums', icon: 'comments', backgroundColor: '#f27121', screen: 'Discussion Forums' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Stats Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#4caf50' }]}>
            <MaterialIcons name="check-circle" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.completedLeaderTasks}</Text>
            <Text style={styles.statLabel}>Completed Leader Tasks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e94057' }]}>
            <MaterialIcons name="hourglass-empty" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.pendingLeaderTasks}</Text>
            <Text style={styles.statLabel}>Pending Leader Tasks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#2196f3' }]}>
            <MaterialIcons name="assignment" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.assignedSubTasks}</Text>
            <Text style={styles.statLabel}>Assigned Subtasks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ff9800' }]}>
            <MaterialIcons name="error" size={40} color="#fff" />
            <Text style={styles.statValue}>{stats.unresolvedIssues}</Text>
            <Text style={styles.statLabel}>Unresolved Issues</Text>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    height: 125,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
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

export default VolunteerHome;
