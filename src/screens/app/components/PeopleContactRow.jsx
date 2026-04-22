import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {AppAvatar} from '@/components/ui';

const peopleStyles = {
  contactRow: 'min-h-[88px] flex-row items-center gap-4 py-4',
  contactMeta: 'mt-1',
  balanceWrap: 'items-end gap-1',
  balancePositive: 'text-success',
  balanceNegative: 'text-primary-600',
};

export const PeopleContactRow = ({
  name,
  summary,
  balance,
  balanceType = 'gave',
  variant = 'primary',
  showDivider = true,
}) => {
  return (
    <Pressable
      hitSlop={6}
      className={`${peopleStyles.contactRow} ${showDivider ? 'border-b border-border' : ''}`}>
      <AppAvatar name={name} size="md" variant={variant} />

      <View className="flex-1 justify-center">
        <Text className="text-body font-normal text-textPrimary">{name}</Text>
        <View className={peopleStyles.contactMeta}>
          <Text className="text-caption font-normal text-textSecondary">{summary}</Text>
        </View>
      </View>

      <View className={peopleStyles.balanceWrap}>
        <View
          className={
            balanceType === 'took'
              ? peopleStyles.balancePositive
              : peopleStyles.balanceNegative
          }>
          <Text className="text-caption font-normal">{balance}</Text>
        </View>
        <Text className="text-caption font-normal text-textMuted">
          {balanceType === 'took' ? 'you took' : 'you gave'}
        </Text>
      </View>
    </Pressable>
  );
};
