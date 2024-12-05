// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import "react-native-gesture-handler";
// import { AuthProvider } from "./helpers/Auth";
// import Main from "./screens/Main";
// // import General_Auth from "./navigations/generalUser_nav/G_auth";

// export default function App() {
//   return (
//     <AuthProvider>
//       <NavigationContainer>
//         <Main></Main>
//       </NavigationContainer>
//     </AuthProvider>
//   );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import { AuthProvider } from "./helpers/Auth";
import NotificationProvider from "./helpers/NotificationsProvider";
import Main from "./screens/Main";
// import General_Auth from "./navigations/generalUser_nav/G_auth";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </NotificationProvider>
    </AuthProvider>
  );
}
