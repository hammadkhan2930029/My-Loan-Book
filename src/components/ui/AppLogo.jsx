import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

export const AppLogo = ({size = 'lg', className}) => {
  const sizeMap = {
    md: {
      shell: 'h-24 w-24 rounded-[28px]',
      core: 'h-14 w-14',
      accent: 'h-5 w-5',
      text: 'sectionTitle',
    },
    lg: {
      shell: 'h-32 w-32 rounded-[36px]',
      core: 'h-16 w-16',
      accent: 'h-6 w-6',
      text: 'title',
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
      <View
        className={cn(
          'items-center justify-center rounded-full bg-primary-500',
          currentSize.core,
        )}>
        <AppText className="text-white" variant={currentSize.text}>
          ML
        </AppText>
      </View>
      <View
        className={cn(
          'absolute bottom-5 right-5 rounded-full border-2 border-surfaceElevated bg-accent-300',
          currentSize.accent,
        )}
      />
    </View>
  );
};
