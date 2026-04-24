import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  ChangePasswordScreen,
  ContactDetailScreen,
  EditProfileScreen,
  MyDetailsScreen,
  RecordRepaymentScreen,
  TransactionHistoryScreen,
} from '@/screens';

import {AppTabs} from './AppTabs';
import {ROUTES} from './routeNames';
import {defaultStackScreenOptions} from './screenOptions';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN_TABS}
      screenOptions={defaultStackScreenOptions}>
      <Stack.Screen component={AppTabs} name={ROUTES.MAIN_TABS} />
      <Stack.Screen component={MyDetailsScreen} name={ROUTES.MY_DETAILS} />
      <Stack.Screen component={EditProfileScreen} name={ROUTES.EDIT_PROFILE} />
      <Stack.Screen component={ChangePasswordScreen} name={ROUTES.CHANGE_PASSWORD} />
      <Stack.Screen component={TransactionHistoryScreen} name={ROUTES.TRANSACTION_HISTORY} />
      <Stack.Screen component={ContactDetailScreen} name={ROUTES.CONTACT_DETAIL} />
      <Stack.Screen component={RecordRepaymentScreen} name={ROUTES.RECORD_REPAYMENT} />
    </Stack.Navigator>
  );
};
