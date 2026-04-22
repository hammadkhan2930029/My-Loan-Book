import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const sectionStyles = {
  container: 'gap-4',
  titleGroup: 'gap-1',
};

export const Section = ({title, subtitle, children, className, ...props}) => {
  return (
    <View className={cn(sectionStyles.container, className)} {...props}>
      {title ? (
        <View className={sectionStyles.titleGroup}>
          <AppText variant="sectionTitle">{title}</AppText>
          {subtitle ? (
            <AppText variant="caption" color="secondary">
              {subtitle}
            </AppText>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};
