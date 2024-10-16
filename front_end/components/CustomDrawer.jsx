import React, { useState } from "react";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { View, Text, ImageBackground, Image, TouchableHighlight } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const CustomDrawer = (props) => {
  const { navigation, profilePhoto, fullName } = props;
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: '#492caf' }}
      >
        <ImageBackground source={require('../assets/img/back_drawer.jpg')} style={{ padding: 20 }}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto.uri }} style={{ height: 100, width: 100, borderRadius: 50, marginBottom: 10 }} />
          ) : (
            <Image source={require('../assets/img/profile.png')} style={{ height: 100, width: 80, borderRadius: 50, marginBottom: 10 }} />
          )}
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{fullName}</Text>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
          <DrawerItemList {...props} />
          
          {/* Services Submenu */}
          <TouchableHighlight
            underlayColor="#aa18ea"
            onPress={() => setIsServicesOpen(!isServicesOpen)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <MaterialIcons name="miscellaneous-services" size={22} color="#333" />
              <Text style={{ marginLeft: 30, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
                Services
              </Text>
              <Ionicons
                name={isServicesOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#333"
                style={{ marginLeft: 'auto' }}
              />
            </View>
          </TouchableHighlight>
          {isServicesOpen && (
            <>
              <TouchableHighlight
                underlayColor="#aa18ea"
                onPress={() => navigation.navigate("Report an Accident")}
                style={{
                  paddingLeft: 60,
                  paddingVertical: 10,
                  backgroundColor: "white",
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <MaterialIcons name="report" size={22} color="#333" />
                  <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
                    Report an Accident
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor="#aa18ea"
                onPress={() => navigation.navigate("Vehicle Assistance")}
                style={{
                  paddingLeft: 60,
                  paddingVertical: 10,
                  backgroundColor: "white",
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <MaterialIcons name="build" size={22} color="#333" />
                  <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
                    Vehicle Assistance
                  </Text>
                </View>
              </TouchableHighlight>
            </>
          )}
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

export default CustomDrawer;
