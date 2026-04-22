import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';

import {ROUTES} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {registerUser} from '@/services/authApi';
import {authValidationRules, getConfirmPasswordRules} from '@/utils/validators';

import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const {control, getValues, handleSubmit, formState, reset} = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
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
      const result = await registerUser(values);
      const successMessage =
        result.user?.reg_code
          ? `Registration successful. Reg code: ${result.user.reg_code}`
          : 'Registration successful. Please login.';

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
      reset();

      setTimeout(() => {
        navigation.navigate(ROUTES.LOGIN);
      }, 1200);
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';

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
              Register
            </Text>
            <Text className="mt-2 max-w-[300px] text-body font-normal text-textSecondary text-center">
              Create your account to organize transactions, contacts, and records in one place.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AuthFormField
                control={control}
                focusedField={focusedField}
                label="Full Name"
                name="fullName"
                placeholder="Enter your full name"
                rules={authValidationRules.fullName}
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                autoCapitalize="none"
                control={control}
                focusedField={focusedField}
                keyboardType="email-address"
                label="Email"
                name="email"
                placeholder="you@example.com"
                rules={authValidationRules.email}
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                keyboardType="phone-pad"
                label="Phone"
                name="phone"
                placeholder="+1 234 567 890"
                rules={authValidationRules.phone}
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                label="Password"
                name="password"
                placeholder="Create a password"
                rules={authValidationRules.password}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AuthFormField
                control={control}
                focusedField={focusedField}
                helperText="Keep this structure ready for confirm-password validation later."
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Re-enter password"
                rules={getConfirmPasswordRules(getValues)}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <AppFormStatus
                idleMessage={
                  formError ||
                  formMessage ||
                  'Create account stays disabled until all fields are valid.'
                }
                submitting={isSubmitting}
                submittingMessage="Creating your account..."
              />

              <AppButton
                disabled={!formState.isValid || isSubmitting}
                label="Register"
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />

              <View className="gap-2">
                <Text className="text-caption font-normal text-textMuted text-center">
                  Your account is created through the MyLoanBook backend.
                </Text>
                <View className="flex-row items-center justify-center gap-1">
                  <Text className="text-caption font-normal text-textSecondary">
                    Already have an account?
                  </Text>
                  <AuthLinkText
                    label="Login"
                    onPress={() => navigation.navigate(ROUTES.LOGIN)}
                  />
                </View>
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
