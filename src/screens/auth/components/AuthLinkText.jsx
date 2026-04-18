import React from 'react';
import {Pressable, Text} from 'react-native';

import {authStyles} from '@/design-system';
export const AuthLinkText = ({label, onPress, className}) => {
  return (
    <Pressable onPress={onPress}>
      <Text className={['text-caption font-normal', authStyles.inlineLink, className].filter(Boolean).join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
};
