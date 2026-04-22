import React from 'react';
import {Pressable, View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const listRowStyles = {
  container: 'min-h-[76px] flex-row items-center gap-3 py-3.5',
  divider: 'border-b border-border',
  content: 'flex-1 justify-center',
  title: 'text-textPrimary',
  subtitle: 'mt-1 text-textSecondary',
  trailingText: 'text-right text-primary-600',
  trailingWrap: 'items-end justify-center gap-1',
  sideWrap: 'items-center justify-center',
};

export const AppListItem = ({
  title,
  subtitle,
  leftElement,
  rightElement,
  rightText,
  showDivider = true,
  className,
  ...props
}) => {
  return (
    <Pressable
      className={cn(
        listRowStyles.container,
        showDivider && listRowStyles.divider,
        className,
      )}
      {...props}>
      {leftElement ? <View className={listRowStyles.sideWrap}>{leftElement}</View> : null}

      <View className={listRowStyles.content}>
        <AppText className={listRowStyles.title} variant="body">
          {title}
        </AppText>
        {subtitle ? (
          <AppText className={listRowStyles.subtitle} variant="caption" color="secondary">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {rightText ? (
        <View className={listRowStyles.trailingWrap}>
          <AppText className={listRowStyles.trailingText} variant="caption" color="brand">
            {rightText}
          </AppText>
        </View>
      ) : null}

      {rightElement ? <View className={listRowStyles.sideWrap}>{rightElement}</View> : null}
    </Pressable>
  );
};
