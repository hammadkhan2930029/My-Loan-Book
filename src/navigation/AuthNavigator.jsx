import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ForgotPasswordScreen,
  LoginScreen,
  RegisterScreen,
  ResetPasswordScreen,
  SplashScreen,
} from '@/screens';

import {ROUTES} from './routeNames';
import {defaultStackScreenOptions} from './screenOptions';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.SPLASH}
      screenOptions={defaultStackScreenOptions}>
      <Stack.Screen component={SplashScreen} name={ROUTES.SPLASH} />
      <Stack.Screen component={LoginScreen} name={ROUTES.LOGIN} />
      <Stack.Screen component={RegisterScreen} name={ROUTES.REGISTER} />
      <Stack.Screen component={ForgotPasswordScreen} name={ROUTES.FORGOT_PASSWORD} />
      <Stack.Screen component={ResetPasswordScreen} name={ROUTES.RESET_PASSWORD} />
    </Stack.Navigator>
  );
};
