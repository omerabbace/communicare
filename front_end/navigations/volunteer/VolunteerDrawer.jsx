import React, { useState, useContext, useEffect } from "react";
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
import IssueListScreen from "../../screens/volunteer/ApprovedIssuesList";
import VolunteerManagementScreen from "../../screens/volunteer/VolunteerManagementScreen";
import LeaderTaskScreen from "../../screens/volunteer/LeaderTask";
import AssignSubTaskScreen from "../../screens/volunteer/AssignSubTaskScreen";
import ViewAssignedSubTasksScreen from "../../screens/volunteer/ViewAssignedSubTasksScreen";
import VolunteerSubTasksScreen from "../../screens/volunteer/VolunteerSubTasksScreen";
import ReportTaskScreen from "../../screens/volunteer/ReportTaskScreen";
import CompletedLeaderTasksScreen from "../../screens/volunteer/CompletedLeaderTasksScreen";
const Drawer = createDrawerNavigator();

function VolunteerDrawer({ navigation }) {
  const { userSession , isLeader} = useContext(AuthContext);
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
        name="Issues List"
        component={IssueListScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report" size={22} color={color} />
          ),
        }}
      />
        {/* <Drawer.Screen
        name="Manage Volunteers"
        component={VolunteerManagementScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report" size={22} color={color} />
          ),
        }}
      /> */}
      <Drawer.Screen
        name="Manage Volunteers"
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report" size={22} color={color} />
          ),
        }}
      >
      {(props) =>(
        <VolunteerManagementScreen
        {...props}
         isLeader= {isLeader} 
        />
      )}
      </Drawer.Screen>
      {isLeader && (
      <Drawer.Screen
        name="pending Leader Tasks"
        component={LeaderTaskScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report" size={22} color={color} />
          ),
        }}
      />
      )}
      {isLeader && (
      <Drawer.Screen
        name="Completed Leader Tasks"
        component={CompletedLeaderTasksScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="report" size={22} color={color} />
          ),
        }}
      />
      )}
       <Drawer.Screen
        name="assignSubtask"
        component={AssignSubTaskScreen}
        options={{
          drawerItemStyle : {display : 'none'},
        }}
      />
      <Drawer.Screen
        name="ViewAssignedSubTasksScreen"
        component={ViewAssignedSubTasksScreen}
        options={{
          drawerItemStyle : {display : 'none'},
        }}
      />
      <Drawer.Screen
        name="VolunteerSubTasksScreen"
        component={VolunteerSubTasksScreen}
        options={{
          drawerItemStyle : {display : 'none'},
        }}
      />
      <Drawer.Screen
        name="ReportTaskScreen"
        component={ReportTaskScreen}
        options={{
          drawerItemStyle : {display : 'none'},
        }}
      />
    

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
