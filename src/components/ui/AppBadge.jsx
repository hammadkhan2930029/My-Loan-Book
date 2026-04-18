import React from 'react';
import {View} from 'react-native';

import {badgeStyles} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

export const AppBadge = ({label, variant = 'neutral', className, ...props}) => {
  const variantStyle = badgeStyles.variants[variant];

  return (
    <View className={cn(badgeStyles.base, variantStyle.container, className)} {...props}>
      <AppText className={cn('font-semibold', variantStyle.text)} variant="caption">
        {label}
      </AppText>
    </View>
  );
};
