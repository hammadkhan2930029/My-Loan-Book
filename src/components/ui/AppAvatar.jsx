import React from 'react';
import {Image, Text, View} from 'react-native';

import {cn} from '@/utils/cn';

const avatarStyleMap = {
  xs: {
    container: 'h-8 w-8',
    text: 'text-xs',
  },
  sm: {
    container: 'h-10 w-10',
    text: 'text-sm',
  },
  md: {
    container: 'h-12 w-12',
    text: 'text-base',
  },
  lg: {
    container: 'h-16 w-16',
    text: 'text-xl',
  },
  xl: {
    container: 'h-20 w-20',
    text: 'text-2xl',
  },
};

const avatarVariants = {
  primary: {
    container: 'bg-primary-100',
    text: 'text-primary-700',
  },
  accent: {
    container: 'bg-accent-100',
    text: 'text-textPrimary',
  },
  muted: {
    container: 'bg-surfaceMuted',
    text: 'text-textSecondary',
  },
};

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
  imageUri,
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
      {imageUri ? (
        <Image
          className="h-full w-full rounded-full"
          resizeMode="cover"
          source={{uri: imageUri}}
        />
      ) : (
        <Text
          className={cn(
            'font-semibold',
            avatarVariants[variant].text,
            avatarStyleMap[size].text,
          )}>
          {label}
        </Text>
      )}
    </View>
  );
};
