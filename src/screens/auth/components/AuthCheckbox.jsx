import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {cn} from '@/utils/cn';

const authStyles = {
  checkboxRow: 'flex-row items-center gap-3',
  checkboxBox:
    'h-6 w-6 items-center justify-center rounded-[8px] border border-borderStrong bg-surface',
  checkboxChecked: 'border-primary-500 bg-primary-500',
};

export const AuthCheckbox = ({label, checked, onPress}) => {
  return (
    <Pressable className={authStyles.checkboxRow} onPress={onPress}>
      <View
        className={cn(
          authStyles.checkboxBox,
          checked && authStyles.checkboxChecked,
        )}>
        {checked ? <Text className="text-caption font-normal text-white">✓</Text> : null}
      </View>
      <Text className="text-caption font-normal text-textSecondary">{label}</Text>
    </Pressable>
  );
};
