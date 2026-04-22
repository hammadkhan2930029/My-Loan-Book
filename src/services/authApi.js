import {apiRequest} from './apiClient';

export const registerUser = ({fullName, email, phone, password}) =>
  apiRequest('/auth/register', {
    method: 'POST',
    data: {
      fullName,
      email,
      phone,
      password,
    },
  });

export const loginUser = ({phone, password}) =>
  apiRequest('/auth/login', {
    method: 'POST',
    data: {
      phone,
      password,
    },
  });
