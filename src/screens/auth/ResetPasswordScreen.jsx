import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

import {ROUTES} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {delay} from '@/utils/delay';
import {authValidationRules, getConfirmPasswordRules} from '@/utils/validators';

import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {control, getValues, handleSubmit, formState} = useForm({
    defaultValues: {
      password: 'newpassword123',
      confirmPassword: 'newpassword123',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    console.log('Reset password form values:', values);
    await delay(700);
    setIsSubmitting(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1">
        <ScrollView
          bounces={false}
          contentContainerClassName="flex-grow px-6 py-8"
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className="items-center pb-7 pt-3">
            <AppBadge label="Secure Access" variant="primary" />
            <View className="mt-5">
              <AppLogo size="md" />
            </View>
            <Text className="mt-5 text-title font-bold tracking-[-0.3px] text-textPrimary text-center">
              Reset Password
            </Text>
            <Text className="mt-2 max-w-[300px] text-body font-normal text-textSecondary text-center">
              Set a new password to continue using your account securely.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AuthFormField
                control={control}
                focusedField={focusedField}
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
                helperText="Ready for match validation when form logic is added."
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                rules={getConfirmPasswordRules(getValues)}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AppFormStatus
                idleMessage="Save stays disabled until both passwords match and pass validation."
                submitting={isSubmitting}
                submittingMessage="Updating your password..."
              />

              <AppButton
                disabled={!formState.isValid || isSubmitting}
                label="Submit"
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />

              <View className="flex-row items-center justify-center gap-1">
                <Text className="text-caption font-normal text-textSecondary">
                  Remembered it already?
                </Text>
                <AuthLinkText
                  label="Login"
                  onPress={() => navigation.navigate(ROUTES.LOGIN)}
                />
              </View>
            </View>
          </AppCard>

          <View className="mt-5 items-center gap-2">
            <Text className="text-caption font-normal text-textMuted">MyLoanBook</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
