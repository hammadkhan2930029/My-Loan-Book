import './global.css';

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { toastConfig } from './src/components/ui';
import { RootNavigator } from './src/navigation/RootNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

export default App;
