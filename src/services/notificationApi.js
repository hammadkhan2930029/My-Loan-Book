import {apiRequest} from './apiClient';

export const getNotifications = () =>
  apiRequest('/notifications', {
    method: 'GET',
  });

export const getUnreadNotificationCount = () =>
  apiRequest('/notifications/unread-count', {
    method: 'GET',
  });

export const markNotificationAsRead = notificationId =>
  apiRequest(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });

export const markAllNotificationsAsRead = () =>
  apiRequest('/notifications/read-all', {
    method: 'PATCH',
  });
