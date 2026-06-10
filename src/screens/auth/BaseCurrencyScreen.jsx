import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {
  AppBadge,
  AppButton,
  AppCard,
  AppInput,
  AppLogo,
} from '@/components/ui';
import {useCurrency} from '@/context/CurrencyContext';
import {ROUTES, useAuth} from '@/navigation';
import {normalizeCurrency} from '@/utils/currency';

const commonCurrencies = [
  {code: 'PKR', label: 'Pakistani Rupee'},
  {code: 'USD', label: 'US Dollar'},
  {code: 'SAR', label: 'Saudi Riyal'},
  {code: 'AED', label: 'UAE Dirham'},
  {code: 'EUR', label: 'Euro'},
  {code: 'GBP', label: 'British Pound'},
  {code: 'INR', label: 'Indian Rupee'},
];

const normalizeCurrencyInput = value =>
  String(value || '')
    .replace(/[^a-zA-Z]/g, '')
    .toUpperCase()
    .slice(0, 3);

export const BaseCurrencyScreen = () => {
  const navigation = useNavigation();
  const {isAuthenticated} = useAuth();
  const {baseCurrency, setBaseCurrency} = useCurrency();
  const [query, setQuery] = useState('');
  const [selectedCode, setSelectedCode] = useState(baseCurrency || 'PKR');

  const filteredCurrencies = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commonCurrencies;
    }

    return commonCurrencies.filter(
      currency =>
        currency.code.toLowerCase().includes(normalizedQuery) ||
        currency.label.toLowerCase().includes(normalizedQuery),
    );
  }, [query]);

  const customCode = normalizeCurrency(query);
  const canUseCustomCode =
    Boolean(customCode) &&
    !commonCurrencies.some(currency => currency.code === customCode);

  const handleContinue = () => {
    const currency = normalizeCurrency(selectedCode);

    if (!currency) {
      return;
    }

    setBaseCurrency(currency);

    if (!isAuthenticated) {
      navigation.replace(ROUTES.LOGIN);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="items-center">
          <AppBadge label="One-time setup" variant="accent" />
          <View className="mt-5">
            <AppLogo showAccentDot={false} size="md" />
          </View>
          <Text className="mt-5 text-center text-title font-bold text-textPrimary">
            Choose Base Currency
          </Text>
          <Text className="mt-2 max-w-[320px] text-center text-body text-textSecondary">
            This currency will open by default across your dashboard, reports,
            contacts and repayments.
          </Text>
        </View>

        <AppCard className="mt-7" variant="elevated">
          <AppInput
            autoCapitalize="characters"
            autoCorrect={false}
            helperText="Choose a common currency or enter any 3-letter code."
            label="Base Currency"
            maxLength={3}
            onChangeText={value => setQuery(normalizeCurrencyInput(value))}
            placeholder="Example: PKR"
            value={query}
            variant="filled"
          />

          {canUseCustomCode ? (
            <Pressable
              className="mt-4 rounded-2xl border border-primary-500 bg-primary-500 px-4 py-4"
              onPress={() => {
                setSelectedCode(customCode);
                setQuery('');
              }}>
              <Text className="text-body font-semibold text-white">
                Use {customCode}
              </Text>
              <Text className="mt-1 text-caption text-white/80">
                Set this as your base currency
              </Text>
            </Pressable>
          ) : null}

          <View className="mt-5 flex-row flex-wrap gap-3">
            {filteredCurrencies.map(currency => {
              const isSelected = currency.code === selectedCode;

              return (
                <Pressable
                  key={currency.code}
                  className={`min-w-[46%] flex-1 rounded-2xl border px-4 py-4 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-border bg-surface'
                  }`}
                  onPress={() => {
                    setSelectedCode(currency.code);
                    setQuery('');
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
        </AppCard>

        <View className="mt-auto pt-7">
          <Text className="mb-3 text-center text-caption text-textSecondary">
            Selected base currency: {selectedCode}
          </Text>
          <AppButton
            disabled={!normalizeCurrency(selectedCode)}
            label="Continue"
            onPress={handleContinue}
            variant="primary"
          />
          <Text className="mt-3 text-center text-caption text-textMuted">
            You can still switch to other transaction currencies whenever you
            need to view them.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
