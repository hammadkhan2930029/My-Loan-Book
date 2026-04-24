import React from 'react';
import {Pressable, Text, View} from 'react-native';

const transactionHistoryStyles = {
  row: 'min-h-[88px] flex-row items-center gap-3 py-4',
  rowMeta: 'mt-1',
  statusBadge: 'rounded-full px-3 py-1.5',
  statusGave: 'bg-primary-500',
  statusTook: 'bg-accent-400',
  amountGave: 'text-primary-600',
  amountTook: 'text-success',
  amountWrap: 'items-end justify-center gap-1',
};

export const TransactionHistoryRow = ({
  title,
  date,
  note,
  amount,
  type = 'gave',
  showDivider = true,
}) => {
  const isTook = type === 'took';

  return (
    <Pressable
      hitSlop={6}
      className={`${transactionHistoryStyles.row} ${showDivider ? 'border-b border-border' : ''}`}>
      <View
        className={`${transactionHistoryStyles.statusBadge} ${
          isTook ? transactionHistoryStyles.statusTook : transactionHistoryStyles.statusGave
        }`}>
        <Text className="text-caption font-normal text-white">
          {isTook ? 'Took' : 'Gave'}
        </Text>
      </View>

      <View className="flex-1 justify-center">
        <Text className="text-body font-normal text-textPrimary">{title}</Text>
        <View className={transactionHistoryStyles.rowMeta}>
          <Text className="text-caption font-normal text-textSecondary">
            {[date, note].filter(Boolean).join(' - ')}
          </Text>
        </View>
      </View>

      <View className={transactionHistoryStyles.amountWrap}>
        <View className={isTook ? transactionHistoryStyles.amountTook : transactionHistoryStyles.amountGave}>
          <Text className="text-caption font-normal">{amount}</Text>
        </View>
      </View>
    </Pressable>
  );
};
