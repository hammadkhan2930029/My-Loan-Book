import {apiRequest} from './apiClient';

export const getReports = ({currency, month, year} = {}) =>
  apiRequest('/reports', {
    method: 'GET',
    params: {
      ...(currency ? {currency} : {}),
      ...(month ? {month} : {}),
      ...(year ? {year} : {}),
    },
  });
