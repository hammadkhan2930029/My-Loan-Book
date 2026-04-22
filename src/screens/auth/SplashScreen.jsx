
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { ROUTES } from '@/navigation';
// Logo aapka custom component hi rahega kyunke wo image/svg ho sakta hai
import { AppLogo } from '@/components/ui'; 
import { cn } from '@/utils/cn';
import { delay } from '@/utils/delay';

const splashStyles = {
  content: 'flex-1 items-center justify-between px-6 py-8',
  topGlow: 'absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary-100/70',
  bottomGlow: 'absolute -right-10 bottom-16 h-48 w-48 rounded-full bg-accent-100/70',
  logoShell: 'shadow-float',
};

export const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    let isMounted = true;

    const moveToLogin = async () => {
      await delay(1800);
      if (isMounted) {
        navigation.replace(ROUTES.LOGIN);
      }
    };

    moveToLogin();

    return () => {
      isMounted = false;
    };
  }, [navigation]);

  return (
    // ScreenContainer ki jagah SafeAreaView use kiya hai
    <SafeAreaView className="flex-1 bg-background">
      <View className={cn("flex-1 px-6 justify-between py-10", splashStyles.content)}>
        
        {/* Glow Effects (Background designs) */}
        <View className={splashStyles.topGlow} />
        <View className={splashStyles.bottomGlow} />

        {/* Top Text Section */}
        <View className="w-full items-end">
          <Text className="text-textMuted uppercase tracking-widest text-[10px] font-medium">
            Personal Finance
          </Text>
        </View>

        {/* Center Section: Logo aur Title */}
        <View className="items-center justify-center">
          <View className={cn("p-6 rounded-[40px] bg-surfaceMuted mb-8", splashStyles.logoShell)}>
            <AppLogo size="lg" />
          </View>

          <View className="items-center">
            <Text className="text-[32px] leading-[38px] font-bold text-textPrimary text-center">
              {APP_NAME}
            </Text>
            <View className="max-w-[280px] mt-2">
              <Text className="text-center text-textSecondary text-[15px] leading-[22px]">
                {APP_TAGLINE}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Section: Progress dots aur loading text */}
        <View className="items-center">
          <View className="flex-row space-x-2 mb-4">
            <View className="h-2 w-2 rounded-full bg-primary-500" />
            <View className="h-2 w-2 rounded-full bg-border" />
            <View className="h-2 w-2 rounded-full bg-border" />
          </View>
          
          <Text className="text-textMuted text-[13px] italic">
            Loading your money space
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
