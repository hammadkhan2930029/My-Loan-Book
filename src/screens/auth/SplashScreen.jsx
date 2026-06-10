import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {APP_LOGO, APP_NAME, APP_TAGLINE} from '@/constants/app';
import {ROUTES} from '@/navigation';
import {getBaseCurrency} from '@/services/currencyStorage';
import {cn} from '@/utils/cn';
import {delay} from '@/utils/delay';

const splashStyles = {
  content: 'flex-1 items-center justify-between px-6 py-8',
  topGlow: 'absolute -left-12 top-8 h-40 w-40 rounded-full bg-primary-100/70',
  bottomGlow: 'absolute -right-10 bottom-16 h-48 w-48 rounded-full bg-accent-100/70',
  logoShell: 'shadow-float',
  orbitRing: 'absolute h-[210px] w-[210px] rounded-full border border-primary-100/70',
  loadingTrack: 'mt-5 h-1.5 w-40 overflow-hidden rounded-full bg-surfaceMuted',
};

export const SplashScreen = () => {
  const navigation = useNavigation();
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoTranslateY = useRef(new Animated.Value(24)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(16)).current;
  const glowPulse = useRef(new Animated.Value(0.92)).current;
  const orbitSpin = useRef(new Animated.Value(0)).current;
  const dotsPulse = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 850,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(logoTranslateY, {
        toValue: 0,
        duration: 850,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(220),
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(titleTranslateY, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.08,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.92,
          duration: 1700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const orbitLoop = Animated.loop(
      Animated.timing(orbitSpin, {
        toValue: 1,
        duration: 7000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const dotsLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(dotsPulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotsPulse, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    const loadingLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingProgress, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(loadingProgress, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    glowLoop.start();
    orbitLoop.start();
    dotsLoop.start();
    loadingLoop.start();

    const moveToNextScreen = async () => {
      await delay(2400);
      if (isMounted) {
        const baseCurrency = await getBaseCurrency();

        if (isMounted) {
          navigation.replace(
            baseCurrency ? ROUTES.LOGIN : ROUTES.BASE_CURRENCY,
          );
        }
      }
    };

    moveToNextScreen();

    return () => {
      isMounted = false;
      glowLoop.stop();
      orbitLoop.stop();
      dotsLoop.stop();
      loadingLoop.stop();
    };
  }, [
    dotsPulse,
    glowPulse,
    loadingProgress,
    logoOpacity,
    logoScale,
    logoTranslateY,
    navigation,
    orbitSpin,
    titleOpacity,
    titleTranslateY,
  ]);

  const orbitRotation = orbitSpin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const loadingTranslateX = loadingProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [-110, 110],
  });

  const secondDotOpacity = dotsPulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.35, 1, 0.35],
  });

  const thirdDotOpacity = dotsPulse.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.15, 0.55, 1],
  });

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className={cn('flex-1 justify-between px-6 py-10', splashStyles.content)}>
        <Animated.View
          className={splashStyles.topGlow}
          style={{opacity: 0.9, transform: [{scale: glowPulse}]}}
        />
        <Animated.View
          className={splashStyles.bottomGlow}
          style={{opacity: 0.8, transform: [{scale: glowPulse}]}}
        />

        <View className="w-full items-end">
          <Text className="text-[10px] font-medium uppercase tracking-widest text-textMuted">
            Personal Finance
          </Text>
        </View>

        <View className="items-center justify-center">
          <Animated.View
            className={splashStyles.orbitRing}
            style={{transform: [{rotate: orbitRotation}]}}>
            <View className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-2 rounded-full bg-accent-300" />
            <View className="absolute -bottom-2 left-7 h-3 w-3 rounded-full bg-primary-300" />
          </Animated.View>

          <Animated.View
            style={{
              opacity: logoOpacity,
              transform: [{translateY: logoTranslateY}, {scale: logoScale}],
            }}>
            <View className={cn('mb-8 rounded-[40px] bg-surfaceMuted p-6', splashStyles.logoShell)}>
              <Image
                source={APP_LOGO}
                className="h-32 w-32"
                resizeMode="contain"
              />
            </View>
          </Animated.View>

          <Animated.View
            className="items-center"
            style={{
              opacity: titleOpacity,
              transform: [{translateY: titleTranslateY}],
            }}>
            <Text className="text-center text-[32px] font-bold leading-[38px] text-textPrimary">
              {APP_NAME}
            </Text>
            <View className="mt-2 max-w-[280px]">
              <Text className="text-center text-[15px] leading-[22px] text-textSecondary">
                {APP_TAGLINE}
              </Text>
            </View>
          </Animated.View>
        </View>

        <View className="items-center">
          <View className="flex-row items-center gap-2">
            <Animated.View className="h-2 w-2 rounded-full bg-primary-500" style={{opacity: 1}} />
            <Animated.View
              className="h-2 w-2 rounded-full bg-primary-300"
              style={{opacity: secondDotOpacity}}
            />
            <Animated.View
              className="h-2 w-2 rounded-full bg-accent-300"
              style={{opacity: thirdDotOpacity}}
            />
          </View>

          <View className={splashStyles.loadingTrack}>
            <Animated.View
              className="h-full w-16 rounded-full bg-primary-500"
              style={{transform: [{translateX: loadingTranslateX}]}}
            />
          </View>

          <Text className="mt-4 text-[13px] italic text-textMuted">
            Loading your money space
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
