import React, {useState} from 'react';
import {Pressable} from 'react-native';
import {Controller} from 'react-hook-form';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
  const isPasswordField = Boolean(inputProps.secureTextEntry);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({field, fieldState}) => (
        <AppInput
          {...inputProps}
          errorText={fieldState.error?.message}
          helperText={!fieldState.error ? helperText : undefined}
          isFocused={focusedField === name}
          onBlur={() => {
            field.onBlur();
            setFocusedField('');
          }}
          onChangeText={field.onChange}
          onFocus={() => setFocusedField(name)}
          rightElement={
            isPasswordField ? (
              <Pressable
                hitSlop={8}
                onPress={() => setIsPasswordVisible(current => !current)}>
                <Ionicons
                  color="#8a97a8"
                  name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                />
              </Pressable>
            ) : (
              inputProps.rightElement
            )
          }
          secureTextEntry={isPasswordField ? !isPasswordVisible : inputProps.secureTextEntry}
          value={field.value}
        />
      )}
      rules={rules}
    />
  );
};
