import React from 'react';
import {Controller} from 'react-hook-form';

import {AppInput} from '@/components/ui';

export const AuthFormField = ({
  control,
  name,
  rules,
  focusedField,
  setFocusedField,
  helperText,
  ...inputProps
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <AppInput
          errorText={fieldState.error?.message}
          helperText={!fieldState.error ? helperText : undefined}
          isFocused={focusedField === name}
          onBlur={() => {
            field.onBlur();
            setFocusedField('');
          }}
          onChangeText={field.onChange}
          onFocus={() => setFocusedField(name)}
          value={field.value}
          {...inputProps}
        />
      )}
      rules={rules}
    />
  );
};
