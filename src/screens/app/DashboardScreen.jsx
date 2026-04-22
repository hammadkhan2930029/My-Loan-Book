import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppAvatar, AppCard} from '@/components/ui';

import {DashboardActivityItem} from './components/DashboardActivityItem';
import {DashboardContactCard} from './components/DashboardContactCard';
import {DashboardSummaryCard} from './components/DashboardSummaryCard';

const summaryCards = [
  {
    id: 'gave',
    title: 'You Will Receive',
    amount: 'PKR 5,000',
    note: 'From 3 people',
    variant: 'receive',
  },
  {
    id: 'took',
    title: 'You Need to Pay',
    amount: 'PKR 2,000',
    note: 'From 2 people',
    variant: 'pay',
  },
];

const contacts = [
  {id: '1', name: 'Ali', variant: 'primary'},
  {id: '2', name: 'Saima', variant: 'muted'},
  {id: '3', name: 'Ahmed', variant: 'accent'},
  {id: '4', name: 'Afzal', variant: 'primary'},
  {id: '5', name: 'Sheeza', variant: 'accent'},
];

const recentActivity = [
  {
    id: '1',
    name: 'Ali',
    meta: 'paid you',
    amount: '2,000',
    status: 'Received',
    variant: 'receive',
  },
  {
    id: '2',
    name: 'Ahmed',
    meta: 'borrowed from you',
    amount: '4,000',
    status: 'Given',
    variant: 'given',
  },
  {
    id: '3',
    name: 'Sara',
    meta: 'owes you',
    amount: '4,000',
    status: 'Taken',
    variant: 'taken',
  },
];

export const DashboardScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-5 py-5 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <AppAvatar
              className="border-2 border-white"
              name="Sara"
              size="sm"
              variant="accent"
            />

            <Pressable
              className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
              hitSlop={8}>
              <Ionicons color="#ffffff" name="notifications-outline" size={18} />
            </Pressable>
          </View>

          <View>
            <Text className="text-[25px] leading-[30px] font-bold text-textPrimary">
              Hello, Sara
            </Text>
            <Text className="mt-0.5 text-[13px] leading-[18px] font-semibold text-textPrimary">
              You have 3 balances to review
            </Text>
          </View>
        </View>

        <View className="flex-row items-end gap-3">
          {summaryCards.map(card => (
            <DashboardSummaryCard key={card.id} {...card} />
          ))}
        </View>

        <View className="gap-3">
          <AppCard className="rounded-[22px] bg-surface px-4 py-4" padding="sm">
            <View className="flex-row items-center justify-between">
              <Text className="text-section font-semibold text-textPrimary">My People</Text>
              <Pressable hitSlop={8}>
                <Text className="text-caption font-normal text-textSecondary">See all</Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              contentContainerClassName="gap-4 pt-4"
              showsHorizontalScrollIndicator={false}>
              {contacts.map(contact => (
                <DashboardContactCard key={contact.id} {...contact} />
              ))}
            </ScrollView>
          </AppCard>
        </View>

        <View className="gap-3 pb-24">
          <View className="flex-row items-center justify-between">
            <Text className="text-section font-semibold text-textPrimary">Recent Activity</Text>
            <Pressable hitSlop={8}>
              <Text className="text-caption font-normal text-textSecondary">See all</Text>
            </Pressable>
          </View>

          <AppCard className="rounded-[22px] bg-surface" padding="sm">
            <View className="gap-3">
              {recentActivity.map((item, index) => (
                <DashboardActivityItem
                  key={item.id}
                  {...item}
                  showDivider={index !== recentActivity.length - 1}
                />
              ))}
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
