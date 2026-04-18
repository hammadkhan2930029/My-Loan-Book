import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {contactDetailStyles} from '@/design-system';

export const ContactTransactionRow = ({
  title,
  subtitle,
  amount,
  type = 'gave',
  showDivider = true,
}) => {
  const isTook = type === 'took';

  return (
    <Pressable
      hitSlop={6}
      className={`${contactDetailStyles.transactionRow} ${showDivider ? 'border-b border-border' : ''}`}>
      <View
        className={`${contactDetailStyles.transactionBadge} ${
          isTook
            ? contactDetailStyles.transactionBadgeTook
            : contactDetailStyles.transactionBadgeGave
        }`}>
        <Text className={`text-caption font-normal ${isTook ? 'text-accent-500' : 'text-primary-500'}`}>
          {isTook ? 'Took' : 'Gave'}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-body font-normal text-textPrimary">{title}</Text>
        <View className={contactDetailStyles.transactionMeta}>
          <Text className="text-caption font-normal text-textSecondary">{subtitle}</Text>
        </View>
      </View>

      <View className={contactDetailStyles.transactionAmountWrap}>
        <View className={isTook ? contactDetailStyles.amountTook : contactDetailStyles.amountGave}>
          <Text className="text-caption font-normal">{amount}</Text>
        </View>
      </View>
    </Pressable>
  );
};
