import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';

import {buttonVariants, colorPalette} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

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
        <AppText className={buttonVariants.text[variant]} variant="button">
          {label}
        </AppText>
        {!loading ? rightElement : null}
      </View>
    </Pressable>
  );
};
