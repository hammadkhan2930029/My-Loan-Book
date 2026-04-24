import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {AppBadge, AppCard} from '@/components/ui';

const developerHighlights = [
  {
    title: 'Mission',
    body: 'Your growth is our mission. We dive deep into your business needs and deliver solutions that elevate your success.',
  },
  {
    title: 'Office',
    body: 'R-5, Row 5, Block D, NCECHS, Gulshan-e-Iqbal Block 10A, Rashid Minhas Road, Karachi, Pakistan.',
  },
];

const contactItems = [
  {
    icon: 'mail-outline',
    label: 'Email',
    value: 'info@cogentdevs.com',
  },
  {
    icon: 'call-outline',
    label: 'Phone',
    value: '+92-331-9998780',
  },
];

export const DeveloperScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <Text className="text-caption font-bold text-white/80">Development Partner</Text>
          <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-white">
            Cogent Devs
          </Text>
          <Text className="mt-2 text-caption font-normal text-white/80">
            Product engineering and business-focused software solutions built with clarity and care.
          </Text>
          <View className="mt-4">
            <AppBadge className="bg-white/15" label="Trusted Team" variant="primary" />
          </View>
        </View>

        <View className="gap-4">
          {developerHighlights.map(section => (
            <AppCard key={section.title} variant="elevated">
              <Text className="text-section font-semibold text-textPrimary">{section.title}</Text>
              <Text className="mt-2 text-body font-normal text-textSecondary">
                {section.body}
              </Text>
            </AppCard>
          ))}
        </View>

        <AppCard variant="elevated">
          <Text className="text-section font-semibold text-textPrimary">Contact</Text>
          <View className="mt-4 gap-4">
            {contactItems.map(item => (
              <View key={item.label} className="flex-row items-start gap-4">
                <View className="h-11 w-11 items-center justify-center rounded-full bg-accent-400">
                  <Ionicons color="#ffffff" name={item.icon} size={18} />
                </View>
                <View className="flex-1">
                  <Text className="text-caption font-semibold text-textMuted">{item.label}</Text>
                  <Text className="mt-1 text-body font-normal text-textPrimary">{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};
