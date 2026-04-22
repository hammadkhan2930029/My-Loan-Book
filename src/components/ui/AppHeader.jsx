import React from 'react';
import {Pressable, View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const headerStyles = {
  container: 'flex-row items-start justify-between gap-4',
  leadingGroup: 'flex-1 flex-row items-start gap-3',
  backButton: 'h-12 w-12 items-center justify-center rounded-full bg-surfaceMuted',
  titleGroup: 'flex-1',
  subtitle: 'mt-1 max-w-[320px]',
  rightWrap: 'min-h-[48px] items-center justify-center',
};

export const AppHeader = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  onBackPress,
  className,
  ...props
}) => {
  return (
    <View className={cn(headerStyles.container, className)} {...props}>
      <View className={headerStyles.leadingGroup}>
        {onBackPress ? (
          <Pressable
            accessibilityLabel="Go back"
            hitSlop={10}
            className={headerStyles.backButton}
            onPress={onBackPress}>
            <AppText variant="sectionTitle">{'<'}</AppText>
          </Pressable>
        ) : leftElement ? (
          <View>{leftElement}</View>
        ) : null}

        <View className={headerStyles.titleGroup}>
          <AppText variant="title">{title}</AppText>
          {subtitle ? (
            <AppText className={headerStyles.subtitle} variant="caption" color="secondary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
      </View>

      {rightElement ? <View className={headerStyles.rightWrap}>{rightElement}</View> : null}
    </View>
  );
};
