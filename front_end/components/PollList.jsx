import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons'; // Import an icon library (e.g., Expo Vector Icons)

const PollList = ({ navigation }) => {
    const [polls, setPolls] = useState([]);
    const [search, setSearch] = useState('');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [suggestionModalVisible, setSuggestionModalVisible] = useState(false);
    const [suggestion, setSuggestion] = useState('');
    const [activeButton, setActiveButton] = useState(null);
    const [filter, setFilter] = useState('all'); // Filter state for filtering polls

    // Function to fetch polls
    const fetchPolls = async () => {
        try {
            // Retrieve token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${BASE_URL}/api/polls`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Merge active and ended polls into a single array
            const { active, ended } = response.data.polls;
            setPolls([...active, ...ended]);
        } catch (error) {
            console.log('Error fetching polls:', error);
            Alert.alert('Error', 'Unable to fetch polls');
        }
    };

    // Fetch polls when component mounts and set up polling
    useEffect(() => {
        // Initial fetch
        fetchPolls();

        // Set interval to fetch new data every 10 seconds
        const intervalId = setInterval(fetchPolls, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Filter polls based on filter state and search input
    const filteredPolls = polls
        .filter((poll) => {
            const pollNameMatches = poll.name.toLowerCase().includes(search.toLowerCase());
            const isNotEnded = new Date(poll.endDate) > new Date();
            const isVotingEnabled = !poll.disableVotes;

            // Handle filters: all, active, and ended
            if (filter === 'all') return pollNameMatches;
            if (filter === 'ended') return pollNameMatches && (!isNotEnded || poll.disableVotes);
            if (filter === 'active') return pollNameMatches && isNotEnded && isVotingEnabled;

            return pollNameMatches;
        });

    const handleSuggestionSubmit = () => {
        const trimmedSuggestion = suggestion.trim();
        const regex = /^[a-zA-Z\s]+$/;

        if (!trimmedSuggestion) {
            Alert.alert('Invalid Input', 'Suggestion cannot be empty or just spaces.');
        } else if (!regex.test(trimmedSuggestion)) {
            Alert.alert('Invalid Input', 'Suggestion should contain only letters and spaces.');
        } else {
            setSuggestion('');
            setSuggestionModalVisible(false);
            Alert.alert('Success', 'Your suggestion has been submitted.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Filter Icon */}
            <TouchableOpacity 
                style={styles.filterIcon}
                onPress={() => setFilterModalVisible(true)}
            >
                <Ionicons name="filter-outline" size={24} color="#000" />
            </TouchableOpacity>

            <TextInput
                placeholder="Search Polls"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
            />

            <FlatList
                data={filteredPolls || []}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={[
                            styles.pollItem, 
                            activeButton === item._id && styles.pollItemActive
                        ]}
                        onPress={() => navigation.navigate('PollDetail', { pollId: item._id })}
                        activeOpacity={1}
                        onPressIn={() => setActiveButton(item._id)}
                        onPressOut={() => setActiveButton(null)}
                    >
                        <Text style={styles.pollText}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Modal for Filter Options */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalHeader}>Filter Polls</Text>
                        <TouchableOpacity
                            style={[styles.modalButton, filter === 'all' && styles.modalButtonActive]}
                            onPress={() => { setFilter('all'); setFilterModalVisible(false); }}
                        >
                            <Text style={styles.modalButtonText}>All Polls</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, filter === 'active' && styles.modalButtonActive]}
                            onPress={() => { setFilter('active'); setFilterModalVisible(false); }}
                        >
                            <Text style={styles.modalButtonText}>Active Polls</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, filter === 'ended' && styles.modalButtonActive]}
                            onPress={() => { setFilter('ended'); setFilterModalVisible(false); }}
                        >
                            <Text style={styles.modalButtonText}>Ended Polls</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setFilterModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal for suggesting poll topics */}
            <TouchableOpacity 
                style={styles.linkContainer}
                onPress={() => setSuggestionModalVisible(true)}
                activeOpacity={1}
                onPressIn={() => setActiveButton('suggestLink')}
                onPressOut={() => setActiveButton(null)}
            >
                <Text style={[styles.suggestLink, activeButton === 'suggestLink' && styles.suggestLinkActive]}>
                    Suggest a Poll Topic
                </Text>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={suggestionModalVisible}
                onRequestClose={() => setSuggestionModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Enter poll suggestion"
                            value={suggestion}
                            onChangeText={setSuggestion}
                            style={styles.suggestionInput}
                        />
                        <TouchableOpacity 
                            style={[
                                styles.modalButton, 
                                styles.submitButton, 
                                activeButton === 'submitButton' && styles.modalButtonActive
                            ]}
                            onPress={handleSuggestionSubmit} 
                            activeOpacity={1}
                            onPressIn={() => setActiveButton('submitButton')}
                            onPressOut={() => setActiveButton(null)}
                        >
                            <Text style={styles.modalButtonText}>Submit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[
                                styles.modalButton, 
                                styles.cancelButton, 
                                activeButton === 'cancelButton' && styles.modalButtonActive
                            ]}
                            onPress={() => setSuggestionModalVisible(false)} 
                            activeOpacity={1}
                            onPressIn={() => setActiveButton('cancelButton')}
                            onPressOut={() => setActiveButton(null)}
                        >
                            <Text style={styles.modalButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
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
    searchInput: {
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    filterIcon: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    pollItem: {
        padding: 15,
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    pollItemActive: {
        backgroundColor: '#aa18ea',
    },
    pollText: {
        fontSize: 16,
    },
    linkContainer: {
        alignItems: 'center',
        marginTop: 10,
    },
    suggestLink: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginBottom: 10,
    },
    suggestLinkActive: {
        color: '#8b14c6',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalButton: {
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderColor: 'gray',
        borderWidth: 1,
    },
    modalButtonActive: {
        color: 'red',

        backgroundColor: '#aa18ea',

    },
    cancelButton: {
        backgroundColor: '#aa18ea',
    },
    modalButtonText: {
        color: '#000',
        fontSize: 16,
    },
    suggestionInput: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#aa18ea',
    },
});

export default PollList;
