import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {ROUTES} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {resetPassword} from '@/services/authApi';

import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const resetToken = route.params?.resetToken || '';
  const resetEmail = route.params?.email || '';
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(
    resetEmail ? `Create a new password for ${resetEmail}.` : '',
  );
  const [formError, setFormError] = useState('');
  const {control, getValues, handleSubmit, formState} = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      await resetPassword({
        email: resetEmail,
        resetToken,
        newPassword: values.newPassword,
      });
      const successMessage = 'Password reset successful.';

      setFormMessage(successMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: successMessage,
        visibilityTime: 1200,
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{name: ROUTES.LOGIN}],
        });
      }, 900);
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed. Please try again.';

      setFormError(errorMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: errorMessage,
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <View className="rounded-[20px] bg-surfaceMuted px-4 py-3">
                <Text className="text-caption font-normal text-textSecondary text-center">
                  Resetting password for
                </Text>
                <Text className="mt-1 text-caption font-semibold text-primary-500 text-center">
                  {resetEmail || 'No email provided'}
                </Text>
              </View>

              <AuthFormField
                control={control}
                focusedField={focusedField}
                label="New Password"
                name="newPassword"
                placeholder="Enter new password"
                rules={{
                  required: 'Password is required.',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters.',
                  },
                }}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                rules={{
                  required: 'Please confirm your password.',
                  validate: value =>
                    value === getValues('newPassword') || 'Passwords do not match.',
                }}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AppFormStatus
                idleMessage={
                  formError ||
                  formMessage ||
                  'Save stays disabled until both passwords are valid.'
                }
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
            <Text className="text-caption font-normal text-textMuted">Digital Loan Tracker</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
