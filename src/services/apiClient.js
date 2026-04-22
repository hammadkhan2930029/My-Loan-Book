import axios from 'axios';

import {getAuthSession} from './authStorage';

const API_HOST = '192.168.18.10';
const API_BASE_URL = `http://${API_HOST}:5000/api`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async config => {
  const session = await getAuthSession();
  const token = session?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const apiRequest = async (path, config = {}) => {
  try {
    const response = await apiClient({
      url: path,
      ...config,
    });

    return response.data;
  } catch (requestError) {
    const errorData = requestError.response?.data;
    const fieldErrorMessage = Array.isArray(errorData?.errors)
      ? errorData.errors
          .map(item => item?.message)
          .filter(Boolean)
          .join('\n')
      : '';
    const isTimeout = requestError.code === 'ECONNABORTED';
    const isNetworkError = requestError.message === 'Network Error';
    const error = new Error(
      fieldErrorMessage ||
        errorData?.message ||
        (isTimeout
          ? 'Request timed out. Please check that the backend is running.'
          : isNetworkError
            ? 'Cannot reach backend. Check your API base URL and network.'
            : requestError.message || 'Request failed. Please try again.'),
    );

    error.status = requestError.response?.status;
    error.errors = errorData?.errors;
    throw error;
  }
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
};
