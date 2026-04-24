import React, {useCallback, useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppAvatar} from '@/components/ui';
import {getUnreadNotificationCount} from '@/services/notificationApi';

import {useAuth} from './AuthContext';
import {ROUTES} from './routeNames';

const titleMap = {
  [ROUTES.APP_STACK]: 'Dashboard',
  [ROUTES.MAIN_TABS]: 'Dashboard',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.REPORTS]: 'Reports',
  [ROUTES.ADD_TRANSACTION]: 'Add Transaction',
  [ROUTES.MY_PEOPLE]: 'My People',
  [ROUTES.PROFILE]: 'Profile',
  [ROUTES.MY_DETAILS]: 'My Details',
  [ROUTES.EDIT_PROFILE]: 'Edit Profile',
  [ROUTES.CHANGE_PASSWORD]: 'Change Password',
  [ROUTES.NOTIFICATIONS]: 'Notifications',
  [ROUTES.TRANSACTION_HISTORY]: 'Transaction History',
  [ROUTES.CONTACT_DETAIL]: 'Contact Detail',
  [ROUTES.RECORD_REPAYMENT]: 'Record Repayment',
  [ROUTES.PRIVACY_POLICY]: 'Privacy Policy',
  [ROUTES.TERMS_AND_CONDITIONS]: 'Terms & Conditions',
  [ROUTES.DISCLAIMER]: 'Disclaimer',
  [ROUTES.DEVELOPER]: 'Developer',
};

const getDeepestRoute = route => {
  let activeRoute = route;

  while (activeRoute?.state?.routes?.length) {
    activeRoute = activeRoute.state.routes[activeRoute.state.index ?? 0];
  }

  return activeRoute;
};

const resolveUnreadCount = result => {
  if (typeof result?.count === 'number') {
    return result.count;
  }

  if (typeof result?.unreadCount === 'number') {
    return result.unreadCount;
  }

  if (typeof result?.data?.count === 'number') {
    return result.data.count;
  }

  if (typeof result?.data?.unreadCount === 'number') {
    return result.data.unreadCount;
  }

  return 0;
};

const getHeaderTitle = ({options, route}) => {
  const activeRoute = getDeepestRoute(route);
  const activeRouteName = activeRoute?.name;

  return (
    options?.title ||
    titleMap[activeRouteName] ||
    titleMap[route?.name] ||
    activeRouteName ||
    route?.name ||
    'MyLoanBook'
  );
};

export const AppShellHeader = ({navigation, options, route}) => {
  const {session} = useAuth();
  const profile = session?.user || {};
  const profileName = profile.fullName || 'MyLoanBook User';
  const headerTitle = getHeaderTitle({options, route});
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      const result = await getUnreadNotificationCount();
      setUnreadCount(resolveUnreadCount(result));
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUnreadCount();
    }, [loadUnreadCount, route?.key, route?.params?.notificationRefreshKey]),
  );

  return (
    <View className="bg-background px-5 pb-4 pt-3">
      <View className="rounded-[28px] border border-border bg-surface px-4 py-4 shadow-card">
        <View className="flex-row items-center justify-between gap-3">
          <Pressable
            className="h-11 w-11 items-center justify-center rounded-full bg-primary-500"
            hitSlop={8}
            onPress={() => navigation.openDrawer()}>
            <Ionicons color="#ffffff" name="menu" size={20} />
          </Pressable>

          <View className="flex-1 px-2">
            <Text
              className="text-center text-[17px] font-bold text-textPrimary"
              numberOfLines={1}>
              {headerTitle}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              className="relative h-11 w-11 items-center justify-center rounded-full bg-surfaceMuted"
              hitSlop={8}
              onPress={() =>
                navigation.navigate(ROUTES.APP_STACK, {
                  screen: ROUTES.NOTIFICATIONS,
                })
              }>
              <Ionicons color="#203049" name="notifications-outline" size={20} />
              {unreadCount ? (
                <View className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-accent-400 px-1 py-[1px]">
                  <Text className="text-center text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              ) : null}
            </Pressable>

            <Pressable
              hitSlop={8}
              onPress={() =>
                navigation.navigate(ROUTES.APP_STACK, {
                  screen: ROUTES.MAIN_TABS,
                  params: {
                    screen: ROUTES.PROFILE,
                  },
                })
              }>
              <AppAvatar
                className="border-2 border-white"
                imageUri={profile.profilePhoto}
                name={profileName}
                size="sm"
                variant="accent"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
