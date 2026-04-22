import React from 'react';
import {View} from 'react-native';

import {AppLoader} from './AppLoader';
import {AppText} from './AppText';

const uxStateStyles = {
  formStatus: 'rounded-[20px] bg-surfaceMuted px-4 py-3',
  formStatusText: 'text-center',
};

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
