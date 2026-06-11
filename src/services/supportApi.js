import {apiRequest} from './apiClient';

export const submitSupportRequest = ({category, subject, message}) =>
  apiRequest('/support', {
    method: 'POST',
    data: {
      category,
      subject,
      message,
    },
  });

export const submitSuggestion = ({category, subject, message}) =>
  apiRequest('/support/suggestions', {
    method: 'POST',
    data: {
      category,
      subject,
      message,
    },
  });
