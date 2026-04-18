import React from 'react';
import {Text, View} from 'react-native';

import {avatarStyleMap, avatarVariants} from '@/design-system';
import {cn} from '@/utils/cn';

const getInitials = name => {
  if (!name || !name.trim()) {
    return '?';
  }

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
};

export const AppAvatar = ({
  name,
  size = 'md',
  variant = 'primary',
  fallbackLabel,
  className,
  ...props
}) => {
  const label = fallbackLabel || getInitials(name);

  return (
    <View
      className={cn(
        'items-center justify-center rounded-full',
        avatarVariants[variant].container,
        avatarStyleMap[size].container,
        className,
      )}
      {...props}>
      <Text
        className={cn(
          'font-semibold',
          avatarVariants[variant].text,
          avatarStyleMap[size].text,
        )}>
        {label}
      </Text>
    </View>
  );
};
