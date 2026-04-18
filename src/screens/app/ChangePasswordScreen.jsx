import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

import {delay} from '@/utils/delay';
import {authValidationRules, getConfirmPasswordRules} from '@/utils/validators';
import {
  AppBadge,
  AppButton,
  AppCard,
  AppFormStatus,
} from '@/components/ui';
import {AuthFormField} from '@/screens';

export const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {control, getValues, handleSubmit, formState} = useForm({
    defaultValues: {
      currentPassword: 'password123',
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    console.log('Change password form values:', values);
    await delay(700);
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Text className="text-caption font-semibold text-primary-500">Back</Text>
          </Pressable>

          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-caption font-normal text-textSecondary">
                Update your password with the same secure form style used across auth and settings.
              </Text>
              <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                Change Password
              </Text>
            </View>
            <AppBadge label="Security" variant="accent" />
          </View>
        </View>

        <AppCard variant="elevated">
          <View className="gap-3">
            <AppBadge label="Protected Access" variant="primary" />
            <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
              Password Settings
            </Text>
            <Text className="text-caption font-normal text-textSecondary">
              Use static values for now. No API call is connected yet.
            </Text>
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Update Password</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              This form is validation-ready and keeps the same input language as auth screens.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AuthFormField
                control={control}
                focusedField={focusedField}
                helperText="Enter your current password before saving changes."
                label="Current Password"
                name="currentPassword"
                placeholder="Enter current password"
                rules={authValidationRules.password}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                helperText="New password should be at least 8 characters."
                label="New Password"
                name="password"
                placeholder="Enter new password"
                rules={authValidationRules.password}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                helperText="Must match your new password."
                label="Confirm New Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                rules={getConfirmPasswordRules(getValues)}
                secureTextEntry
                setFocusedField={setFocusedField}
              />
            </View>
          </AppCard>
        </View>

        <AppFormStatus
          idleMessage="Password save stays disabled until all three fields are valid."
          submitting={isSubmitting}
          submittingMessage="Saving new password..."
        />

        <AppButton
          disabled={!formState.isValid || isSubmitting}
          label="Save Password"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
