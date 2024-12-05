// import React, { useState, useContext } from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import ServiceProviderHome from "../../screens/Service_provider/LandingServiceProvider";
// import Profile from "../../screens/generalUser/Profile";
// import CustomServiceProviderDrawer from "../../components/CustomServiceProDrawer";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { MaterialIcons } from "@expo/vector-icons";
// import { AuthContext } from "../../helpers/Auth";
// import ViewReportedAccidents from "../../screens/Service_provider/ReportedAccident";
// import ServiceProviderAccidentTracker from "../../screens/Service_provider/ServiceProviderAccidentTracker";
// import ServiceProviderAccidentList from "../../screens/Service_provider/ServiceProviderAccidentList";
// import VehicleIssuesList from "../../screens/Service_provider/VehicleIssuesList";
// import ReportDetailsScreen from "../../screens/Service_provider/VehicleReportDetails";
// import CompletedAccidentsScreen from "../../screens/Service_provider/CompletedAccidents";
// const Drawer = createDrawerNavigator();

// function ServiceProviderDrawer({ navigation }) {
//   const { userSession } = useContext(AuthContext);
//   const [fullName, setFullName] = useState(userSession.name);
//   const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => (
//         <CustomServiceProviderDrawer {...props} profilePhoto={profilePhoto} fullName={fullName} />
//       )}
//       screenOptions={{
//         headerTitle: "",
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontSize: 15,
//           fontFamily: "Roboto-medium",
//         },
//         drawerActiveBackgroundColor: "#aa18ea",
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#333",
//       }}
//     >
//       {/* Common Screens */}
//       <Drawer.Screen
//         name="Home"
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <ServiceProviderHome {...props} fullName={fullName} serviceCategory={userSession.serviceCategory} />}
//       </Drawer.Screen>

//       <Drawer.Screen
//         name="Profile"
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => (
//           <Profile
//             {...props}
//             fullName={fullName}
//             setFullName={setFullName}
//             profilePhoto={profilePhoto}
//             setProfilePhoto={setProfilePhoto}
//           />
//         )}
//       </Drawer.Screen>

//       {/* Conditional Screens Based on Role */}
//       {userSession.serviceCategory === "vehicleAssistance" && (
//         <>
//         <Drawer.Screen
//           name="Vehicle Assistance"
//           component={VehicleIssuesList}
//           options={{
//             drawerIcon: ({ color }) => (
//               <MaterialIcons name="car-repair" size={22} color={color} />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="ReportDetails"
//           component={ReportDetailsScreen}
//           options={{
//             drawerItemStyle: { display: 'none' },
//           }}
//         />
//         </>
//       )}

//       {userSession.serviceCategory === "accidentManagement" && (
//         <>
//         <Drawer.Screen
//           name="Reported Accidents"
//           component={ViewReportedAccidents}
//           options={{
//             drawerIcon: ({ color }) => (
//               <MaterialIcons name="report" size={22} color={color} />
//             ),
//           }}
//         />
//         <Drawer.Screen
//           name="Track Accidents"
//           component={ServiceProviderAccidentTracker}
//           options={{
//             drawerItemStyle: { display: 'none' },
//           }}
//         />
//         <Drawer.Screen
//         name="List of accident"
//         component={ServiceProviderAccidentList}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="report" size={22} color={color} />
//           ),
//         }}
//       />
//         <Drawer.Screen
//         name="Completed Accidents"
//         component={CompletedAccidentsScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="report" size={22} color={color} />
//           ),
//         }}
//       />
//       </>
//       )}

        
        
      

      
//       {/* Additional screens can be added here for each role */}
//     </Drawer.Navigator>
//   );
// }

// export default ServiceProviderDrawer;

import React, { useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Platform } from "react-native";
import ServiceProviderHome from "../../screens/Service_provider/LandingServiceProvider";
import Profile from "../../screens/generalUser/Profile";
import CustomServiceProviderDrawer from "../../components/CustomServiceProDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../helpers/Auth";
import ViewReportedAccidents from "../../screens/Service_provider/ReportedAccident";
import ServiceProviderAccidentTracker from "../../screens/Service_provider/ServiceProviderAccidentTracker";
import ServiceProviderAccidentList from "../../screens/Service_provider/ServiceProviderAccidentList";
import VehicleIssuesList from "../../screens/Service_provider/VehicleIssuesList";
import ReportDetailsScreen from "../../screens/Service_provider/VehicleReportDetails";
import CompletedAccidentsScreen from "../../screens/Service_provider/CompletedAccidents";

const Drawer = createDrawerNavigator();

function ServiceProviderDrawer({ navigation }) {
  const { userSession } = useContext(AuthContext);
  const [fullName, setFullName] = useState(userSession.name);
  const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);

  const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomServiceProviderDrawer
          {...props}
          profilePhoto={profilePhoto}
          fullName={fullName}
        />
      )}
      screenOptions={{
        headerTitle: "",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
          fontFamily: fontFamily, // Cross-platform font
        },
        drawerActiveBackgroundColor: "#aa18ea",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
      }}
    >
      {/* Common Screens */}
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <ServiceProviderHome
            {...props}
            fullName={fullName}
            serviceCategory={userSession.serviceCategory}
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Profile"
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => (
          <Profile
            {...props}
            fullName={fullName}
            setFullName={setFullName}
            profilePhoto={profilePhoto}
            setProfilePhoto={setProfilePhoto}
          />
        )}
      </Drawer.Screen>

      {/* Conditional Screens Based on Role */}
      {userSession.serviceCategory === "vehicleAssistance" && (
        <>
          <Drawer.Screen
            name="Vehicle Assistance"
            component={VehicleIssuesList}
            options={{
              drawerIcon: ({ color }) => (
                <MaterialIcons name="car-repair" size={22} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="ReportDetails"
            component={ReportDetailsScreen}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </>
      )}

      {userSession.serviceCategory === "accidentManagement" && (
        <>
          <Drawer.Screen
            name="Reported Accidents"
            component={ViewReportedAccidents}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="alert-circle-outline" size={22} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Track Accidents"
            component={ServiceProviderAccidentTracker}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="List of accident"
            component={ServiceProviderAccidentList}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="list-outline" size={22} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Completed Accidents"
            component={CompletedAccidentsScreen}
            options={{
              drawerIcon: ({ color }) => (
                <Ionicons name="checkmark-done-outline" size={22} color={color} />
              ),
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
}

export default ServiceProviderDrawer;
