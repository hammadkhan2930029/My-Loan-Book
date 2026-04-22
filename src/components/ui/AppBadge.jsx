import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const badgeStyles = {
  base: 'rounded-full px-3 py-1.5 self-start',
  variants: {
    neutral: {
      container: 'bg-surfaceMuted',
      text: 'text-textSecondary',
    },
    primary: {
      container: 'bg-primary-100',
      text: 'text-primary-700',
    },
    accent: {
      container: 'bg-accent-100',
      text: 'text-textPrimary',
    },
    success: {
      container: 'bg-[#e9f6ef]',
      text: 'text-success',
    },
    warning: {
      container: 'bg-[#fff8e1]',
      text: 'text-warning',
    },
    danger: {
      container: 'bg-[#fdecef]',
      text: 'text-danger',
    },
  },
};

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
