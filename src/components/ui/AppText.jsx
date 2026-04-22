import React from 'react';
import {Text} from 'react-native';

import {cn} from '@/utils/cn';

const typographyScale = {
  hero: {
    className: 'text-hero font-bold tracking-[-0.4px]',
  },
  title: {
    className: 'text-title font-bold tracking-[-0.3px]',
  },
  sectionTitle: {
    className: 'text-section font-semibold',
  },
  body: {
    className: 'text-body font-normal',
  },
  caption: {
    className: 'text-caption font-normal',
  },
  button: {
    className: 'text-[15px] leading-5 font-semibold',
  },
  overline: {
    className: 'text-[12px] leading-4 font-semibold uppercase tracking-[1px]',
  },
};

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
