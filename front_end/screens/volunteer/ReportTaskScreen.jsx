// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import * as ImagePicker from 'expo-image-picker';
// import DropDownPicker from 'react-native-dropdown-picker';
// import { Ionicons } from '@expo/vector-icons';

// const ReportTaskScreen = ({ route, navigation }) => {
//   const { issueId } = route.params;
//   const [description, setDescription] = useState('');
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [status, setStatus] = useState(null);
//   const [openDropdown, setOpenDropdown] = useState(false);

//   // Handle media selection and add selected files to state
//   const handleAddMedia = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });
//     if (!result.canceled) {
//       setMediaFiles((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
//     }
//   };

//   // Remove media file from selection
//   const handleRemoveMedia = (uri) => {
//     setMediaFiles((prev) => prev.filter((file) => file !== uri));
//   };

//   // Convert report data and media files to FormData and submit to backend
//   const handleSubmitReport = async () => {
//     if (!status) {
//       return Alert.alert('Please select a status before submitting.');
//     }

//     const token = await AsyncStorage.getItem('token');
//     const url = status === 'complete'
//       ? `${BASE_URL}/api/issueReporting/complete-task`
//       : `${BASE_URL}/api/issueReporting/progress`;

//     // Create FormData and append fields
//     const formData = new FormData();
//     formData.append('issueId', issueId);
//     formData.append('description', description);
//     mediaFiles.forEach((fileUri, index) => {
//       const fileType = fileUri.substring(fileUri.lastIndexOf('.') + 1);
//       formData.append('media', {
//         uri: fileUri,
//         name: `media_${index}.${fileType}`,
//         type: `image/${fileType}`, // Assuming images; adjust if other types are allowed
//       });
//     });

//     try {
//       await axios.post(url, formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       Alert.alert('Report submitted successfully');
//       navigation.goBack();
//     } catch (error) {
//       console.error('Error submitting report:', error);
//       Alert.alert('Failed to submit report');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Report Description</Text>
//       <TextInput
//         style={styles.input}
//         multiline
//         placeholder="Enter report details"
//         value={description}
//         onChangeText={setDescription}
//       />
//       <DropDownPicker
//         open={openDropdown}
//         value={status}
//         items={[
//           { label: 'In Progress', value: 'in-progress' },
//           { label: 'Complete', value: 'complete' },
//         ]}
//         setOpen={setOpenDropdown}
//         setValue={setStatus}
//         placeholder="Select Status"
//         containerStyle={styles.dropdownContainer}
//         style={styles.dropdown}
//         onChangeValue={(value) => setStatus(value)}
//       />
//       <TouchableOpacity onPress={handleAddMedia} style={styles.mediaButton}>
//         <Text style={styles.mediaButtonText}>Add Media</Text>
//       </TouchableOpacity>
      
//       <FlatList
//         data={mediaFiles}
//         horizontal
//         keyExtractor={(item) => item}
//         renderItem={({ item }) => (
//           <View style={styles.mediaPreviewContainer}>
//             <Image source={{ uri: item }} style={styles.mediaPreview} />
//             <TouchableOpacity onPress={() => handleRemoveMedia(item)} style={styles.removeMediaButton}>
//               <Ionicons name="close-circle" size={24} color="red" />
//             </TouchableOpacity>
//           </View>
//         )}
//       />

//       <Button title="Submit Report" onPress={handleSubmitReport} color="#2196F3" />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     height: 120,
//     marginBottom: 20,
//     textAlignVertical: 'top',
//   },
//   dropdownContainer: {
//     marginBottom: 20,
//     width: '100%',
//   },
//   dropdown: {
//     borderColor: '#ccc',
//   },
//   mediaButton: {
//     backgroundColor: '#4CAF50',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   mediaButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   mediaPreviewContainer: {
//     position: 'relative',
//     marginRight: 10,
//   },
//   mediaPreview: {
//     width: 70,
//     height: 70,
//     borderRadius: 8,
//   },
//   removeMediaButton: {
//     position: 'absolute',
//     top: -10,
//     right: -10,
//   },
// });

// export default ReportTaskScreen;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const ReportTaskScreen = ({ route, navigation }) => {
  const { issueId } = route.params;
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleAddMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!result.canceled) {
      setMediaFiles((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveMedia = (uri) => {
    setMediaFiles((prev) => prev.filter((file) => file !== uri));
  };

  const handleSubmitReport = async () => {
    if (!description.trim()) {
      return Alert.alert('Error', 'Please enter a description.');
    }

    if (!status) {
      return Alert.alert('Error', 'Please select a status before submitting.');
    }

    const token = await AsyncStorage.getItem('token');
    const url =
      status === 'complete'
        ? `${BASE_URL}/api/issueReporting/complete-task`
        : `${BASE_URL}/api/issueReporting/progress`;

    const formData = new FormData();
    formData.append('issueId', issueId);
    formData.append('description', description);
    mediaFiles.forEach((fileUri, index) => {
      const fileType = fileUri.substring(fileUri.lastIndexOf('.') + 1);
      formData.append('media', {
        uri: fileUri,
        name: `media_${index}.${fileType}`,
        type: fileType === 'mov' || fileType === 'mp4' ? `video/${fileType}` : `image/${fileType}`,
      });
    });

    try {
      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Report submitted successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit report.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={mediaFiles}
        ListHeaderComponent={
          <>
            <View style={styles.card}>
              <Text style={styles.label}>Report Description</Text>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Enter report details"
                value={description}
                onChangeText={setDescription}
              />
              <DropDownPicker
                open={openDropdown}
                value={status}
                items={[
                  { label: 'In Progress', value: 'in-progress' },
                  { label: 'Complete', value: 'complete' },
                ]}
                setOpen={setOpenDropdown}
                setValue={setStatus}
                placeholder="Select Status"
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                onChangeValue={(value) => setStatus(value)}
              />
              <TouchableOpacity onPress={handleAddMedia} style={styles.mediaButton}>
                <Text style={styles.mediaButtonText}>Add Media</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.mediaPreviewContainer}>
            {item.endsWith('.mp4') || item.endsWith('.mov') ? (
              <Video
                source={{ uri: item }}
                style={styles.mediaPreview}
                resizeMode="cover"
                shouldPlay={false}
              />
            ) : (
              <Image source={{ uri: item }} style={styles.mediaPreview} />
            )}
            <TouchableOpacity
              onPress={() => handleRemoveMedia(item)}
              style={styles.removeMediaButton}
            >
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => `media-${index}`}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity onPress={handleSubmitReport} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    height: 100,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#555555',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#ddd',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  mediaButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aa18ea',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  mediaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  mediaPreviewContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  mediaPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#000000',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 3,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginBottom: 25,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
});


export default ReportTaskScreen;
