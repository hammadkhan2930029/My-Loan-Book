import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const colorPalette = {
  primary: '#203049',
  white: '#ffffff',
};

const buttonVariants = {
  base: 'items-center justify-center flex-row gap-2 active:scale-[0.99]',
  sizes: {
    md: 'min-h-[52px] rounded-[20px] px-4 py-3.5',
    lg: 'min-h-[58px] rounded-[24px] px-5 py-4',
  },
  variants: {
    primary: 'bg-primary-500 shadow-float active:bg-primary-600',
    secondary: 'border border-border bg-surfaceMuted active:bg-primary-50',
    accent: 'bg-accent-300 active:bg-accent-400',
    ghost: 'bg-transparent active:bg-primary-50',
  },
  text: {
    primary: 'text-white',
    secondary: 'text-textPrimary',
    accent: 'text-white',
    ghost: 'text-primary-600',
  },
  states: {
    disabled: 'opacity-60',
    fullWidth: 'w-full',
  },
};

export const AppButton = ({
  label,
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled,
  leftElement,
  rightElement,
  fullWidth = true,
  className,
  textClassName,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: loading}}
      hitSlop={4}
      className={cn(
        buttonVariants.base,
        fullWidth && buttonVariants.states.fullWidth,
        buttonVariants.variants[variant],
        buttonVariants.sizes[size],
        isDisabled && buttonVariants.states.disabled,
        className,
      )}
      disabled={isDisabled}
      {...props}>
      <View className="flex-row items-center justify-center gap-2">
        {loading ? (
          <ActivityIndicator
            color={variant === 'primary' ? colorPalette.white : colorPalette.primary}
          />
        ) : (
          leftElement
        )}
        <AppText className={cn(buttonVariants.text[variant], textClassName)} variant="button">
          {label}
        </AppText>
        {!loading ? rightElement : null}
      </View>
    </Pressable>
  );
};
