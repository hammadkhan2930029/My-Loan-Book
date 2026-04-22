import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

const cardStyles = {
  base: 'border rounded-[28px] shadow-card',
  padding: {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  },
  variants: {
    default: 'border-border bg-surface',
    muted: 'border-transparent bg-surfaceMuted',
    accent: 'border-accent-200 bg-accent-50',
    elevated: 'border-borderStrong bg-surfaceElevated',
  },
};

export const AppCard = ({
  children,
  padding = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        cardStyles.base,
        cardStyles.variants[variant],
        cardStyles.padding[padding],
        className,
      )}
      {...props}>
      {children}
    </View>
  );
};
