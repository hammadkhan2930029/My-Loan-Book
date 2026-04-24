import {apiRequest} from './apiClient';

export const getReports = ({month, year} = {}) =>
  apiRequest('/reports', {
    method: 'GET',
    params: {
      ...(month ? {month} : {}),
      ...(year ? {year} : {}),
    },
  });
