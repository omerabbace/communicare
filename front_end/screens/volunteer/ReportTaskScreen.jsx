import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../config';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons } from '@expo/vector-icons';

const ReportTaskScreen = ({ route, navigation }) => {
  const { issueId } = route.params;
  const [description, setDescription] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [status, setStatus] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Handle media selection and add selected files to state
  const handleAddMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      setMediaFiles((prev) => [...prev, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  // Remove media file from selection
  const handleRemoveMedia = (uri) => {
    setMediaFiles((prev) => prev.filter((file) => file !== uri));
  };

  // Convert report data and media files to FormData and submit to backend
  const handleSubmitReport = async () => {
    if (!status) {
      return Alert.alert('Please select a status before submitting.');
    }

    const token = await AsyncStorage.getItem('token');
    const url = status === 'complete'
      ? `${BASE_URL}/api/issueReporting/complete-task`
      : `${BASE_URL}/api/issueReporting/progress`;

    // Create FormData and append fields
    const formData = new FormData();
    formData.append('issueId', issueId);
    formData.append('description', description);
    mediaFiles.forEach((fileUri, index) => {
      const fileType = fileUri.substring(fileUri.lastIndexOf('.') + 1);
      formData.append('media', {
        uri: fileUri,
        name: `media_${index}.${fileType}`,
        type: `image/${fileType}`, // Assuming images; adjust if other types are allowed
      });
    });

    try {
      await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Report submitted successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Failed to submit report');
    }
  };

  return (
    <View style={styles.container}>
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
      
      <FlatList
        data={mediaFiles}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.mediaPreviewContainer}>
            <Image source={{ uri: item }} style={styles.mediaPreview} />
            <TouchableOpacity onPress={() => handleRemoveMedia(item)} style={styles.removeMediaButton}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Submit Report" onPress={handleSubmitReport} color="#2196F3" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 120,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  dropdownContainer: {
    marginBottom: 20,
    width: '100%',
  },
  dropdown: {
    borderColor: '#ccc',
  },
  mediaButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  mediaButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

export default ReportTaskScreen;
