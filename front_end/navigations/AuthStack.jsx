//navigations/AuthStack.jsx
import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Home from '../screens/Home';
import Login from "../screens/Login";
// import Home from '../../screens/generalUser/generalHome';
import SignUpForm from '../screens/SignUp';
const Stack = createStackNavigator();

const AuthStack = ()=>{
  return(
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home}/>
      <Stack.Screen name="Login" component={Login}  />
      <Stack.Screen name="SignUp" component={SignUpForm} />
    </Stack.Navigator>
    );
}
export default AuthStack;