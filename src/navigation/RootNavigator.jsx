import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {AppLoader} from '@/components/ui';
import {clearAuthSession, getAuthSession, saveAuthSession} from '@/services/authStorage';

import {AuthNavigator} from './AuthNavigator';
import {AuthProvider} from './AuthContext';
import {DrawerNavigator} from './DrawerNavigator';
import {navigationTheme} from './navigationTheme';
import {ROUTES} from './routeNames';
import {defaultStackScreenOptions} from './screenOptions';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const [session, setSession] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const isAuthenticated = Boolean(session);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedSession = await getAuthSession();
        setSession(savedSession);
      } finally {
        setIsAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = useCallback(async nextSession => {
    const sessionToSave = nextSession || {authenticated: true};

    await saveAuthSession(sessionToSave);
    setSession(sessionToSave);
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthSession();
    setSession(null);
  }, []);

  const authValue = useMemo(
    () => ({
      isAuthLoading,
      isAuthenticated,
      session,
      signIn,
      signOut,
    }),
    [isAuthLoading, isAuthenticated, session, signIn, signOut],
  );

  if (isAuthLoading) {
    return <AppLoader fullscreen label="Loading session..." />;
  }

  return (
    <AuthProvider value={authValue}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator screenOptions={defaultStackScreenOptions}>
          {isAuthenticated ? (
            <Stack.Screen component={DrawerNavigator} name={ROUTES.APP_FLOW} />
          ) : (
            <Stack.Screen component={AuthNavigator} name={ROUTES.AUTH_FLOW} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};
