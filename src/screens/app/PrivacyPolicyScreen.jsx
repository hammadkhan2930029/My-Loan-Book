import React, {useCallback, useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppBadge, AppCard, AppListState, AppLoader} from '@/components/ui';
import {getPrivacyPolicy} from '@/services/legalApi';

export const PrivacyPolicyScreen = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPrivacyPolicy = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getPrivacyPolicy();
      setPrivacyPolicy(result?.data || result?.privacyPolicy || null);
    } catch (error) {
      setPrivacyPolicy(null);
      setErrorMessage(error.message || 'Could not load privacy policy.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrivacyPolicy();
  }, [loadPrivacyPolicy]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <Text className="text-caption font-bold text-white/80">Your Data</Text>
          <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-white">
            {privacyPolicy?.title || 'Privacy Policy'}
          </Text>
          <Text className="mt-2 text-caption font-normal text-white/80">
            {privacyPolicy?.intro ||
              'This Privacy Policy describes how Digital Loan Tracker collects, uses, and protects your information.'}
          </Text>
          <View className="mt-4 gap-3">
            <AppBadge
              className="bg-white/15"
              label={`Effective: ${privacyPolicy?.effectiveDateLabel || 'Loading...'}`}
              variant="primary"
            />
            {privacyPolicy?.contactEmail ? (
              <Text className="text-caption font-semibold text-white/90">
                {privacyPolicy.contactEmail}
              </Text>
            ) : null}
          </View>
        </View>

        {isLoading ? (
          <View className="gap-4 pb-24">
            <AppLoader card label="Loading privacy policy..." />
            <AppLoader card label="Preparing legal content..." />
          </View>
        ) : errorMessage ? (
          <AppListState
            actionLabel="Retry"
            description={errorMessage}
            mode="empty"
            onActionPress={loadPrivacyPolicy}
            title="Privacy policy unavailable"
          />
        ) : (
          <View className="gap-4 pb-24">
            {(privacyPolicy?.sections || []).map(section => (
              <AppCard key={section.heading} variant="elevated">
                <Text className="text-section font-semibold text-textPrimary">
                  {section.heading}
                </Text>
                {section.body ? (
                  <Text className="mt-2 text-body font-normal text-textSecondary">
                    {section.body}
                  </Text>
                ) : null}
                {Array.isArray(section.bullets) && section.bullets.length ? (
                  <View className="mt-3 gap-2">
                    {section.bullets.map(bullet => (
                      <View key={bullet} className="flex-row items-start gap-3">
                        <Text className="mt-[2px] text-body font-semibold text-primary-500">
                          -
                        </Text>
                        <Text className="flex-1 text-body font-normal text-textSecondary">
                          {bullet}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </AppCard>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
