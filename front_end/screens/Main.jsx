import React, { useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import store from "../store";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StripeProvider } from '@stripe/stripe-react-native';

// AuthContext
import { AuthContext } from '../helpers/Auth';

// Importing screen Stacks
import GeneralUser_Auth from '../navigations/generalUser_nav/G_auth';
import ServiceProvider_Auth from '../navigations/serviceProvider/ServiceProvider_Auth';
import Volunteer_Auth from '../navigations/volunteer/Volunteer_Auth';
import AuthStack from '../navigations/AuthStack';

// Stripe Publishable Key
import { STRIPE_PUBLISHABLE_KEY } from '../config';

export default function Main() {
  const { userSession } = useContext(AuthContext);
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    // This effect will trigger whenever `userSession` changes
  }, [userSession]);

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <Stack.Navigator initialRouteName='authStack' screenOptions={{ headerShown: false }}>
          {userSession ? (
            // Navigate based on user role
            userSession.role === "normal" ? (
              <Stack.Screen name='generalUserAuthStack' component={GeneralUser_Auth} />
            ) : userSession.role === "volunteer" ? (
              <Stack.Screen name='volunteerAuthStack' component={Volunteer_Auth} />
            ) : userSession.role === "serviceProvider" ? (
              <Stack.Screen name='serviceProviderAuthStack' component={ServiceProvider_Auth} />
            ) : (
              // Fallback for unexpected roles
              <Stack.Screen name='authStack' component={AuthStack} />
            )
          ) : (
            <Stack.Screen name='authStack' component={AuthStack} />
          )}
        </Stack.Navigator>
      </StripeProvider>
    </Provider>
  );
}
