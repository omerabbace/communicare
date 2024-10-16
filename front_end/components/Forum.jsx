import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getDatabase, ref, onValue, off } from 'firebase/database'; // Firebase Realtime Database imports

const Forum = () => {
  const [categories, setCategories] = useState([]);
  const [activeItem, setActiveItem] = useState('');
  const [loading, setLoading] = useState(true); // Loading state
  const navigation = useNavigation();

  useEffect(() => {
    console.log('Starting Firebase data fetch...');
    const db = getDatabase();
    const categoriesRef = ref(db, 'issueCategories');
  
    // Fetch categories from Firebase
    const fetchData = onValue(
      categoriesRef, 
      (snapshot) => {
        console.log('Data snapshot received');
        const data = snapshot.val();
        console.log('Fetched data:', data);
        
        const categoriesList = data 
          ? Object.keys(data).map((key) => ({
              id: key,
              label: data[key].label,
              value: data[key].value,
            })) 
          : [];
        
        setCategories(categoriesList);
        setLoading(false); // Set loading to false after data is fetched
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  

    return () => {
      // Unsubscribe when the component unmounts
      off(categoriesRef, fetchData);
    };
  }, []);

  const handleNavigate = (category) => {
    setActiveItem('');
    navigation.navigate('ForumDiscussion', { category: category.value, categoryName: category.label });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.item, 
        activeItem === item.value && styles.activeItem
      ]}
      onPressIn={() => setActiveItem(item.value)}
      onPressOut={() => setActiveItem('')}
      onPress={() => handleNavigate(item)}
    >
      <Text style={styles.itemText}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#aa18ea" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Forum Category:</Text>
      <FlatList 
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={activeItem}
        initialNumToRender={5} // Render the first 5 items initially
        maxToRenderPerBatch={10} // Load more items in batches
        windowSize={10} // How many items to keep in memory at once
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  item: {
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  activeItem: {
    backgroundColor: '#aa18ea',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Forum;
