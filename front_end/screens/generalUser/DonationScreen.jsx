
// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import axios from 'axios';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from '../../config';

// const DonationScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeProject, setActiveProject] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigation = useNavigation();

//   useEffect(() => {
//     // Fetch charity projects from backend
//     const fetchProjects = async () => {
//       try {
//         // Retrieve token from AsyncStorage
//         const token = await AsyncStorage.getItem('token');
//         if (!token) {
//           Alert.alert('Error', 'No token found, please login.');
//           return;
//         }

//         // Make API call to fetch projects
//         const response = await axios.get(`${BASE_URL}/api/charityProjects/enabled`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setProjects(response.data.data); // Assuming `data.data` contains the list of projects
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//         Alert.alert('Error', 'Unable to fetch charity projects.');
//       } finally {
//         setLoading(false); // Stop the loading spinner
//       }
//     };

//     // Initial fetch
//     fetchProjects();

//     // Set up interval to refresh the data every 10 seconds (10000ms)
//     const intervalId = setInterval(fetchProjects, 10000);

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(intervalId);
//   }, []);

//   // Filter projects based on search query
//   const filteredProjects = projects.filter(project =>
//     project.title.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Navigate to the project detail screen
//   const handleNavigateToDetail = (project) => {
//     setActiveProject(null);
//     navigation.navigate('ProjectDetailScreen', { project });
//   };

//   // Render individual project item
//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.projectItem,
//         activeProject === item._id && styles.projectItemActive
//       ]}
//       onPress={() => handleNavigateToDetail(item)}
//       activeOpacity={1}
//       onPressIn={() => setActiveProject(item._id)}
//       onPressOut={() => setActiveProject(null)}
//     >
//       <Icon name="volunteer-activism" size={24} color="#000" />
//       <Text style={styles.projectTitle}>{item.title}</Text>
//     </TouchableOpacity>
//   );

//   // Display loading spinner while fetching data
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#000" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.searchBar}
//         placeholder="Search Projects"
//         value={searchQuery}
//         onChangeText={text => setSearchQuery(text)}
//       />
//       {filteredProjects.length > 0 ? (
//         <FlatList
//           data={filteredProjects}
//           renderItem={renderItem}
//           keyExtractor={item => item._id} // Use `_id` as key from backend
//         />
//       ) : (
//         // Display message when no projects are found
//         <View style={styles.noProjectsContainer}>
//           <Text style={styles.noProjectsText}>No charity projects are currently ongoing.</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   searchBar: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   projectItem: {
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//   },
//   projectItemActive: {
//     backgroundColor: '#aa18ea',
//   },
//   projectTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginLeft: 10,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noProjectsContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   noProjectsText: {
//     fontSize: 18,
//     color: 'gray',
//   },
// });

// export default DonationScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../config';

const DonationScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert('Error', 'No token found, please login.');
          return;
        }

        const response = await axios.get(`${BASE_URL}/api/charityProjects/enabled`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data.data); 
      } catch (error) {
        console.error('Error fetching projects:', error);
        Alert.alert('Error', 'Unable to fetch charity projects.');
      } finally {
        setLoading(false); 
      }
    };

    fetchProjects();
    const intervalId = setInterval(fetchProjects, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNavigateToDetail = (project) => {
    setActiveProject(null);
    navigation.navigate('ProjectDetailScreen', { project });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.projectItem,
        activeProject === item._id && styles.projectItemActive
      ]}
      onPress={() => handleNavigateToDetail(item)}
      activeOpacity={0.8}
      onPressIn={() => setActiveProject(item._id)}
      onPressOut={() => setActiveProject(null)}
    >
      <Icon name="volunteer-activism" size={24} color={activeProject === item._id ? '#fff' : '#000'} />
      <Text style={[styles.projectTitle, activeProject === item._id && styles.projectTitleActive]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Projects"
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
        placeholderTextColor="#aaa"
      />
      {filteredProjects.length > 0 ? (
        <FlatList
          data={filteredProjects}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      ) : (
        <View style={styles.noProjectsContainer}>
          <Text style={styles.noProjectsText}>No charity projects are currently ongoing.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
    color: '#333',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  projectItemActive: {
    backgroundColor: '#aa18ea',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  projectTitleActive: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noProjectsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noProjectsText: {
    fontSize: 18,
    color: '#aaa',
  },
});

export default DonationScreen;
