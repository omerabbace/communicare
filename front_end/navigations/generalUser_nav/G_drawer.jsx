import React, { useState, useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity , Platform } from "react-native";
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
import ReportVehicleIssueScreen from "../../screens/generalUser/ReportVehicleIssue";
import RequestDetailsScreen from "../../screens/generalUser/RequestVehicleDetails";
import RequestWaitingScreen from "../../screens/generalUser/RequestWaiting";
import ServiceProviderDetailsScreen from "../../screens/generalUser/ServiceProVehicleDetail";
import PaymentScreen from "../../screens/generalUser/VehiclePayment";
// import Notifications from "../../components/Notifications";
import Notifications, { NotificationContext } from "../../components/Notifications";
const Drawer = createDrawerNavigator();
function GeneralDrawer({ navigation }) {
  const { userSession } = useContext(AuthContext);
  const [fullName, setFullName] = useState(userSession.name);
  const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);
  const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  return (
    <NotificationContext.Provider value={{ setHasUnreadNotifications }}>
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawer {...props} profilePhoto={profilePhoto} fullName={fullName} />
      )}
      screenOptions={{
        headerTitle: "",
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
          fontFamily:fontFamily,
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
        name="Notifications"
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons
              name={
                hasUnreadNotifications
                  ? "notifications"
                  : "notifications-outline"
              }
              size={22}
              color={color}
            />
          ),
        }}
      >
        {(props) => (
          <Notifications
            {...props}
            setHasUnreadNotifications={setHasUnreadNotifications}
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
        component={ReportVehicleIssueScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
       <Drawer.Screen
        name="RequestVehcileDetails"
        component={RequestDetailsScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="RequestWaiting"
        component={RequestWaitingScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="ServiceProviderDetails"
        component={ServiceProviderDetailsScreen}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
      <Drawer.Screen
        name="VehiclePayment"
        component={PaymentScreen}
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
    </NotificationContext.Provider>
  );
  
}

export default GeneralDrawer;




// import React, { useState, useContext } from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { View, Platform } from "react-native";
// import UserHome from "../../screens/generalUser/UserHome";
// import Profile from "../../screens/generalUser/Profile";
// import CustomDrawer from "../../components/CustomDrawer";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import IssueReport from "../../screens/generalUser/IssueReport";
// import DonationScreen from "../../screens/generalUser/DonationScreen";
// import ProjectDetailScreen from "../../screens/generalUser/ProjectDetailScreen";
// import StripePaymentScreen from "../../screens/generalUser/StripePaymentScreen";
// import DonationConfirmationScreen from "../../screens/generalUser/DonationConfirmationScreen";
// import { MaterialIcons } from "@expo/vector-icons";
// import { AuthContext } from "../../helpers/Auth";
// import PollDetail from "../../components/PollDetail";
// import PollList from "../../components/PollList";
// import Forum from "../../components/Forum";
// import { issueCategories } from "../../components/issues"; 
// import ForumDiscussion from "../../components/ForumDiscussion";
// import ReportAccident from "../../components/ReportAccident";
// import VehicleAssistance from "../../components/VehicleAssistance";
// import TrackServiceProvider from "../../components/TrackServiceProvider";
// import UserReportedIssuesScreen from "../../screens/generalUser/ReportedIssues";
// import ReportVehicleIssueScreen from "../../screens/generalUser/ReportVehicleIssue";
// import RequestDetailsScreen from "../../screens/generalUser/RequestVehicleDetails";
// import RequestWaitingScreen from "../../screens/generalUser/RequestWaiting";
// import ServiceProviderDetailsScreen from "../../screens/generalUser/ServiceProVehicleDetail";
// import PaymentScreen from "../../screens/generalUser/VehiclePayment";
// import BottomTabNavigator from "./BottomTab";
// // import BottomTabNavigatorWrapper from "./BottomTabNavigatorWrapper"; // Adjust the path as needed
// import { CommonActions } from "@react-navigation/native";

// // const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();


// function GeneralDrawer({ navigation }) {
//   const { userSession } = useContext(AuthContext);
//   const [fullName, setFullName] = useState(userSession.name);
//   const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);
//   const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
  

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => (
//         <CustomDrawer {...props} profilePhoto={profilePhoto} fullName={fullName} />
//       )}
//       screenOptions={{
//         headerTitle: "",
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontSize: 15,
//           fontFamily:fontFamily,
//         },
//         drawerActiveBackgroundColor: "#aa18ea",
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#333",
//       }}
//     >
//   {/* Bottom Tab Navigator */}
//   {/* <Drawer.Screen
//         name="MainTabs"
//         component={BottomTabNavigatorWrapper}
//         options={{
//           drawerLabel: "Home",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="grid-outline" size={22} color={color} />
//           ),
//         }}
//       /> */}
//       {/* <Drawer.Screen
//         name="Home"
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <UserHome {...props} fullName={fullName} />}
//       </Drawer.Screen> */}
//       {/* <Drawer.Screen
//         name="Home"
//         component={BottomTabNavigatorWrapper}
//         options={{
//           drawerLabel: "Home",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//         initialParams={{ screen: "Home" }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={BottomTabNavigatorWrapper}
//         options={{
//           drawerLabel: "Profile",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//         initialParams={{ screen: "Profile" }}
//       />
//       <Drawer.Screen
//         name="Donate"
//         component={BottomTabNavigatorWrapper}
//         options={{
//           drawerLabel: "Donate",
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="volunteer-activism" size={22} color={color} />
//           ),
//         }}
//         initialParams={{ screen: "Donate" }}
//       />
//       <Drawer.Screen
//         name="Notifications"
//         component={BottomTabNavigatorWrapper}
//         options={{
//           drawerLabel: "Notifications",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="notifications-outline" size={22} color={color} />
//           ),
//         }}
//         initialParams={{ screen: "Notifications" }}
//       /> */}

// <Drawer.Screen
//   name="Home"
//   options={{
//     drawerLabel: "Home",
//     drawerIcon: ({ color }) => (
//       <Ionicons name="home-outline" size={22} color={color} />
//     ),
//   }}
// >
//   {({ navigation }) => (
//     <BottomTabNavigatorWrapper
//       route={{ params: { screen: "Home" } }}
//       navigation={navigation}
//     />
//   )}
// </Drawer.Screen>
// <Drawer.Screen
//   name="Profile"
//   options={{
//     drawerLabel: "Profile",
//     drawerIcon: ({ color }) => (
//       <Ionicons name="person-outline" size={22} color={color} />
//     ),
//   }}
// >
//   {({ navigation }) => (
//     <BottomTabNavigatorWrapper
//       route={{ params: { screen: "Profile" } }}
//       navigation={navigation}
//     />
//   )}
// </Drawer.Screen>
// <Drawer.Screen
//   name="Donate"
//   options={{
//     drawerLabel: "Donate",
//     drawerIcon: ({ color }) => (
//       <MaterialIcons name="volunteer-activism" size={22} color={color} />
//     ),
//   }}
// >
//   {({ navigation }) => (
//     <BottomTabNavigatorWrapper
//       route={{ params: { screen: "Donate" } }}
//       navigation={navigation}
//     />
//   )}
// </Drawer.Screen>
// <Drawer.Screen
//   name="Notifications"
//   options={{
//     drawerLabel: "Notifications",
//     drawerIcon: ({ color }) => (
//       <Ionicons name="notifications-outline" size={22} color={color} />
//     ),
//   }}
// >
//   {({ navigation }) => (
//     <BottomTabNavigatorWrapper
//       route={{ params: { screen: "Notifications" } }}
//       navigation={navigation}
//     />
//   )}
// </Drawer.Screen>



//       {/* <Drawer.Screen
//         name="Profile"
//         options={{
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//         listeners={({ navigation }) => ({
//           drawerItemPress: () => navigation.navigate("MainTabs", { screen: "Profile" }),
//         })}
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
//       </Drawer.Screen> */}
//       <Drawer.Screen
//         name="Report an Issue"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="report-problem" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <IssueReport {...props} issueCategories={issueCategories} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="Track Report"
//         component={UserReportedIssuesScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="arrow-forward" size={22} color={color} />
//           ),
//         }}
//       />
//       {/* <Drawer.Screen
//         name="Donate"
//         component={DonationScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="volunteer-activism" size={22} color={color} />
//           ),
//         }}
//         listeners={({ navigation }) => ({
//           drawerItemPress: () => navigation.navigate("MainTabs", { screen: "Donate" }),
//         })}
//       /> */}
//       <Drawer.Screen
//         name="ProjectDetailScreen"
//         component={ProjectDetailScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="StripePaymentScreen"
//         component={StripePaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="DonationConfirmationScreen"
//         component={DonationConfirmationScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Voting and Polling"
//         component={PollList}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="poll" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="PollDetail"
//         component={PollDetail}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Report an Accident"
//         component={ReportAccident}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Vehicle Assistance"
//         component={ReportVehicleIssueScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//        <Drawer.Screen
//         name="RequestVehcileDetails"
//         component={RequestDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="RequestWaiting"
//         component={RequestWaitingScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="ServiceProviderDetails"
//         component={ServiceProviderDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="VehiclePayment"
//         component={PaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Discussion Forums"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="forum" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <Forum {...props} categories={issueCategories} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="ForumDiscussion"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => (
//           <ForumDiscussion 
//             {...props} 
//             profilePhoto={profilePhoto} 
//             fullName={fullName}
//           />
//         )}
//       </Drawer.Screen>
//       {/* Services Submenu */}
//       <Drawer.Screen
//         name="ServicesSubMenu"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => <ServicesSubMenu {...props} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="TrackServiceProvider"
//         component={TrackServiceProvider}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// // function BottomTabNavigatorWrapper({ route }) {
// //   const initialScreen = route?.params?.screen || "Home";

// //   return <BottomTabNavigator initialScreen={initialScreen} />;
// // }
// function BottomTabNavigatorWrapper({ route, navigation }) {
//   const initialScreen = route?.params?.screen || "Home";

//   React.useEffect(() => {
//     // Navigate to the correct tab
//     navigation.navigate(initialScreen);
//   }, [initialScreen, navigation]);

//   return <BottomTabNavigator initialScreen={initialScreen} />;
// }



// export default GeneralDrawer;



// import React, { useState, useContext } from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { View, Platform } from "react-native";
// import UserHome from "../../screens/generalUser/UserHome";
// import Profile from "../../screens/generalUser/Profile";
// import CustomDrawer from "../../components/CustomDrawer";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import IssueReport from "../../screens/generalUser/IssueReport";
// import DonationScreen from "../../screens/generalUser/DonationScreen";
// import ProjectDetailScreen from "../../screens/generalUser/ProjectDetailScreen";
// import StripePaymentScreen from "../../screens/generalUser/StripePaymentScreen";
// import DonationConfirmationScreen from "../../screens/generalUser/DonationConfirmationScreen";
// import { MaterialIcons } from "@expo/vector-icons";
// import { AuthContext } from "../../helpers/Auth";
// import PollDetail from "../../components/PollDetail";
// import PollList from "../../components/PollList";
// import Forum from "../../components/Forum";
// import { issueCategories } from "../../components/issues"; 
// import ForumDiscussion from "../../components/ForumDiscussion";
// import ReportAccident from "../../components/ReportAccident";
// import VehicleAssistance from "../../components/VehicleAssistance";
// import TrackServiceProvider from "../../components/TrackServiceProvider";
// import UserReportedIssuesScreen from "../../screens/generalUser/ReportedIssues";
// import ReportVehicleIssueScreen from "../../screens/generalUser/ReportVehicleIssue";
// import RequestDetailsScreen from "../../screens/generalUser/RequestVehicleDetails";
// import RequestWaitingScreen from "../../screens/generalUser/RequestWaiting";
// import ServiceProviderDetailsScreen from "../../screens/generalUser/ServiceProVehicleDetail";
// import PaymentScreen from "../../screens/generalUser/VehiclePayment";
// import BottomTabNavigator from "./BottomTab";
// import BottomTabNavigatorWrapper from "./BottomTabNavigatorWrapper"; // Adjust the path as needed
// import { CommonActions } from "@react-navigation/native";


// // const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();


// function GeneralDrawer({ navigation }) {
//   const { userSession } = useContext(AuthContext);
//   const [fullName, setFullName] = useState(userSession.name);
//   const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);
//   const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
  
//   const [activeScreen, setActiveScreen] = useState("Home");

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => (
//         <CustomDrawer {...props} profilePhoto={profilePhoto} fullName={fullName}  activeScreen={activeScreen} setActiveScreen={setActiveScreen}/>
//       )}
//       screenOptions={{
//         headerTitle: "",
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontSize: 15,
//           fontFamily:fontFamily,
//         },
//         drawerActiveBackgroundColor: "#aa18ea",
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#333",
//       }}
//     >
//    <Drawer.Screen
//         name="Home"
//         options={{
//           drawerLabel: "Home",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="home-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {() => (
//           <BottomTabNavigatorWrapper
//             initialScreen="Home"
//             setActiveScreen={setActiveScreen}
//           />
//         )}
//       </Drawer.Screen>

//       {/* Profile Screen */}
//       <Drawer.Screen
//         name="Profile"
//         options={{
//           drawerLabel: "Profile",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {() => (
//           <BottomTabNavigatorWrapper
//             initialScreen="Profile"
//             setActiveScreen={setActiveScreen}
//           />
//         )}
//       </Drawer.Screen>

//       {/* Donate Screen */}
//       <Drawer.Screen
//         name="Donate"
//         options={{
//           drawerLabel: "Donate",
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="volunteer-activism" size={22} color={color} />
//           ),
//         }}
//       >
//         {() => (
//           <BottomTabNavigatorWrapper
//             initialScreen="Donate"
//             setActiveScreen={setActiveScreen}
//           />
//         )}
//       </Drawer.Screen>

//       {/* Notifications Screen */}
//       <Drawer.Screen
//         name="Notifications"
//         options={{
//           drawerLabel: "Notifications",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="notifications-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {() => (
//           <BottomTabNavigatorWrapper
//             initialScreen="Notifications"
//             setActiveScreen={setActiveScreen}
//           />
//         )}
//       </Drawer.Screen>

//       <Drawer.Screen
//         name="Report an Issue"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="report-problem" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <IssueReport {...props} issueCategories={issueCategories} setActiveScreen={setActiveScreen} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="Track Report"
//         component={UserReportedIssuesScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="arrow-forward" size={22} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="ProjectDetailScreen"
//         component={ProjectDetailScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="StripePaymentScreen"
//         component={StripePaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="DonationConfirmationScreen"
//         component={DonationConfirmationScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Voting and Polling"
//         component={PollList}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="poll" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="PollDetail"
//         component={PollDetail}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Report an Accident"
//         component={ReportAccident}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Vehicle Assistance"
//         component={ReportVehicleIssueScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//        <Drawer.Screen
//         name="RequestVehcileDetails"
//         component={RequestDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="RequestWaiting"
//         component={RequestWaitingScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="ServiceProviderDetails"
//         component={ServiceProviderDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="VehiclePayment"
//         component={PaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Discussion Forums"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="forum" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <Forum {...props} categories={issueCategories} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="ForumDiscussion"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => (
//           <ForumDiscussion 
//             {...props} 
//             profilePhoto={profilePhoto} 
//             fullName={fullName}
//           />
//         )}
//       </Drawer.Screen>
//       {/* Services Submenu */}
//       <Drawer.Screen
//         name="ServicesSubMenu"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => <ServicesSubMenu {...props} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="TrackServiceProvider"
//         component={TrackServiceProvider}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// // function BottomTabNavigatorWrapper({ initialScreen, setActiveScreen }) {
// //   return (
// //     <BottomTabNavigator
// //       initialScreen={initialScreen}
// //       setActiveScreen={setActiveScreen}
// //     />
// //   );
// // }


// export default GeneralDrawer;


// import React, { useState, useContext } from "react";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { View, Platform } from "react-native";
// import UserHome from "../../screens/generalUser/UserHome";
// import Profile from "../../screens/generalUser/Profile";
// import CustomDrawer from "../../components/CustomDrawer";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import IssueReport from "../../screens/generalUser/IssueReport";
// import DonationScreen from "../../screens/generalUser/DonationScreen";
// import ProjectDetailScreen from "../../screens/generalUser/ProjectDetailScreen";
// import StripePaymentScreen from "../../screens/generalUser/StripePaymentScreen";
// import DonationConfirmationScreen from "../../screens/generalUser/DonationConfirmationScreen";
// import { MaterialIcons } from "@expo/vector-icons";
// import { AuthContext } from "../../helpers/Auth";
// import PollDetail from "../../components/PollDetail";
// import PollList from "../../components/PollList";
// import Forum from "../../components/Forum";
// import { issueCategories } from "../../components/issues"; 
// import ForumDiscussion from "../../components/ForumDiscussion";
// import ReportAccident from "../../components/ReportAccident";
// import VehicleAssistance from "../../components/VehicleAssistance";
// import TrackServiceProvider from "../../components/TrackServiceProvider";
// import UserReportedIssuesScreen from "../../screens/generalUser/ReportedIssues";
// import ReportVehicleIssueScreen from "../../screens/generalUser/ReportVehicleIssue";
// import RequestDetailsScreen from "../../screens/generalUser/RequestVehicleDetails";
// import RequestWaitingScreen from "../../screens/generalUser/RequestWaiting";
// import ServiceProviderDetailsScreen from "../../screens/generalUser/ServiceProVehicleDetail";
// import PaymentScreen from "../../screens/generalUser/VehiclePayment";
// import BottomTabNavigator from "./BottomTab";
// import BottomTabNavigatorWrapper from "./BottomTabNavigatorWrapper"; // Adjust the path as needed
// import { CommonActions } from "@react-navigation/native";


// // const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();


// function GeneralDrawer({ navigation }) {
//   const { userSession } = useContext(AuthContext);
//   const [fullName, setFullName] = useState(userSession.name);
//   const [profilePhoto, setProfilePhoto] = useState(userSession.profilePhoto);
//   const fontFamily = Platform.OS === "ios" ? "Arial" : "Roboto";
  
//   const [activeScreen, setActiveScreen] = useState("Home");

//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => (
//         <CustomDrawer {...props} profilePhoto={profilePhoto} fullName={fullName}  activeScreen={activeScreen} setActiveScreen={setActiveScreen}/>
//       )}
//       screenOptions={{
//         headerTitle: "",
//         drawerLabelStyle: {
//           marginLeft: -25,
//           fontSize: 15,
//           fontFamily:fontFamily,
//         },
//         drawerActiveBackgroundColor: "#aa18ea",
//         drawerActiveTintColor: "#fff",
//         drawerInactiveTintColor: "#333",
//       }}
//     >
      




//  {/* Embed Bottom Tab Navigator as a screen */}
//  <Drawer.Screen
//     name="Home"
//     options={{
//       drawerLabel: "Home",
//       drawerIcon: ({ color }) => (
//         <Ionicons name="home-outline" size={22} color={color} />
//       ),
//     }}
//     component={BottomTabNavigatorWrapper}
//   />
  
//       {/* Profile Screen */}
//       <Drawer.Screen
//         name="Profile"
//         options={{
//           drawerLabel: "Profile",
//           drawerIcon: ({ color }) => (
//             <Ionicons name="person-outline" size={22} color={color} />
//           ),
//         }}
//       >
//         {() => (
//           <BottomTabNavigatorWrapper
//             initialScreen="Profile"
//             setActiveScreen={setActiveScreen}
//           />
//         )}
//       </Drawer.Screen>


//   {/* Other Drawer Screens */}
//   <Drawer.Screen
//     name="Donate"
//     options={{
//       drawerLabel: "Donate",
//       drawerIcon: ({ color }) => (
//         <MaterialIcons name="volunteer-activism" size={22} color={color} />
//       ),
//     }}
//   >
//     {() => <BottomTabNavigatorWrapper initialScreen="Donate" setActiveScreen={setActiveScreen} />}
//   </Drawer.Screen>

//   {/* Notifications */}
//   <Drawer.Screen
//     name="Notifications"
//     options={{
//       drawerLabel: "Notifications",
//       drawerIcon: ({ color }) => (
//         <Ionicons name="notifications-outline" size={22} color={color} />
//       ),
//     }}
//   >
//     {() => <BottomTabNavigatorWrapper initialScreen="Notifications" setActiveScreen={setActiveScreen} />}
//   </Drawer.Screen>

      

//       <Drawer.Screen
//         name="Report an Issue"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="report-problem" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <IssueReport {...props} issueCategories={issueCategories} setActiveScreen={setActiveScreen} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="Track Report"
//         component={UserReportedIssuesScreen}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="arrow-forward" size={22} color={color} />
//           ),
//         }}
//       />

//       <Drawer.Screen
//         name="ProjectDetailScreen"
//         component={ProjectDetailScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="StripePaymentScreen"
//         component={StripePaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="DonationConfirmationScreen"
//         component={DonationConfirmationScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Voting and Polling"
//         component={PollList}
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="poll" size={22} color={color} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="PollDetail"
//         component={PollDetail}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Report an Accident"
//         component={ReportAccident}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Vehicle Assistance"
//         component={ReportVehicleIssueScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//        <Drawer.Screen
//         name="RequestVehcileDetails"
//         component={RequestDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="RequestWaiting"
//         component={RequestWaitingScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="ServiceProviderDetails"
//         component={ServiceProviderDetailsScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="VehiclePayment"
//         component={PaymentScreen}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//       <Drawer.Screen
//         name="Discussion Forums"
//         options={{
//           drawerIcon: ({ color }) => (
//             <MaterialIcons name="forum" size={22} color={color} />
//           ),
//         }}
//       >
//         {(props) => <Forum {...props} categories={issueCategories} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="ForumDiscussion"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => (
//           <ForumDiscussion 
//             {...props} 
//             profilePhoto={profilePhoto} 
//             fullName={fullName}
//           />
//         )}
//       </Drawer.Screen>
//       {/* Services Submenu */}
//       <Drawer.Screen
//         name="ServicesSubMenu"
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       >
//         {(props) => <ServicesSubMenu {...props} />}
//       </Drawer.Screen>
//       <Drawer.Screen
//         name="TrackServiceProvider"
//         component={TrackServiceProvider}
//         options={{
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//     </Drawer.Navigator>
//   );
// }

// // function BottomTabNavigatorWrapper({ initialScreen, setActiveScreen }) {
// //   return (
// //     <BottomTabNavigator
// //       initialScreen={initialScreen}
// //       setActiveScreen={setActiveScreen}
// //     />
// //   );
// // }


// export default GeneralDrawer;

