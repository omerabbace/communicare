// // helpers/Auth.jsx
// import React, { createContext, useEffect, useState } from 'react';
// import { registerForPushNotificationsAsync } from './notificationHelper';
// import axios from 'axios';
// import { Alert } from 'react-native';
// import { BASE_URL } from '../config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AuthContext = createContext();

// const AuthProvider = ({ children }) => {
//   const [userSession, setUserSession] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [sessionLoaded, setSessionLoaded] = useState(false); // NEW: Flag to track session load completion

//   // Login user and store session in AsyncStorage
//   const loginUser = async (userData) => {
//     setIsLoading(true);
//     const { email, password } = userData;
//     try {
//       const response = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
//       if (!response.data.success) {
//         Alert.alert('Error', response.data.message);
//         setIsLoading(false);
//         return false;
//       } else {
//         const user = response.data.data;
//         console.log('Login successful. Storing session:', user);
//         const token = user.token;
//         // console.log("tokenn oneee", token);
//         setUserSession(user);  // Set session
//          // Save session to AsyncStorage
//         await AsyncStorage.setItem('userSession', JSON.stringify(user));
//         // saving token 
//         await AsyncStorage.setItem('token', token);  
//           // Get FCM token
//       //   const fcmToken = await registerForPushNotificationsAsync();
//       //   if (fcmToken) {

//       //     await axios.put(
//       //       `${BASE_URL}/api/users/update-fcm-token`,
//       //        { fcmToken },
//       //        { headers: { Authorization: `Bearer ${token}` } }
//       //  );
//       // console.log('FCM token sent to backend.');
//       //   } else {
//       // console.log('FCM token not available.');
//       // }

//         setIsLoading(false);
//         setSessionLoaded(true);  // Mark session as loaded
//         return user;
//       }
//     } catch (error) {
//       console.error('Login error:', error);
//       Alert.alert('Error', 'Login failed. Please try again.');
//       setIsLoading(false);
//       setSessionLoaded(true);  // Ensure this is set to true even on failure
//       return false;
//     }
//   };

//   // Logout user and remove session from AsyncStorage
//   const logoutUser = () => {
//     console.log('Logging out user...');
//     setUserSession(null);
//     AsyncStorage.removeItem('userSession');
//     AsyncStorage.removeItem('token');
//   };

//   // Check if user session exists in AsyncStorage
//   const isLoggedIn = async () => {
//     console.log('Checking for existing session in AsyncStorage...');
//     try {
//       setIsLoading(true);  // Start loading session
//       let session = await AsyncStorage.getItem('userSession');
//       if (session) {
//         let userData = JSON.parse(session);
//         console.log('Session found:', userData);  // LOG: Check session data
//         setUserSession(userData);  // Set session from AsyncStorage
//       } else {
//         console.log('No session found in AsyncStorage');
//       }
//       setSessionLoaded(true);  // Mark that session loading is done
//       setIsLoading(false);  // End loading
//     } catch (error) {
//       console.log('Error retrieving session:', error);
//       setIsLoading(false);
//       setSessionLoaded(true);
//     }
//   };

//   useEffect(() => {
//     isLoggedIn();  // Check session on app start
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         userSession,
//         loginUser,
//         logoutUser,
//         isLoading,
//         sessionLoaded,  // NEW: Expose this value to track session load completion
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContext, AuthProvider };

import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert } from 'react-native';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [isLeader, setIsLeader] = useState(false); // NEW: To track leader status
  const [isLoading, setIsLoading] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false); // To track session load completion
  // Login user and store session and leader status in AsyncStorage
  const loginUser = async (userData) => {
    setIsLoading(true);
    const { email, password } = userData;
    try {
      const response = await axios.post(`${BASE_URL}/api/users/login`, { email, password });
      if (!response.data.success) {
        Alert.alert('Error', response.data.message);
        setIsLoading(false);
        return false;
      } else {
        const user = response.data.data;
        const token = user.token;
        setUserSession(user);  // Set session

        // Save session and token to AsyncStorage
        await AsyncStorage.setItem('userSession', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);

        // Check if user is a leader
        const leaderResponse = await axios.get(`${BASE_URL}/api/issueReporting/check-leader-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const leaderData = leaderResponse.data;
        if (leaderData.isLeader) {
          setIsLeader(true);
          await AsyncStorage.setItem('isLeader', 'true');  // Save leader status to AsyncStorage
        } else {
          setIsLeader(false);
          await AsyncStorage.removeItem('isLeader');  // Clear if not a leader
        }

        setIsLoading(false);
        setSessionLoaded(true);  // Mark session as loaded
        return user;
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
      setIsLoading(false);
      setSessionLoaded(true);  // Ensure this is set to true even on failure
      return false;
    }
  };

  // Logout user and remove session from AsyncStorage
  const logoutUser = async () => {
    console.log('Logging out user...');
    setUserSession(null);
    setIsLeader(false);  // Reset leader status
    await AsyncStorage.removeItem('userSession');
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isLeader');
  };

  // Check if user session and leader status exist in AsyncStorage
  const isLoggedIn = async () => {
    // console.log('Checking for existing session in AsyncStorage...');
    try {
      setIsLoading(true);  // Start loading session
      let session = await AsyncStorage.getItem('userSession');
      if (session) {
        let userData = JSON.parse(session);
        setUserSession(userData);  // Set session from AsyncStorage

        // Check if the user is a leader
        const isLeaderStored = await AsyncStorage.getItem('isLeader');
        setIsLeader(isLeaderStored === 'true');
      } else {
        console.log('No session found in AsyncStorage');
      }
      setSessionLoaded(true);  // Mark that session loading is done
      setIsLoading(false);  // End loading
    } catch (error) {
      console.log('Error retrieving session:', error);
      setIsLoading(false);
      setSessionLoaded(true);
    }
  };

  useEffect(() => {
    isLoggedIn();  // Check session on app start
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userSession,
        loginUser,
        logoutUser,
        isLoading,
        sessionLoaded,
        isLeader,
        setIsLeader,  // Expose leader status in the context
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
