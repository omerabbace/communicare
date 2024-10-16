import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import ViewReportedAccidents from "../../screens/Service_provider/ReportedAccident";
import Logout from "../../screens/generalUser/Logout";
import VolunteerDrawer from "./VolunteerDrawer";
const Stack = createStackNavigator();

const Volunteer_Auth = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VolunteerHome" component={VolunteerDrawer} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  );
};

export default Volunteer_Auth;
