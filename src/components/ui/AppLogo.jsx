import React from 'react';
import {Image, View} from 'react-native';

import {APP_LOGO} from '@/constants/app';
import {cn} from '@/utils/cn';

export const AppLogo = ({size = 'lg', className, showAccentDot = true}) => {
  const sizeMap = {
    md: {
      shell: 'h-24 w-24 rounded-[28px]',
      image: 'h-16 w-16',
      accent: 'h-5 w-5',
    },
    lg: {
      shell: 'h-32 w-32 rounded-[36px]',
      image: 'h-24 w-24',
      accent: 'h-6 w-6',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  return (
    <View
      className={cn(
        'items-center justify-center border border-borderStrong bg-surfaceElevated shadow-float',
        currentSize.shell,
        className,
      )}>
      <View className="absolute -right-2 -top-2 h-10 w-10 rounded-full bg-accent-100" />
      <View className="absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-primary-100" />
      <Image
        source={APP_LOGO}
        className={cn(
          currentSize.image,
        )}
        resizeMode="contain"
      />
      {showAccentDot ? (
        <View
          className={cn(
            'absolute bottom-5 right-5 rounded-full border-2 border-surfaceElevated bg-accent-300',
            currentSize.accent,
          )}
        />
      ) : null}
    </View>
  );
};
