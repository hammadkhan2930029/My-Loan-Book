import {DefaultTheme} from '@react-navigation/native';

export const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#203049',
    background: '#f6f8fb',
    card: '#ffffff',
    text: '#203049',
    border: '#dce3ea',
    notification: '#EC7418',
  },
};
