import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {addTransactionStyles} from '@/design-system';
import {cn} from '@/utils/cn';

export const TransactionTypeToggle = ({value, onChange}) => {
  const options = [
    {label: 'You Gave', value: 'gave'},
    {label: 'You Took', value: 'took'},
  ];

  return (
    <View className={addTransactionStyles.toggleWrap}>
      <View className={addTransactionStyles.toggleRow}>
        {options.map(option => {
          const isActive = option.value === value;

          return (
            <Pressable
              key={option.value}
              className={cn(
                addTransactionStyles.toggleButton,
                isActive
                  ? option.value === 'gave'
                    ? addTransactionStyles.toggleButtonActiveGave
                    : addTransactionStyles.toggleButtonActiveTook
                  : addTransactionStyles.toggleButtonInactive,
              )}
              onPress={() => onChange(option.value)}>
              <Text
                className={`text-[15px] leading-5 font-semibold ${
                  isActive ? 'text-white' : 'text-textSecondary'
                }`}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
