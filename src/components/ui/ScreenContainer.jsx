import React from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {cn} from '@/utils/cn';

const commonLayoutWrappers = {
  screen: 'flex-1 bg-background',
  screenContent: 'px-5 py-4',
};

export const ScreenContainer = ({
  children,
  scrollable = false,
  edges = ['top'],
  className,
  contentClassName,
  keyboardShouldPersistTaps = 'handled',
  keyboardDismissMode = 'interactive',
  ...props
}) => {
  if (scrollable) {
    return (
      <SafeAreaView edges={edges} {...props}>
        <View className={cn(commonLayoutWrappers.screen, className)}>
          <ScrollView
            bounces={false}
            contentContainerClassName={cn(
              `flex-grow ${commonLayoutWrappers.screenContent}`,
              contentClassName,
            )}
            keyboardDismissMode={keyboardDismissMode}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={edges} {...props}>
      <View className={cn(commonLayoutWrappers.screen, className)}>
        <View className={cn(`flex-1 ${commonLayoutWrappers.screenContent}`, contentClassName)}>
          {children}
        </View>
      </View>
    </SafeAreaView>
  );
};
