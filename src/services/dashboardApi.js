import {apiRequest} from './apiClient';

export const getDashboard = () =>
  apiRequest('/dashboard', {
    method: 'GET',
  });
