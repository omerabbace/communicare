import React, { useContext, useState,useEffect } from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, ImageBackground, Image, TouchableHighlight,Platform } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "../helpers/Auth";
import { BASE_URL } from "../config";

const CustomServiceProviderDrawer = (props) => {
  const { navigation,fullName } = props;
  const {userSession} = useContext(AuthContext);
  const [profilePhoto, setProfilePhoto] = useState(
    userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : require('../assets/img/profile.png')
  );
  // console.log('volunteer sessionnn ', userSession);
  useEffect(() => {
    setProfilePhoto(
      userSession.profilePicture
        ? { uri: `${BASE_URL}${userSession.profilePicture}` }
        : require("../assets/img/profile.png")
    );
  }, [userSession]); 
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#492caf' }}
      >
        {/* <ImageBackground source={require('../assets/img/back_drawer.jpg')} style={{ padding: 20 }}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto.uri }} style={{ height: 100, width: 100, borderRadius: 50, marginBottom: 10 }} />
          ) : (
            <Image source={require('../assets/img/profile.png')} style={{ height: 100, width: 80, borderRadius: 50, marginBottom: 10 }} />
          )}
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{fullName}</Text>
        </ImageBackground> */}
        <ImageBackground
          source={require("../assets/img/back_drawer.jpg")}
          style={{ padding: 20 }}
        >
          <Image
            source={profilePhoto}
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              marginBottom: 10,
              borderWidth: 2,
              borderColor: "#fff",
            }}
          />
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              fontFamily: Platform.OS === "ios" ? "Arial" : "Roboto",
            }}
          >
            {fullName || "User"}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 30 }}>
        <TouchableHighlight
          underlayColor="#aa18ea"
          style={{ paddingVertical: 15 }}
          onPress={() => { navigation.navigate("Logout") }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name='exit-outline' size={22} />
            <Text style={{ fontSize: 15, fontFamily: 'Roboto-medium', marginLeft: 5 }}>
              Sign Out
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default CustomServiceProviderDrawer;
