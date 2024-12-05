// import React from 'react';
// import { View, Text, Modal, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
// import { BASE_URL } from '../../config';

// const FullReportModal = ({ visible, onClose, adminReport }) => {
//   if (!adminReport) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Text style={styles.title}>Admin Report</Text>
//           <Text style={styles.description}>Description: {adminReport.description} </Text>

//           <Text style={styles.date}>Date: {new Date(adminReport.date).toLocaleDateString()}</Text>

//           <Text style={styles.mediaHeader}>Media Files:</Text>
//           <FlatList
//             data={adminReport.media}
//             keyExtractor={(item, index) => index.toString()}
//             horizontal
//             renderItem={({ item }) => {
//                 // Replace any backslashes with forward slashes
//                 const imageUri = `${BASE_URL}/${item.uri.replace(/\\/g, '/')}`;
//                 console.log('Image URI:', imageUri); // Log the corrected image URI

//                 return (
//                 <View style={styles.mediaContainer}>
//                     {item.type === 'image' ? (
//                     <Image source={{ uri: imageUri }} style={styles.media} />
//                     ) : (
//                     <Text style={styles.videoText}>Video file - tap to view</Text> // Placeholder for videos
//                     )}
//                 </View>
//                 );
//             }}
//             ListEmptyComponent={<Text style={styles.noMediaText}>No media files available</Text>}
//             />


//           <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//             <Text style={styles.closeButtonText}>Close</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   date: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   description: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 20,
//     lineHeight: 22,
//   },
//   mediaHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   mediaContainer: {
//     marginRight: 10,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#ddd',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 100,
//     height: 100,
//   },
//   media: {
//     width: '100%',
//     height: '100%',
//   },
//   videoText: {
//     fontSize: 12,
//     color: '#666',
//     textAlign: 'center',
//     padding: 10,
//   },
//   noMediaText: {
//     fontSize: 14,
//     color: '#666',
//     textAlign: 'center',
//     paddingVertical: 10,
//   },
//   closeButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#aa18ea',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default FullReportModal;

import React from 'react';
import { View, Text, Modal, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { BASE_URL } from '../../config';

const FullReportModal = ({ visible, onClose, adminReport }) => {
  if (!adminReport) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Admin Report</Text>
          <Text style={styles.description}>Description: {adminReport.description}</Text>
          <Text style={styles.date}>Date: {new Date(adminReport.date).toLocaleDateString()}</Text>

          <Text style={styles.mediaHeader}>Media Files:</Text>
          <FlatList
            data={adminReport.media}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            renderItem={({ item }) => {
              // Replace any backslashes with forward slashes
              const imageUri = `${BASE_URL}/${item.uri.replace(/\\/g, '/')}`;
              return (
                <View style={styles.mediaContainer}>
                  {item.type === 'image' ? (
                    <Image source={{ uri: imageUri }} style={styles.media} />
                  ) : (
                    <Text style={styles.videoText}>Video file - tap to view</Text> // Placeholder for videos
                  )}
                </View>
              );
            }}
            ListEmptyComponent={<Text style={styles.noMediaText}>No media files available</Text>}
          />

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    // textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#444',
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'justify',
  },
  mediaHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  mediaContainer: {
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  videoText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    padding: 10,
  },
  noMediaText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#aa18ea',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FullReportModal;
