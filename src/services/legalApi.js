import {apiRequest} from './apiClient';

export const getPrivacyPolicy = () =>
  apiRequest('/legal/privacy-policy', {
    method: 'GET',
  });

export const getTermsAndConditions = () =>
  apiRequest('/legal/terms-and-conditions', {
    method: 'GET',
  });
