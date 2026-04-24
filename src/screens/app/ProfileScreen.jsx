import React from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {ROUTES, useAuth} from '@/navigation';
import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
} from '@/components/ui';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const {session, signOut} = useAuth();
  const profile = session?.user || {
    fullName: 'MyLoanBook User',
    email: 'No email found',
    phone: 'No phone found',
    profilePhoto: '',
  };
  const regCode = profile.reg_code || session?.reg_code || 'Not available';

  const copyRegCode = () => {
    if (!profile.reg_code && !session?.reg_code) {
      return;
    }

    Clipboard.setString(regCode);
    Toast.show({
      type: 'customToast',
      text1: 'Copied',
      text2: `Reg code ${regCode} copied.`,
      props: {
        bgColor: '#ffffff',
        borderColor: 'green',
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 pt-8 pb-32 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Manage your personal details and account security from one place.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Profile
            </Text>
          </View>
          <AppBadge label="Account" variant="accent" />
        </View>

        <AppCard variant="elevated">
          <View className="flex-row items-center gap-4">
            <AppAvatar
              imageUri={profile.profilePhoto}
              name={profile.fullName}
              size="xl"
              variant="primary"
            />
            <View className="flex-1">
              <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                {profile.fullName}
              </Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                Personal transaction tracker
              </Text>
            </View>
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Account Details</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Basic account information shown on your profile.
            </Text>
          </View>

          <AppCard padding="sm">
            <View className="gap-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-caption font-normal text-textSecondary">Full Name</Text>
                  <Text className="mt-1 text-body font-normal text-textPrimary">
                    {profile.fullName}
                  </Text>
                </View>
                <AppBadge label="Primary" variant="primary" />
              </View>

              <View>
                <Text className="text-caption font-normal text-textSecondary">Email</Text>
                <Text className="mt-1 text-body font-normal text-textPrimary">{profile.email}</Text>
              </View>

              <View>
                <Text className="text-caption font-normal text-textSecondary">Phone</Text>
                <Text className="mt-1 text-body font-normal text-textPrimary">{profile.phone}</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                disabled={regCode === 'Not available'}
                onPress={copyRegCode}
                className="flex-row items-center justify-between gap-3 rounded-[18px] border border-border bg-surfaceMuted px-4 py-3 active:bg-primary-50">
                <View className="flex-1">
                  <Text className="text-caption font-normal text-textSecondary">Reg Code</Text>
                  <Text className="mt-1 text-body font-semibold text-textPrimary">
                    {regCode}
                  </Text>
                </View>
                <AppBadge label="Copy" variant="success" />
              </Pressable>
            </View>
          </AppCard>
        </View>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Settings</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Quick actions for updating your profile and account access.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AppButton
                label="Edit Profile"
                onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)}
                variant="primary"
              />
              <AppButton
                label="Change Password"
                onPress={() => navigation.navigate(ROUTES.CHANGE_PASSWORD)}
                variant="secondary"
              />
              <AppButton label="Logout" onPress={signOut} variant="secondary" />
            </View>
          </AppCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
