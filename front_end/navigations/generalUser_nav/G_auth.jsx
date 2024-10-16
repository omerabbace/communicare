import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GeneralDrawer from "./G_drawer";
import Logout from "../../screens/generalUser/Logout";
import UserHome from "../../screens/generalUser/UserHome";

const Stack = createStackNavigator();

const GeneralUser_Auth = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserHome" component={GeneralDrawer} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  );
};

export default GeneralUser_Auth;
