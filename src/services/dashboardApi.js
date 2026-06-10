import {apiRequest} from './apiClient';

export const getDashboard = ({currency} = {}) =>
  apiRequest('/dashboard', {
    method: 'GET',
    params: {
      ...(currency ? {currency} : {}),
    },
  });
