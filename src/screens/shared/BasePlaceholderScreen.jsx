import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
} from '@/components/ui';

export const BasePlaceholderScreen = ({
  title,
  subtitle,
  badge,
  ctaLabel,
  accent = 'primary',
}) => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">{subtitle}</Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              {title}
            </Text>
          </View>
          <AppAvatar name={title} size="sm" variant={accent} />
        </View>

        <AppCard variant="elevated">
          <View className="gap-4">
            <View className="flex-row flex-wrap gap-2">
              <AppBadge label={badge} variant={accent === 'accent' ? 'accent' : 'primary'} />
              <AppBadge label="Placeholder" variant="neutral" />
            </View>
            <Text className="text-body font-normal text-textSecondary">
              This screen is ready for real content once we connect forms, state, and APIs.
            </Text>
            <AppButton
              label={ctaLabel || 'Continue'}
              variant={accent === 'accent' ? 'accent' : 'primary'}
            />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};
