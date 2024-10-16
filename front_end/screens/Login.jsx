//screens/Login.jsx
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import styles from "../assets/style";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AuthContext } from "../helpers/Auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  const handleSignIn = async () => {
    if (email.length === 0 || password.length === 0) {
      Alert.alert("Error", "Enter Both Email And Password");
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Enter a valid email address");
      return;
    }
    const userData = {
      email: email,
      password: password,
    };
    const res = await loginUser(userData);
    
    if (res) {
      console.log("User Role:", res.role); // Add this to debug the role
      // Navigate based on user role
      if (res.role === "normal") {
        navigation.navigate("UserHome");
      } else if (res.role === "volunteer") {
        navigation.navigate("VolunteerHome");
      } else if (res.role === "serviceProvider") {
        navigation.navigate("ServiceProviderHome");
      } else {
        Alert.alert("Error", "Invalid user role.");
      }
    } else {
      Alert.alert("Error", "Login failed. Please try again.");
    }
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
                style={styles.textInput}
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Email"
                keyboardType="email-address"
              />
            </View>
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
    </SafeAreaView>
  );
};

export default Login;
