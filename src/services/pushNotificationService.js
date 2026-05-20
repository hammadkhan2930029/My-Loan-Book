import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';

import {updateFcmToken} from './authApi';

const requestAndroidNotificationPermission = async () => {
  if (Platform.OS !== 'android' || Platform.Version < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
};

const requestMessagingPermission = async () => {
  const androidPermissionGranted = await requestAndroidNotificationPermission();

  if (!androidPermissionGranted) {
    return false;
  }

  const authorizationStatus = await messaging().requestPermission();

  return (
    authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

const syncCurrentFcmToken = async () => {
  const fcmToken = await messaging().getToken();

  if (fcmToken) {
    await updateFcmToken({fcmToken});
  }

  return fcmToken;
};

export const registerDeviceForPushNotifications = async () => {
  try {
    const hasPermission = await requestMessagingPermission();

    if (!hasPermission) {
      return () => {};
    }

    await syncCurrentFcmToken();

    return messaging().onTokenRefresh(nextToken => {
      updateFcmToken({fcmToken: nextToken}).catch(error => {
        console.warn('Failed to refresh FCM token:', error.message);
      });
    });
  } catch (error) {
    console.warn('Failed to register device for push notifications:', error.message);
    return () => {};
  }
};
