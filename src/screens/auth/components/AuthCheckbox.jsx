import React from 'react';
import {Pressable, Text, View} from 'react-native';

import {authStyles} from '@/design-system';
import {cn} from '@/utils/cn';

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
