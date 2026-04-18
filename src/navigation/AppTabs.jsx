import React from 'react';
import {Pressable, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {tabBarStylingRules} from '@/design-system';
import {
  AddTransactionScreen,
  DashboardScreen,
  MyPeopleScreen,
  ProfileScreen,
  ReportsScreen,
} from '@/screens';
import {cn} from '@/utils/cn';

import {ROUTES} from './routeNames';

const Tab = createBottomTabNavigator();

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

const TabLabel = ({focused, routeName}) => {
  const meta = tabMeta[routeName];
  const iconName = focused ? meta.activeIcon : meta.inactiveIcon;
  const iconColor = focused ? '#6d28d9' : '#7e728d';

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

const AddTabButton = ({children, onPress}) => {
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
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          display: 'none',
        },
        tabBarButton:
          route.name === ROUTES.ADD_TRANSACTION
            ? props => <AddTabButton {...props} />
            : props => <Pressable {...props} />,
        tabBarIcon: ({focused}) => <TabLabel focused={focused} routeName={route.name} />,
      })}
      tabBar={props => {
        const {state, descriptors, navigation} = props;

        return (
          <View className={tabBarStylingRules.container}>
            <View className={tabBarStylingRules.row}>
              {state.routes.map((route, index) => {
                const {options} = descriptors[route.key];
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
                  ? options.tabBarIcon({focused: isFocused, color: '', size: 0})
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
