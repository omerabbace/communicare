// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { PieChart } from 'react-native-chart-kit';
// import { BASE_URL } from '../config';

// const PollDetail = ({ route }) => {
//     const { pollId } = route.params;
//     const [poll, setPoll] = useState(null);
//     const [selectedOption, setSelectedOption] = useState(null);
//     const [voted, setVoted] = useState(false);
//     const [userId, setUserId] = useState(null);

//     useEffect(() => {
//         // Function to fetch poll details from backend
//         const fetchPollDetails = async () => {
//             try {
//                 // Retrieve token and userId from AsyncStorage
//                 const token = await AsyncStorage.getItem('token');
//                 const user = await AsyncStorage.getItem('userSession');
                
//                 if (!token || !user) {
//                     Alert.alert('Error', 'No token found, please login.');
//                     return;
//                 }

//                 const { _id } = JSON.parse(user); 
//                 setUserId(_id);

//                 // Retrieve saved vote status
//                 const savedVoteState = await AsyncStorage.getItem(`voteState-${pollId}-${_id}`);
//                 if (savedVoteState) {
//                     const { selectedOption, voted } = JSON.parse(savedVoteState);
//                     setSelectedOption(selectedOption);
//                     setVoted(voted);
//                 }

//                 // Make API call to fetch poll details
//                 const response = await axios.get(`${BASE_URL}/api/polls/${pollId}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 setPoll(response.data.poll); // Assuming response contains poll details in `data.poll`
//             } catch (error) {
//                 console.error('Error fetching poll details:', error);
//                 Alert.alert('Error', 'Unable to fetch poll details');
//             }
//         };

//         // Initial fetch
//         fetchPollDetails();

//         // Set up interval to refresh poll results every 10 seconds
//         const intervalId = setInterval(fetchPollDetails, 10000);

//         // Cleanup interval on component unmount
//         return () => clearInterval(intervalId);
//     }, [pollId]);

//     // Function to handle voting
//     const handleVote = (optionIndex) => {
//         if (!voted && poll && !poll.disableVotes && new Date(poll.endDate) > new Date()) {
//             setSelectedOption(optionIndex);
//         }
//     };

//     // Function to submit the vote
//     const submitVote = async () => {
//         if (typeof selectedOption === 'number' && userId) {
//             try {
//                 const token = await AsyncStorage.getItem('token');
//                 if (!token) {
//                     Alert.alert('Error', 'No token found, please login.');
//                     return;
//                 }
                
//                 // Make API call to cast the vote
//                 await axios.post(`${BASE_URL}/api/votes/cast`, 
//                 { 
//                     pollId: pollId,
//                     option: poll.options[selectedOption].optionText, // Send selected option text
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
                
//                 // Save the state locally for this user and poll
//                 await AsyncStorage.setItem(`voteState-${pollId}-${userId}`, JSON.stringify({ selectedOption, voted: true }));
//                 setVoted(true);
//                 Alert.alert('Success', 'Your vote has been submitted');
//             } catch (error) {
//                 console.error('Error submitting vote:', error);
//                 Alert.alert('Error', 'Unable to submit vote');
//             }
//         } else {
//             Alert.alert('Please select an option before voting.');
//         }
//     };

//     // Function to undo the vote
//     const undoVote = async () => {
//         if (voted && userId) {
//             try {
//                 const token = await AsyncStorage.getItem('token');
//                 if (!token) {
//                     Alert.alert('Error', 'No token found, please login.');
//                     return;
//                 }

//                 // Make API call to undo the vote
//                 await axios.patch(`${BASE_URL}/api/votes/update`, 
//                 { 
//                     pollId: pollId,
//                     newOption: null, // Send selected option text
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 // Remove the vote state locally
//                 await AsyncStorage.removeItem(`voteState-${pollId}-${userId}`);
//                 setVoted(false);
//                 setSelectedOption(null);
//                 Alert.alert('Success', 'Your vote has been undone');
//             } catch (error) {
//                 console.error('Error undoing vote:', error);
//                 Alert.alert('Error', 'Unable to undo vote');
//             }
//         }
//     };

//     // Render poll results as a pie chart
//     const renderChart = () => {
//         const data = poll.options.map((option, index) => ({
//             name: option.optionText,
//             population: option.votes,
//             color: index % 2 === 0 ? 'blue' : 'green',
//             legendFontColor: "#7F7F7F",
//             legendFontSize: 15,
//         }));

//         return (
//             <PieChart
//                 data={data}
//                 width={Dimensions.get('window').width - 50}
//                 height={220}
//                 chartConfig={{
//                     backgroundColor: '#ffffff',
//                     backgroundGradientFrom: '#ffffff',
//                     backgroundGradientTo: '#ffffff',
//                     decimalPlaces: 2,
//                     color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//                     style: {
//                         borderRadius: 16,
//                     },
//                 }}
//                 accessor="population"
//                 backgroundColor="transparent"
//                 paddingLeft="15"
//                 absolute
//             />
//         );
//     };

//     if (!poll) {
//         return <Text style={styles.notFoundText}>Poll not found</Text>;
//     }

//     // Check if the poll is active and not disabled
//     const isPollActive = !poll.disableVotes && new Date(poll.endDate) > new Date();

//     return (
//         <View style={styles.container}>
//             <Text style={styles.question}>{poll.name || 'Poll Title'}</Text>

//             {poll.options.map((option, index) => (
//                 <TouchableOpacity
//                     key={index}
//                     onPress={() => handleVote(index)}
//                     style={[
//                         styles.option,
//                         {
//                             backgroundColor: selectedOption === index ? '#aa18ea' : 'white',
//                             opacity: voted || !isPollActive ? 0.6 : 1, // Disable if voted or poll is not active
//                         }
//                     ]}
//                     disabled={voted || !isPollActive} // Disable the button if voted or poll is not active
//                 >
//                     <Text style={styles.optionText}>{option.optionText || 'Option Text'}</Text>
//                 </TouchableOpacity>
//             ))}

//             {!voted && isPollActive && (
//                 <TouchableOpacity onPress={submitVote} style={styles.submitButton}>
//                     <Text style={styles.submitButtonText}>Submit Vote</Text>
//                 </TouchableOpacity>
//             )}

//             {voted && isPollActive && (
//                 <TouchableOpacity onPress={undoVote} style={[styles.submitButton, styles.undoButton]}>
//                     <Text style={styles.submitButtonText}>Undo Vote</Text>
//                 </TouchableOpacity>
//             )}

//             {(voted || !isPollActive) && (
//                 <View style={styles.resultsContainer}>
//                     <Text style={styles.resultsHeader}>Poll Results:</Text>
//                     {renderChart()}
//                 </View>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#f5f5f5',
//     },
//     question: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     option: {
//         padding: 15,
//         backgroundColor: 'white',
//         borderColor: 'gray',
//         borderWidth: 1,
//         borderRadius: 5,
//         marginVertical: 5,
//         alignItems: 'center',
//     },
//     optionText: {
//         fontSize: 16,
//     },
//     submitButton: {
//         padding: 15,
//         backgroundColor: '#aa18ea',
//         borderRadius: 5,
//         marginVertical: 20,
//         alignItems: 'center',
//     },
//     submitButtonText: {
//         color: 'white',
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     undoButton: {
//         backgroundColor: '#d9534f', // Red color for "Undo Vote" button
//     },
//     resultsContainer: {
//         marginTop: 20,
//     },
//     resultsHeader: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         marginBottom: 10,
//     },
//     notFoundText: {
//         fontSize: 18,
//         textAlign: 'center',
//         marginTop: 50,
//     },
// });

// export default PollDetail;


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';
import { BASE_URL } from '../config';

const PollDetail = ({ route }) => {
    const { pollId } = route.params;
    const [poll, setPoll] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [voted, setVoted] = useState(false);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPollDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user = await AsyncStorage.getItem('userSession');

                if (!token || !user) {
                    Alert.alert('Error', 'No token found, please login.');
                    return;
                }

                const { _id } = JSON.parse(user);
                setUserId(_id);

                const savedVoteState = await AsyncStorage.getItem(`voteState-${pollId}-${_id}`);
                if (savedVoteState) {
                    const { selectedOption, voted } = JSON.parse(savedVoteState);
                    setSelectedOption(selectedOption);
                    setVoted(voted);
                }

                const response = await axios.get(`${BASE_URL}/api/polls/${pollId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPoll(response.data.poll);
            } catch (error) {
                console.error('Error fetching poll details:', error);
                Alert.alert('Error', 'Unable to fetch poll details');
            } finally {
                setLoading(false);
            }
        };

        fetchPollDetails();
        const intervalId = setInterval(fetchPollDetails, 10000);
        return () => clearInterval(intervalId);
    }, [pollId]);

    const handleVote = (optionIndex) => {
        if (!voted && poll && !poll.disableVotes && new Date(poll.endDate) > new Date()) {
            setSelectedOption(optionIndex);
        }
    };

    const submitVote = async () => {
        if (typeof selectedOption === 'number' && userId) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'No token found, please login.');
                    return;
                }

                await axios.post(
                    `${BASE_URL}/api/votes/cast`,
                    {
                        pollId: pollId,
                        option: poll.options[selectedOption].optionText,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                await AsyncStorage.setItem(
                    `voteState-${pollId}-${userId}`,
                    JSON.stringify({ selectedOption, voted: true })
                );
                setVoted(true);
                Alert.alert('Success', 'Your vote has been submitted');
            } catch (error) {
                console.error('Error submitting vote:', error);
                Alert.alert('Error', 'Unable to submit vote');
            }
        } else {
            Alert.alert('Please select an option before voting.');
        }
    };

    const undoVote = async () => {
        if (voted && userId) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    Alert.alert('Error', 'No token found, please login.');
                    return;
                }

                await axios.patch(
                    `${BASE_URL}/api/votes/update`,
                    {
                        pollId: pollId,
                        newOption: null,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                await AsyncStorage.removeItem(`voteState-${pollId}-${userId}`);
                setVoted(false);
                setSelectedOption(null);
                Alert.alert('Success', 'Your vote has been undone');
            } catch (error) {
                console.error('Error undoing vote:', error);
                Alert.alert('Error', 'Unable to undo vote');
            }
        }
    };

    const renderChart = () => {
        const data = poll.options.map((option, index) => ({
            name: option.optionText,
            population: option.votes,
            color: index % 2 === 0 ? '#4caf50' : '#2196f3',
            legendFontColor: '#333',
            legendFontSize: 14,
        }));

        return (
            <PieChart
                data={data}
                width={Dimensions.get('window').width - 50}
                height={220}
                chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#f5f5f5',
                    backgroundGradientTo: '#f5f5f5',
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                        borderRadius: 16,
                    },
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#aa18ea" />
            </View>
        );
    }

    if (!poll) {
        return <Text style={styles.notFoundText}>Poll not found</Text>;
    }

    const isPollActive = !poll.disableVotes && new Date(poll.endDate) > new Date();

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{poll.name || 'Poll Title'}</Text>

            {poll.options.map((option, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => handleVote(index)}
                    style={[
                        styles.option,
                        selectedOption === index && styles.optionSelected,
                        {
                            opacity: voted || !isPollActive ? 0.6 : 1,
                        },
                    ]}
                    disabled={voted || !isPollActive}
                >
                    <Text style={styles.optionText}>{option.optionText || 'Option Text'}</Text>
                </TouchableOpacity>
            ))}

            {!voted && isPollActive && (
                <TouchableOpacity onPress={submitVote} style={styles.submitButton}>
                    <Text style={styles.submitButtonText}>Submit Vote</Text>
                </TouchableOpacity>
            )}

            {voted && isPollActive && (
                <TouchableOpacity onPress={undoVote} style={[styles.submitButton, styles.undoButton]}>
                    <Text style={styles.submitButtonText}>Undo Vote</Text>
                </TouchableOpacity>
            )}

            {(voted || !isPollActive) && (
                <View style={styles.resultsContainer}>
                    <Text style={styles.resultsHeader}>Poll Results:</Text>
                    {renderChart()}
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
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    question: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    option: {
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: '#aa18ea',
        borderColor: '#aa18ea',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        padding: 15,
        backgroundColor: '#4caf50',
        borderRadius: 8,
        marginVertical: 20,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    undoButton: {
        backgroundColor: '#d9534f',
    },
    resultsContainer: {
        marginTop: 20,
    },
    resultsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    notFoundText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#555',
    },
});

export default PollDetail;
