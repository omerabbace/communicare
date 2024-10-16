import React, { useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import VolunteerHome from "../../screens/volunteer/LandingVolunteer";
import Profile from "../../screens/generalUser/Profile";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../helpers/Auth";
import Forum from "../../components/Forum";
import ForumDiscussion from "../../components/ForumDiscussion";
import PollList from "../../components/PollList";
import PollDetail from "../../components/PollDetail";
import CustomServiceProviderDrawer from "../../components/CustomServiceProDrawer";

const Drawer = createDrawerNavigator();

function VolunteerDrawer({ navigation }) {
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
        {(props) => <VolunteerHome {...props} fullName={fullName} />}
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

     
        {/* <Drawer.Screen
          name="Reported Accidents"
          component={ViewReportedAccidents}
          options={{
            drawerIcon: ({ color }) => (
              <MaterialIcons name="report" size={22} color={color} />
            ),
          }}
        /> */}
        <Drawer.Screen
        name="Discussion Forums"
        component={Forum}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="forum" size={22} color={color} />
          ),
        }}
      />
       
      <Drawer.Screen
        name="ForumDiscussion"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      >
        {(props) => (
          <ForumDiscussion 
            {...props} 
            profilePhoto={profilePhoto} 
            fullName={fullName}
          />
        )}
      </Drawer.Screen>
      <Drawer.Screen
        name="Voting and Polling"
        component={PollList}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="poll" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PollDetail"
        component={PollDetail}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      
      
    </Drawer.Navigator>
  );
}

export default VolunteerDrawer;
