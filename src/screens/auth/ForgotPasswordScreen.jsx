import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {ROUTES} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {forgotPassword} from '@/services/authApi';
import {authValidationRules} from '@/utils/validators';

import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const {control, handleSubmit, formState} = useForm({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      const result = await forgotPassword(values);
      const successMessage = result.expiresInMinutes
        ? `Reset token generated. It expires in ${result.expiresInMinutes} minutes.`
        : 'Reset token generated.';

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
      navigation.navigate(ROUTES.RESET_PASSWORD, {
        email: values.email,
        resetToken: result.resetToken,
        expiresInMinutes: result.expiresInMinutes,
      });
    } catch (error) {
      const errorMessage =
        error.message || 'Password reset request failed. Please try again.';

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
              Forgot Password
            </Text>
            <Text className="mt-2 max-w-[300px] text-body font-normal text-textSecondary text-center">
              Enter your email and we&apos;ll prepare a secure password reset token.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <Text className="text-body font-normal text-textSecondary">
                We&apos;ll send reset instructions to the email associated with your account.
              </Text>

              <AuthFormField
                autoCapitalize="none"
                control={control}
                helperText="Use the email address attached to your MyLoanBook account."
                focusedField={focusedField}
                keyboardType="email-address"
                label="Email"
                name="email"
                placeholder="you@example.com"
                rules={authValidationRules.email}
                setFocusedField={setFocusedField}
              />

              <AppFormStatus
                idleMessage={
                  formError ||
                  formMessage ||
                  'Submit becomes available after entering a valid email.'
                }
                submitting={isSubmitting}
                submittingMessage="Requesting reset token..."
              />

              <AppButton
                disabled={!formState.isValid || isSubmitting}
                label="Submit"
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />

              <View className="items-center">
                <AuthLinkText
                  label="Back to Login"
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
