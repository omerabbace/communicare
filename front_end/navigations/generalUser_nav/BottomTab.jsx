import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import UserHome from "../../screens/generalUser/UserHome";
import Profile from "../../screens/generalUser/Profile";
import IssueReport from "../../screens/generalUser/IssueReport";
import DonationScreen from "../../screens/generalUser/DonationScreen";
import PollList from "../../components/PollList";
import Forum from "../../components/Forum";
import Notifications from "../../components/Notifications";
const Tab = createBottomTabNavigator();

// function BottomTabNavigator() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName;

//           // Assign icon names based on route names
//           if (route.name === "Home") {
//             iconName = "home-outline";
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === "Profile") {
//             iconName = "person-outline";
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === "Report Issue") {
//             iconName = "clipboard-outline"; // Ionicons clipboard icon
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === "Donate") {
//             iconName = "volunteer-activism"; // MaterialIcons
//             return <MaterialIcons name={iconName} size={size} color={color} />;
//           } else if (route.name === "Polls") {
//             iconName = "bar-chart-outline"; // Ionicons bar chart icon
//             return <Ionicons name={iconName} size={size} color={color} />;
//           } else if (route.name === "Forum") {
//             iconName = "chatbubble-outline"; // Ionicons chat icon
//             return <Ionicons name={iconName} size={size} color={color} />;
//           }
//         },
//         tabBarActiveTintColor: "#aa18ea",
//         tabBarInactiveTintColor: "#333",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={UserHome} />
//       <Tab.Screen name="Profile" component={Profile} />
//       <Tab.Screen name="Donate" component={DonationScreen} />
//       <Tab.Screen name="Polls" component={PollList} />
//       <Tab.Screen name="Forum" component={Forum} />
//     </Tab.Navigator>
//   );
// }

// export default BottomTabNavigator;
// function BottomTabNavigator({ route }) {
//     return (
//       <Tab.Navigator
//         initialRouteName={route?.params?.screen || "Home"}
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color, size }) => {
//             let iconName;
  
//             if (route.name === "Home") {
//               iconName = "home-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Profile") {
//               iconName = "person-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Report Issue") {
//               iconName = "clipboard-outline"; // Ionicons clipboard icon
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Donate") {
//               iconName = "volunteer-activism";
//               return <MaterialIcons name={iconName} size={size} color={color} />;
//             }
//           },
//           tabBarActiveTintColor: "#aa18ea",
//           tabBarInactiveTintColor: "#333",
//           headerShown: false,
//         })}
//       >
//         <Tab.Screen name="Home" component={UserHome} />
//         <Tab.Screen name="Profile" component={Profile} />
//         <Tab.Screen name="Donate" component={DonationScreen} />
//       </Tab.Navigator>
//     );
//   }
  
//   export default BottomTabNavigator;
  

// function BottomTabNavigator({ initialScreen = "Home" }) {
//     return (
//       <Tab.Navigator
//         initialRouteName={initialScreen}
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color, size }) => {
//             let iconName;
  
//             if (route.name === "Home") {
//               iconName = "home-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Profile") {
//               iconName = "person-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Donate") {
//               iconName = "volunteer-activism";
//               return <MaterialIcons name={iconName} size={size} color={color} />;
//             }
//           },
//           tabBarActiveTintColor: "#aa18ea",
//           tabBarInactiveTintColor: "#333",
//           headerShown: false,
//         })}
//       >
//         <Tab.Screen name="Home" component={UserHome} />
//         <Tab.Screen name="Profile" component={Profile} />
//         <Tab.Screen name="Donate" component={DonationScreen} />
//         <Tab.Screen name="Notifications" component={Notifications} />
//       </Tab.Navigator>
//     );
//   }
  
//   export default BottomTabNavigator;
  

// function BottomTabNavigator({ initialScreen = "Home", setActiveScreen }) {
//     return (
//       <Tab.Navigator
//         initialRouteName={initialScreen}
//         screenOptions={({ route }) => ({
//           tabBarIcon: ({ color, size }) => {
//             let iconName;
  
//             if (route.name === "Home") {
//               iconName = "home-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Profile") {
//               iconName = "person-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Donate") {
//               iconName = "volunteer-activism";
//               return <MaterialIcons name={iconName} size={size} color={color} />;
//             } else if (route.name === "Notifications") {
//               iconName = "notifications-outline";
//               return <Ionicons name={iconName} size={size} color={color} />;
//             }
//           },
//           tabBarActiveTintColor: "#aa18ea",
//           tabBarInactiveTintColor: "#333",
//           headerShown: false,
//         })}
//         screenListeners={{
//           state: (e) => {
//             const currentRoute = e.data.state.routes[e.data.state.index].name;
//             setActiveScreen && setActiveScreen(currentRoute);
//           },
//         }}
//       >
//         <Tab.Screen name="Home" component={UserHome} />
//         <Tab.Screen name="Profile" component={Profile} />
//         <Tab.Screen name="Donate" component={DonationScreen} />
//         <Tab.Screen name="Notifications" component={Notifications} />
//       </Tab.Navigator>
//     );
//   }
  
//   export default BottomTabNavigator;


function BottomTabNavigator({ initialScreen = "Home", setActiveScreen }) {
  return (
    <Tab.Navigator
      initialRouteName={initialScreen}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Profile") {
            iconName = "person-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          } else if (route.name === "Donate") {
            iconName = "volunteer-activism";
            return <MaterialIcons name={iconName} size={size} color={color} />;
          } else if (route.name === "Notifications") {
            iconName = "notifications-outline";
            return <Ionicons name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#aa18ea",
        tabBarInactiveTintColor: "#333",
        headerShown: false,
      })}
      screenListeners={{
        state: (e) => {
          const currentRoute = e.data.state.routes[e.data.state.index].name;
          setActiveScreen && setActiveScreen(currentRoute); // Update active screen
        },
      }}
    >
      <Tab.Screen name="Home" component={UserHome} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Donate" component={DonationScreen} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
