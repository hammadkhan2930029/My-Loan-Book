import React from 'react';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';

import {APP_NAME} from '@/constants/app';
import {AppBadge, AppCard, AppLogo, ScreenContainer} from '@/components/ui';

const authStyles = {
  keyboard: 'flex-1',
  content: 'flex-grow justify-center px-5 py-6',
  hero: 'items-center pb-7 pt-3',
  heroTitle: 'mt-5 text-center',
  heroSubtitle: 'mt-2 max-w-[300px] text-center',
  formCard: 'rounded-[32px]',
  formStack: 'gap-4.5',
  footerWrap: 'mt-5 items-center gap-2',
};

export const AuthScreenShell = ({title, subtitle, children, keyboardOffset = 0}) => {
  return (
    <ScreenContainer
      edges={['top', 'bottom']}
      keyboardDismissMode="on-drag"
      scrollable>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
        className={authStyles.keyboard}>
        <View className={authStyles.content}>
          <View className={authStyles.hero}>
            <AppBadge label="Secure Access" variant="primary" />
            <View className="mt-5">
              <AppLogo size="md" />
            </View>
            <View className={authStyles.heroTitle}>
              <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary text-center">
                {title}
              </Text>
            </View>
            <View className={authStyles.heroSubtitle}>
              <Text className="text-body font-normal text-textSecondary text-center">
                {subtitle}
              </Text>
            </View>
          </View>

          <View className={authStyles.formCard}>
            <AppCard variant="elevated">
              <View className={authStyles.formStack}>{children}</View>
            </AppCard>
          </View>

          <View className={authStyles.footerWrap}>
            <Text className="text-caption font-normal text-textMuted">{APP_NAME}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};
