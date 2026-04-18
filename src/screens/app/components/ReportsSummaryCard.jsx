import React from 'react';
import {Text, View} from 'react-native';

import {reportsStyles} from '@/design-system';
import {AppCard} from '@/components/ui';

export const ReportsSummaryCard = ({title, amount, note, accent = 'primary'}) => {
  const dotClass = accent === 'accent' ? 'bg-accent-300' : 'bg-primary-500';

  return (
    <View className={reportsStyles.summaryCard}>
      <AppCard variant="elevated">
        <View className={reportsStyles.summaryTop}>
          <Text className="text-caption font-normal text-textSecondary">{title}</Text>
          <View className={`h-3 w-3 rounded-full ${dotClass}`} />
        </View>
        <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">{amount}</Text>
        <View className="mt-2">
          <Text className="text-caption font-normal text-textSecondary">{note}</Text>
        </View>
      </AppCard>
    </View>
  );
};
