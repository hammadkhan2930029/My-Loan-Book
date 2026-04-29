import React, {useEffect, useMemo, useState} from 'react';
import {KeyboardAvoidingView, Platform, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';

import {AppBadge, AppButton, AppCard, AppFormStatus, AppLogo} from '@/components/ui';
import {ROUTES, useAuth} from '@/navigation';
import {
  resendForgotPasswordOtp,
  resendRegisterOtp,
  verifyForgotPasswordOtp,
  verifyRegisterOtp,
} from '@/services/authApi';

const RESEND_SECONDS = 60;
const OTP_CELL_COUNT = 6;

export const OtpVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {signIn} = useAuth();
  const email = route.params?.email || '';
  const purpose = route.params?.purpose || 'register';
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('Enter the 6 digit code sent to your email.');
  const ref = useBlurOnFulfill({
    value: otp,
    cellCount: OTP_CELL_COUNT,
  });
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  useEffect(() => {
    if (countdown <= 0) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setCountdown(current => {
        if (current <= 1) {
          clearInterval(timerId);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [countdown]);

  const screenTitle = purpose === 'register' ? 'Verify Email' : 'Verify Reset Code';
  const verifyLabel = purpose === 'register' ? 'Verify & Continue' : 'Verify Code';
  const resendDisabled = countdown > 0 || isResending || isSubmitting;
  const helperMessage = useMemo(() => {
    if (formError) {
      return formError;
    }

    if (formMessage) {
      return formMessage;
    }

    return 'Enter the code from your inbox to continue.';
  }, [formError, formMessage]);

  const handleVerify = async () => {
    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== OTP_CELL_COUNT) {
      const errorMessage = 'Enter the 6 digit OTP code.';

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
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormMessage('');

    try {
      if (purpose === 'register') {
        const result = await verifyRegisterOtp({
          email,
          otp: trimmedOtp,
        });

        Toast.show({
          type: 'customToast',
          text1: 'Success',
          text2: 'Email verified successfully.',
          props: {
            bgColor: '#ffffff',
            borderColor: 'green',
          },
        });
        await signIn(result);
        return;
      }

      const result = await verifyForgotPasswordOtp({
        email,
        otp: trimmedOtp,
      });

      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: 'OTP verified successfully.',
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      navigation.replace(ROUTES.RESET_PASSWORD, {
        email,
        resetToken: result.resetToken,
      });
    } catch (error) {
      const errorMessage = error.message || 'OTP verification failed. Please try again.';

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

  const handleResend = async () => {
    if (resendDisabled) {
      return;
    }

    setIsResending(true);
    setFormError('');

    try {
      if (purpose === 'register') {
        await resendRegisterOtp({email});
      } else {
        await resendForgotPasswordOtp({email});
      }

      setOtp('');
      setCountdown(RESEND_SECONDS);
      setFormMessage('A fresh OTP has been sent to your email.');
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: 'New OTP sent successfully',
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
    } catch (error) {
      const errorMessage = error.message || 'Could not resend OTP. Please try again.';

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
      setIsResending(false);
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
              <AppLogo showAccentDot={false} size="md" />
            </View>
            <Text className="mt-5 text-title font-bold tracking-[-0.3px] text-textPrimary text-center">
              {screenTitle}
            </Text>
            <Text className="mt-2 text-body font-normal text-textSecondary text-center">
              Code sent to your email
            </Text>
            <Text className="mt-1 text-caption font-semibold text-primary-500 text-center">
              {email}
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-caption font-normal text-textSecondary">6 Digit OTP</Text>
                <CodeField
                  ref={ref}
                  {...codeFieldProps}
                  value={otp}
                  onChangeText={value => {
                    setOtp(value.replace(/\D/g, ''));
                    if (formError) {
                      setFormError('');
                    }
                  }}
                  cellCount={OTP_CELL_COUNT}
                  rootStyle={{justifyContent: 'space-between'}}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  autoComplete={Platform.select({
                    android: 'sms-otp',
                    default: 'one-time-code',
                  })}
                  renderCell={({index, symbol, isFocused}) => (
                    <View
                      key={index}
                      onLayout={getCellOnLayoutHandler(index)}
                      className={`h-14 w-12 items-center justify-center rounded-[18px] border ${
                        isFocused
                          ? 'border-primary-300 bg-surfaceElevated'
                          : symbol
                            ? 'border-accent-300 bg-accent-50'
                            : 'border-border bg-surface'
                      }`}>
                      <Text className="text-section font-bold text-textPrimary">
                        {symbol || (isFocused ? <Cursor /> : '')}
                      </Text>
                    </View>
                  )}
                />
              </View>

              <View className="rounded-[20px] bg-surfaceMuted px-4 py-4">
                <Text className="text-caption font-normal text-textSecondary text-center">
                  {countdown > 0
                    ? `Resend available in ${countdown}s`
                    : 'You can request a new OTP now.'}
                </Text>
              </View>

              <AppFormStatus
                idleMessage={helperMessage}
                submitting={isSubmitting}
                submittingMessage="Verifying your OTP..."
              />

              <AppButton
                disabled={otp.trim().length !== OTP_CELL_COUNT || isSubmitting || isResending}
                label={verifyLabel}
                loading={isSubmitting}
                onPress={handleVerify}
              />

              <AppButton
                disabled={resendDisabled}
                fullWidth
                label={countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                loading={isResending}
                onPress={handleResend}
                variant="secondary"
              />

              <Text className="text-caption font-normal text-textMuted text-center">
                Only the latest OTP sent to your email will work.
              </Text>
            </View>
          </AppCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
