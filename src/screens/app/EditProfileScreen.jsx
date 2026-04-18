import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';

import {delay} from '@/utils/delay';
import {authValidationRules} from '@/utils/validators';
import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppFormStatus,
} from '@/components/ui';
import {AuthFormField} from '@/screens';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {control, handleSubmit, formState} = useForm({
    defaultValues: {
      fullName: 'Alex Morgan',
      email: 'alex@myloanbook.app',
      phone: '+1 234 567 890',
    },
    mode: 'onChange',
  });

  const onSubmit = async values => {
    setIsSubmitting(true);
    console.log('Edit profile form values:', values);
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
                Update your personal details while keeping the account layout consistent.
              </Text>
              <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                Edit Profile
              </Text>
            </View>
            <AppBadge label="Draft" variant="accent" />
          </View>
        </View>

        <AppCard variant="elevated">
          <View className="items-center gap-4">
            <AppAvatar name="Alex Morgan" size="xl" variant="primary" />
            <View className="items-center">
              <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                Alex Morgan
              </Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                Profile image placeholder
              </Text>
            </View>
            <AppButton label="Change Photo" size="md" variant="secondary" />
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Profile Details</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              These fields are validation-ready and still using static data only.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AuthFormField
                control={control}
                focusedField={focusedField}
                helperText="Keep your first and last name here."
                label="Full Name"
                name="fullName"
                placeholder="Enter full name"
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
            </View>
          </AppCard>
        </View>

        <AppFormStatus
          idleMessage="Save changes becomes available when the edited profile stays valid."
          submitting={isSubmitting}
          submittingMessage="Saving your profile..."
        />

        <AppButton
          disabled={!formState.isValid || isSubmitting}
          label="Save Changes"
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
