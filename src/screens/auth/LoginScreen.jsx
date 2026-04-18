import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

import {ROUTES, useAuth} from '@/navigation';
import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {delay} from '@/utils/delay';
import {authValidationRules} from '@/utils/validators';

import {AuthCheckbox} from './components/AuthCheckbox';
import {AuthFormField} from './components/AuthFormField';
import {AuthLinkText} from './components/AuthLinkText';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const {signIn} = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {control, handleSubmit, formState} = useForm({
    defaultValues: {
      email: 'alex@myloanbook.app',
      password: 'password123',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    console.log('Login form values:', {...values, rememberMe});
    await delay(700);
    setIsSubmitting(false);
    signIn();
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
              Login
            </Text>
            <Text className="mt-2 max-w-[300px] text-body font-normal text-textSecondary text-center">
              Welcome back. Track balances, payments, and people from one calm finance space.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AuthFormField
                autoCapitalize="none"
                control={control}
                focusedField={focusedField}
                helperText="Use a valid email format later when validation is connected."
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
                helperText="Password field is static for now."
                label="Password"
                name="password"
                placeholder="Enter your password"
                rules={authValidationRules.password}
                secureTextEntry
                setFocusedField={setFocusedField}
              />

              <View className="flex-row items-center justify-between gap-3 py-1">
                <AuthCheckbox
                  checked={rememberMe}
                  label="Remember me"
                  onPress={() => setRememberMe(current => !current)}
                />
                <AuthLinkText
                  label="Forgot Password?"
                  onPress={() => navigation.navigate(ROUTES.FORGOT_PASSWORD)}
                />
              </View>

              <AppFormStatus
                idleMessage="Buttons stay disabled until the form becomes valid."
                submitting={isSubmitting}
                submittingMessage="Signing you in..."
              />

              <AppButton
                disabled={!formState.isValid || isSubmitting}
                label="Login"
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />

              <View className="gap-2">
                <Text className="text-caption font-normal text-textMuted text-center">
                  Demo only. No API calls are connected yet.
                </Text>
                <View className="flex-row items-center justify-center gap-1">
                  <Text className="text-caption font-normal text-textSecondary">
                    Don&apos;t have an account?
                  </Text>
                  <AuthLinkText
                    label="Register"
                    onPress={() => navigation.navigate(ROUTES.REGISTER)}
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
