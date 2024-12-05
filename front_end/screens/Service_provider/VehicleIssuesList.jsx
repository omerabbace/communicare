// // ServiceProviderListScreen.js
// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../helpers/Auth';
// import { LinearGradient } from 'expo-linear-gradient';

// const VehicleIssuesList = () => {
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState([]);
//   const navigation = useNavigation();
//   const { userSession } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
//           headers: { Authorization: `Bearer ${userSession.token}` },
//         });

//         if (response.data.success && response.data.data) {
//           // Transform the data object into an array
//           const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
//             id: key, // use the unique key as id
//             ...value,
//           }));
//           setReports(reportsArray);
//           console.log(reportsArray);
//         }
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, [userSession.token]);

//   // const handleSelectReport = (report) => {
//   //   navigation.navigate('ReportDetails', { report });
//   // };
//   const handleUpdateReport = (updatedReport) => {
//     setReports((prevReports) =>
//       prevReports.map((report) => (report.id === updatedReport.id ? updatedReport : report))
//     );
//   };

//   const handleSelectReport = (report) => {
//     navigation.navigate('ReportDetails', {
//       report,
//       onUpdateReport: handleUpdateReport, // Pass the update handler
//     });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Vehicle Assistance Requests</Text>
//       {reports.length === 0 ? (
//         <Text style={styles.noReportsText}>No reports available.</Text>
//       ) : (
//         <FlatList
//           data={reports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity style={styles.reportCard} onPress={() => handleSelectReport(item)}>
//               <LinearGradient
//                 colors={['#aa18ea', '#e94057', '#f27121']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.gradientBackground}
//               >
//                 <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
//                 <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
//                 <Text style={styles.reportTextTitle}>Issue</Text>
//                 <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   reportCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   gradientBackground: {
//     padding: 20,
//     borderRadius: 15,
//   },
//   reportTextTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginBottom: 5,
//   },
//   reportTextValue: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noReportsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#333',
//   },
// });

// export default VehicleIssuesList;

// ServiceProviderListScreen.js
// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../helpers/Auth';
// import { LinearGradient } from 'expo-linear-gradient';

// const VehicleIssuesList = () => {
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState([]);
//   const navigation = useNavigation();
//   const { userSession } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
//           headers: { Authorization: `Bearer ${userSession.token}` },
//         });

//         if (response.data.success && response.data.data) {
//           // Transform the data object into an array
//           const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
//             id: key, // use the unique key as id
//             ...value,
//           }));
//           setReports(reportsArray);
//         }
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReports();
//   }, [userSession.token]);

//   const handleSelectReport = (report) => {
//     navigation.navigate('ReportDetails', { report });
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Vehicle Assistance Requests</Text>
//       {reports.length === 0 ? (
//         <Text style={styles.noReportsText}>No reports available.</Text>
//       ) : (
//         <FlatList
//           data={reports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity style={styles.reportCard} onPress={() => handleSelectReport(item)}>
//               <LinearGradient
//                 colors={['#aa18ea', '#e94057', '#f27121']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.gradientBackground}
//               >
//                 <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
//                 <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
//                 <Text style={styles.reportTextTitle}>Issue</Text>
//                 <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   reportCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   gradientBackground: {
//     padding: 20,
//     borderRadius: 15,
//   },
//   reportTextTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginBottom: 5,
//   },
//   reportTextValue: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noReportsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#333',
//   },
// });

// export default VehicleIssuesList;


// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../helpers/Auth';
// import { LinearGradient } from 'expo-linear-gradient';

// const VehicleIssuesList = () => {
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState([]);
//   const navigation = useNavigation();
//   const { userSession } = useContext(AuthContext);

//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         setLoading(true);

//         // Load cached reports
//         const cachedReports = await AsyncStorage.getItem('reports');
//         if (cachedReports) {
//           setReports(JSON.parse(cachedReports));
//         }

//         // Fetch fresh reports from the API
//         const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
//           headers: { Authorization: `Bearer ${userSession.token}` },
//         });

//         if (response.data.success && response.data.data) {
//           const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
//             id: key,
//             ...value,
//           }));
//           setReports(reportsArray);

//           // Save reports to AsyncStorage
//           await AsyncStorage.setItem('reports', JSON.stringify(reportsArray));
//         }
//       } catch (error) {
//         console.error('Error loading reports:', error);
//         Alert.alert('Error', 'Failed to load reports. Please check your internet connection.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadReports();
//   }, [userSession.token]);

//   const handleSelectReport = (reportId) => {
//     navigation.navigate('ReportDetails', { reportId });
//   };

//   const updateReport = async (updatedReport) => {
//     try {
//       // Update the state for the specific report
//       setReports((prevReports) =>
//         prevReports.map((report) => (report.id === updatedReport.id ? updatedReport : report))
//       );

//       // Persist updated reports to AsyncStorage
//       await AsyncStorage.setItem('reports', JSON.stringify(reports));
//     } catch (error) {
//       console.error('Error updating report:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Vehicle Assistance Requests</Text>
//       {reports.length === 0 ? (
//         <Text style={styles.noReportsText}>No reports available.</Text>
//       ) : (
//         <FlatList
//           data={reports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.reportCard}
//               onPress={() => handleSelectReport(item.id)}
//             >
//               <LinearGradient
//                 colors={['#aa18ea', '#e94057', '#f27121']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.gradientBackground}
//               >
//                 <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
//                 <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
//                 <Text style={styles.reportTextTitle}>Issue</Text>
//                 <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   reportCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   gradientBackground: {
//     padding: 20,
//     borderRadius: 15,
//   },
//   reportTextTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginBottom: 5,
//   },
//   reportTextValue: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noReportsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#333',
//   },
// });

// export default VehicleIssuesList;


// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Alert,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../helpers/Auth';
// import { LinearGradient } from 'expo-linear-gradient';

// const VehicleIssuesList = () => {
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState([]);
//   const [statusFilter, setStatusFilter] = useState('pending'); // Add a state for status filter
//   const navigation = useNavigation();
//   const { userSession } = useContext(AuthContext);

//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         setLoading(true);
  
//         const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
//           headers: { Authorization: `Bearer ${userSession.token}` },
//         });
  
//         if (response.data.success && response.data.data) {
//           const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
//             id: key,
//             ...value,
//           }));
//           setReports(reportsArray);
  
//           await AsyncStorage.setItem('reports', JSON.stringify(reportsArray));
//         }
//       } catch (error) {
//         console.error('Error loading reports:', error);
//         Alert.alert('Error', 'Failed to load reports. Please check your internet connection.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     loadReports();
    
//   }, [userSession.token]);
  
//   const handleSelectReport = (reportId) => {
//     navigation.navigate('ReportDetails', { reportId });
//   };

//   const filteredReports = reports.filter((report) => report.status === statusFilter);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Vehicle Assistance Requests</Text>

//       <View style={styles.filterContainer}> 
//         {['pending', 'accepted', 'pending approval', 'approved', 'canceled','completed'].map((status) => (
//           <TouchableOpacity
//             key={status}
//             style={[
//               styles.filterButton,
//               statusFilter === status && styles.selectedFilterButton,
//             ]}
//             onPress={() => setStatusFilter(status)}
//           >
//             <Text
//               style={[
//                 styles.filterButtonText,
//                 statusFilter === status && styles.selectedFilterButtonText,
//               ]}
//             >
//               {status}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {filteredReports.length === 0 ? (
//         <Text style={styles.noReportsText}>No reports available for {statusFilter} status.</Text>
//       ) : (
//         <FlatList
//           data={filteredReports}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.reportCard}
//               onPress={() => handleSelectReport(item.id)}
//             >
//               <LinearGradient
//                 colors={['#aa18ea', '#e94057', '#f27121']}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.gradientBackground}
//               >
//                 <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
//                 <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
//                 <Text style={styles.reportTextTitle}>Issue</Text>
//                 <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//     paddingVertical: 10,
//     borderRadius: 25, // Makes the filter container rounded
//     backgroundColor: '#e0e0e0', // Light background for unselected state
//     overflow: 'hidden',
//   },
//   filterButton: {
//     flex: 1, // Takes equal space
//     paddingVertical: 10,
//     alignItems: 'center',
//     borderRadius: 25, // Rounded corners for each button
//     backgroundColor: 'transparent', // Transparent for unselected state
//   },
//   selectedFilterButton: {
//     backgroundColor: '#aa18ea', // Selected button color
//   },
//   filterButtonText: {
//     color: '#333', // Dark text for unselected buttons
//     fontWeight: 'bold',
//   },
//   selectedFilterButtonText: {
//     color: '#fff', // White text for selected button
//   },
//   reportCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   gradientBackground: {
//     padding: 20,
//     borderRadius: 15,
//   },
//   reportTextTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginBottom: 5,
//   },
//   reportTextValue: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noReportsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#333',
//   },
// });


// export default VehicleIssuesList;

// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ActivityIndicator,
//   FlatList,
//   StyleSheet,
//   Alert,
//   SafeAreaView,
// } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';
// import { useNavigation } from '@react-navigation/native';
// import { AuthContext } from '../../helpers/Auth';
// import { LinearGradient } from 'expo-linear-gradient';

// const statusList = ['pending', 'accepted', 'pending approval', 'approved', 'canceled', 'completed'];

// const VehicleIssuesList = () => {
//   const [loading, setLoading] = useState(true);
//   const [reports, setReports] = useState([]);
//   const [statusFilter, setStatusFilter] = useState('pending');
//   const navigation = useNavigation();
//   const { userSession } = useContext(AuthContext);

//   useEffect(() => {
//     const loadReports = async () => {
//       try {
//         setLoading(true);

//         const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
//           headers: { Authorization: `Bearer ${userSession.token}` },
//         });

//         if (response.data.success && response.data.data) {
//           const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
//             id: key,
//             ...value,
//           }));
//           setReports(reportsArray);

//           await AsyncStorage.setItem('reports', JSON.stringify(reportsArray));
//         }
//       } catch (error) {
//         console.error('Error loading reports:', error);
//         Alert.alert('Error', 'Failed to load reports. Please check your internet connection.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadReports();
//   }, [userSession.token]);

//   const handleSelectReport = (reportId) => {
//     navigation.navigate('ReportDetails', { reportId });
//   };

//   const filteredReports = reports.filter((report) => report.status === statusFilter);

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//   <Text style={styles.title}>Vehicle Assistance Requests</Text>

//   {/* Status List */}
//   <View style={styles.filterWrapper}>
//     <FlatList
//       data={statusList}
//       keyExtractor={(item, index) => `${item}-${index}`}
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       contentContainerStyle={styles.filterContainer}
//       renderItem={({ item }) => (
//         <TouchableOpacity
//           style={[
//             styles.filterButton,
//             statusFilter === item && styles.selectedFilterButton,
//           ]}
//           onPress={() => setStatusFilter(item)}
//         >
//           <Text
//             style={[
//               styles.filterButtonText,
//               statusFilter === item && styles.selectedFilterButtonText,
//             ]}
//           >
//             {item}
//           </Text>
//         </TouchableOpacity>
//       )}
//     />
//   </View>

//   {/* Gap Between Filters and Cards */}
//   <View style={styles.gap} />

//   {/* Report Cards */}
//   <View style={styles.cardContainer}>
//     {filteredReports.length === 0 ? (
//       <Text style={styles.noReportsText}>
//         No reports available for {statusFilter} status.
//       </Text>
//     ) : (
//       <FlatList
//         data={filteredReports}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.reportCard}
//             onPress={() => handleSelectReport(item.id)}
//           >
//             <LinearGradient
//               colors={['#aa18ea', '#e94057', '#f27121']}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.gradientBackground}
//             >
//               <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
//               <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
//               <Text style={styles.reportTextTitle}>Issue</Text>
//               <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         )}
//       />
//     )}
//   </View>
// </SafeAreaView>

//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#333',
//   },
//   filterWrapper: {
//     paddingHorizontal: 10, // Horizontal padding for status list
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 50,
//     backgroundColor: '#f0f0f0',
//     borderRadius: 10,
//   },
//   gap: {
//     height: 20, // Gap between the status list and the cards
//   },
//   filterButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     marginHorizontal: 5, // Adjust for better button spacing
//     borderRadius: 25,
//     backgroundColor: 'transparent',
//   },
//   selectedFilterButton: {
//     backgroundColor: '#aa18ea',
//   },
//   filterButtonText: {
//     color: '#333',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   selectedFilterButtonText: {
//     color: '#fff',
//     fontSize: 14,
//   },
//   cardContainer: {
//     flex: 1,
//     paddingHorizontal: 10, // Align cards within the screen
//     paddingTop: 5, // Small padding at the top
//   },
//   reportCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 15,
//     marginBottom: 15, // Space between cards
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   gradientBackground: {
//     padding: 20,
//     borderRadius: 15,
//   },
//   reportTextTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#f0f0f0',
//     marginBottom: 5,
//   },
//   reportTextValue: {
//     fontSize: 16,
//     color: '#fff',
//     fontWeight: '600',
//     marginBottom: 10,
//   },
//   noReportsText: {
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 20,
//     color: '#333',
//   },
//   loadingContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//       },
// });



// export default VehicleIssuesList;

import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../../helpers/Auth';
import { LinearGradient } from 'expo-linear-gradient';

const statusList = ['pending', 'accepted', 'pending approval', 'approved', 'canceled', 'completed'];

const VehicleIssuesList = () => {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const navigation = useNavigation();
  const route = useRoute(); // Access route params
  const { userSession } = useContext(AuthContext);

  useEffect(() => {
    // Set the initial statusFilter from the navigation parameter
    const initialStatus = route.params?.status || 'pending';
    setStatusFilter(initialStatus);
  }, [route.params]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        const response = await axios.get(`${BASE_URL}/api/vehicle-assistance/reports`, {
          headers: { Authorization: `Bearer ${userSession.token}` },
        });

        if (response.data.success && response.data.data) {
          const reportsArray = Object.entries(response.data.data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setReports(reportsArray);

          await AsyncStorage.setItem('reports', JSON.stringify(reportsArray));
        }
      } catch (error) {
        console.error('Error loading reports:', error);
        Alert.alert('Error', 'Failed to load reports. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [userSession.token]);

  const handleSelectReport = (reportId, status) => {
    navigation.navigate('ReportDetails', { reportId, category: status });
  };

  const filteredReports = reports.filter((report) => report.status === statusFilter);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vehicle Assistance Requests</Text>

      {/* Status List */}
      <View style={styles.filterWrapper}>
        <FlatList
          data={statusList}
          keyExtractor={(item, index) => `${item}-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                statusFilter === item && styles.selectedFilterButton,
              ]}
              onPress={() => setStatusFilter(item)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === item && styles.selectedFilterButtonText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Gap Between Filters and Cards */}
      <View style={styles.gap} />

      {/* Report Cards */}
      <View style={styles.cardContainer}>
        {filteredReports.length === 0 ? (
          <Text style={styles.noReportsText}>
            No reports available for {statusFilter} status.
          </Text>
        ) : (
          <FlatList
            data={filteredReports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.reportCard}
                onPress={() => handleSelectReport(item.id, statusFilter)}
              >
                <LinearGradient
                  colors={['#aa18ea', '#e94057', '#f27121']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBackground}
                >
                  <Text style={styles.reportTextTitle}>Vehicle Registration</Text>
                  <Text style={styles.reportTextValue}>{item.vehicleRegNo}</Text>
                  <Text style={styles.reportTextTitle}>Issue</Text>
                  <Text style={styles.reportTextValue}>{item.issueDescription || 'N/A'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  filterWrapper: {
    paddingHorizontal: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  gap: {
    height: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 25,
    backgroundColor: 'transparent',
  },
  selectedFilterButton: {
    backgroundColor: '#aa18ea',
  },
  filterButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedFilterButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  gradientBackground: {
    padding: 20,
    borderRadius: 15,
  },
  reportTextTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f0f0f0',
    marginBottom: 5,
  },
  reportTextValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  noReportsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleIssuesList;
