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

export const forgotPassword = ({email}) =>
  apiRequest('/auth/forgot-password', {
    method: 'POST',
    data: {
      email,
    },
  });

export const resetPassword = ({token, password, confirmPassword}) =>
  apiRequest('/auth/reset-password', {
    method: 'POST',
    data: {
      token,
      password,
      confirmPassword,
    },
  });

export const updateProfile = ({fullName, email, phone, profilePhoto}) =>
  apiRequest('/auth/me', {
    method: 'PATCH',
    data: {
      fullName,
      email,
      phone,
      profilePhoto,
    },
  });

export const changePassword = ({currentPassword, password, confirmPassword}) =>
  apiRequest('/auth/change-password', {
    method: 'PATCH',
    data: {
      currentPassword,
      password,
      confirmPassword,
    },
  });
