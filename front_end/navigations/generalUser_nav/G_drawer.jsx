import React, { useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import UserHome from "../../screens/generalUser/UserHome";
import Profile from "../../screens/generalUser/Profile";
import CustomDrawer from "../../components/CustomDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import IssueReport from "../../screens/generalUser/IssueReport";
import DonationScreen from "../../screens/generalUser/DonationScreen";
import ProjectDetailScreen from "../../screens/generalUser/ProjectDetailScreen";
import StripePaymentScreen from "../../screens/generalUser/StripePaymentScreen";
import DonationConfirmationScreen from "../../screens/generalUser/DonationConfirmationScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { AuthContext } from "../../helpers/Auth";
import PollDetail from "../../components/PollDetail";
import PollList from "../../components/PollList";
import Forum from "../../components/Forum";
import { issueCategories } from "../../components/issues"; 
import ForumDiscussion from "../../components/ForumDiscussion";
import ReportAccident from "../../components/ReportAccident";
import VehicleAssistance from "../../components/VehicleAssistance";
import TrackServiceProvider from "../../components/TrackServiceProvider";
import UserReportedIssuesScreen from "../../screens/generalUser/ReportedIssues";
const Drawer = createDrawerNavigator();
function GeneralDrawer({ navigation }) {
  const { userSession } = useContext(AuthContext);
  const [fullName, setFullName] = useState(userSession.name);
  const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer {...props} profilePhoto={profilePhoto} fullName={fullName} />
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
      <Drawer.Screen
        name="Home"
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      >
        {(props) => <UserHome {...props} fullName={fullName} />}
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
      <Drawer.Screen
        name="Report an Issue"
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report-problem" size={22} color={color} />
          ),
        }}
      >
        {(props) => <IssueReport {...props} issueCategories={issueCategories} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="Track Report"
        component={UserReportedIssuesScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="arrow-forward" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Donate"
        component={DonationScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="volunteer-activism" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="StripePaymentScreen"
        component={StripePaymentScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="DonationConfirmationScreen"
        component={DonationConfirmationScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
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
      <Drawer.Screen
        name="Report an Accident"
        component={ReportAccident}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Vehicle Assistance"
        component={VehicleAssistance}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="Discussion Forums"
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="forum" size={22} color={color} />
          ),
        }}
      >
        {(props) => <Forum {...props} categories={issueCategories} />}
      </Drawer.Screen>
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
      {/* Services Submenu */}
      <Drawer.Screen
        name="ServicesSubMenu"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      >
        {(props) => <ServicesSubMenu {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="TrackServiceProvider"
        component={TrackServiceProvider}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
}

export default GeneralDrawer;
