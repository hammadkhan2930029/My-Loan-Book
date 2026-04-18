import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppBadge, AppCard, AppListItem} from '@/components/ui';

import {ReportsDonutChart, ReportsSummaryCard} from './components';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const selectedMonth = 'Apr';

const reportTotals = {
  gave: 4820,
  took: 3145,
  total: 7965,
};

const history = [
  {
    id: '1',
    title: 'Dinner with Sara',
    subtitle: 'You gave money - Apr 16',
    amount: '-$120',
  },
  {
    id: '2',
    title: 'Ali repayment',
    subtitle: 'You took money - Apr 14',
    amount: '+$90',
  },
  {
    id: '3',
    title: 'Fuel split',
    subtitle: 'You gave money - Apr 12',
    amount: '-$45',
  },
  {
    id: '4',
    title: 'Office lunch return',
    subtitle: 'You took money - Apr 09',
    amount: '+$70',
  },
];

export const ReportsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              A calm monthly view of what you gave, what you took, and how it moved.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Reports
            </Text>
          </View>
          <AppBadge label="April" variant="accent" />
        </View>

        <ScrollView
          horizontal
          contentContainerClassName="gap-3"
          showsHorizontalScrollIndicator={false}>
          {months.map(month => {
            const active = month === selectedMonth;

            return (
              <Pressable
                key={month}
                className={`rounded-full border px-4 py-2 ${
                  active
                    ? 'border-primary-500 bg-primary-100'
                    : 'border-border bg-surface'
                }`}>
                <Text
                  className={`text-caption font-normal ${
                    active ? 'text-primary-500' : 'text-textSecondary'
                  }`}>
                  {month}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <AppCard variant="elevated">
          <View className="gap-5">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-section font-semibold text-textPrimary">
                  Monthly Snapshot
                </Text>
                <Text className="mt-2 text-caption font-normal text-textSecondary">
                  Distribution of money given and money received in {selectedMonth}.
                </Text>
              </View>
              <AppBadge label="Balanced" variant="primary" />
            </View>

            <View className="items-center">
              <ReportsDonutChart
                gave={reportTotals.gave}
                took={reportTotals.took}
                total={reportTotals.total}
              />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 rounded-2xl bg-primary-100 px-4 py-4">
                <Text className="text-caption font-normal text-textSecondary">You Gave</Text>
                <Text className="mt-2 text-section font-semibold text-textPrimary">
                  ${reportTotals.gave}
                </Text>
              </View>

              <View className="flex-1 rounded-2xl bg-accent-100 px-4 py-4">
                <Text className="text-caption font-normal text-textSecondary">You Took</Text>
                <Text className="mt-2 text-section font-semibold text-textPrimary">
                  ${reportTotals.took}
                </Text>
              </View>
            </View>
          </View>
        </AppCard>

        <View className="gap-4">
          <ReportsSummaryCard
            accent="primary"
            amount="$4,820"
            note="12 outgoing records this month"
            title="You Gave"
          />
          <ReportsSummaryCard
            accent="accent"
            amount="$3,145"
            note="8 incoming records this month"
            title="You Took"
          />
        </View>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">History</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Latest reportable activity for the selected month.
            </Text>
          </View>

          <AppCard padding="sm">
            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="text-section font-semibold text-textPrimary">
                  Transaction History
                </Text>
                <AppBadge label={`${history.length} entries`} variant="accent" />
              </View>
              {history.map((item, index) => (
                <AppListItem
                  key={item.id}
                  rightText={item.amount}
                  showDivider={index !== history.length - 1}
                  subtitle={item.subtitle}
                  title={item.title}
                />
              ))}
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
