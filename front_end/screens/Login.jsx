// //screens/Login.jsx
// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   SafeAreaView,
//   Alert,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import styles from "../assets/style";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { AuthContext } from "../helpers/Auth";

// const Login = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { loginUser } = useContext(AuthContext);

//   function isValidEmail(email) {
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailPattern.test(email);
//   }

//   const handleSignUpPress = () => {
//     navigation.navigate("SignUp");
//   };

//   const handleSignIn = async () => {
//     if (email.length === 0 || password.length === 0) {
//       Alert.alert("Error", "Enter Both Email And Password");
//       return;
//     }
//     if (!isValidEmail(email)) {
//       Alert.alert("Error", "Enter a valid email address");
//       return;
//     }
//     const userData = {
//       email: email,
//       password: password,
//     };
//     const res = await loginUser(userData);
    
//     if (res) {
//       console.log("User Role:", res.role); // Add this to debug the role
//       // Navigate based on user role
//       if (res.role === "normal") {
//         navigation.navigate("UserHome");
//       } else if (res.role === "volunteer") {
//         navigation.navigate("VolunteerHome");
//       } else if (res.role === "serviceProvider") {
//         navigation.navigate("ServiceProviderHome");
//       } else {
//         Alert.alert("Error", "Invalid user role.");
//       }
//     } else {
//       Alert.alert("Error", "Login failed. Please try again.");
//     }
//   };
  
  

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View style={styles.logoContainer}>
//             <Image
//               style={styles.logo}
//               source={require("../assets/img/home.jpg")}
//             />
//           </View>
//           <View style={styles.loginContainer}>
//             <Text style={styles.text_header}>Sign In</Text>
//             <View style={styles.action}>
//               <FontAwesome
//                 name="user-o"
//                 color="#420475"
//                 style={styles.smallIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={email}
//                 onChangeText={(text) => setEmail(text)}
//                 placeholder="Email"
//                 keyboardType="email-address"
//               />
//             </View>
//             <View style={styles.action}>
//               <FontAwesome
//                 name="lock"
//                 color="#420475"
//                 style={styles.smallIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={password}
//                 onChangeText={(text) => setPassword(text)}
//                 placeholder="Password"
//                 secureTextEntry
//               />
//             </View>
//             <View style={styles.forgetPass}>
//               <TouchableOpacity>
//                 <Text style={styles.link}>Forget Password</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View style={styles.button}>
//             <TouchableOpacity style={styles.inBut} onPress={handleSignIn}>
//               <View>
//                 <Text style={styles.textSign}>Login</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//           <View style={{ flexDirection: "row", justifyContent: "center" }}>
//             <Text>Don't have an account? </Text>
//             <TouchableOpacity onPress={handleSignUpPress}>
//               <Text style={styles.link}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default Login;
// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   Animated,
// } from "react-native";
// import styles from "../assets/style";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { AuthContext } from "../helpers/Auth";

// const Login = ({ navigation }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [showError, setShowError] = useState(false);
//   const { loginUser } = useContext(AuthContext);

//   const fadeAnim = new Animated.Value(0); // Animation for fade-in/out

//   function isValidEmail(email) {
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     return emailPattern.test(email);
//   }

//   const handleSignUpPress = () => {
//     navigation.navigate("SignUp");
//   };

//   const handleSignIn = async () => {
//     if (email.length === 0 || password.length === 0) {
//       showErrorAlert("Enter Both Email And Password");
//       return;
//     }
//     if (!isValidEmail(email)) {
//       showErrorAlert("Enter a valid email address");
//       return;
//     }

//     const userData = {
//       email: email,
//       password: password,
//     };
//     const res = await loginUser(userData);

//     if (res) {
//       console.log("User Role:", res.role); // Debug the role
//       if (res.role === "normal") {
//         navigation.navigate("UserHome");
//       } else if (res.role === "volunteer") {
//         navigation.navigate("VolunteerHome");
//       } else if (res.role === "serviceProvider") {
//         navigation.navigate("ServiceProviderHome");
//       } else {
//         showErrorAlert("Invalid user role.");
//       }
//     } else {
//       showErrorAlert("Login failed. Please try again.");
//     }
//   };

//   const showErrorAlert = (message) => {
//     setErrorMessage(message);
//     setShowError(true);
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start(() => {
//       setTimeout(() => {
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }).start(() => setShowError(false));
//       }, 2000);
//     });
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//           <View style={styles.logoContainer}>
//             <Image
//               style={styles.logo}
//               source={require("../assets/img/home.jpg")}
//             />
//           </View>
//           <View style={styles.loginContainer}>
//             <Text style={styles.text_header}>Sign In</Text>
//             <View style={styles.action}>
//               <FontAwesome
//                 name="user-o"
//                 color="#420475"
//                 style={styles.smallIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={email}
//                 onChangeText={(text) => setEmail(text)}
//                 placeholder="Email"
//                 keyboardType="email-address"
//               />
//             </View>
//             <View style={styles.action}>
//               <FontAwesome
//                 name="lock"
//                 color="#420475"
//                 style={styles.smallIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={password}
//                 onChangeText={(text) => setPassword(text)}
//                 placeholder="Password"
//                 secureTextEntry
//               />
//             </View>
//             <View style={styles.forgetPass}>
//               <TouchableOpacity>
//                 <Text style={styles.link}>Forget Password</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           <View style={styles.button}>
//             <TouchableOpacity style={styles.inBut} onPress={handleSignIn}>
//               <View>
//                 <Text style={styles.textSign}>Login</Text>
//               </View>
//             </TouchableOpacity>
//           </View>
//           <View style={{ flexDirection: "row", justifyContent: "center" }}>
//             <Text>Don't have an account? </Text>
//             <TouchableOpacity onPress={handleSignUpPress}>
//               <Text style={styles.link}>Sign Up</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* Custom Alert */}
//       {showError && (
//         <Animated.View
//           style={[
//             styles.errorAlert,
//             { opacity: fadeAnim },
//           ]}
//         >
//           <Text style={styles.errorText}>{errorMessage}</Text>
//         </Animated.View>
//       )}
//     </SafeAreaView>
//   );
// };

// export default Login;

import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../helpers/Auth";
import styles from "../assets/style"; // Ensure this file exists
import registerForPushNotificationsAsync from "../lib/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { BASE_URL } from "../config";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(""); // Track email error
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const { loginUser } = useContext(AuthContext);

  const fadeAnim = new Animated.Value(0); // Animation for fade-in/out

  // Check for missing styles
  const validateStyles = () => {
    const requiredStyles = [
      "textInput",
      "logoContainer",
      "logo",
      "loginContainer",
      "text_header",
      "action",
      "button",
      "inBut",
      "textSign",
    ];
    const missingStyles = requiredStyles.filter(
      (style) => !styles || !styles[style]
    );

    if (missingStyles.length > 0) {
      Alert.alert(
        "Missing Styles",
        `The following styles are missing:\n\n${missingStyles.join(", ")}`,
        [{ text: "OK" }]
      );
    }
  };


  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  // const handleSignIn = async () => {
  //   validateStyles(); // Validate styles before proceeding
  //   if (email.length === 0 || password.length === 0) {
  //     showErrorAlert("Enter Both Email And Password");
  //     return;
  //   }
  //   if (!isValidEmail(email)) {
  //     setEmailError("Enter a valid email address");
  //     return;
  //   }

    
  //   setEmailError(""); // Clear email error if valid
  //   const userData = {
  //     email: email,
  //     password: password,
  //   };
  //   const res = await loginUser(userData);

  //   if (res) {
  //     if (res.role === "normal") {
  //       navigation.navigate("UserHome");
  //     } else if (res.role === "volunteer") {
  //       navigation.navigate("VolunteerHome");
  //     } else if (res.role === "serviceProvider") {
  //       navigation.navigate("ServiceProviderHome");
  //     } else {
  //       showErrorAlert("Invalid user role.");
  //     }
  //   } else {
  //     showErrorAlert("Login failed. Please try again.");
  //   }
  // };

  // const handleSignIn = async () => {
  //   validateStyles();
  
  //   if (email.length === 0 || password.length === 0) {
  //     showErrorAlert("Enter Both Email And Password");
  //     return;
  //   }
  
  //   if (!isValidEmail(email)) {
  //     setEmailError("Enter a valid email address");
  //     return;
  //   }
  
  //   setEmailError("");
  
  //   const userData = {
  //     email: email,
  //     password: password,
  //   };
  
  //   const res = await loginUser(userData); // Authenticate user and get session
  
  //   if (res) {
  //     try {
  //       // Step 1: Retrieve the Expo Push Token
  //       const token = await registerForPushNotificationsAsync();
  //       console.log("Push Token:", token);
  
  //       // Step 2: Save the push token to AsyncStorage
  //       const updatedSession = { ...res, pushNotificationToken: token };
  //       await AsyncStorage.setItem("userSession", JSON.stringify(updatedSession));
  
  //       // Step 3: Send the push token to the backend
  //       await axios.post(
  //         `${BASE_URL}/api/users/updatePushToken`,
  //         { pushNotificationToken: token },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${res.token}`,
  //           },
  //         }
  //       );
  
  //       console.log("Push token saved successfully");
  //     } catch (error) {
  //       console.error("Error saving push token:", error);
  //     }
  
  //     // Step 4: Navigate based on user role
  //     if (res.role === "normal") {
  //       navigation.navigate("UserHome");
  //     } else if (res.role === "volunteer") {
  //       navigation.navigate("VolunteerHome");
  //     } else if (res.role === "serviceProvider") {
  //       navigation.navigate("ServiceProviderHome");
  //     } else {
  //       showErrorAlert("Invalid user role.");
  //     }
  //   } else {
  //     showErrorAlert("Login failed. Please try again.");
  //   }
  // };
  
  const handleSignIn = async () => {
    validateStyles();
  
    if (email.length === 0 || password.length === 0) {
      showErrorAlert("Enter Both Email And Password");
      return;
    }
  
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address");
      return;
    }
  
    setEmailError("");
  
    const userData = {
      email: email,
      password: password,
    };
  
    const res = await loginUser(userData); // Authenticate user and get session
  
    if (res) {
      try {
        // Step 1: Save user session to AsyncStorage
        await AsyncStorage.setItem("userSession", JSON.stringify(res));
  
        // NotificationProvider will automatically pick up the session and handle token updates
        console.log("User session saved successfully");
  
        // Step 2: Navigate based on user role
        if (res.role === "normal") {
          navigation.navigate("UserHome");
        } else if (res.role === "volunteer") {
          navigation.navigate("VolunteerHome");
        } else if (res.role === "serviceProvider") {
          navigation.navigate("ServiceProviderHome");
        } else {
          showErrorAlert("Invalid user role.");
        }
      } catch (error) {
        console.error("Error saving user session:", error);
        showErrorAlert("An error occurred while processing your request.");
      }
    } else {
      showErrorAlert("Login failed. Please try again.");
    } 
  };
  

  const showErrorAlert = (message) => {
    setErrorMessage(message);
    setShowError(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowError(false));
      }, 2000);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require("../assets/img/home.jpg")}
            />
          </View>
          <View style={styles.loginContainer}>
            <Text style={styles.text_header}>Sign In</Text>
            <View style={styles.action}>
              <FontAwesome
                name="user-o"
                color="#420475"
                style={styles.smallIcon}
              />
              <TextInput
                style={[
                  styles.textInput,
                  emailError ? { borderColor: "red", borderWidth: 1 } : null,
                ]}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(""); // Reset error on change
                }}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
            {emailError ? (
              <Text style={[styles.errorText, { marginLeft: 10 }]}>
                {emailError}
              </Text>
            ) : null}
            <View style={styles.action}>
              <FontAwesome
                name="lock"
                color="#420475"
                style={styles.smallIcon}
              />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder="Password"
                secureTextEntry
              />
            </View>
            <View style={styles.forgetPass}>
              <TouchableOpacity>
                <Text style={styles.link}>Forget Password</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity style={styles.inBut} onPress={handleSignIn}>
              <View>
                <Text style={styles.textSign}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      {showError && (
        <Animated.View
          style={[
            styles.errorAlert,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Login;
