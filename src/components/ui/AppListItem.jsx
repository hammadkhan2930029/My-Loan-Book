import React from 'react';
import {Pressable, View} from 'react-native';

import {listRowStyles} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

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
