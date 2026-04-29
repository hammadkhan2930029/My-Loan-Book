import {apiRequest} from './apiClient';

export const requestRegisterOtp = ({fullName, email, phone, password}) =>
  apiRequest('/auth/register/request-otp', {
    method: 'POST',
    data: {
      fullName,
      email,
      phone,
      password,
    },
  });

export const verifyRegisterOtp = ({email, otp}) =>
  apiRequest('/auth/register/verify-otp', {
    method: 'POST',
    data: {
      email,
      otp,
    },
  });

export const resendRegisterOtp = ({email}) =>
  apiRequest('/auth/register/resend-otp', {
    method: 'POST',
    data: {
      email,
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

export const requestForgotPasswordOtp = ({email}) =>
  apiRequest('/auth/forgot-password/request-otp', {
    method: 'POST',
    data: {
      email,
    },
  });

export const verifyForgotPasswordOtp = ({email, otp}) =>
  apiRequest('/auth/forgot-password/verify-otp', {
    method: 'POST',
    data: {
      email,
      otp,
    },
  });

export const resendForgotPasswordOtp = ({email}) =>
  apiRequest('/auth/forgot-password/resend-otp', {
    method: 'POST',
    data: {
      email,
    },
  });

export const resetPassword = ({email, resetToken, newPassword}) =>
  apiRequest('/auth/reset-password', {
    method: 'POST',
    data: {
      email,
      resetToken,
      newPassword,
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
