import React from 'react';
import {ScrollView, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {commonLayoutWrappers} from '@/design-system';
import {cn} from '@/utils/cn';

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
