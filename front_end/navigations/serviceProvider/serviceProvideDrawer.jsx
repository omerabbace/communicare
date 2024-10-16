import React, { useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ServiceProviderHome from "../../screens/Service_provider/LandingServiceProvider";
import Profile from "../../screens/generalUser/Profile";
import CustomServiceProviderDrawer from "../../components/CustomServiceProDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../helpers/Auth";
import ViewReportedAccidents from "../../screens/Service_provider/ReportedAccident";


const Drawer = createDrawerNavigator();

function ServiceProviderDrawer({ navigation }) {
  const { userSession } = useContext(AuthContext);
  const [fullName, setFullName] = useState(userSession.name);
  const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomServiceProviderDrawer {...props} profilePhoto={profilePhoto} fullName={fullName} />
      )}
      screenOptions={{
        headerTitle: "",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
          fontFamily: "Roboto-medium",
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
        {(props) => <ServiceProviderHome {...props} fullName={fullName} />}
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

      {/* Conditional Screens Based on Role
      {userSession.serviceCategory === "vehicleAssistance" && (
        <Drawer.Screen
          name="Vehicle Assistance"
          component={VehicleAssistanceScreen}
          options={{
            drawerIcon: ({ color }) => (
              <MaterialIcons name="car-repair" size={22} color={color} />
            ),
          }}
        />
      )} */}

      {userSession.serviceCategory === "accidentManagement" && (
        <Drawer.Screen
          name="Reported Accidents"
          component={ViewReportedAccidents}
          options={{
            drawerIcon: ({ color }) => (
              <MaterialIcons name="report" size={22} color={color} />
            ),
          }}
        />
      )}
      
      {/* Additional screens can be added here for each role */}
    </Drawer.Navigator>
  );
}

export default ServiceProviderDrawer;
