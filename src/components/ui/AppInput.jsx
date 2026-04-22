import React from 'react';
import {TextInput, View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const colorPalette = {
  textMuted: '#8a97a8',
};

const inputVariants = {
  wrapper: 'gap-2.5',
  fieldBase: 'min-h-[56px] flex-row items-center border px-4',
  shape: 'rounded-[24px]',
  variants: {
    default: 'bg-surface border-border',
    filled: 'bg-surfaceMuted border-transparent',
    quiet: 'bg-transparent border-border',
  },
  states: {
    error: 'border-danger',
    focused: 'border-primary-300 bg-surfaceElevated',
    disabled: 'opacity-60',
  },
  inputText: 'text-body font-normal flex-1 py-4 text-textPrimary',
  inputMultiline: 'min-h-[120px] py-4 text-top',
  helper: 'pl-1 text-textMuted',
  error: 'pl-1 text-danger',
};

export const AppInput = ({
  label,
  helperText,
  errorText,
  leftElement,
  rightElement,
  variant = 'default',
  editable = true,
  isFocused = false,
  className,
  multiline = false,
  ...props
}) => {
  const hasError = Boolean(errorText);

  return (
    <View className={inputVariants.wrapper}>
      {label ? (
        <AppText variant="caption" color="secondary">
          {label}
        </AppText>
      ) : null}

      <View
        className={cn(
          inputVariants.fieldBase,
          inputVariants.shape,
          inputVariants.variants[variant],
          hasError && inputVariants.states.error,
          isFocused && !hasError && inputVariants.states.focused,
          !editable && inputVariants.states.disabled,
        )}>
        {leftElement ? <View className="mr-3">{leftElement}</View> : null}
        <TextInput
          editable={editable}
          multiline={multiline}
          placeholderTextColor={colorPalette.textMuted}
          className={cn(
            inputVariants.inputText,
            multiline && inputVariants.inputMultiline,
            className,
          )}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
        {rightElement ? <View className="ml-3">{rightElement}</View> : null}
      </View>

      {errorText ? (
        <AppText className={inputVariants.error} variant="caption" color="danger">
          {errorText}
        </AppText>
      ) : helperText ? (
        <AppText className={inputVariants.helper} variant="caption" color="muted">
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
};
