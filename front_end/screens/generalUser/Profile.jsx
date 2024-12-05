// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Modal,
//   Pressable,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialIcons } from '@expo/vector-icons';
// import { AuthContext } from '../../helpers/Auth';
// import { useContext } from 'react';

// const Profile = ({ profilePhoto, setProfilePhoto, fullName, setFullName }) => {
//   const {userSession} = useContext(AuthContext);
//   const [email, setEmail] = useState(userSession.email);
//   const [phoneNumber, setPhoneNumber] = useState('03195512112');
//   const [password, setPassword] = useState('password');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [reEnterNewPassword, setReEnterNewPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showReEnterNewPassword, setShowReEnterNewPassword] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== 'web') {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           alert('Sorry, we need camera roll permissions to make this work!');
//         }
//       }
//     })();
//   }, []);

//   const handleChoosePhoto = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

  //   if (!result.cancelled && result.assets && result.assets.length > 0) {
  //     const selectedAsset = result.assets[0];
  //     setProfilePhoto({ uri: selectedAsset.uri });
  //   }
  // };

//   const handleSave = () => {
//     Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
//   };

//   const handleChangePassword = () => {
//     if (newPassword !== reEnterNewPassword) {
//       Alert.alert('Error', 'New passwords do not match.');
//       return;
//     }

//     Alert.alert('Password Changed', 'Your password has been updated successfully.');
//     setCurrentPassword('');
//     setNewPassword('');
//     setReEnterNewPassword('');
//     setModalVisible(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Profile Management</Text>
//       <TouchableOpacity onPress={handleChoosePhoto}>
//         <Image
//           source={profilePhoto ? { uri: profilePhoto.uri } : require('../../assets/img/profile.png')}
//           style={styles.profilePhoto}
//         />
//       </TouchableOpacity>

//       <View style={styles.inputContainer}>
//         <MaterialIcons name="person" size={24} color="gray" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={fullName}
//           onChangeText={setFullName}
//           placeholderTextColor="#999"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <MaterialIcons name="email" size={24} color="gray" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           placeholderTextColor="#999"
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <MaterialIcons name="phone" size={24} color="gray" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           keyboardType="phone-pad"
//           placeholderTextColor="#999"
//         />
//       </View>

//       <TouchableOpacity
//         onPress={() => setModalVisible(true)}
//         style={styles.changePasswordButton}
//       >
//         <MaterialIcons name="lock" size={24} color="white" style={styles.icon} />
//         <Text style={styles.changePasswordButtonText}>Change Your Password</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
//         <Text style={styles.saveButtonText}>Save</Text>
//       </TouchableOpacity>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.modalView}>
//           <Pressable
//             style={{ alignSelf: 'flex-end' }}
//             onPress={() => setModalVisible(!modalVisible)}
//           >
//             <MaterialIcons name="close" size={24} color="gray" />
//           </Pressable>
//           <Text style={styles.modalHeader}>Change Password</Text>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Current Password"
//               value={currentPassword}
//               onChangeText={setCurrentPassword}
//               secureTextEntry={!showCurrentPassword}
//               placeholderTextColor="#999"
//             />
//             <TouchableOpacity
//               onPress={() => setShowCurrentPassword(!showCurrentPassword)}
//               style={styles.eyeIcon}
//             >
//               <MaterialIcons name={showCurrentPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="New Password"
//               value={newPassword}
//               onChangeText={setNewPassword}
//               secureTextEntry={!showNewPassword}
//               placeholderTextColor="#999"
//             />
//             <TouchableOpacity
//               onPress={() => setShowNewPassword(!showNewPassword)}
//               style={styles.eyeIcon}
//             >
//               <MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Re-enter New Password"
//               value={reEnterNewPassword}
//               onChangeText={setReEnterNewPassword}
//               secureTextEntry={!showReEnterNewPassword}
//               placeholderTextColor="#999"
//             />
//             <TouchableOpacity
//               onPress={() => setShowReEnterNewPassword(!showReEnterNewPassword)}
//               style={styles.eyeIcon}
//             >
//               <MaterialIcons name={showReEnterNewPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
//             <Text style={styles.modalButtonText}>Submit</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setModalVisible(!modalVisible)}
//             style={[styles.modalButton, { backgroundColor: '#ff6347' }]}
//           >
//             <Text style={styles.modalButtonText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   profilePhoto: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: 'center',
//     marginBottom: 20,
//     borderWidth: 2,
//     borderColor: '#ccc',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 5,
//   },
//   eyeIcon: {
//     marginLeft: 10,
//   },
//   changePasswordButton: {
//     flexDirection: 'row',
//     backgroundColor: '#aa18ea',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   changePasswordButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   saveButton: {
//     backgroundColor: '#28a745',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   modalView: {
//     flex: 1,
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 35,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 5,
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     backgroundColor: '#007bff',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//     width: '100%',
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default Profile;
// import React, { useState, useEffect, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
//   Platform,
//   Modal,
//   Pressable,
//   ScrollView,
// } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { MaterialIcons } from '@expo/vector-icons';
// import { AuthContext } from '../../helpers/Auth';

// const Profile = ({ profilePhoto, setProfilePhoto, fullName, setFullName }) => {
//   const { userSession } = useContext(AuthContext);
//   const [email, setEmail] = useState(userSession.email);
//   const [phoneNumber, setPhoneNumber] = useState('03195512112');
//   const [password, setPassword] = useState('password');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [reEnterNewPassword, setReEnterNewPassword] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showReEnterNewPassword, setShowReEnterNewPassword] = useState(false);

//   useEffect(() => {
//     (async () => {
//       if (Platform.OS !== 'web') {
//         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (status !== 'granted') {
//           alert('Sorry, we need camera roll permissions to make this work!');
//         }
//       }
//     })();
//   }, []);

//   const handleChoosePhoto = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.cancelled && result.assets && result.assets.length > 0) {
//       const selectedAsset = result.assets[0];
//       setProfilePhoto({ uri: selectedAsset.uri });
//     }
//   };

//   const handleSave = () => {
//     Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
//   };

//   const handleChangePassword = () => {
//     if (newPassword !== reEnterNewPassword) {
//       Alert.alert('Error', 'New passwords do not match.');
//       return;
//     }

//     Alert.alert('Password Changed', 'Your password has been updated successfully.');
//     setCurrentPassword('');
//     setNewPassword('');
//     setReEnterNewPassword('');
//     setModalVisible(false);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.card}>
//         <Text style={styles.header}>Profile Management</Text>
//         <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
//           <Image
//             source={profilePhoto ? { uri: profilePhoto.uri } : require('../../assets/img/profile.png')}
//             style={styles.profilePhoto}
//           />
//           <MaterialIcons name="camera-alt" size={24} color="#000" style={styles.cameraIcon} />
//         </TouchableOpacity>

//         <View style={styles.inputContainer}>
//           <MaterialIcons name="person" size={24} color="#000" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Full Name"
//             value={fullName}
//             onChangeText={setFullName}
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <MaterialIcons name="email" size={24} color="#000" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             placeholderTextColor="#999"
//           />
//         </View>

//         <View style={styles.inputContainer}>
//           <MaterialIcons name="phone" size={24} color="#000" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone Number"
//             value={phoneNumber}
//             onChangeText={setPhoneNumber}
//             keyboardType="phone-pad"
//             placeholderTextColor="#999"
//           />
//         </View>

//         <TouchableOpacity
//           onPress={() => setModalVisible(true)}
//           style={styles.changePasswordButton}
//         >
//           <MaterialIcons name="lock" size={24} color="#fff" style={styles.icon} />
//           <Text style={styles.changePasswordButtonText}>Change Your Password</Text>
//         </TouchableOpacity>

//         <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
//           <Text style={styles.saveButtonText}>Save</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Pressable
//               style={{ alignSelf: 'flex-end' }}
//               onPress={() => setModalVisible(false)}
//             >
//               <MaterialIcons name="close" size={24} color="#000" />
//             </Pressable>
//             <Text style={styles.modalHeader}>Change Password</Text>

//             <View style={styles.inputContainer}>
//               <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Current Password"
//                 value={currentPassword}
//                 onChangeText={setCurrentPassword}
//                 secureTextEntry={!showCurrentPassword}
//                 placeholderTextColor="#999"
//               />
//               <TouchableOpacity
//                 onPress={() => setShowCurrentPassword(!showCurrentPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <MaterialIcons
//                   name={showCurrentPassword ? 'visibility' : 'visibility-off'}
//                   size={24}
//                   color="#000"
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//               <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChangeText={setNewPassword}
//                 secureTextEntry={!showNewPassword}
//                 placeholderTextColor="#999"
//               />
//               <TouchableOpacity
//                 onPress={() => setShowNewPassword(!showNewPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <MaterialIcons
//                   name={showNewPassword ? 'visibility' : 'visibility-off'}
//                   size={24}
//                   color="#000"
//                 />
//               </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//               <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Re-enter New Password"
//                 value={reEnterNewPassword}
//                 onChangeText={setReEnterNewPassword}
//                 secureTextEntry={!showReEnterNewPassword}
//                 placeholderTextColor="#999"
//               />
//               <TouchableOpacity
//                 onPress={() => setShowReEnterNewPassword(!showReEnterNewPassword)}
//                 style={styles.eyeIcon}
//               >
//                 <MaterialIcons
//                   name={showReEnterNewPassword ? 'visibility' : 'visibility-off'}
//                   size={24}
//                   color="#000"
//                 />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
//               <Text style={styles.modalButtonText}>Submit</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               style={[styles.modalButton, { backgroundColor: '#f44336' }]}
//             >
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#f9f9f9',
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 4,
//   },
//   header: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   photoContainer: {
//     position: 'relative',
//     alignSelf: 'center',
//   },
//   profilePhoto: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: '#aa18ea',
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     padding: 5,
//     borderRadius: 15,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#000',
//     borderRadius: 8,
//     marginBottom: 15,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   icon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//   },
//   changePasswordButton: {
//     flexDirection: 'row',
//     backgroundColor: '#aa18ea',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   changePasswordButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   saveButton: {
//     backgroundColor: '#4caf50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 4 },
//     elevation: 5,
//   },
//   modalHeader: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   modalButton: {
//     backgroundColor: '#4caf50',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default Profile;


//   import React, { useState, useEffect, useContext } from 'react';
//   import {
//     View,
//     Text,
//     TextInput,
//     StyleSheet,
//     Image,
//     TouchableOpacity,
//     Alert,
//     Platform,
//     Modal,
//     Pressable,
//     ScrollView,
//   } from 'react-native';
//   import * as ImagePicker from 'expo-image-picker';
//   import { MaterialIcons } from '@expo/vector-icons';
//   import axios from 'axios';
//   import { AuthContext } from '../../helpers/Auth';
//   import { BASE_URL } from '../../config';
// import { ColorSpace } from 'react-native-reanimated';

//   const Profile = () => {
//     const { userSession } = useContext(AuthContext);
//     // const [profilePhoto, setProfilePhoto] = useState(
//     //   userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : null
//     // );
//     const [profilePhoto, setProfilePhoto] = useState(
//       userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : require('../../assets/img/profile.png')
//     );
//     const [fullName, setFullName] = useState(userSession.name || '');
//     const [email, setEmail] = useState(userSession.email || '');
//     const [phone, setPhoneNumber] = useState(userSession.phone || '');
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [role, setRole] = useState(userSession.role || '');
//     const [serviceCategory, setServiceCategory] = useState(userSession.serviceCategory || '');
//     const [newPassword, setNewPassword] = useState('');
//     const [reEnterNewPassword, setReEnterNewPassword] = useState('');
//     const [cnic, setCnic] = useState(userSession.cnic || ''); 
//     const [modalVisible, setModalVisible] = useState(false);
//     const [loading, setLoading] = useState(false);
//     // console.log(userSession);

//     useEffect(() => {
//       // Request permission for the image picker
//       (async () => {
//         if (Platform.OS !== 'web') {
//           const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//           if (status !== 'granted') {
//             alert('Sorry, we need camera roll permissions to make this work!');
//           }
//         }
//       })();

//     }, [userSession.token]);
//     const handleChoosePhoto = async () => {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.cancelled && result.assets && result.assets.length > 0) {
//         const selectedAsset = result.assets[0];
//         setProfilePhoto({ uri: selectedAsset.uri });
//       }
//     };

//     const handleSave = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('name', fullName);
//         formData.append('email', email);
//         formData.append('phone', phone);
//         formData.append('role', role);
//         if (role !== 'normal') {
//               formData.append('cnic', cnic); 
//             }
//         if (role === 'serviceProvider') {
//               formData.append('serviceCategory', serviceCategory); 
//             }
//         if (profilePhoto && profilePhoto.uri) {
//           const fileName = profilePhoto.uri.split('/').pop();
//           const fileType = fileName.split('.').pop();

//           formData.append('profilePicture', {
//             uri: profilePhoto.uri,
//             name: fileName,
//             type: `image/${fileType}`,
//           });
//         }

//         setLoading(true);
//         console.log(profilePhoto);
//         // console.log("idddddd",userSession._id);
//         const response = await axios.put(
//           `${BASE_URL}/api/users/update-profile/${userSession._id}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${userSession.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
//       } catch (error) {
//         console.error('Error updating profile:', error);
//         Alert.alert('Error', 'Failed to update profile.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const handleChangePassword = async () => {
//       if (newPassword !== reEnterNewPassword) {
//         Alert.alert('Error', 'New passwords do not match.');
//         return;
//       }

//       try {
//         setLoading(true);
//         await axios.put(
//           `${BASE_URL}/api/users/change-password`,
//           { currentPassword, newPassword },
//           {
//             headers: {
//               Authorization: `Bearer ${userSession.token}`,
//             },
//           }
//         );

//         Alert.alert('Password Changed', 'Your password has been updated successfully.');
//         setCurrentPassword('');
//         setNewPassword('');
//         setReEnterNewPassword('');
//         setModalVisible(false);
//       } catch (error) {
//         console.error('Error changing password:', error);
//         Alert.alert('Error', 'Failed to change password.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     return (
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.card}>
//           <Text style={styles.header}>Profile Management</Text>
//           <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
//             <Image
//               source={profilePhoto ? { uri: profilePhoto.uri } : require('../../assets/img/profile.png')}
//               style={styles.profilePhoto}
//             />
//             <MaterialIcons name="camera-alt" size={24} color="#000" style={styles.cameraIcon} />
//           </TouchableOpacity>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="person" size={24} color="#000" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               value={fullName}
//               onChangeText={setFullName}
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="email" size={24} color="#000" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               placeholderTextColor="#999"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <MaterialIcons name="phone" size={24} color="#000" style={styles.icon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               value={phone}
//               onChangeText={setPhoneNumber}
//               keyboardType="phone-pad"
//               placeholderTextColor="#999"
//             />
//           </View>
//                 {/* {/* Conditionally render CNIC input field */}
//           {(role === 'serviceProvider' || role === 'volunteer') && (
//             <View style={styles.inputContainer}>
//               <MaterialIcons name="credit-card" size={24} color="#000" style={styles.icon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="CNIC (e.g., 12345-6789012-3)"
//                 value={cnic}
//                 onChangeText={setCnic}
//                 keyboardType="numeric"
//                 placeholderTextColor="#999"
//               />
//             </View>
//           )}

//           <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.changePasswordButton}>
//             <MaterialIcons name="lock" size={24} color="#fff" style={styles.icon} />
//             <Text style={styles.changePasswordButtonText}>Change Your Password</Text>
//           </TouchableOpacity>

//           <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
//             <Text style={styles.saveButtonText}>Save</Text>
//           </TouchableOpacity>
//         </View>

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Pressable style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
//                 <MaterialIcons name="close" size={24} color="#000" />
//               </Pressable>
//               <Text style={styles.modalHeader}>Change Password</Text>

//               <View style={styles.inputContainer}>
//                 <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Current Password"
//                   value={currentPassword}
//                   onChangeText={setCurrentPassword}
//                   secureTextEntry={true}
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="New Password"
//                   value={newPassword}
//                   onChangeText={setNewPassword}
//                   secureTextEntry={true}
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Re-enter New Password"
//                   value={reEnterNewPassword}
//                   onChangeText={setReEnterNewPassword}
//                   secureTextEntry={true}
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
//                 <Text style={styles.modalButtonText}>Submit</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </ScrollView>
//     );
//   };

//   const styles = StyleSheet.create({
//     container: {
//       flexGrow: 1,
//       padding: 20,
//       backgroundColor: '#f9f9f9',
//     },
//     card: {
//       backgroundColor: '#fff',
//       borderRadius: 12,
//       padding: 20,
//       shadowColor: '#000',
//       shadowOpacity: 0.1,
//       shadowRadius: 6,
//       shadowOffset: { width: 0, height: 4 },
//       elevation: 4,
//     },
//     header: {
//       fontSize: 22,
//       fontWeight: 'bold',
//       color: '#333',
//       textAlign: 'center',
//       marginBottom: 20,
//     },
//     photoContainer: {
//       position: 'relative',
//       alignSelf: 'center',
//     },
//     profilePhoto: {
//       width: 120,
//       height: 120,
//       borderRadius: 60,
//       borderWidth: 3,
//       borderColor: '#aa18ea',
//     },
//     cameraIcon: {
//       position: 'absolute',
//       bottom: 0,
//       right: 0,
//       backgroundColor: '#fff',
//       padding: 5,
//       borderRadius: 15,
//     },
//     inputContainer: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       borderWidth: 1,
//       borderColor: '#000',
//       borderRadius: 8,
//       marginBottom: 15,
//       padding: 10,
//       backgroundColor: '#fff',
//     },
//     icon: {
//       marginRight: 10,
//     },
//     input: {
//       flex: 1,
//     },
//     changePasswordButton: {
//       flexDirection: 'row',
//       backgroundColor: '#aa18ea',
//       padding: 15,
//       borderRadius: 8,
//       alignItems: 'center',
//       marginVertical: 10,
//     },
//     changePasswordButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//       fontSize: 16,
//       marginLeft: 10,
//     },
//     saveButton: {
//       backgroundColor: '#4caf50',
//       padding: 15,
//       borderRadius: 8,
//       alignItems: 'center',
//       marginTop: 20,
//     },
//     saveButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//       fontSize: 16,
//     },
//     modalContainer: {
//       flex: 1,
//       backgroundColor: 'rgba(0, 0, 0, 0.5)',
//       justifyContent: 'center',
//       paddingHorizontal: 20,  
//     },
//     modalContent: {
//       backgroundColor: '#fff',
//       borderRadius: 12,
//       padding: 20,
//       shadowColor: '#000',
//       shadowOpacity: 0.2,
//       shadowRadius: 6,
//       shadowOffset: { width: 0, height: 4 },
//       elevation: 5,
//     },
//     modalHeader: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 20,
//       textAlign: 'center',
//     },
//     modalButton: {
//       backgroundColor: '#4caf50',
//       padding: 15,
//       borderRadius: 8,
//       alignItems: 'center',
//       marginTop: 10,
//     },
//     modalButtonText: {
//       color: '#fff',
//       fontWeight: 'bold',
//       fontSize: 16,
//     },
//   });

//   export default Profile;

  
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import { AuthContext } from '../../helpers/Auth';
import { BASE_URL } from '../../config';

const isValidCNIC = (cnic) => {
  const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
  return cnicPattern.test(cnic);
};

const isValidName = (name) => {
  const namePattern = /^[a-zA-Z\s]+$/;
  return namePattern.test(name) && name.length <= 50;
};

const Profile = () => {
  const { userSession } = useContext(AuthContext);
  const [profilePhoto, setProfilePhoto] = useState(
    userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : require('../../assets/img/profile.png')
  );
  const [fullName, setFullName] = useState(userSession.name || '');
  const [email, setEmail] = useState(userSession.email || '');
  const [phone, setPhoneNumber] = useState(userSession.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [role, setRole] = useState(userSession.role || '');
  const [serviceCategory, setServiceCategory] = useState(userSession.serviceCategory || '');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterNewPassword, setReEnterNewPassword] = useState('');
  const [cnic, setCnic] = useState(userSession.cnic || '');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, [userSession.token]);

  const handleCnicChange = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, '');

    // Format the cleaned input according to XXXXX-XXXXXXX-X
    let formatted = cleaned;
    if (cleaned.length > 5) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    if (cleaned.length > 12) {
      formatted = `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(12, 13)}`;
    }

    setCnic(formatted);
  };
  const handleChoosePhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setProfilePhoto({ uri: selectedAsset.uri });
    }
  };

  const handleSave = async () => {
    if (!isValidName(fullName)) {
      Alert.alert('Invalid Name', 'Name should not contain numbers, special characters, or exceed 50 characters.');
      return;
    }

    if (!/^\d{11}$/.test(phone)) {
      Alert.alert('Invalid Phone', 'Phone number should be exactly 11 digits.');
      return;
    }

    if (role !== 'normal' && !isValidCNIC(cnic)) {
      Alert.alert('Invalid CNIC', 'CNIC should follow the format 12345-6789012-3.');
      return;
    }

    Alert.alert(
      'Confirm Save',
      'Are you sure you want to save these changes?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Save',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('name', fullName);
              formData.append('email', email);
              formData.append('phone', phone);
              formData.append('role', role);

              if (role !== 'normal') {
                formData.append('cnic', cnic);
              }

              if (role === 'serviceProvider') {
                formData.append('serviceCategory', serviceCategory);
              }

              if (profilePhoto && profilePhoto.uri) {
                const fileName = profilePhoto.uri.split('/').pop();
                const fileType = fileName.split('.').pop();

                formData.append('profilePicture', {
                  uri: profilePhoto.uri,
                  name: fileName,
                  type: `image/${fileType}`,
                });
              }

              setLoading(true);
              await axios.put(`${BASE_URL}/api/users/update-profile/${userSession._id}`, formData, {
                headers: {
                  Authorization: `Bearer ${userSession.token}`,
                  'Content-Type': 'multipart/form-data',
                },
              });

              Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
            } catch (error) {
              console.error('Error updating profile:', error);
              Alert.alert('Error', 'Failed to update profile.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  // const handleChoosePhoto = async () => {
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   if (!result.cancelled && result.assets && result.assets.length > 0) {
  //     const selectedAsset = result.assets[0];
  //     setProfilePhoto({ uri: selectedAsset.uri });
  //   }
  // };

  // const handleSave = async () => {
  //   if (!isValidName(fullName)) {
  //     Alert.alert('Invalid Name', 'Name should not contain numbers, special characters, or exceed 50 characters.');
  //     return;
  //   }

  //   if (!/^\d{11}$/.test(phone)) {
  //     Alert.alert('Invalid Phone', 'Phone number should be exactly 11 digits.');
  //     return;
  //   }

  //   if (role !== 'normal' && !isValidCNIC(cnic)) {
  //     Alert.alert('Invalid CNIC', 'CNIC should follow the format 12345-6789012-3.');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('name', fullName);
  //     formData.append('email', email);
  //     formData.append('phone', phone);
  //     formData.append('role', role);

  //     if (role !== 'normal') {
  //       formData.append('cnic', cnic);
  //     }

  //     if (role === 'serviceProvider') {
  //       formData.append('serviceCategory', serviceCategory);
  //     }

  //     if (profilePhoto && profilePhoto.uri) {
  //       const fileName = profilePhoto.uri.split('/').pop();
  //       const fileType = fileName.split('.').pop();

  //       formData.append('profilePicture', {
  //         uri: profilePhoto.uri,
  //         name: fileName,
  //         type: `image/${fileType}`,
  //       });
  //     }

  //     setLoading(true);
  //     await axios.put(`${BASE_URL}/api/users/update-profile/${userSession._id}`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${userSession.token}`,
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });

  //     Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
  //   } catch (error) {
  //     console.error('Error updating profile:', error);
  //     Alert.alert('Error', 'Failed to update profile.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleChangePassword = async () => {
  //   if (newPassword.length <= 6) {
  //     Alert.alert('Invalid Password', 'Password length should be greater than 6 characters.');
  //     return;
  //   }

  //   if (newPassword !== reEnterNewPassword) {
  //     Alert.alert('Error', 'New passwords do not match.');
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     await axios.put(
  //       `${BASE_URL}/api/users/${userSession._id}/update-password`,
  //       { oldPassword: currentPassword, newPassword },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${userSession.token}`,
  //         },
  //       }
  //     );

  //     Alert.alert('Password Changed', 'Your password has been updated successfully.');
  //     setCurrentPassword('');
  //     setNewPassword('');
  //     setReEnterNewPassword('');
  //     setModalVisible(false);
  //   } catch (error) {
  //     console.error('Error changing password:', error);
  //     Alert.alert('Error', 'Failed to change password.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleChangePassword = () => {
    if (newPassword.length <= 6) {
      Alert.alert('Invalid Password', 'Password length should be greater than 6 characters.');
      return;
    }

    if (newPassword !== reEnterNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    Alert.alert(
      'Confirm Password Change',
      'Are you sure you want to update your password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async () => {
            try {
              setLoading(true);
              await axios.put(
                `${BASE_URL}/api/users/${userSession._id}/update-password`,
                { oldPassword: currentPassword, newPassword },
                {
                  headers: {
                    Authorization: `Bearer ${userSession.token}`,
                  },
                }
              );

              Alert.alert('Password Changed', 'Your password has been updated successfully.');
              setCurrentPassword('');
              setNewPassword('');
              setReEnterNewPassword('');
              setModalVisible(false);
            } catch (error) {
              console.error('Error changing password:', error);
              Alert.alert('Error', 'Failed to change password.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>Profile Management</Text>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.photoContainer}>
          <Image
            source={profilePhoto ? { uri: profilePhoto.uri } : require('../../assets/img/profile.png')}
            style={styles.profilePhoto}
          />
          <MaterialIcons name="camera-alt" size={24} color="#000" style={styles.cameraIcon} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="email" size={24} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="phone" size={24} color="#000" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            maxLength={11}
          />
        </View>

        {role !== 'normal' && (
          <View style={styles.inputContainer}>
            <MaterialIcons name="credit-card" size={24} color="#000" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="CNIC (e.g., 12345-6789012-3)"
              value={cnic}
              onChangeText={handleCnicChange}
              keyboardType="numeric"
              placeholderTextColor="#999"
              maxLength={15} 
            />
          </View>
        )}

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.changePasswordButton}>
          <MaterialIcons name="lock" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.changePasswordButtonText}>Change Your Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable style={{ alignSelf: 'flex-end' }} onPress={() => setModalVisible(false)}>
              <MaterialIcons name="close" size={24} color="#000" />
            </Pressable>
            <Text style={styles.modalHeader}>Change Password</Text>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={true}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Re-enter New Password"
                value={reEnterNewPassword}
                onChangeText={setReEnterNewPassword}
                secureTextEntry={true}
                placeholderTextColor="#999"
              />
            </View>

            <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    alignSelf: 'center',
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#aa18ea',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  changePasswordButton: {
    flexDirection: 'row',
    backgroundColor: '#aa18ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
