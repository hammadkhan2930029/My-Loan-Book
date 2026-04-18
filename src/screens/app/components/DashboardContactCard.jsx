import React from 'react';
import {Pressable, Text} from 'react-native';

import {AppAvatar} from '@/components/ui';

export const DashboardContactCard = ({name, variant = 'primary'}) => {
  return (
    <Pressable className="items-center gap-2">
      <AppAvatar name={name} size="md" variant={variant} />
      <Text className="text-caption font-normal text-textPrimary">{name}</Text>
    </Pressable>
  );
};
