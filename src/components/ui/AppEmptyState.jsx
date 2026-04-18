import React from 'react';
import {View} from 'react-native';

import {emptyStateStyles} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

export const AppEmptyState = ({
  title,
  description,
  action,
  iconLabel = '0',
  className,
  ...props
}) => {
  return (
    <View className={cn(emptyStateStyles.container, className)} {...props}>
      <View className={emptyStateStyles.icon}>
        <AppText variant="title" color="brand">
          {iconLabel}
        </AppText>
      </View>
      <AppText className={emptyStateStyles.title} variant="sectionTitle">
        {title}
      </AppText>
      {description ? (
        <AppText className={emptyStateStyles.description} color="secondary">
          {description}
        </AppText>
      ) : null}
      {action ? <View className={emptyStateStyles.action}>{action}</View> : null}
    </View>
  );
};
