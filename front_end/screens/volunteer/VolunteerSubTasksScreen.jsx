// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   TextInput,
//   StyleSheet,
//   ActivityIndicator,
//   Modal,
//   Image,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { BASE_URL } from '../../config';
// import * as ImagePicker from 'expo-image-picker';
// import { Ionicons } from '@expo/vector-icons';
// import DropDownPicker from 'react-native-dropdown-picker';

// const VolunteerSubTasksScreen = ({ route }) => {
//   const { issueId } = route.params;
//   const [subTasks, setSubTasks] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedSubTask, setSelectedSubTask] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [viewReportsModalVisible, setViewReportsModalVisible] = useState(false);
//   const [reportDescription, setReportDescription] = useState('');
//   const [mediaFiles, setMediaFiles] = useState([]);
//   const [reportStatus, setReportStatus] = useState('pending');
//   const [subTaskReports, setSubTaskReports] = useState([]);
//   const [openDropdown, setOpenDropdown] = useState(false);

//   useEffect(() => {
//     const fetchSubTasks = async () => {
//       const token = await AsyncStorage.getItem('token');
//       try {
//         const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setSubTasks(response.data.subTasks);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching sub-tasks:', error);
//         setIsLoading(false);
//       }
//     };
//     fetchSubTasks();
//   }, [issueId]);

//   // const handleAddMedia = async () => {
//   //   let result = await ImagePicker.launchImageLibraryAsync({
//   //     mediaTypes: ImagePicker.MediaTypeOptions.All,
//   //     allowsMultipleSelection: true,
//   //     quality: 1,
//   //   });

//   //   if (!result.canceled) {
//   //     setMediaFiles((prev) => [...prev, result.uri]);
//   //   }
//   // };

//   // const handleRemoveMedia = (uri) => {
//   //   setMediaFiles((prev) => prev.filter((file) => file !== uri));
//   // };
//   const handleAddMedia = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsMultipleSelection: true,
//       quality: 1,
//     });
  
//     if (!result.canceled && result.assets) {
//       setMediaFiles((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
//     }
//   };
  
//   const handleRemoveMedia = (uri) => {
//     setMediaFiles((prev) => prev.filter((file) => file !== uri));
//   };
  

  

//   const handleReportSubmit = async () => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       await axios.post(
//         `${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks/${selectedSubTask}/report`,
//         {
//           description: reportDescription,
//           media: mediaFiles,
//           status: reportStatus,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       alert('Report submitted successfully');
//       setModalVisible(false);
//       setReportDescription('');
//       setMediaFiles([]);
//       setReportStatus('pending');
//     } catch (error) {
//       console.error('Error submitting report:', error);
//       alert('Failed to submit report');
//     }
//   };

//   const handleViewReports = async (subTaskId) => {
//     const token = await AsyncStorage.getItem('token');
//     try {
//       const response = await axios.get(
//         `${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks/${subTaskId}/volunteer-reports`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSubTaskReports(response.data.reports || []);
//       setViewReportsModalVisible(true);
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       alert('Failed to fetch reports');
//     }
//   };

//   const renderSubTask = ({ item }) => (
//     <View style={styles.card}>
//       <Text style={styles.title}>{item.description}</Text>
//       <Text>Status: {item.status}</Text>
//       <TouchableOpacity
//         style={styles.reportButton}
//         onPress={() => {
//           setSelectedSubTask(item._id);
//           setModalVisible(true);
//         }}
//       >
//         <Text style={styles.reportButtonText}>Report</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.viewReportsButton}
//         onPress={() => handleViewReports(item._id)}
//       >
//         <Text style={styles.viewReportsButtonText}>View My Reports</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const renderReportItem = ({ item }) => (
//     <View style={styles.reportCard}>
//       <Text style={styles.reportTitle}>Report Details</Text>
//       <Text style={styles.reportText}>Description: {item.description}</Text>
//       <Text style={styles.reportText}>Status: {item.status}</Text>
//       <Text style={styles.reportDate}>
//         Date: {new Date(item.date).toLocaleString()}
//       </Text>
//       {item.media.length > 0 && (
//         <FlatList
//           data={item.media}
//           horizontal
//           renderItem={({ item: mediaUri }) => (
//             <Image source={{ uri: mediaUri }} style={styles.reportImage} />
//           )}
//           keyExtractor={(mediaUri) => mediaUri}
//         />
//       )}
//     </View>
//   );

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#aa18ea" />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//       <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
//         <View style={styles.container}>
//           <Text style={styles.header}>Sub-Tasks</Text>
//           <FlatList data={subTasks} renderItem={renderSubTask} keyExtractor={(item) => item._id} />

//           {/* Modal for reporting */}
//           <Modal visible={modalVisible} animationType="fade" transparent={true}>
//             <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <Text style={styles.modalTitle}>Report Sub-Task</Text>
//                   <TextInput
//                     placeholder="Enter report details"
//                     value={reportDescription}
//                     onChangeText={setReportDescription}
//                     style={styles.input}
//                     multiline
//                   />

//                   <DropDownPicker
//                     open={openDropdown}
//                     value={reportStatus}
//                     items={[
//                       { label: 'Pending', value: 'pending' },
//                       { label: 'In Progress', value: 'in progress' },
//                       { label: 'Completed', value: 'completed' },
//                     ]}
//                     setOpen={setOpenDropdown}
//                     setValue={setReportStatus}
//                     style={styles.dropdown}
//                     containerStyle={styles.pickerContainer}
//                   />

//                   {/* <View style={styles.mediaContainer}>
//                     {mediaFiles.map((uri, index) => (
//                       <View key={index} style={styles.mediaPreviewContainer}>
//                         <Image source={{ uri }} style={styles.mediaPreview} />
//                         <TouchableOpacity onPress={() => handleRemoveMedia(uri)} style={styles.removeMediaButton}>
//                           <Ionicons name="close-circle" size={24} color="red" />
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                     <TouchableOpacity onPress={handleAddMedia} style={styles.mediaPicker}>
//                       <Ionicons name="add-circle-outline" size={40} color="#28a745" />
//                       <Text style={styles.mediaPickerText}>Add Media</Text>
//                     </TouchableOpacity> */}
//                     <View style={styles.mediaContainer}>
//                       {mediaFiles.map((uri, index) => (
//                         <View key={index} style={styles.mediaPreviewContainer}>
//                           <Image source={{ uri }} style={styles.mediaPreview} />
//                           <TouchableOpacity onPress={() => handleRemoveMedia(uri)} style={styles.removeMediaButton}>
//                             <Ionicons name="close-circle" size={24} color="red" />
//                           </TouchableOpacity>
//                         </View>
//                       ))}
//                     </View>
//                     <TouchableOpacity onPress={handleAddMedia} style={styles.fixedMediaPicker}>
//                       <Ionicons name="add-circle-outline" size={40} color="#28a745" />
//                       <Text style={styles.mediaPickerText}>Add Media</Text>
//                     </TouchableOpacity>
//                   {/* </View> */}

//                   <TouchableOpacity style={styles.submitButton} onPress={handleReportSubmit}>
//                     <Text style={styles.submitButtonText}>Submit Report</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
//                     <Text style={styles.closeButtonText}>Close</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </Modal>

//           {/* Modal to view reported sub-tasks */}
//           <Modal visible={viewReportsModalVisible} animationType="slide" transparent={true}>
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <FlatList
//                   data={subTaskReports}
//                   keyExtractor={(item, index) => index.toString()}
//                   renderItem={renderReportItem}
//                   ListHeaderComponent={<Text style={styles.modalTitle}>Reported Updates</Text>}
//                   ListFooterComponent={
//                     <TouchableOpacity style={styles.closeButton} onPress={() => setViewReportsModalVisible(false)}>
//                       <Text style={styles.closeButtonText}>Close</Text>
//                     </TouchableOpacity>
//                   }
//                 />
//               </View>
//             </View>
//           </Modal>
//         </View>
//       </Pressable>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 10, backgroundColor: '#f8f8f8' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   header: { fontSize: 22, fontWeight: 'bold', color: '#444', marginBottom: 15, textAlign: 'center' },
//   card: {
//     backgroundColor: 'white',
//     padding: 15,
//     marginVertical: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
//   reportButton: {
//     backgroundColor: '#aa18ea',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   reportButtonText: { color: '#fff', fontWeight: 'bold' },
//   viewReportsButton: {
//     backgroundColor: '#4a90e2',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 5,
//   },
//   viewReportsButtonText: { color: '#fff', fontWeight: 'bold' },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 10,
//     elevation: 10,
//   },
//   modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
//   reportCard: {
//     backgroundColor: '#f9f9f9',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     width: '100%',
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   reportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
//   reportText: { fontSize: 16, color: '#444', marginBottom: 5 },
//   reportDate: { fontSize: 14, color: '#888', marginTop: 5 },
//   reportImage: { width: 60, height: 60, borderRadius: 5, margin: 5 },
//   input: {
//     backgroundColor: '#f0f0f0',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 15,
//     textAlignVertical: 'top',
//     height: 100,
//     width: '100%',
//   },
//   dropdown: { width: '100%', marginBottom: 15 },
//   pickerContainer: { width: '100%', marginBottom: 20 },
//   mediaContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   mediaPreviewContainer: { position: 'relative', margin: 8 },
//   mediaPreview: { width: 70, height: 70, borderRadius: 8 },
//   removeMediaButton: { position: 'absolute', top: -10, right: -10 },
//   mediaPicker: { alignItems: 'center', marginVertical: 15  },
//   mediaPickerText: { marginTop: 5, color: '#28a745', fontWeight: 'bold', },
//   submitButton: {
//     backgroundColor: '#28a745',
//     padding: 12,
//     borderRadius: 10,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
//   closeButton: {
//     backgroundColor: '#aa18ea',
//     padding: 10,
//     borderRadius: 10,
//     width: '100%',
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
// });

// export default VolunteerSubTasksScreen;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Video } from 'expo-av';

const VolunteerSubTasksScreen = ({ route }) => {
  const { issueId } = route.params;
  const [subTasks, setSubTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubTask, setSelectedSubTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewReportsModalVisible, setViewReportsModalVisible] = useState(false);
  const [reportDescription, setReportDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [reportStatus, setReportStatus] = useState('pending');
  const [subTaskReports, setSubTaskReports] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const fetchSubTasks = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const response = await axios.get(`${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubTasks(response.data.subTasks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sub-tasks:', error);
        setIsLoading(false);
      }
    };
    fetchSubTasks();
  }, [issueId]);

  const handleAddMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setMediaFiles((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveMedia = (uri) => {
    setMediaFiles((prev) => prev.filter((file) => file !== uri));
  };

  // const renderMedia = (uri) => {
  //   const isVideo = uri.endsWith('.mp4') || uri.endsWith('.mov');
  //   if (isVideo) {
  //     return (
  //       <Video
  //         source={{ uri }}
  //         style={styles.mediaPreview}
  //         useNativeControls
  //         resizeMode="cover"
  //       />
  //     );
  //   }
  //   return <Image source={{ uri }} style={styles.mediaPreview} />;
  // };
  const renderMedia = (uri) => {
    if (!uri) return null; // Return nothing if uri is null or undefined
    const isVideo = uri.endsWith('.mp4') || uri.endsWith('.mov');
    if (isVideo) {
      return (
        <Video
          source={{ uri }}
          style={styles.mediaPreview}
          useNativeControls
          resizeMode="cover"
        />
      );
    }
    return <Image source={{ uri }} style={styles.mediaPreview} />;
  };
  

  const handleReportSubmit = async () => {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
  
    formData.append('description', reportDescription);
    formData.append('status', reportStatus);
  
    mediaFiles.forEach((file, index) => {
      const fileName = file.split('/').pop();
      const fileType = fileName.split('.').pop();
      formData.append('media', {
        uri: file,
        name: fileName,
        type: fileType.includes('mp4') || fileType.includes('mov') ? `video/${fileType}` : `image/${fileType}`,
      });
    });
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks/${selectedSubTask}/report`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      alert('Report submitted successfully');
      setModalVisible(false);
      setReportDescription('');
      setMediaFiles([]);
      setReportStatus('pending');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  };
  
  const handleViewReports = async (subTaskId) => {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await axios.get(
        `${BASE_URL}/api/issueReporting/issues/${issueId}/sub-tasks/${subTaskId}/volunteer-reports`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubTaskReports(response.data.reports || []);
      setViewReportsModalVisible(true);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports');
    }
  };

  const renderSubTask = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.description}</Text>
      <Text>Status: {item.status}</Text>
      {/* Conditionally render the Report button */}
      {item.status !== 'completed' && (
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => {
            setSelectedSubTask(item._id);
            setModalVisible(true);
          }}
        >
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.viewReportsButton}
        onPress={() => handleViewReports(item._id)}
      >
        <Text style={styles.viewReportsButtonText}>View My Reports</Text>
      </TouchableOpacity>
    </View>
  );
  

  // const renderReportItem = ({ item }) => (
  //   <View style={styles.reportCard}>
  //     <Text style={styles.reportTitle}>Report Details</Text>
  //     <Text style={styles.reportText}>Description: {item.description}</Text>
  //     <Text style={styles.reportText}>Status: {item.status}</Text>
  //     <Text style={styles.reportDate}>
  //       Date: {new Date(item.date).toLocaleString()}
  //     </Text>
  //     {item.media.length > 0 && (
  //       <FlatList
  //         data={item.media}
  //         horizontal
  //         renderItem={({ item: mediaUri }) => (
  //           renderMedia(mediaUri)
  //         )}
  //         keyExtractor={(mediaUri) => mediaUri}
  //       />
  //     )}
  //   </View>
  // );
  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>Report Details</Text>
      <Text style={styles.reportText}>Description: {item.description}</Text>
      <Text style={styles.reportText}>Status: {item.status}</Text>
      <Text style={styles.reportDate}>
        Date: {new Date(item.date).toLocaleString()}
      </Text>
      {item.media && item.media.length > 0 ? (
        <FlatList
          data={item.media}
          horizontal
          renderItem={({ item: mediaUri }) => renderMedia(mediaUri)}
          keyExtractor={(mediaUri, index) => `${mediaUri}-${index}`}
        />
      ) : (
        <Text style={styles.noMediaText}>No media attached</Text>
      )}
    </View>
  );
  

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Pressable style={{ flex: 1 }} onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
          <Text style={styles.header}>Sub-Tasks</Text>
          <FlatList data={subTasks} renderItem={renderSubTask} keyExtractor={(item) => item._id} />

          {/* Modal for reporting */}
          <Modal visible={modalVisible} animationType="fade" transparent={true}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Report Sub-Task</Text>
                  <TextInput
                    placeholder="Enter report details"
                    value={reportDescription}
                    onChangeText={setReportDescription}
                    style={styles.input}
                    multiline
                  />
                  <DropDownPicker
                    open={openDropdown}
                    value={reportStatus}
                    items={[
                      { label: 'Pending', value: 'pending' },
                      { label: 'In Progress', value: 'in progress' },
                      { label: 'Completed', value: 'completed' },
                    ]}
                    setOpen={setOpenDropdown}
                    setValue={setReportStatus}
                    style={styles.dropdown}
                    containerStyle={styles.pickerContainer}
                  />
                  <View style={styles.mediaContainer}>
                    {mediaFiles.map((uri, index) => (
                      <View key={index} style={styles.mediaPreviewContainer}>
                        {renderMedia(uri)}
                        <TouchableOpacity onPress={() => handleRemoveMedia(uri)} style={styles.removeMediaButton}>
                          <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity onPress={handleAddMedia} style={styles.fixedMediaPicker}>
                    <Ionicons name="add-circle-outline" size={40} color="#28a745" />
                    <Text style={styles.mediaPickerText}>Add Media</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitButton} onPress={handleReportSubmit}>
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {/* Modal to view reported sub-tasks */}
          <Modal visible={viewReportsModalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <FlatList
                  data={subTaskReports}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderReportItem}
                  ListHeaderComponent={<Text style={styles.modalTitle}>Reported Updates</Text>}
                  ListFooterComponent={
                    <TouchableOpacity style={styles.closeButton} onPress={() => setViewReportsModalVisible(false)}>
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
          </Modal>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f8f8f8' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#444', marginBottom: 15, textAlign: 'center' },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  reportButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  reportButtonText: { color: '#fff', fontWeight: 'bold' },
  viewReportsButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  viewReportsButtonText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  reportCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  reportTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  reportText: { fontSize: 16, color: '#444', marginBottom: 5 },
  reportDate: { fontSize: 14, color: '#888', marginTop: 5 },
  reportImage: { width: 60, height: 60, borderRadius: 5, margin: 5 },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    textAlignVertical: 'top',
    height: 100,
    width: '100%',
  },
  dropdown: { width: '100%', marginBottom: 15 },
  pickerContainer: { width: '100%', marginBottom: 20 },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
    width: '100%',
  },
  mediaPreviewContainer: { position: 'relative', margin: 8 },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaButton: { position: 'absolute', top: -5, right: -5 },
  fixedMediaPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  mediaPickerText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  closeButton: {
    backgroundColor: '#aa18ea',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default VolunteerSubTasksScreen;
