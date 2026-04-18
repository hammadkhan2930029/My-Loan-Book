import React, {useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AppNavigator} from './AppNavigator';
import {AuthNavigator} from './AuthNavigator';
import {AuthProvider} from './AuthContext';
import {navigationTheme} from './navigationTheme';
import {ROUTES} from './routeNames';
import {defaultStackScreenOptions} from './screenOptions';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authValue = useMemo(
    () => ({
      isAuthenticated,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
    }),
    [isAuthenticated],
  );

  return (
    <AuthProvider value={authValue}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={defaultStackScreenOptions}>
          {isAuthenticated ? (
            <Stack.Screen component={AppNavigator} name={ROUTES.APP_FLOW} />
          ) : (
            <Stack.Screen component={AuthNavigator} name={ROUTES.AUTH_FLOW} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
