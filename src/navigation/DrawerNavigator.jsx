import React, {useMemo} from 'react';
import {Pressable, Text, View} from 'react-native';
import {DrawerContentScrollView, createDrawerNavigator} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppAvatar} from '@/components/ui';
import {
  DeveloperScreen,
  DisclaimerScreen,
  PrivacyPolicyScreen,
  TermsAndConditionsScreen,
} from '@/screens';

import {AppShellHeader} from './AppShellHeader';
import {useAuth} from './AuthContext';
import {AppNavigator} from './AppNavigator';
import {ROUTES} from './routeNames';

const Drawer = createDrawerNavigator();

const drawerMenuItems = [
  {
    id: ROUTES.DASHBOARD,
    label: 'Dashboard',
    icon: 'home-outline',
    type: 'tab',
    target: ROUTES.DASHBOARD,
  },
  {
    id: ROUTES.REPORTS,
    label: 'Reports',
    icon: 'stats-chart-outline',
    type: 'tab',
    target: ROUTES.REPORTS,
  },
  {
    id: ROUTES.ADD_TRANSACTION,
    label: 'Add Transaction',
    icon: 'add-circle-outline',
    type: 'tab',
    target: ROUTES.ADD_TRANSACTION,
  },
  {
    id: ROUTES.MY_PEOPLE,
    label: 'My People',
    icon: 'people-outline',
    type: 'tab',
    target: ROUTES.MY_PEOPLE,
  },
  {
    id: ROUTES.PROFILE,
    label: 'Profile',
    icon: 'person-outline',
    type: 'tab',
    target: ROUTES.PROFILE,
  },
  {
    id: ROUTES.PRIVACY_POLICY,
    label: 'Privacy Policy',
    icon: 'shield-checkmark-outline',
    type: 'screen',
    target: ROUTES.PRIVACY_POLICY,
  },
  {
    id: ROUTES.TERMS_AND_CONDITIONS,
    label: 'Terms & Conditions',
    icon: 'document-text-outline',
    type: 'screen',
    target: ROUTES.TERMS_AND_CONDITIONS,
  },
  {
    id: ROUTES.DISCLAIMER,
    label: 'Disclaimer',
    icon: 'warning-outline',
    type: 'screen',
    target: ROUTES.DISCLAIMER,
  },
  {
    id: ROUTES.DEVELOPER,
    label: 'Developer',
    icon: 'code-slash-outline',
    type: 'screen',
    target: ROUTES.DEVELOPER,
  },
];

const getActiveRouteName = state => {
  if (!state?.routes?.length) {
    return '';
  }

  const route = state.routes[state.index ?? 0];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name || '';
};

const AppDrawerContent = props => {
  const {navigation, state} = props;
  const {session} = useAuth();
  const profile = session?.user || {};
  const profileName = profile.fullName || 'MyLoanBook User';
  const activeRouteName = getActiveRouteName(state);
  const profileMeta = profile.email || profile.phone || 'No account info';

  const handleNavigate = item => {
    if (item.type === 'tab') {
      navigation.navigate(ROUTES.APP_STACK, {
        screen: ROUTES.MAIN_TABS,
        params: {
          screen: item.target,
        },
      });
    } else {
      navigation.navigate(item.target);
    }

    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{paddingBottom: 24}}
      showsVerticalScrollIndicator={false}>
      <View className="px-4 pt-2">
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <View className="flex-row items-center gap-4">
            <AppAvatar
              className="border-2 border-white/20"
              imageUri={profile.profilePhoto}
              name={profileName}
              size="lg"
              variant="accent"
            />
            <View className="flex-1">
              <Text className="text-[12px] font-bold uppercase tracking-[1px] text-white/90">
                Account
              </Text>
              <Text className="mt-1 text-[18px] font-bold leading-6 text-white">
                {profileName}
              </Text>
              <Text className="mt-1 text-[13px] leading-5 font-medium text-white/90">
                {profileMeta}
              </Text>
            </View>
          </View>
          <Pressable
            className="mt-4 flex-row items-center justify-between rounded-[22px] bg-white/12 px-4 py-3"
            hitSlop={6}
            onPress={() => {
              navigation.navigate(ROUTES.APP_STACK, {
                screen: ROUTES.MAIN_TABS,
                params: {
                  screen: ROUTES.PROFILE,
                },
              });
              navigation.closeDrawer();
            }}>
            <View>
              <Text className="text-caption font-bold text-white/80">Quick Action</Text>
              <Text className="mt-1 text-body font-semibold text-white">View Profile</Text>
            </View>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-white/15">
              <Ionicons color="#ffffff" name="arrow-forward" size={18} />
            </View>
          </Pressable>
        </View>

        <View className="mt-6 gap-2">
          {drawerMenuItems.map(item => {
            const isActive = activeRouteName === item.target;
            const iconColor = isActive ? '#ffffff' : '#607086';

            return (
              <Pressable
                key={item.id}
                className={`flex-row items-center gap-3 rounded-[24px] px-4 py-4 ${
                  isActive ? 'bg-primary-500' : 'bg-transparent'
                }`}
                hitSlop={6}
                onPress={() => handleNavigate(item)}>
                <View
                  className={`h-11 w-11 items-center justify-center rounded-full ${
                    isActive ? 'bg-white/15' : 'bg-surface'
                  }`}>
                  <Ionicons color={iconColor} name={item.icon} size={20} />
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-body font-semibold ${
                      isActive ? 'text-white' : 'text-textPrimary'
                    }`}>
                    {item.label}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

export const DrawerNavigator = () => {
  const screenOptions = useMemo(
    () => ({
      headerShown: true,
      header: headerProps => <AppShellHeader {...headerProps} />,
      drawerType: 'front',
      sceneStyle: {
        backgroundColor: '#f6f8fb',
      },
      drawerStyle: {
        backgroundColor: '#f6f8fb',
        width: 318,
      },
      overlayColor: 'rgba(32, 48, 73, 0.2)',
    }),
    [],
  );

  return (
    <Drawer.Navigator
      id={ROUTES.APP_DRAWER}
      drawerContent={drawerProps => <AppDrawerContent {...drawerProps} />}
      initialRouteName={ROUTES.APP_STACK}
      screenOptions={screenOptions}>
      <Drawer.Screen component={AppNavigator} name={ROUTES.APP_STACK} />
      <Drawer.Screen component={PrivacyPolicyScreen} name={ROUTES.PRIVACY_POLICY} />
      <Drawer.Screen
        component={TermsAndConditionsScreen}
        name={ROUTES.TERMS_AND_CONDITIONS}
      />
      <Drawer.Screen component={DisclaimerScreen} name={ROUTES.DISCLAIMER} />
      <Drawer.Screen component={DeveloperScreen} name={ROUTES.DEVELOPER} />
    </Drawer.Navigator>
  );
};
