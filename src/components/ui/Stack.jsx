import React from 'react';
import {View} from 'react-native';

import {commonLayoutWrappers} from '@/design-system';
import {cn} from '@/utils/cn';

export const Stack = ({children, spacing = 'content', className, ...props}) => {
  return (
    <View
      className={cn(
        spacing === 'section'
          ? commonLayoutWrappers.sectionStack
          : commonLayoutWrappers.contentStack,
        className,
      )}
      {...props}>
      {children}
    </View>
  );
};
