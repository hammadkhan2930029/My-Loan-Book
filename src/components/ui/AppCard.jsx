import React from 'react';
import {View} from 'react-native';

import {cardStyles} from '@/design-system';
import {cn} from '@/utils/cn';

export const AppCard = ({
  children,
  padding = 'md',
  variant = 'default',
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        cardStyles.base,
        cardStyles.variants[variant],
        cardStyles.padding[padding],
        className,
      )}
      {...props}>
      {children}
    </View>
  );
};
