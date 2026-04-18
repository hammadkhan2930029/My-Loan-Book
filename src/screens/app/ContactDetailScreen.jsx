import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
} from '@/components/ui';

import {ContactTransactionRow} from './components';

const contact = {
  name: 'Sara Khan',
  phone: '+1 234 567 890',
  email: 'sara.khan@example.com',
  variant: 'primary',
  overallBalance: '$540',
  status: 'You gave more',
  gaveTotal: '$780',
  tookTotal: '$240',
};

const transactions = [
  {
    id: '1',
    title: 'Dinner split',
    subtitle: 'You gave money - Today',
    amount: '-$120',
    type: 'gave',
  },
  {
    id: '2',
    title: 'Cash return',
    subtitle: 'You took money - Yesterday',
    amount: '+$90',
    type: 'took',
  },
  {
    id: '3',
    title: 'Cab fare share',
    subtitle: 'You gave money - Apr 12',
    amount: '-$60',
    type: 'gave',
  },
  {
    id: '4',
    title: 'Lunch repayment',
    subtitle: 'You took money - Apr 09',
    amount: '+$50',
    type: 'took',
  },
];

export const ContactDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Text className="text-caption font-semibold text-primary-500">Back</Text>
          </Pressable>

          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Contact details, balance summary, and recent transactions.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Contact Detail
            </Text>
          </View>
        </View>

        <AppCard variant="elevated">
          <View className="flex-row items-start gap-4">
            <AppAvatar name={contact.name} size="lg" variant={contact.variant} />
            <View className="flex-1">
              <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                {contact.name}
              </Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                {contact.phone}
              </Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                {contact.email}
              </Text>
            </View>
            <AppBadge label="Active" variant="primary" />
          </View>
        </AppCard>

        <AppCard variant="elevated">
          <View className="gap-5">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-caption font-normal text-textSecondary">Overall Balance</Text>
                <Text className="mt-2 text-hero font-bold tracking-[-0.4px] text-textPrimary">
                  {contact.overallBalance}
                </Text>
                <Text className="mt-2 text-caption font-normal text-textSecondary">
                  {contact.status}
                </Text>
              </View>
              <AppBadge label="Open Ledger" variant="accent" />
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1 rounded-2xl bg-primary-100 px-4 py-4">
                <Text className="text-caption font-normal text-textSecondary">You Gave</Text>
                <Text className="mt-2 text-section font-semibold text-textPrimary">
                  {contact.gaveTotal}
                </Text>
              </View>

              <View className="flex-1 rounded-2xl bg-accent-100 px-4 py-4">
                <Text className="text-caption font-normal text-textSecondary">You Took</Text>
                <Text className="mt-2 text-section font-semibold text-textPrimary">
                  {contact.tookTotal}
                </Text>
              </View>
            </View>
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">
              Transaction History
            </Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              A clear split between outgoing and incoming entries.
            </Text>
          </View>

          <AppCard padding="sm">
            <View className="gap-4">
              <View className="flex-row items-center justify-between gap-3">
                <Text className="text-section font-semibold text-textPrimary">Transactions</Text>
                <AppBadge label={`${transactions.length} records`} variant="primary" />
              </View>
              {transactions.map((item, index) => (
                <ContactTransactionRow
                  key={item.id}
                  {...item}
                  showDivider={index !== transactions.length - 1}
                />
              ))}
            </View>
          </AppCard>
        </View>

        <AppButton label="Add Transaction" />
      </ScrollView>
    </SafeAreaView>
  );
};
