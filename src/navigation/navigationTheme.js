import {DefaultTheme} from '@react-navigation/native';

export const navigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9442f1',
    background: '#f8f6fb',
    card: '#fffdfd',
    text: '#231933',
    border: '#e8def2',
    notification: '#e5e844',
  },
};
