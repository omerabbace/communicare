// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   SafeAreaView,
//   ActivityIndicator,
// } from "react-native";
// import axios from "axios";
// import { BASE_URL } from "../../config";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const CompletedAccidentsScreen = () => {
//   const [completedAccidents, setCompletedAccidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchCompletedAccidents = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");

//         if (!token) {
//           setError("Authorization token not found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           `${BASE_URL}/api/accidents/completedAccidents`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setCompletedAccidents(response.data.data);
//       } catch (err) {
//         console.error("Error fetching completed accidents:", err);
//         setError("Failed to fetch completed accidents");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompletedAccidents();
//   }, []);

//   const renderAccidentCard = ({ item }) => (
//     <View style={styles.card}>
//      {/* { console.log(item)} */}
//       {/* <Text style={styles.label}>Accident ID:</Text>
//       <Text style={styles.value}>{item._id}</Text> */}

//       <Text style={styles.label}>Severity:</Text>
//       <Text style={styles.value}>{item.accidentSeverity}</Text>

//       <Text style={styles.label}>Location:</Text>
//       <Text style={styles.value}>
//         Latitude: {item.location?.latitude || "N/A"}{" "}
//         Longitude: {item.location?.longitude || "N/A"}
//       </Text>

//       {/* <Text style={styles.label}>Service Provider:</Text>
//       <Text style={styles.value}>
//         {item.serviceProvider?.name || "N/A"} ({item.serviceProvider?.phone || "N/A"})
//       </Text> */}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Completed Accidents</Text>
//       <FlatList
//         data={completedAccidents}
//         keyExtractor={(item, index) => item._id || item.id || index.toString()}
//         renderItem={renderAccidentCard}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No completed accidents found.</Text>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     paddingHorizontal: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 16,
//     color: "#aa18ea",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   label: {
//     fontWeight: "bold",
//     fontSize: 16,
//     color: "#333",
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 14,
//     color: "#555",
//     marginBottom: 10,
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   emptyText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#777",
//     marginTop: 20,
//   },
// });

// export default CompletedAccidentsScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   SafeAreaView,
//   ActivityIndicator,
//   TouchableOpacity,
//   Platform
// } from "react-native";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { BASE_URL } from "../../config";
// const CompletedAccidentsScreen = () => {
//   const [completedAccidents, setCompletedAccidents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const fetchPlaceName = async (latitude, longitude) => {
//     try {
//       const response = await axios.get(
//         `https://api.openrouteservice.org/geocode/reverse`, // OpenRouteService API URL
//         {
//           params: {
//             api_key: "5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5", // Replace with your actual API key
//             "point.lat": latitude, // Correct parameter for latitude
//             "point.lon": longitude, // Correct parameter for longitude
//             size: 1, // Optional: Limit to one result
//           },
//         }
//       );
//       return response.data.features[0]?.properties.label || "Unknown Location";
//     } catch (err) {
//       console.error(
//         "Error fetching place name:",
//         err.response?.data || err.message
//       );
//       return "Unknown Location";
//     }
//   };
  
  

//   useEffect(() => {
//     const fetchCompletedAccidents = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");

//         if (!token) {
//           setError("Authorization token not found");
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get(
//           `${BASE_URL}/api/accidents/completedAccidents`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const accidentsWithPlaces = await Promise.all(
//           response.data.data.map(async (accident) => {
//             if (accident.location?.latitude && accident.location?.longitude) {
//               const placeName = await fetchPlaceName(
//                 accident.location.latitude,
//                 accident.location.longitude
//               );
//               return { ...accident, placeName };
//             }
//             return { ...accident, placeName: "Location not available" };
//           })
//         );

//         setCompletedAccidents(accidentsWithPlaces);
//       } catch (err) {
//         console.error("Error fetching completed accidents:", err);
//         setError("Failed to fetch completed accidents");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompletedAccidents();
//   }, []);

//   const renderAccidentCard = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.label}>Severity:</Text>
//       <Text style={styles.value}>{item.accidentSeverity}</Text>

//       <Text style={styles.label}>Location:</Text>
//       <Text style={styles.value}>{item.placeName}</Text>

//       {/* <TouchableOpacity style={styles.detailsButton}>
//         <Text style={styles.detailsButtonText}>View Details</Text>
//       </TouchableOpacity> */}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>{error}</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>Completed Accidents</Text>
//       <FlatList
//         data={completedAccidents}
//         keyExtractor={(item, index) => item._id || item.id || index.toString()}
//         renderItem={renderAccidentCard}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No completed accidents found.</Text>
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//     paddingHorizontal: 16,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 16,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 15,
//     padding: 20,
//     marginVertical: 10,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 4 },
//     shadowOpacity: Platform.OS === "ios" ? 0.1 : 0.3,
//     shadowRadius: 6,
//     elevation: 5, // For Android shadow
//   },
//   label: {
//     fontWeight: "600", // Slightly bolder for better readability
//     fontSize: 16,
//     color: "#444",
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 10,
//   },
//   detailsButton: {
//     marginTop: 10,
//     backgroundColor: "#aa18ea",
//     paddingVertical: Platform.OS === "ios" ? 10 : 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   detailsButtonText: {
//     color: "#ffffff",
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   loaderContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f5f5f5",
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 16,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 16,
//     textAlign: "center",
//   },
//   listContent: {
//     paddingBottom: 16,
//   },
//   emptyText: {
//     textAlign: "center",
//     fontSize: 16,
//     color: "#888",
//     marginTop: 20,
//   },
// });


// export default CompletedAccidentsScreen;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../config";

const CompletedAccidentsScreen = () => {
  const [completedAccidents, setCompletedAccidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openrouteservice.org/geocode/reverse`,
        {
          params: {
            api_key: "5b3ce3597851110001cf62481df96251675d457492fd45c3538a46c5", // Replace with your actual API key
            "point.lat": latitude,
            "point.lon": longitude,
            size: 1,
          },
        }
      );
      return response.data.features[0]?.properties.label || null; // Return null if no label found
    } catch (err) {
      console.error("Error fetching place name:", err.message || err);
      return null; // Return null in case of an error
    }
  };
  
  useEffect(() => {
    const fetchCompletedAccidents = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
    
        if (!token) {
          setError("Authorization token not found");
          setLoading(false);
          return;
        }
    
        const headers = {
          Authorization: `Bearer ${token}`,
        };
    
        const response = await axios.get(
          `${BASE_URL}/api/accidents/completedAccidents`,
          {
            headers,
          }
        );
    
        if (response.data.success) {
          const accidentsWithPlaces = await Promise.all(
            response.data.data.map(async (accident) => {
              let placeName = "Location not available";
              if (accident.location?.latitude && accident.location?.longitude) {
                const fetchedPlaceName = await fetchPlaceName(
                  accident.location.latitude,
                  accident.location.longitude
                );
                placeName =
                  fetchedPlaceName ||
                  `Lat: ${accident.location.latitude}, Lon: ${accident.location.longitude}`;
              }
              return { ...accident, placeName };
            })
          );
          setCompletedAccidents(accidentsWithPlaces);
        } else {
          setError("Failed to fetch completed accidents");
        }
      } catch (err) {
        console.error("Error fetching completed accidents:", err.message || err);
        setError("Failed to fetch completed accidents");
      } finally {
        setLoading(false);
      }
    };
    

    fetchCompletedAccidents();
  }, []);

  const renderAccidentCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.label}>Severity:</Text>
      <Text style={styles.value}>{item.accidentSeverity}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{item.placeName}</Text>

      
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Completed Accidents</Text>
      <FlatList
        data={completedAccidents}
        keyExtractor={(item) => item._id || item.id}
        renderItem={renderAccidentCard}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No completed accidents found.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: Platform.OS === "ios" ? 2 : 4 },
    shadowOpacity: Platform.OS === "ios" ? 0.1 : 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#444",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});

export default CompletedAccidentsScreen;
