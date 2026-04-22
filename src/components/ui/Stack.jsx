import React from 'react';
import {View} from 'react-native';

import {cn} from '@/utils/cn';

const commonLayoutWrappers = {
  sectionStack: 'gap-6',
  contentStack: 'gap-4',
};

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
