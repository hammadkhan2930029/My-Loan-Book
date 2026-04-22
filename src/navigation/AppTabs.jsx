import React from 'react';
import { Pressable, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  AddTransactionScreen,
  DashboardScreen,
  MyPeopleScreen,
  ProfileScreen,
  ReportsScreen,
} from '@/screens';
import { cn } from '@/utils/cn';

import { ROUTES } from './routeNames';

const Tab = createBottomTabNavigator();

const tabBarStylingRules = {
  container:
    'absolute bottom-4 left-4 right-4 rounded-[30px] border border-border bg-surface/95 px-3 pb-4 pt-3 shadow-float',
  row: 'flex-row items-end justify-between gap-2',
  itemWrap: 'flex-1',
  item: 'min-h-[58px] items-center justify-center rounded-[22px] px-2 py-2',
  activeItem: 'bg-primary-50',
  inactiveItem: 'bg-transparent',
  iconText: 'text-[11px] font-semibold uppercase',
  activeLabel: 'text-primary-600',
  inactiveLabel: 'text-textMuted',
  fab: 'h-16 w-16 -mt-15 items-center justify-center rounded-full bg-primary-500 shadow-float',
  fabOuter: 'min-w-[84px] items-center justify-center px-1',
  fabIcon: 'text-white',
};

const tabMeta = {
  [ROUTES.DASHBOARD]: {
    activeIcon: 'home',
    inactiveIcon: 'home-outline',
  },
  [ROUTES.REPORTS]: {
    activeIcon: 'stats-chart',
    inactiveIcon: 'stats-chart-outline',
  },
  [ROUTES.ADD_TRANSACTION]: {
    activeIcon: 'add',
    inactiveIcon: 'add',
  },
  [ROUTES.MY_PEOPLE]: {
    activeIcon: 'people',
    inactiveIcon: 'people-outline',
  },
  [ROUTES.PROFILE]: {
    activeIcon: 'person',
    inactiveIcon: 'person-outline',
  },
};

const TabLabel = ({ focused, routeName }) => {
  const meta = tabMeta[routeName];
  const iconName = focused ? meta.activeIcon : meta.inactiveIcon;
  const iconColor = focused ? '#203049' : '#8a97a8';

  return (
    <View
      className={cn(
        tabBarStylingRules.item,
        focused ? tabBarStylingRules.activeItem : tabBarStylingRules.inactiveItem,
      )}>
      <View
        className={cn(
          tabBarStylingRules.iconText,
          focused ? tabBarStylingRules.activeLabel : tabBarStylingRules.inactiveLabel,
        )}>
        <Ionicons color={iconColor} name={iconName} size={22} />
      </View>
    </View>
  );
};

const AddTabButton = ({ children, onPress }) => {
  return (
    <Pressable className={tabBarStylingRules.fabOuter} hitSlop={8} onPress={onPress}>
      <View className={tabBarStylingRules.fab}>
        <View className={tabBarStylingRules.fabIcon}>
          <Ionicons color="#ffffff" name="add" size={24} />
        </View>
      </View>
      {children}
    </Pressable>
  );
};

export const AppTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.DASHBOARD}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
        },
        tabBarButton:
          route.name === ROUTES.ADD_TRANSACTION
            ? props => <AddTabButton {...props} />
            : props => <Pressable {...props} />,
        tabBarIcon: ({ focused }) => <TabLabel focused={focused} routeName={route.name} />,
      })}
      tabBar={props => {
        const { state, descriptors, navigation } = props;

        return (
          <View className={tabBarStylingRules.container}>
            <View className={tabBarStylingRules.row}>
              {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                  const event = navigation.emit({
                    canPreventDefault: true,
                    target: route.key,
                    type: 'tabPress',
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                };

                const icon = options.tabBarIcon
                  ? options.tabBarIcon({ focused: isFocused, color: '', size: 0 })
                  : null;

                if (route.name === ROUTES.ADD_TRANSACTION) {
                  return <AddTabButton key={route.key} onPress={onPress} />;
                }

                return (
                  <Pressable
                    key={route.key}
                    accessibilityRole="button"
                    hitSlop={8}
                    className={tabBarStylingRules.itemWrap}
                    onPress={onPress}>
                    {icon}
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      }}>
      <Tab.Screen component={DashboardScreen} name={ROUTES.DASHBOARD} />
      <Tab.Screen component={ReportsScreen} name={ROUTES.REPORTS} />
      <Tab.Screen component={AddTransactionScreen} name={ROUTES.ADD_TRANSACTION} />
      <Tab.Screen component={MyPeopleScreen} name={ROUTES.MY_PEOPLE} />
      <Tab.Screen component={ProfileScreen} name={ROUTES.PROFILE} />
    </Tab.Navigator>
  );
};
