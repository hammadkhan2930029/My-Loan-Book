import React from 'react';
import {Text} from 'react-native';

import {typographyScale} from '@/design-system';
import {cn} from '@/utils/cn';

const colorClasses = {
  primary: 'text-textPrimary',
  secondary: 'text-textSecondary',
  muted: 'text-textMuted',
  brand: 'text-primary-500',
  accent: 'text-accent-500',
  danger: 'text-danger',
};

export const AppText = ({
  children,
  variant = 'body',
  color = 'primary',
  className,
  ...props
}) => {
  return (
    <Text
      className={cn(typographyScale[variant].className, colorClasses[color], className)}
      {...props}>
      {children}
    </Text>
  );
};
