import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppBadge, AppCard} from '@/components/ui';

const disclaimerSections = [
  {
    heading: '1. No Legal Authority',
    body: '',
    bullets: [
      'The app does NOT provide legal validation.',
      'Records are NOT legally binding agreements.',
    ],
  },
  {
    heading: '2. No Financial Services',
    body: '',
    bullets: [
      'We do NOT provide loans.',
      'We do NOT facilitate money transfers.',
      'We do NOT act as a financial intermediary.',
    ],
  },
  {
    heading: '3. User Responsibility',
    body: '',
    bullets: [
      'All entries are created by users.',
      'Users are fully responsible for accuracy and authenticity.',
    ],
  },
  {
    heading: '4. Dispute Resolution',
    body: '',
    bullets: [
      'We are not involved in disputes between users.',
      'Users must resolve disputes independently.',
    ],
  },
  {
    heading: '5. Proof Attachments',
    body: '',
    bullets: [
      'Uploaded documents are user-provided.',
      'We do not verify authenticity.',
    ],
  },
  {
    heading: '6. No Guarantees',
    body: 'We do not guarantee:',
    bullets: ['Data accuracy.', 'Payment recovery.', 'Legal enforceability.'],
  },
  {
    heading: '7. Use at Your Own Risk',
    body: 'By using this app, you agree that:',
    bullets: [
      'You use it at your own discretion.',
      'You understand its limitations.',
    ],
  },
  {
    heading: '8. Contact',
    body: 'For inquiries: digiloantracker@gmail.com',
    bullets: [],
  },
];

export const DisclaimerScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-accent-400 bg-accent-400 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <Text className="text-caption font-bold text-white/80">Important Notice</Text>
          <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-white">
            Digital Loan Tracker is a digital record-keeping tool designed for personal use.
          </Text>
          <View className="mt-4">
            <AppBadge className="bg-white/15" label="Use Responsibly" variant="accent" />
          </View>
        </View>

        <View className="gap-4 pb-24">
          {disclaimerSections.map(section => (
            <AppCard key={section.heading} variant="elevated">
              <Text className="text-section font-semibold text-textPrimary">
                {section.heading}
              </Text>
              {section.body ? (
                <Text className="mt-2 text-body font-normal text-textSecondary">
                  {section.body}
                </Text>
              ) : null}
              {section.bullets.length ? (
                <View className="mt-3 gap-2">
                  {section.bullets.map(bullet => (
                    <View key={bullet} className="flex-row items-start gap-3">
                      <Text className="mt-[2px] text-body font-semibold text-accent-400">
                        -
                      </Text>
                      <Text className="flex-1 text-body font-normal text-textSecondary">
                        {bullet}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
