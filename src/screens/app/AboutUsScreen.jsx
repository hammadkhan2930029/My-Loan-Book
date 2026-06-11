import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppBadge, AppCard} from '@/components/ui';

const featureSections = [
  {
    icon: 'swap-horizontal-outline',
    title: 'Track Lending & Borrowing',
    body: 'Keep accurate records of all your personal loan transactions in one place.',
    bullets: [
      'Money you gave',
      'Money you borrowed',
      'Partial payments',
      'Full settlements',
    ],
  },
  {
    icon: 'book-outline',
    title: 'Digital Loan Ledger',
    body: 'Maintain a separate ledger for every contact and always know who owes you, what you owe, and which payments are pending.',
    bullets: [
      'Complete transaction history',
      'Running balance',
      'Payment status',
      'Clear due amounts',
    ],
  },
  {
    icon: 'document-attach-outline',
    title: 'Upload Payment Proof & Slips',
    body: 'Store payment evidence securely to help avoid future disputes and confusion.',
    bullets: [
      'Bank transfer slips',
      'Screenshots',
      'Receipts',
    ],
  },
  {
    icon: 'people-outline',
    title: 'Contact Management',
    body: 'Manage all your lending and borrowing contacts easily.',
    bullets: [
      'Friends',
      'Family',
      'Customers',
      'Business partners',
    ],
  },
  {
    icon: 'stats-chart-outline',
    title: 'Balance Summary Dashboard',
    body: 'Get a quick financial overview anytime.',
    bullets: [
      'Total receivable amount',
      'Total payable amount',
      'Recent transactions',
      'Pending balances',
    ],
  },
];

const perfectFor = [
  'Personal lending',
  'Borrow and lend records',
  'Shopkeepers',
  'Credit sales tracking',
  'Friends and family transactions',
  'Small business payment tracking',
];

export const AboutUsScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow gap-6 px-6 pb-32 pt-8"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <AppBadge
                className="self-start bg-white/15"
                label="About The App"
                variant="primary"
              />
              <Text className="mt-4 text-title font-bold text-white">
                Digital Loan Tracker with Proof
              </Text>
              <Text className="mt-2 text-body font-semibold text-white/90">
                Never forget who owes you money or what you owe others.
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-400">
              <Ionicons
                color="#ffffff"
                name="information-circle-outline"
                size={24}
              />
            </View>
          </View>
        </View>

        <AppCard variant="elevated">
          <Text className="text-section font-semibold text-textPrimary">
            Simple, Secure Loan Tracking
          </Text>
          <Text className="mt-3 text-body leading-6 text-textSecondary">
            Digital Loan Tracker is a simple and secure digital loan tracking
            app designed to help you record personal lending and borrowing
            transactions with proof, reminders, and clear balance tracking.
          </Text>
          <Text className="mt-3 text-body leading-6 text-textSecondary">
            Whether you lend money to friends, family, customers, employees, or
            business contacts, Digital Loan Tracker helps you maintain
            organized records and avoid misunderstandings.
          </Text>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">
              Key Features
            </Text>
            <Text className="mt-1 text-caption text-textSecondary">
              Everything you need to manage personal lending and borrowing.
            </Text>
          </View>

          {featureSections.map(feature => (
            <AppCard key={feature.title} variant="elevated">
              <View className="flex-row items-start gap-4">
                <View className="h-12 w-12 items-center justify-center rounded-full bg-primary-500">
                  <Ionicons color="#ffffff" name={feature.icon} size={21} />
                </View>
                <View className="flex-1">
                  <Text className="text-section font-semibold text-textPrimary">
                    {feature.title}
                  </Text>
                  <Text className="mt-2 text-body leading-6 text-textSecondary">
                    {feature.body}
                  </Text>
                </View>
              </View>

              <View className="mt-4 gap-2">
                {feature.bullets.map(bullet => (
                  <View key={bullet} className="flex-row items-start gap-3">
                    <View className="mt-2 h-2 w-2 rounded-full bg-accent-400" />
                    <Text className="flex-1 text-body text-textSecondary">
                      {bullet}
                    </Text>
                  </View>
                ))}
              </View>
            </AppCard>
          ))}
        </View>

        <AppCard variant="elevated">
          <Text className="text-section font-semibold text-textPrimary">
            Perfect For
          </Text>
          <View className="mt-4 flex-row flex-wrap gap-2">
            {perfectFor.map(item => (
              <View
                key={item}
                className="rounded-full border border-border bg-surfaceMuted px-4 py-2.5">
                <Text className="text-caption font-semibold text-textSecondary">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </AppCard>

        <View className="rounded-[28px] bg-accent-400 px-5 py-5">
          <Text className="text-section font-semibold text-white">
            Keep every record clear
          </Text>
          <Text className="mt-2 text-body leading-6 text-white/85">
            Download Digital Loan Tracker today and keep your lending and
            borrowing records organized, secure, and easy to manage.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
