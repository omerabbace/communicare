// import React, { useContext, useState,useEffect } from "react";
// import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
// import { View, Text, ImageBackground, Image, TouchableHighlight,Platform } from 'react-native';
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { BASE_URL } from "../config";
// import { AuthContext } from "../helpers/Auth";
// const CustomDrawer = (props) => {
//   const {userSession} = useContext(AuthContext);
//   const { navigation, fullName ,activeScreen, setActiveScreen } = props;
//   const [isServicesOpen, setIsServicesOpen] = useState(false);
//   const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
//   const [profilePhoto, setProfilePhoto] = useState(
//     userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : require('../assets/img/profile.png')
//   );
//   useEffect(() => {
//     setProfilePhoto(
//       userSession.profilePicture
//         ? { uri: `${BASE_URL}${userSession.profilePicture}` }
//         : require("../assets/img/profile.png")
//     );
//   }, [userSession]);

//   return (
//     <View style={{ flex: 1 }}>
//       <DrawerContentScrollView
//         {...props}
//         contentContainerStyle={{ backgroundColor: '#492caf' }}
//       >
//         {/* <ImageBackground source={require('../assets/img/back_drawer.jpg')} style={{ padding: 20 }}>
//           {profilePhoto ? (
//             <Image source={{ uri: profilePhoto.uri }} style={{ height: 100, width: 100, borderRadius: 50, marginBottom: 10 }} />
//           ) : (
//             <Image source={require('../assets/img/profile.png')} style={{ height: 100, width: 80, borderRadius: 50, marginBottom: 10 }} />
//           )}
//           <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{fullName}</Text>
//         </ImageBackground> */}
//         <ImageBackground
//           source={require("../assets/img/back_drawer.jpg")}
//           style={{ padding: 20 }}
//         >
//           <Image
//             source={profilePhoto}
//             style={{
//               height: 100,
//               width: 100,
//               borderRadius: 50,
//               marginBottom: 10,
//               borderWidth: 2,
//               borderColor: "#fff",
//             }}
//           />
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 18,
//               fontWeight: "bold",
//               fontFamily: Platform.OS === "ios" ? "Arial" : "Roboto",
//             }}
//           >
//             {fullName || "User"}
//           </Text>
//         </ImageBackground>

//         <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
//           <DrawerItemList {...props} />
          
//           {/* Services Submenu */}
//           <TouchableHighlight
//             underlayColor="#aa18ea"
//             onPress={() => setIsServicesOpen(!isServicesOpen)}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 10,
//               paddingHorizontal: 20,
//             }}
//           >
//             <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//               <MaterialIcons name="miscellaneous-services" size={22} color="#333" />
//               <Text style={{ marginLeft: 30, fontSize: 15, fontFamily: fontFamily, color: "#333" }}>
//                 Services
//               </Text>
//               <Ionicons
//                 name={isServicesOpen ? "chevron-up-outline" : "chevron-down-outline"}
//                 size={22}
//                 color="#333"
//                 style={{ marginLeft: 'auto' }}
//               />
//             </View>
//           </TouchableHighlight>
//           {isServicesOpen && (
//             <>
//               <TouchableHighlight
//                 underlayColor="#aa18ea"
//                 onPress={() => navigation.navigate("Report an Accident")}
//                 style={{
//                   paddingLeft: 60,
//                   paddingVertical: 10,
//                   backgroundColor: "white",
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                   <MaterialIcons name="report" size={22} color="#333" />
//                   <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
//                     Report an Accident
//                   </Text>
//                 </View>
//               </TouchableHighlight>
//               <TouchableHighlight
//                 underlayColor="#aa18ea"
//                 onPress={() => navigation.navigate("Vehicle Assistance")}
//                 style={{
//                   paddingLeft: 60,
//                   paddingVertical: 10,
//                   backgroundColor: "white",
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                   <MaterialIcons name="build" size={22} color="#333" />
//                   <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
//                     Vehicle Assistance
//                   </Text>
//                 </View>
//               </TouchableHighlight>
//             </>
//           )}
//         </View>
//       </DrawerContentScrollView>
//       <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 30 }}>
//         <TouchableHighlight
//           underlayColor="#aa18ea"
//           style={{ paddingVertical: 15 }}
//           onPress={() => { navigation.navigate("Logout") }}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name='exit-outline' size={22} />
//             <Text style={{ fontSize: 15, fontFamily: 'Roboto-medium', marginLeft: 5 }}>
//               Sign Out
//             </Text>
//           </View>
//         </TouchableHighlight>
//       </View>
//     </View>
//   );
// };

// export default CustomDrawer;


// import React, { useContext, useState,useEffect } from "react";
// import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
// import { View, Text, ImageBackground, Image, TouchableHighlight,Platform } from 'react-native';
// import Ionicons from "react-native-vector-icons/Ionicons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import { BASE_URL } from "../config";
// import { AuthContext } from "../helpers/Auth";
// const CustomDrawer = (props) => {
//   const {userSession} = useContext(AuthContext);
//   const { navigation, fullName ,activeScreen, setActiveScreen } = props;
//   const [isServicesOpen, setIsServicesOpen] = useState(false);
//   const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
//   const [profilePhoto, setProfilePhoto] = useState(
//     userSession.profilePicture ? { uri: `${BASE_URL}${userSession.profilePicture}` } : require('../assets/img/profile.png')
//   );
//   useEffect(() => {
//     setProfilePhoto(
//       userSession.profilePicture
//         ? { uri: `${BASE_URL}${userSession.profilePicture}` }
//         : require("../assets/img/profile.png")
//     );
//   }, [userSession]);

//   return (
//     <View style={{ flex: 1 }}>
//       <DrawerContentScrollView
//         {...props}
//         contentContainerStyle={{ backgroundColor: '#492caf' }}
//       >
//         <ImageBackground
//           source={require("../assets/img/back_drawer.jpg")}
//           style={{ padding: 20 }}
//         >
//           <Image
//             source={profilePhoto}
//             style={{
//               height: 100,
//               width: 100,
//               borderRadius: 50,
//               marginBottom: 10,
//               borderWidth: 2,
//               borderColor: "#fff",
//             }}
//           />
//           <Text
//             style={{
//               color: "#fff",
//               fontSize: 18,
//               fontWeight: "bold",
//               fontFamily: Platform.OS === "ios" ? "Arial" : "Roboto",
//             }}
//           >
//             {fullName || "User"}
//           </Text>
//         </ImageBackground>
            
//         <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
//           <DrawerItemList {...props} />
          
//           {/* Services Submenu */}
//           <TouchableHighlight
//             underlayColor="#aa18ea"
//             onPress={() => setIsServicesOpen(!isServicesOpen)}
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 10,
//               paddingHorizontal: 20,
//             }}
//           >
//             <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//               <MaterialIcons name="miscellaneous-services" size={22} color="#333" />
//               <Text style={{ marginLeft: 30, fontSize: 15, fontFamily: fontFamily, color: "#333" }}>
//                 Services
//               </Text>
//               <Ionicons
//                 name={isServicesOpen ? "chevron-up-outline" : "chevron-down-outline"}
//                 size={22}
//                 color="#333"
//                 style={{ marginLeft: 'auto' }}
//               />
//             </View>
//           </TouchableHighlight>
//           {isServicesOpen && (
//             <>
//               <TouchableHighlight
//                 underlayColor="#aa18ea"
//                 onPress={() => navigation.navigate("Report an Accident")}
//                 style={{
//                   paddingLeft: 60,
//                   paddingVertical: 10,
//                   backgroundColor: "white",
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                   <MaterialIcons name="report" size={22} color="#333" />
//                   <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
//                     Report an Accident
//                   </Text>
//                 </View>
//               </TouchableHighlight>
//               <TouchableHighlight
//                 underlayColor="#aa18ea"
//                 onPress={() => navigation.navigate("Vehicle Assistance")}
//                 style={{
//                   paddingLeft: 60,
//                   paddingVertical: 10,
//                   backgroundColor: "white",
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                 }}
//               >
//                 <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
//                   <MaterialIcons name="build" size={22} color="#333" />
//                   <Text style={{ marginLeft: 10, fontSize: 15, fontFamily: "Roboto-medium", color: "#333" }}>
//                     Vehicle Assistance
//                   </Text>
//                 </View>
//               </TouchableHighlight>
//             </>
//           )}
//         </View>
//       </DrawerContentScrollView>
//       <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 30 }}>
//         <TouchableHighlight
//           underlayColor="#aa18ea"
//           style={{ paddingVertical: 15 }}
//           onPress={() => { navigation.navigate("Logout") }}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name='exit-outline' size={22} />
//             <Text style={{ fontSize: 15, fontFamily: 'Roboto-medium', marginLeft: 5 }}>
//               Sign Out
//             </Text>
//           </View>
//         </TouchableHighlight>
//       </View>
//     </View>
//   );
// };

// export default CustomDrawer;

import React, { useContext, useState, useEffect } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableHighlight,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BASE_URL } from "../config";
import { AuthContext } from "../helpers/Auth";

const CustomDrawer = (props) => {
  const { userSession } = useContext(AuthContext);
  const { navigation, fullName, activeScreen, setActiveScreen } = props;
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";

  const [profilePhoto, setProfilePhoto] = useState(
    userSession.profilePicture
      ? { uri: `${BASE_URL}${userSession.profilePicture}` }
      : require("../assets/img/profile.png")
  );

  useEffect(() => {
    setProfilePhoto(
      userSession.profilePicture
        ? { uri: `${BASE_URL}${userSession.profilePicture}` }
        : require("../assets/img/profile.png")
    );
  }, [userSession]);

  // Filter visible routes
  const visibleRoutes = props.state.routes.filter(
    (route) => !(props.descriptors[route.key].options.drawerItemStyle?.display === "none")
  );

  const handleNavigate = (routeName) => {
    setActiveScreen(routeName); // Set the active screen for highlighting
  
    // Navigate to the selected route, ensuring no duplicate stacking
    if (navigation.getState().routes.find((r) => r.name === routeName)) {
      navigation.navigate(routeName);
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: routeName }],
      });
    }
  };
  
  
  // const handleNavigate = (routeName) => {
  //   setActiveScreen(routeName); // Set the active screen for highlighting
  //   navigation.navigate(routeName); // Navigate to the selected route
  // };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: "#492caf" }}
      >
        {/* User Profile Section */}
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
              fontFamily: fontFamily,
            }}
          >
            {fullName || "User"}
          </Text>
        </ImageBackground>

        {/* Drawer Items */}
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          {visibleRoutes.map((route) => (
            <TouchableHighlight
              key={route.key}
              underlayColor="#aa18ea"
              onPress={() => handleNavigate(route.name)}
              style={{
                backgroundColor:
                  activeScreen === route.name ? "#aa18ea" : "transparent",
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
                paddingHorizontal: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Add icons based on route names */}
                {route.name === "Home" && (
                  <Ionicons
                    name="home-outline"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Profile" && (
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Donate" && (
                  <MaterialIcons
                    name="volunteer-activism"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Notifications" && (
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Report an Issue" && (
                  <MaterialIcons
                    name="report-problem"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Track Report" && (
                  <MaterialIcons
                    name="arrow-forward"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Voting and Polling" && (
                  <MaterialIcons
                    name="poll"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {route.name === "Discussion Forums" && (
                  <MaterialIcons
                    name="forum"
                    size={22}
                    color={activeScreen === route.name ? "#fff" : "#333"}
                  />
                )}
                {/* Drawer Item Name */}
                <Text
                  style={{
                    marginLeft: 30,
                    fontSize: 15,
                    color: activeScreen === route.name ? "#fff" : "#333",
                  }}
                >
                  {route.name}
                </Text>
              </View>
            </TouchableHighlight>
          ))}

          {/* Services Submenu */}
          <TouchableHighlight
            underlayColor="#aa18ea"
            onPress={() => setIsServicesOpen(!isServicesOpen)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
              <MaterialIcons name="miscellaneous-services" size={22} color="#333" />
              <Text
                style={{
                  marginLeft: 30,
                  fontSize: 15,
                  fontFamily: fontFamily,
                  color: "#333",
                }}
              >
                Services
              </Text>
              <Ionicons
                name={isServicesOpen ? "chevron-up-outline" : "chevron-down-outline"}
                size={22}
                color="#333"
                style={{ marginLeft: "auto" }}
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
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <MaterialIcons name="report" size={22} color="#333" />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      fontFamily: "Roboto-medium",
                      color: "#333",
                    }}
                  >
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
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                  <MaterialIcons name="build" size={22} color="#333" />
                  <Text
                    style={{
                      marginLeft: 10,
                      fontSize: 15,
                      fontFamily: "Roboto-medium",
                      color: "#333",
                    }}
                  >
                    Vehicle Assistance
                  </Text>
                </View>
              </TouchableHighlight>
            </>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Logout Section */}
      <View style={{ borderTopWidth: 1, borderTopColor: "#ccc", padding: 30 }}>
        <TouchableHighlight
          underlayColor="#aa18ea"
          style={{ paddingVertical: 15 }}
          onPress={() => {
            navigation.navigate("Logout");
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Roboto-medium",
                marginLeft: 5,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default CustomDrawer;







