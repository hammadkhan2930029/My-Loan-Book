import React from 'react';
import {Text, View} from 'react-native';

import {AppAvatar} from '@/components/ui';

export const DashboardActivityItem = ({
  name,
  meta,
  amount,
  status,
  variant = 'receive',
  showDivider = true,
}) => {
  const badgeStyles = {
    receive: {
      container: 'bg-accent-300',
      text: 'text-white',
    },
    given: {
      container: 'bg-primary-700',
      text: 'text-white',
    },
    taken: {
      container: 'bg-[#ff7b64]',
      text: 'text-white',
    },
  };

  return (
    <View className={`${showDivider ? 'border-b border-border/80' : ''} py-3`}>
      <View className="flex-row items-center gap-3 rounded-[18px] bg-[#fcfbf7] px-3 py-3">
        <AppAvatar name={name} size="sm" variant="accent" />
        <View className="flex-1">
          <Text className="text-body font-semibold text-textPrimary">{name}</Text>
          <Text className="mt-0.5 text-caption font-normal text-textSecondary">
            {meta} {amount}
          </Text>
        </View>
        <View className={`rounded-full px-4 py-1 ${badgeStyles[variant].container}`}>
          <Text className={`text-caption font-semibold text-right ${badgeStyles[variant].text}`}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
};
