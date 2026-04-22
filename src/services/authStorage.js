import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_SESSION_KEY = 'myloanbook_auth_session';

export const saveAuthSession = session =>
  AsyncStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));

export const getAuthSession = async () => {
  const storedSession = await AsyncStorage.getItem(AUTH_SESSION_KEY);

  return storedSession ? JSON.parse(storedSession) : null;
};

export const clearAuthSession = () => AsyncStorage.removeItem(AUTH_SESSION_KEY);
