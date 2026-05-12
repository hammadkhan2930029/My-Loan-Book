import React, { useMemo, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '@/navigation';
import { AppBadge, AppButton, AppCard, AppFormStatus, AppInput, AppLogo } from '@/components/ui';
import { requestRegisterOtp } from '@/services/authApi';
import { authValidationRules, getConfirmPasswordRules } from '@/utils/validators';

import { AuthFormField } from './components/AuthFormField';
import { AuthLinkText } from './components/AuthLinkText';

const COUNTRY_CODES = [
    { code: '+92', label: 'Pakistan' },
    { code: '+91', label: 'India' },
    { code: '+880', label: 'Bangladesh' },
    { code: '+94', label: 'Sri Lanka' },
    { code: '+977', label: 'Nepal' },
    { code: '+93', label: 'Afghanistan' },
    { code: '+971', label: 'UAE' },
    { code: '+966', label: 'Saudi Arabia' },
    { code: '+974', label: 'Qatar' },
    { code: '+965', label: 'Kuwait' },
    { code: '+968', label: 'Oman' },
    { code: '+973', label: 'Bahrain' },
    { code: '+962', label: 'Jordan' },
    { code: '+20', label: 'Egypt' },
    { code: '+90', label: 'Turkey' },
    { code: '+44', label: 'UK' },
    { code: '+1', label: 'USA / Canada' },
    { code: '+61', label: 'Australia' },
    { code: '+64', label: 'New Zealand' },
    { code: '+49', label: 'Germany' },
    { code: '+33', label: 'France' },
    { code: '+39', label: 'Italy' },
    { code: '+34', label: 'Spain' },
    { code: '+31', label: 'Netherlands' },
    { code: '+32', label: 'Belgium' },
    { code: '+41', label: 'Switzerland' },
    { code: '+46', label: 'Sweden' },
    { code: '+47', label: 'Norway' },
    { code: '+45', label: 'Denmark' },
    { code: '+358', label: 'Finland' },
    { code: '+48', label: 'Poland' },
    { code: '+351', label: 'Portugal' },
    { code: '+353', label: 'Ireland' },
    { code: '+86', label: 'China' },
    { code: '+81', label: 'Japan' },
    { code: '+82', label: 'South Korea' },
    { code: '+65', label: 'Singapore' },
    { code: '+60', label: 'Malaysia' },
    { code: '+66', label: 'Thailand' },
    { code: '+62', label: 'Indonesia' },
    { code: '+63', label: 'Philippines' },
    { code: '+84', label: 'Vietnam' },
    { code: '+27', label: 'South Africa' },
    { code: '+234', label: 'Nigeria' },
    { code: '+254', label: 'Kenya' },
];

export const RegisterScreen = () => {
    const navigation = useNavigation();
    const [focusedField, setFocusedField] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [formError, setFormError] = useState('');
    const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRY_CODES[0]);
    const [isCountryCodeModalVisible, setIsCountryCodeModalVisible] = useState(false);
    const { control, getValues, handleSubmit, formState, reset } = useForm({
        defaultValues: {
            fullName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });
    const selectedCountrySummary = useMemo(
        () => `${selectedCountryCode.label} (${selectedCountryCode.code})`,
        [selectedCountryCode],
    );

    const onSubmit = async values => {
        setIsSubmitting(true);
        setFormMessage('');
        setFormError('');

        try {
            await requestRegisterOtp({
                ...values,
                phone: `${selectedCountryCode.code}${values.phone.replace(/\D/g, '')}`,
            });
            const successMessage = 'Verification code sent successfully.';

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
            setSelectedCountryCode(COUNTRY_CODES[0]);
            navigation.navigate(ROUTES.OTP_VERIFICATION, {
                email: values.email,
                purpose: 'register',
            });
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
                            <AppLogo showAccentDot={false} size="md" />
                        </View>
                        <Text className="mt-5 text-title font-bold tracking-[-0.3px] text-textPrimary text-center">
                            Register
                        </Text>
                        {/* <Text className="mt-2 max-w-[300px] text-body font-normal text-textSecondary text-center">
                            Create your account to organize transactions, contacts, and records in one place.
                        </Text> */}
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

                            <Controller
                                control={control}
                                name="phone"
                                rules={authValidationRules.phone}
                                render={({ field, fieldState }) => (
                                    <AppInput
                                        errorText={fieldState.error?.message}
                                        // helperText={
                                        //     !fieldState.error
                                        //         ? `Selected: ${selectedCountrySummary}. Enter number without starting 0.`
                                        //         : undefined
                                        // }
                                        isFocused={focusedField === 'phone'}
                                        keyboardType="phone-pad"
                                        label="Phone"
                                        leftElement={
                                            <Pressable
                                                className="flex-row items-center gap-2"
                                                hitSlop={8}
                                                onPress={() => setIsCountryCodeModalVisible(true)}>
                                                <Text className="text-body font-semibold text-textPrimary">
                                                    {selectedCountryCode.code}
                                                </Text>
                                                <Ionicons
                                                    color="#8a97a8"
                                                    name="chevron-down-outline"
                                                    size={18}
                                                />
                                            </Pressable>
                                        }
                                        onBlur={() => {
                                            field.onBlur();
                                            setFocusedField('');
                                        }}
                                        onChangeText={value => {
                                            const sanitizedValue = value.replace(/\D/g, '');
                                            field.onChange(sanitizedValue);
                                        }}
                                        onFocus={() => setFocusedField('phone')}
                                        placeholder="3001234567"
                                        value={field.value}
                                        variant="filled"
                                    />
                                )}
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
                                // helperText="Keep this structure ready for confirm-password validation later."
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
                                {/* <Text className="text-caption font-normal text-textMuted text-center">
                                    Your account is created through the Digital Loan Tracker backend.
                                </Text> */}
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
                        <Text className="text-caption font-normal text-textMuted">Digital Loan Tracker</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal
                animationType="fade"
                transparent
                visible={isCountryCodeModalVisible}
                onRequestClose={() => setIsCountryCodeModalVisible(false)}>
                <Pressable
                    className="flex-1 justify-end bg-black/30 px-6 pb-8"
                    onPress={() => setIsCountryCodeModalVisible(false)}>
                    <Pressable onPress={() => {}}>
                        <AppCard className="max-h-[520px]" variant="elevated">
                            <View className="gap-3">
                                <Text className="text-section font-semibold text-textPrimary">
                                    Select country code
                                </Text>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    contentContainerClassName="gap-3 pr-1">
                                    {COUNTRY_CODES.map(item => {
                                        const isSelected = item.code === selectedCountryCode.code;

                                        return (
                                            <Pressable
                                                key={item.code}
                                                className="flex-row items-center justify-between rounded-[18px] border border-border px-4 py-3"
                                                onPress={() => {
                                                    setSelectedCountryCode(item);
                                                    setIsCountryCodeModalVisible(false);
                                                }}>
                                                <View>
                                                    <Text className="text-body font-semibold text-textPrimary">
                                                        {item.label}
                                                    </Text>
                                                    <Text className="mt-1 text-caption font-normal text-textSecondary">
                                                        {item.code}
                                                    </Text>
                                                </View>
                                                {isSelected ? (
                                                    <Ionicons color="#1d4ed8" name="checkmark-circle" size={20} />
                                                ) : null}
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </AppCard>
                    </Pressable>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
};
