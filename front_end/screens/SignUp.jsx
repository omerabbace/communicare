import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
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
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import RNPickerSelect from "react-native-picker-select";
import { BASE_URL } from "../config";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [userType, setUserType] = useState("normal"); // Default to 'normal' user type
  const [cnic, setCnic] = useState(""); // State for CNIC
  const [serviceCategory, setServiceCategory] = useState(""); // State for service category

  const navigation = useNavigation();

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  const isValidCNIC = (cnic) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    return cnicPattern.test(cnic);
  };

  const handleCnicChange = (text) => {
    // Remove any non-digit characters
    const cleaned = text.replace(/\D/g, "");

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

  const handleSignUp = async () => {
    // Validate input fields
    if (!username || !email || !password || !confirmPassword || !phone) {
      Alert.alert("Error", "Please fill in all fields to sign up.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (userType !== "normal") {
      if (!cnic || !isValidCNIC(cnic)) {
        Alert.alert("Error", "Please enter a valid CNIC in the format XXXXX-XXXXXXX-X.");
        return;
      }
    }

    if (userType === "serviceProvider" && !serviceCategory) {
      Alert.alert("Error", "Please select a service category.");
      return;
    }

    // Send signup request to the server
    try {
      const response = await axios.post(`${BASE_URL}/api/users/signup`, {
        name: username,
        email: email,
        password: password,
        phone: phone,
        role: userType, // Include user type in the signup request
        cnic: userType !== "normal" ? cnic : null, // Include CNIC if not a normal user
        serviceCategory: userType === "serviceProvider" ? serviceCategory : null, // Include service category if service provider
      });

      if (response.data.success) {
        Alert.alert("Congrats", response.data.message);
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Sign Up Error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Sign up failed. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.mainContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require("../assets/img/home.jpg")}
              />
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.text_header}>Sign Up</Text>
              <View style={styles.action}>
                <FontAwesome
                  name="user-o"
                  color="#420475"
                  style={styles.smallIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={(text) => setUsername(text)}
                  placeholder="Full Name"
                />
              </View>
              <View style={styles.action}>
                <FontAwesome
                  name="envelope"
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
                  name="phone"
                  color="#420475"
                  style={styles.smallIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                  placeholder="Phone Number"
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
              <View style={styles.action}>
                <FontAwesome
                  name="lock"
                  color="#420475"
                  style={styles.smallIcon}
                />
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={(text) => setConfirmPassword(text)}
                  placeholder="Confirm Password"
                  secureTextEntry
                />
              </View>

              {/* User Type Selection */}
              <View style={styles.action}>
                <FontAwesome
                  name="users"
                  color="#420475"
                  style={styles.smallIcon}
                />
                <View style={styles.pickerContainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setUserType(value)}
                    items={[
                      { label: "Normal User", value: "normal" },
                      { label: "Volunteer", value: "volunteer" },
                      { label: "Service Provider", value: "serviceProvider" },
                    ]}
                    style={pickerSelectStyles}
                    value={userType}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              {/* Additional Fields for Volunteer and Service Provider */}
              {userType !== "normal" && (
                <View style={styles.action}>
                  <FontAwesome
                    name="id-card"
                    color="#420475"
                    style={styles.smallIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    value={cnic}
                    onChangeText={handleCnicChange}
                    placeholder="CNIC Number (XXXXX-XXXXXXX-X)"
                    keyboardType="numeric"
                    maxLength={15} // Limit input to 15 characters (including hyphens)
                  />
                </View>
              )}

              {userType === "serviceProvider" && (
                <View style={styles.action}>
                  <FontAwesome
                    name="briefcase"
                    color="#420475"
                    style={styles.smallIcon}
                  />
                  <View style={styles.pickerContainer}>
                    <RNPickerSelect
                      onValueChange={(value) => setServiceCategory(value)}
                      items={[
                        {
                          label: "Accident Management",
                          value: "accidentManagement",
                        },
                        {
                          label: "Vehicle Assistance",
                          value: "vehicleAssistance",
                        },
                      ]}
                      style={pickerSelectStyles}
                      value={serviceCategory}
                      useNativeAndroidPickerStyle={false}
                    />
                  </View>
                </View>
              )}
            </View>
            <View style={styles.button}>
              <TouchableOpacity style={styles.inBut} onPress={handleSignUp}>
                <View>
                  <Text style={styles.textSign}>Register</Text>
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={handleLoginPress}>
                  <Text style={styles.link}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white", // white background
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "black",
    paddingRight: 30,
    backgroundColor: "white", // white background
  },
  placeholder: {
    color: "#a0a0a0",
    fontSize: 16,
  },
};

export default SignUpForm;
