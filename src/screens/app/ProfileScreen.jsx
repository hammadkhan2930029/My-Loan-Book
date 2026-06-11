import React, {useMemo, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import {useCurrency} from '@/context/CurrencyContext';
import {ROUTES, useAuth} from '@/navigation';
import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppInput,
} from '@/components/ui';
import {
  CURRENCY_OPTIONS,
  getCurrencyLabel,
  normalizeCurrencyInput,
} from '@/constants/currencies';
import {normalizeCurrencies, normalizeCurrency} from '@/utils/currency';

const APP_SHARE_MESSAGE =
  'Digital Loan Tracker helps you track personal loans and repayments easily. Stay organized and keep every record at your fingertips.\n\nhttps://play.google.com/store/apps/details?id=com.wiin.digitalloantracker&pcampaignid=web_share';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const {session, signOut} = useAuth();
  const {
    availableCurrencies,
    baseCurrency,
    selectedCurrency,
    setBaseCurrency,
  } = useCurrency();
  const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const [pendingBaseCurrency, setPendingBaseCurrency] = useState(
    baseCurrency || selectedCurrency || 'PKR',
  );
  const profile = session?.user || {
    fullName: 'Digital Loan Tracker User',
    email: 'No email found',
    phone: 'No phone found',
    profilePhoto: '',
  };
  const regCode = profile.reg_code || session?.reg_code || 'Not available';
  const currencyOptions = useMemo(() => {
    const codes = normalizeCurrencies([
      baseCurrency,
      ...availableCurrencies,
      ...CURRENCY_OPTIONS.map(currency => currency.code),
    ]);

    return codes.map(code => ({
      code,
      label: getCurrencyLabel(code),
    }));
  }, [availableCurrencies, baseCurrency]);
  const filteredCurrencyOptions = useMemo(() => {
    const query = currencyQuery.trim().toLowerCase();

    if (!query) {
      return currencyOptions;
    }

    return currencyOptions.filter(
      currency =>
        currency.code.toLowerCase().includes(query) ||
        currency.label.toLowerCase().includes(query),
    );
  }, [currencyOptions, currencyQuery]);
  const customCurrencyCode = normalizeCurrency(currencyQuery);
  const canUseCustomCurrency =
    Boolean(customCurrencyCode) &&
    !currencyOptions.some(currency => currency.code === customCurrencyCode);

  const openCurrencyModal = () => {
    setPendingBaseCurrency(baseCurrency || selectedCurrency || 'PKR');
    setCurrencyQuery('');
    setIsCurrencyModalVisible(true);
  };

  const handleSaveBaseCurrency = () => {
    const currency = normalizeCurrency(pendingBaseCurrency);

    if (!currency) {
      return;
    }

    setBaseCurrency(currency);
    setIsCurrencyModalVisible(false);
    setCurrencyQuery('');
    Toast.show({
      type: 'customToast',
      text1: 'Base currency updated',
      text2: `${currency} will now open by default across the app.`,
      props: {
        bgColor: '#ffffff',
        borderColor: 'green',
      },
    });
  };

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

  const handleShareApp = async () => {
    try {
      await Share.share({
        title: 'Digital Loan Tracker',
        message: APP_SHARE_MESSAGE,
      });
    } catch (error) {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: error.message || 'Could not open share options.',
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
    }
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
              <View className="rounded-[18px] border border-border bg-surfaceMuted px-4 py-4">
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1">
                    <Text className="text-caption font-normal text-textSecondary">
                      Base Currency
                    </Text>
                    <Text className="mt-1 text-body font-semibold text-textPrimary">
                      {baseCurrency || selectedCurrency || 'Not selected'}
                    </Text>
                  </View>
                  <AppBadge label="Default" variant="accent" />
                </View>
                <Text className="mt-2 text-caption font-normal text-textSecondary">
                  This currency opens by default across the app.
                </Text>
                <View className="mt-4">
                  <AppButton
                    label="Change Base Currency"
                    onPress={openCurrencyModal}
                    size="md"
                    variant="secondary"
                  />
                </View>
              </View>
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
              <AppButton
                label="Share App"
                onPress={handleShareApp}
                variant="secondary"
              />
              <AppButton label="Logout" onPress={signOut} variant="secondary" />
            </View>
          </AppCard>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsCurrencyModalVisible(false)}
        transparent
        visible={isCurrencyModalVisible}>
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="flex-1"
            onPress={() => setIsCurrencyModalVisible(false)}
          />
          <View className="max-h-[82%] rounded-t-[32px] bg-background px-6 pb-8 pt-6">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-title font-bold text-textPrimary">
                  Change Base Currency
                </Text>
                <Text className="mt-1 text-caption text-textSecondary">
                  The selected currency will become the default across the app.
                </Text>
              </View>
              <Pressable
                hitSlop={8}
                onPress={() => setIsCurrencyModalVisible(false)}>
                <Text className="text-body font-semibold text-primary-500">
                  Close
                </Text>
              </Pressable>
            </View>

            <View className="mt-5">
              <AppInput
                autoCapitalize="characters"
                autoCorrect={false}
                helperText="Select a currency or enter any 3-letter code."
                label="Currency"
                maxLength={3}
                onChangeText={value =>
                  setCurrencyQuery(normalizeCurrencyInput(value))
                }
                placeholder="Example: USD"
                value={currencyQuery}
                variant="filled"
              />
            </View>

            <ScrollView
              className="mt-4"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {canUseCustomCurrency ? (
                <Pressable
                  className="mb-3 rounded-2xl border border-primary-500 bg-primary-500 px-4 py-4"
                  onPress={() => {
                    setPendingBaseCurrency(customCurrencyCode);
                    setCurrencyQuery('');
                  }}>
                  <Text className="text-body font-semibold text-white">
                    Use {customCurrencyCode}
                  </Text>
                  <Text className="mt-1 text-caption text-white/80">
                    Set custom currency as default
                  </Text>
                </Pressable>
              ) : null}

              <View className="flex-row flex-wrap gap-3">
                {filteredCurrencyOptions.map(currency => {
                  const isSelected = currency.code === pendingBaseCurrency;

                  return (
                    <Pressable
                      key={currency.code}
                      className={`min-w-[46%] flex-1 rounded-2xl border px-4 py-4 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-border bg-surface'
                      }`}
                      onPress={() => {
                        setPendingBaseCurrency(currency.code);
                        setCurrencyQuery('');
                      }}>
                      <Text
                        className={`text-body font-semibold ${
                          isSelected ? 'text-white' : 'text-textPrimary'
                        }`}>
                        {currency.code}
                      </Text>
                      <Text
                        className={`mt-1 text-caption ${
                          isSelected ? 'text-white/80' : 'text-textSecondary'
                        }`}>
                        {currency.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            <View className="mt-5">
              <Text className="mb-3 text-center text-caption text-textSecondary">
                New base currency: {pendingBaseCurrency}
              </Text>
              <AppButton
                disabled={!normalizeCurrency(pendingBaseCurrency)}
                label="Save Base Currency"
                onPress={handleSaveBaseCurrency}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
