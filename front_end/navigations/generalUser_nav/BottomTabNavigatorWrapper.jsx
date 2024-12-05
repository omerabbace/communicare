// // navigation/BottomTabNavigatorWrapper.js
// import React from "react";
// import { CommonActions } from "@react-navigation/native";
// import BottomTabNavigator from "./BottomTab"; // Import your BottomTabNavigator

// function BottomTabNavigatorWrapper({ route, navigation }) {
//   const initialScreen = route?.params?.screen || "Home";

//   React.useEffect(() => {
//     // Reset navigation to ensure the correct tab is active
//     navigation.dispatch(
//       CommonActions.reset({
//         index: 0,
//         routes: [{ name: initialScreen }],
//       })
//     );
//   }, [initialScreen, navigation]);

//   return <BottomTabNavigator initialScreen={initialScreen} />;
// }

// export default BottomTabNavigatorWrapper;

import React, { useEffect } from "react";
import { CommonActions } from "@react-navigation/native";
import BottomTabNavigator from "./BottomTab";

function BottomTabNavigatorWrapper({ initialScreen, setActiveScreen, navigation }) {
  useEffect(() => {
    if (navigation) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: initialScreen }],
        })
      );
    }
  }, [initialScreen, navigation]);

  return (
    <BottomTabNavigator
      initialScreen={initialScreen}
      setActiveScreen={setActiveScreen}
    />
  );
}

export default BottomTabNavigatorWrapper;
