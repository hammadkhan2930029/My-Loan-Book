import './global.css';

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { toastConfig } from './src/components/ui';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#f6f8fb" barStyle="dark-content" />
      <RootNavigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

export default App;
