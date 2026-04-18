import React from 'react';

import {AppButton} from './AppButton';
import {AppEmptyState} from './AppEmptyState';

export const AppListState = ({
  mode = 'empty',
  title,
  description,
  actionLabel,
  onActionPress,
}) => {
  const presets = {
    empty: {
      iconLabel: '0',
      resolvedTitle: title || 'Nothing here yet',
      resolvedDescription:
        description || 'This list is empty for now, but it is ready for real data.',
    },
    search: {
      iconLabel: '?',
      resolvedTitle: title || 'No search results',
      resolvedDescription:
        description || 'Try another search term or adjust your filter to see matching items.',
    },
  };

  const selected = presets[mode] || presets.empty;

  return (
    <AppEmptyState
      action={
        actionLabel ? (
          <AppButton label={actionLabel} onPress={onActionPress} size="md" variant="secondary" />
        ) : null
      }
      description={selected.resolvedDescription}
      iconLabel={selected.iconLabel}
      title={selected.resolvedTitle}
    />
  );
};
