import {createContext, useContext} from 'react';

const AuthContext = createContext({
  isAuthLoading: true,
  isAuthenticated: false,
  session: null,
  signIn: () => {},
  signOut: () => {},
});

export const AuthProvider = AuthContext.Provider;

export const useAuth = () => useContext(AuthContext);
