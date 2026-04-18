import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import {colorPalette, loaderStyles} from '@/design-system';
import {cn} from '@/utils/cn';

import {AppText} from './AppText';

export const AppLoader = ({
  label = 'Loading...',
  fullscreen = false,
  card = false,
  className,
  ...props
}) => {
  return (
    <View
      className={cn(
        loaderStyles.base,
        fullscreen ? loaderStyles.fullscreen : loaderStyles.inline,
        card && loaderStyles.card,
        className,
      )}
      {...props}>
      <ActivityIndicator color={colorPalette.primary} size="small" />
      <AppText variant="caption" color="secondary">
        {label}
      </AppText>
    </View>
  );
};
