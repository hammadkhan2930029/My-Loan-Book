import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import {ROUTES, useAuth} from '@/navigation';
import {updateProfile} from '@/services/authApi';
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
  const {session, signIn} = useAuth();
  const profile = session?.user || {
    fullName: '',
    email: '',
    phone: '',
    profilePhoto: '',
  };
  const [focusedField, setFocusedField] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const {control, handleSubmit, formState, setValue, watch} = useForm({
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      profilePhoto: profile.profilePhoto || '',
    },
    mode: 'onChange',
  });
  const previewPhoto = watch('profilePhoto');

  const pickProfilePhoto = async () => {
    let result;

    try {
      result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 600,
        maxHeight: 600,
        quality: 0.6,
        selectionLimit: 1,
      });
    } catch (pickerError) {
      const errorMessage =
        pickerError.message || 'Could not open image picker. Please try again.';

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

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      const errorMessage = result.errorMessage || 'Could not select profile photo.';

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

    const selectedAsset = result.assets?.[0];

    if (!selectedAsset?.base64) {
      const errorMessage = 'Selected image could not be prepared. Please try another photo.';

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

    const imageType = selectedAsset.type || 'image/jpeg';
    const imageData = `data:${imageType};base64,${selectedAsset.base64}`;

    setFormError('');
    setFormMessage('Profile photo selected. Save changes to update your account.');
    setValue('profilePhoto', imageData, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeProfilePhoto = () => {
    setFormError('');
    setFormMessage('Profile photo removed. Save changes to update your account.');
    setValue('profilePhoto', '', {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const onSubmit = async values => {
    setIsSubmitting(true);
    setFormMessage('');
    setFormError('');

    try {
      const result = await updateProfile(values);
      const successMessage = 'Profile updated successfully.';
      const nextSession = session
        ? {
            ...session,
            user: result.user,
          }
        : {
            user: result.user,
          };

      setFormMessage(successMessage);
      await signIn(nextSession);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: successMessage,
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      navigation.navigate(ROUTES.MAIN_TABS, {
        screen: ROUTES.PROFILE,
      });
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed. Please try again.';

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
            <AppAvatar
              imageUri={previewPhoto}
              name={profile.fullName || 'MyLoanBook User'}
              size="xl"
              variant="primary"
            />
            <View className="items-center">
              <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                {profile.fullName || 'MyLoanBook User'}
              </Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                Profile details synced with your account
              </Text>
            </View>
            <AppButton
              label="Change Photo"
              onPress={pickProfilePhoto}
              size="md"
              variant="secondary"
            />
            {previewPhoto ? (
              <AppButton
                label="Remove Photo"
                onPress={removeProfilePhoto}
                size="md"
                variant="ghost"
              />
            ) : null}
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Profile Details</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              These fields update your saved MyLoanBook account details.
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
          idleMessage={
            formError ||
            formMessage ||
            'Save changes becomes available when the edited profile stays valid.'
          }
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
