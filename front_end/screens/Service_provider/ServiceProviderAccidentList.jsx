// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { db } from '../../firebaseConfig';
// import { ref, onValue, off, update } from 'firebase/database';
// import { AuthContext } from '../../helpers/Auth';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';

// const ServiceProviderAccidentList = () => {
//   const [accidents, setAccidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userSession } = useContext(AuthContext);
//   const navigation = useNavigation();

//   useEffect(() => {
//     if (!userSession || !userSession._id) {
//       console.error('User session or ID not found');
//       Alert.alert('Error', 'User session is missing. Please try logging in again.');
//       setLoading(false);
//       return;
//     }

//     const accidentRef = ref(db, 'accidents');

//     const fetchAccidents = onValue(
//       accidentRef,
//       (snapshot) => {
//         const accidentData = snapshot.val();
//         const acceptedAccidents = Object.keys(accidentData || {})
//           .map((key) => ({
//             id: key,
//             ...accidentData[key],
//           }))
//           .filter((accident) => accident.selectedBy?.id === userSession._id && !accident.completed);

//         setAccidents(acceptedAccidents);
//         setLoading(false);
//       },
//       (error) => {
//         console.error('Error fetching accepted accidents:', error);
//         Alert.alert('Error', 'Failed to load accepted accidents.');
//         setLoading(false);
//       }
//     );

//     // Clean up listener on component unmount or logout
//     return () => {
//       off(accidentRef, fetchAccidents);
//     };
//   }, [userSession._id]);

//   const handleStartRide = async (accidentId) => {
//     try {
//       await update(ref(db, `accidents/${accidentId}`), { rideStatus: 'started' });
//       const response = await axios.post(`${BASE_URL}/api/accidents/notifications/start`, {
//         accidentId,
//         serviceProviderId: userSession._id,
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'Ride started successfully');
//       } else {
//         throw new Error(`Notification error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error starting ride:', error.message || error);
//       Alert.alert('Error', 'Failed to start ride. Please try again.');
//     }
//   };

//   const handleCompleteRide = async (accidentId) => {
//     try {
//       await update(ref(db, `accidents/${accidentId}`), { rideStatus: 'completed', completed: true });
//       const response = await axios.post(`${BASE_URL}/api/accidents/notifications/complete`, {
//         accidentId,
//         serviceProviderId: userSession._id,
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'Ride completed successfully');
//       } else {
//         throw new Error(`Notification error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error completing ride:', error.message || error);
//       Alert.alert('Error', 'Failed to complete ride. Please try again.');
//     }
//   };

//   const handleTrackAccident = (accident) => {
//     if (accident.rideStatus === 'started') {
//       navigation.navigate('Track Accidents', { accident });
//     } else {
//       Alert.alert('Error', 'Please start the ride first');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingOverlay}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Ongoing Accidents</Text>
//       {accidents.length === 0 ? (
//         <Text style={styles.noAccidentsText}>No ongoing accidents assigned to you.</Text>
//       ) : (
//         <FlatList
//           data={accidents}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.accidentCard}>
//               <Text style={styles.accidentText}>Severity: {item.accidentSeverity}</Text>
//               <Text style={styles.accidentText}>Phone: {item.phoneNumber}</Text>
//               <Text style={styles.accidentText}>Location: {item.location.latitude}, {item.location.longitude}</Text>
//               <TouchableOpacity
//                 style={styles.trackButton}
//                 onPress={() => handleTrackAccident(item)}
//               >
//                 <Text style={styles.trackButtonText}>Track Accident</Text>
//               </TouchableOpacity>
//               {item.rideStatus !== 'started' && (
//                 <TouchableOpacity
//                   style={styles.startButton}
//                   onPress={() => handleStartRide(item.id)}
//                 >
//                   <Text style={styles.buttonText}>Start Ride</Text>
//                 </TouchableOpacity>
//               )}
//               {item.rideStatus === 'started' && (
//                 <TouchableOpacity
//                   style={styles.completeButton}
//                   onPress={() => handleCompleteRide(item.id)}
//                 >
//                   <Text style={styles.buttonText}>Complete Ride</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   noAccidentsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//   },
//   accidentCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 10,
//     elevation: 2,
//   },
//   accidentText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5,
//   },
//   trackButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   startButton: {
//     backgroundColor: '#4caf50',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   completeButton: {
//     backgroundColor: '#f44336',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ServiceProviderAccidentList;

// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { db } from '../../firebaseConfig';
// import { ref, onValue, off, update } from 'firebase/database';
// import { AuthContext } from '../../helpers/Auth';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ServiceProviderAccidentList = () => {
//   const [accidents, setAccidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const { userSession } = useContext(AuthContext);
//   const navigation = useNavigation();
//   const OPEN_ROUTE_API_KEY = '5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5'; // Replace with your OpenRouteService API key

//   // useEffect(() => {
//   //   if (!userSession || !userSession._id) {
//   //     console.error('User session or ID not found');
//   //     Alert.alert('Error', 'User session is missing. Please try logging in again.');
//   //     setLoading(false);
//   //     return;
//   //   }

//   //   const accidentRef = ref(db, 'accidents');

//   //   const fetchAccidents = onValue(
//   //     accidentRef,
//   //     async (snapshot) => {
//   //       const accidentData = snapshot.val();
//   //       const acceptedAccidents = await Promise.all(
//   //         Object.keys(accidentData || {}).map(async (key) => {
//   //           const accident = {
//   //             id: key,
//   //             ...accidentData[key],
//   //           };

//   //           if (accident.location && accident.location.latitude && accident.location.longitude) {
//   //             const placeName = await getPlaceFromCoordinates(
//   //               accident.location.latitude,
//   //               accident.location.longitude
//   //             );
//   //             return { ...accident, placeName };
//   //           }
//   //           return accident;
//   //         })
//   //       ).then((result) =>
//   //         result.filter((accident) => accident.selectedBy?.id === userSession._id && !accident.completed)
//   //       );

//   //       setAccidents(acceptedAccidents);
//   //       setLoading(false);
//   //     },
//   //     (error) => {
//   //       console.error('Error fetching accepted accidents:', error);
//   //       Alert.alert('Error', 'Failed to load accepted accidents.');
//   //       setLoading(false);
//   //     }
//   //   );

//   //   return () => {
//   //     off(accidentRef, fetchAccidents);
//   //   };
//   // }, [userSession._id]);
//   useEffect(() => {
//     const fetchAccidents = async () => {
//         try {
//             setLoading(true);
//             const token = await AsyncStorage.getItem('token')
//                 .then((data) => JSON.parse(data)?.token);

//             if (!token) {
//                 Alert.alert('Error', 'No authentication token found.');
//                 setLoading(false);
//                 return;
//             }

//             const headers = { Authorization: `Bearer ${token}` };
//             const response = await axios.get(`${BASE_URL}/api/accidents/accepted`, { headers });
//             console.log('API Response:', response.data);
//             if (response.data.success) {
//                 const accidentData = await Promise.all(
//                     response.data.data.map(async (accident) => {
//                         if (accident.location?.latitude && accident.location?.longitude) {
//                             const placeName = await getPlaceFromCoordinates(
//                                 accident.location.latitude,
//                                 accident.location.longitude
//                             );
//                             return { ...accident, placeName };
//                         }
//                         return accident;
//                     })
//                 );
//                 setAccidents(accidentData);
//             } else {
//                 Alert.alert('Error', 'Failed to fetch accidents.');
//             }
//         } catch (error) {
//             console.error('Error fetching accidents:', error.message || error);
//             Alert.alert('Error', 'Failed to load accidents.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchAccidents();
// }, []);


//   const getPlaceFromCoordinates = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(
//         `https://api.openrouteservice.org/geocode/reverse?api_key=${OPEN_ROUTE_API_KEY}&point.lat=${latitude}&point.lon=${longitude}&size=1`
//       );
//       if (response.data && response.data.features.length > 0) {
//         return response.data.features[0].properties.label;
//       }
//       return 'Unknown Location';
//     } catch (error) {
//       console.error('Error fetching place from coordinates:', error.message || error);
//       return 'Unknown Location';
//     }
//   };

//   const handleStartRide = async (accidentId) => {
//     try {
//       await update(ref(db, `accidents/${accidentId}`), { rideStatus: 'started' });
//       const response = await axios.post(`${BASE_URL}/api/accidents/notifications/start`, {
//         accidentId,
//         serviceProviderId: userSession._id,
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'Ride started successfully');
//       } else {
//         throw new Error(`Notification error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error starting ride:', error.message || error);
//       Alert.alert('Error', 'Failed to start ride. Please try again.');
//     }
//   };

//   const handleCompleteRide = async (accidentId) => {
//     try {
//       await update(ref(db, `accidents/${accidentId}`), { rideStatus: 'completed', completed: true });
//       const response = await axios.post(`${BASE_URL}/api/accidents/notifications/complete`, {
//         accidentId,
//         serviceProviderId: userSession._id,
//       });

//       if (response.status === 200) {
//         Alert.alert('Success', 'Ride completed successfully');
//       } else {
//         throw new Error(`Notification error: ${response.status}`);
//       }
//     } catch (error) {
//       console.error('Error completing ride:', error.message || error);
//       Alert.alert('Error', 'Failed to complete ride. Please try again.');
//     }
//   };

//   const handleTrackAccident = (accident) => {
//     if (accident.rideStatus === 'started') {
//       navigation.navigate('Track Accidents', { accident });
//     } else {
//       Alert.alert('Error', 'Please start the ride first');
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingOverlay}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Ongoing Accidents</Text>
//       {accidents.length === 0 ? (
//         <Text style={styles.noAccidentsText}>No ongoing accidents assigned to you.</Text>
//       ) : (
//         <FlatList
//           data={accidents}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.accidentCard}>
//               <Text style={styles.accidentText}>Severity: {item.accidentSeverity}</Text>
//               <Text style={styles.accidentText}>Phone: {item.phoneNumber}</Text>
//               <Text style={styles.accidentText}>Location: {item.placeName}</Text>
//               <TouchableOpacity
//                 style={styles.trackButton}
//                 onPress={() => handleTrackAccident(item)}
//               >
//                 <Text style={styles.trackButtonText}>Track Accident</Text>
//               </TouchableOpacity>
//               {item.rideStatus !== 'started' && (
//                 <TouchableOpacity
//                   style={styles.startButton}
//                   onPress={() => handleStartRide(item.id)}
//                 >
//                   <Text style={styles.buttonText}>Start Ride</Text>
//                 </TouchableOpacity>
//               )}
//               {item.rideStatus === 'started' && (
//                 <TouchableOpacity
//                   style={styles.completeButton}
//                   onPress={() => handleCompleteRide(item.id)}
//                 >
//                   <Text style={styles.buttonText}>Complete Ride</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   noAccidentsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     color: '#666',
//     marginTop: 20,
//   },
//   accidentCard: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginVertical: 10,
//     elevation: 2,
//   },
//   accidentText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 5,
//   },
//   trackButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   startButton: {
//     backgroundColor: '#4caf50',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   completeButton: {
//     backgroundColor: '#f44336',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ServiceProviderAccidentList;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../helpers/Auth';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ServiceProviderAccidentList = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userSession } = useContext(AuthContext);
  const [completedAccidents, setCompletedAccidents] = useState([]);
  const navigation = useNavigation();
  const OPEN_ROUTE_API_KEY = '5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5';

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        setLoading(true);

        // Fetch token from AsyncStorage
        const token = await AsyncStorage.getItem('token');
        // const token = storedData ? JSON.parse(storedData)?.token : null;

        if (!token) {
          Alert.alert('Error', 'No authentication token found.');
          setLoading(false);
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Make API request to fetch accepted accidents
        const response = await axios.get(`${BASE_URL}/api/accidents/accepted`, { headers });
        // console.log('API Response:', response.data);
        // console.log('API Raw Response:', response); // Log the full response object
        // console.log('API Data:', response.data); 

        if (response.data.success) {
          const accidentData = await Promise.all(
            response.data.data.map(async (accident) => {
              if (accident.location?.latitude && accident.location?.longitude) {
                const placeName = await getPlaceFromCoordinates(
                  accident.location.latitude,
                  accident.location.longitude
                );
                return { ...accident, placeName };
              }
              return accident;
            })
          );
          setAccidents(accidentData);
          // console.log(accidentData);
        } else {
          Alert.alert('Error', 'Failed to fetch accidents.');
        }
      } catch (error) {
        console.error('Error fetching accidents:', error.message || error);
        Alert.alert('Error', 'Failed to load accidents.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccidents();
  }, []);

  const getPlaceFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse?api_key=${OPEN_ROUTE_API_KEY}&point.lat=${latitude}&point.lon=${longitude}&size=1`
      );
      if (response.data && response.data.features.length > 0) {
        return response.data.features[0].properties.label;
      }
      return 'Unknown Location';
    } catch (error) {
      console.error('Error fetching place from coordinates:', error.message || error);
      return 'Unknown Location';
    }
  };

  const handleStartRide = async (accidentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      // Make API request to start ride
      const response = await axios.post(`${BASE_URL}/api/accidents/start/${accidentId}`, {}, { headers });
  
      if (response.status === 200) {
        // Update the state for the specific accident
        setAccidents((prevAccidents) =>
          prevAccidents.map((accident) =>
            accident._id === accidentId ? { ...accident, rideStatus: 'started', status: 'in-progress' } : accident
          )
        );
        Alert.alert('Success', 'Ride started successfully');
      } else {
        throw new Error(`Error starting ride: ${response.status}`);
      }
    } catch (error) {
      console.error('Error starting ride:', error.message || error);
      Alert.alert('Error', 'Failed to start ride. Please try again.');
    }
  };
  

  const handleCompleteRide = async (accidentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }
  
      const headers = { Authorization: `Bearer ${token}` };
  
      // Make API request to complete ride
      const response = await axios.post(`${BASE_URL}/api/accidents/complete/${accidentId}`, {}, { headers });
  
      if (response.status === 200) {
        // Update the state for the specific accident and remove it from the list
        setAccidents((prevAccidents) =>
          prevAccidents.filter((accident) => accident._id !== accidentId)
        );
  
        Alert.alert('Success', 'Ride completed successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Completed Accidents'),
          },
        ]);
      } else {
        throw new Error(`Error completing ride: ${response.status}`);
      }
    } catch (error) {
      console.error('Error completing ride:', error.message || error);
      Alert.alert('Error', 'Failed to complete ride. Please try again.');
    }
  };
  
  

  const handleTrackAccident = (accident) => {
    if (accident.rideStatus === 'started') {
      navigation.navigate('Track Accidents', { accident });
    } else {
      Alert.alert('Error', 'Please start the ride first');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ongoing Accidents</Text>
      {accidents.length === 0 ? (
        <Text style={styles.noAccidentsText}>No ongoing accidents assigned to you.</Text>
      ) : (
        <FlatList
          data={accidents}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.accidentCard}>
              <Text style={styles.accidentText}>Severity: {item.accidentSeverity}</Text>
              <Text style={styles.accidentText}>Phone: {item.phoneNumber}</Text>
              <Text style={styles.accidentText}>Location: {item.placeName}</Text>
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => handleTrackAccident(item)}
              >
                <Text style={styles.trackButtonText}>Track Accident</Text>
              </TouchableOpacity>
              {item.rideStatus !== 'started' && (
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartRide(item._id)}
                >
                  <Text style={styles.buttonText}>Start Ride</Text>
                </TouchableOpacity>
              )}
              {item.rideStatus === 'started' && (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={() => handleCompleteRide(item._id)}
                >
                  <Text style={styles.buttonText}>Complete Ride</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  noAccidentsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  accidentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 2,
  },
  accidentText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  trackButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  startButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  completeButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ServiceProviderAccidentList;
