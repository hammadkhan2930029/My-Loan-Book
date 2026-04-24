import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const emptyStateStyles = {
  container:
    'w-full items-center rounded-[28px] border border-dashed border-border bg-surfaceMuted px-6 py-8',
  icon: 'h-16 w-16 items-center justify-center rounded-full bg-primary-500',
  title: 'mt-4 text-center',
  description: 'mt-2 text-center',
  action: 'mt-5 w-full',
};

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
        <AppText className="text-white" variant="title">
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
