import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {ROUTES, useAuth} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {resetPassword} from '@/services/authApi';
import {authValidationRules, getConfirmPasswordRules} from '@/utils/validators';

import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {signIn} = useAuth();
  const resetToken = route.params?.resetToken || '';
  const resetEmail = route.params?.email || '';
  const expiresInMinutes = route.params?.expiresInMinutes;
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(
    expiresInMinutes
      ? `Reset token ready for ${resetEmail}. It expires in ${expiresInMinutes} minutes.`
      : '',
  );
  const [formError, setFormError] = useState('');
  const {control, getValues, handleSubmit, formState} = useForm({
    defaultValues: {
      token: resetToken,
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      const result = await resetPassword(values);
      const successMessage = 'Password reset successful.';

      setFormMessage(successMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: successMessage,
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      await signIn(result);
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
              <AuthFormField
                autoCapitalize="none"
                control={control}
                focusedField={focusedField}
                helperText={
                  resetToken
                    ? 'Token received from your reset request.'
                    : 'Paste the reset token generated from Forgot Password.'
                }
                label="Reset Token"
                name="token"
                placeholder="Enter reset token"
                rules={{
                  required: 'Reset token is required.',
                }}
                setFocusedField={setFocusedField}
              />

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
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm new password"
                rules={getConfirmPasswordRules(getValues)}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AppFormStatus
                idleMessage={
                  formError ||
                  formMessage ||
                  'Save stays disabled until the token and passwords are valid.'
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
            <Text className="text-caption font-normal text-textMuted">MyLoanBook</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
