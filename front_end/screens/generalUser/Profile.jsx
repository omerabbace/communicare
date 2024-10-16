import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '../../helpers/Auth';
import { useContext } from 'react';

const Profile = ({ profilePhoto, setProfilePhoto, fullName, setFullName }) => {
  const {userSession} = useContext(AuthContext);
  const [email, setEmail] = useState(userSession.email);
  const [phoneNumber, setPhoneNumber] = useState('03195512112');
  const [password, setPassword] = useState('password');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reEnterNewPassword, setReEnterNewPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReEnterNewPassword, setShowReEnterNewPassword] = useState(false);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

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

  const handleSave = () => {
    Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
  };

  const handleChangePassword = () => {
    if (newPassword !== reEnterNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    Alert.alert('Password Changed', 'Your password has been updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setReEnterNewPassword('');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile Management</Text>
      <TouchableOpacity onPress={handleChoosePhoto}>
        <Image
          source={profilePhoto ? { uri: profilePhoto.uri } : require('../../assets/img/profile.png')}
          style={styles.profilePhoto}
        />
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="gray" style={styles.icon} />
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
        <MaterialIcons name="phone" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.changePasswordButton}
      >
        <MaterialIcons name="lock" size={24} color="white" style={styles.icon} />
        <Text style={styles.changePasswordButtonText}>Change Your Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Pressable
            style={{ alignSelf: 'flex-end' }}
            onPress={() => setModalVisible(!modalVisible)}
          >
            <MaterialIcons name="close" size={24} color="gray" />
          </Pressable>
          <Text style={styles.modalHeader}>Change Password</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons name={showCurrentPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons name={showNewPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="gray" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Re-enter New Password"
              value={reEnterNewPassword}
              onChangeText={setReEnterNewPassword}
              secureTextEntry={!showReEnterNewPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowReEnterNewPassword(!showReEnterNewPassword)}
              style={styles.eyeIcon}
            >
              <MaterialIcons name={showReEnterNewPassword ? "visibility" : "visibility-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleChangePassword} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(!modalVisible)}
            style={[styles.modalButton, { backgroundColor: '#ff6347' }]}
          >
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 5,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  changePasswordButton: {
    flexDirection: 'row',
    backgroundColor: '#aa18ea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  changePasswordButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
