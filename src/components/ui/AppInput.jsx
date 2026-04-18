import React from 'react';
import {TextInput, View} from 'react-native';

import {colorPalette, inputVariants} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

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
