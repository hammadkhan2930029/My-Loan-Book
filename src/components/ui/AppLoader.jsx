import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import {cn} from '@/utils/cn';

import {AppText} from './AppText';

const colorPalette = {
  primary: '#203049',
};

const loaderStyles = {
  base: 'items-center justify-center gap-3',
  inline: 'py-4',
  fullscreen: 'flex-1',
  card: 'rounded-[24px] border border-border bg-surface px-5 py-6',
};

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
