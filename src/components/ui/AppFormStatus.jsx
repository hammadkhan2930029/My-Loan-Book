import React from 'react';
import {View} from 'react-native';

import {uxStateStyles} from '@/design-system';

import {AppLoader} from './AppLoader';
import {AppText} from './AppText';

export const AppFormStatus = ({submitting = false, idleMessage, submittingMessage}) => {
  if (submitting) {
    return (
      <View className={uxStateStyles.formStatus}>
        <AppLoader className="py-0" label={submittingMessage || 'Submitting...'} />
      </View>
    );
  }

  if (!idleMessage) {
    return null;
  }

  return (
    <View className={uxStateStyles.formStatus}>
      <AppText className={uxStateStyles.formStatusText} color="muted" variant="caption">
        {idleMessage}
      </AppText>
    </View>
  );
};
