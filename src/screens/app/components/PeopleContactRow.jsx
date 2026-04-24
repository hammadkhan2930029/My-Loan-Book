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
  imageUri,
  summary,
  balance,
  balanceType = 'gave',
  onPress,
  selected = false,
  variant = 'primary',
  showDivider = true,
}) => {
  const rowStateClass = selected
    ? 'rounded-3xl border border-accent-300 bg-accent-100 px-3'
    : showDivider
      ? 'border-b border-border'
      : '';
  const resolvedVariant = selected ? 'accent' : variant;

  return (
    <Pressable
      hitSlop={6}
      onPress={onPress}
      className={`${peopleStyles.contactRow} ${rowStateClass}`}>
      <AppAvatar imageUri={imageUri} name={name} size="md" variant={resolvedVariant} />

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
        <Text
          className={`text-caption font-normal ${
            selected ? 'text-accent-500' : 'text-textMuted'
          }`}>
          {selected ? 'selected' : balanceType === 'took' ? 'you took' : 'you gave'}
        </Text>
      </View>
    </Pressable>
  );
};
