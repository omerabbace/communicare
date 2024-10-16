import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// import ViewReportedAccidents from "../../screens/Service_provider/ReportedAccident";
import Logout from "../../screens/generalUser/Logout";
import ServiceProviderDrawer from "./serviceProvideDrawer";
const Stack = createStackNavigator();

const ServiceProvider_Auth = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ServiceProviderHome" component={ServiceProviderDrawer} />
      <Stack.Screen name="Logout" component={Logout} />
    </Stack.Navigator>
  );
};

export default ServiceProvider_Auth;
