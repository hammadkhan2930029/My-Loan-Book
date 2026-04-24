import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {
  AppBadge,
  AppButton,
  AppCard,
  AppEmptyState,
  AppListState,
  AppLoader,
} from '@/components/ui';
import {ROUTES} from '@/navigation';
import {getContacts} from '@/services/contactApi';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '@/services/notificationApi';

const formatRelativeTime = value => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    const minutes = Math.max(1, Math.round(diffMs / minute));
    return `${minutes} min ago`;
  }

  if (diffMs < day) {
    const hours = Math.max(1, Math.round(diffMs / hour));
    return `${hours} hr ago`;
  }

  if (diffMs < 2 * day) {
    return 'Yesterday';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const notificationTheme = {
  payment_submitted: {
    accent: 'bg-accent-400',
    icon: 'receipt-outline',
  },
  payment_confirmed: {
    accent: 'bg-primary-500',
    icon: 'checkmark-done-outline',
  },
  payment_rejected: {
    accent: 'bg-danger',
    icon: 'close-circle-outline',
  },
  contact_added: {
    accent: 'bg-primary-500',
    icon: 'people-outline',
  },
};

export const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [markingId, setMarkingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadNotifications = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [notificationsResult, contactsResult] = await Promise.all([
        getNotifications(),
        getContacts(),
      ]);
      const nextNotifications = Array.isArray(notificationsResult?.data)
        ? notificationsResult.data
        : Array.isArray(notificationsResult?.notifications)
          ? notificationsResult.notifications
          : [];
      const nextContacts = Array.isArray(contactsResult?.contacts) ? contactsResult.contacts : [];

      setNotifications(nextNotifications);
      setContacts(nextContacts);
    } catch (error) {
      setNotifications([]);
      setContacts([]);
      setErrorMessage(error.message || 'Could not load notifications.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications]),
  );

  const visibleNotifications = useMemo(
    () =>
      notifications.filter(
        item => item.status === 'unread' && item.type !== 'report' && item.type !== 'monthly_report',
      ),
    [notifications],
  );

  const contactIdByUserId = useMemo(
    () =>
      contacts.reduce((lookup, item) => {
        if (item?.contactUserId && item?.id) {
          lookup[item.contactUserId] = item.id;
        }

        return lookup;
      }, {}),
    [contacts],
  );

  const refreshHeaderBadge = useCallback(() => {
    navigation.setParams({
      notificationRefreshKey: Date.now(),
    });
  }, [navigation]);

  const navigateFromNotification = useCallback(
    notification => {
      const senderContactId = contactIdByUserId[notification?.senderId];

      if (
        senderContactId &&
        ['payment_submitted', 'payment_confirmed', 'payment_rejected', 'contact_added'].includes(
          notification?.type,
        )
      ) {
        navigation.navigate(ROUTES.CONTACT_DETAIL, {
          contactId: senderContactId,
        });
      }
    },
    [contactIdByUserId, navigation],
  );

  const handleMarkAsRead = async notificationId => {
    const selectedNotification = notifications.find(item => item.id === notificationId);

    if (!selectedNotification || selectedNotification.status === 'read') {
      return;
    }

    setMarkingId(notificationId);

    try {
      await markNotificationAsRead(notificationId);
      setNotifications(current =>
        current.map(item =>
          item.id === notificationId ? {...item, status: 'read'} : item,
        ),
      );
      refreshHeaderBadge();
      navigateFromNotification(selectedNotification);
    } catch (error) {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: error.message || 'Could not mark notification as read.',
        props: {
          borderColor: '#d95f70',
        },
      });
    } finally {
      setMarkingId('');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!visibleNotifications.length) {
      return;
    }

    setIsMarkingAll(true);

    try {
      await markAllNotificationsAsRead();
      setNotifications(current =>
        current.map(item => ({...item, status: 'read'})),
      );
      refreshHeaderBadge();
      Toast.show({
        type: 'customToast',
        text1: 'Updated',
        text2: 'All notifications were marked as read.',
        props: {
          borderColor: 'green',
        },
      });
    } catch (error) {
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: error.message || 'Could not update notifications.',
        props: {
          borderColor: '#d95f70',
        },
      });
    } finally {
      setIsMarkingAll(false);
    }
  };

  const renderNotificationRow = (item, showDivider = true) => {
    const theme = notificationTheme[item.type] || notificationTheme.contact_added;
    const isUnread = item.status === 'unread';

    return (
      <Pressable
        key={item.id}
        hitSlop={6}
        className={`flex-row items-start gap-3 py-4 ${
          showDivider ? 'border-b border-border' : ''
        }`}
        onPress={() => handleMarkAsRead(item.id)}>
        <View className={`h-12 w-12 items-center justify-center rounded-full ${theme.accent}`}>
          <Ionicons color="#ffffff" name={theme.icon} size={20} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-body font-semibold text-textPrimary">{item.title}</Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                {item.message}
              </Text>
            </View>
            {isUnread ? <View className="mt-1 h-2.5 w-2.5 rounded-full bg-accent-400" /> : null}
          </View>

          <View className="mt-3 flex-row items-center justify-between gap-3">
            <Text className="text-caption font-normal text-textMuted">
              {formatRelativeTime(item.createdAt)}
            </Text>
            <View className="flex-row items-center gap-2">
              <AppBadge label={isUnread ? 'Unread' : 'Read'} variant={isUnread ? 'accent' : 'neutral'} />
              {isUnread ? (
                <Text className="text-caption font-semibold text-primary-500">
                  {markingId === item.id ? 'Updating...' : 'Tap to read'}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <View className="gap-4">
            <View className="flex-row items-start justify-between gap-4">
              <View className="flex-1">
                <Text className="text-caption font-bold text-white/80">Alert Center</Text>
                <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-white">
                  {visibleNotifications.length
                    ? `${visibleNotifications.length} unread updates`
                    : 'All caught up'}
                </Text>
                <Text className="mt-2 text-caption font-normal text-white/80">
                  Tap any notification to mark it as read. Read items are removed from this list.
                </Text>
              </View>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-400">
                <Ionicons color="#ffffff" name="notifications" size={22} />
              </View>
            </View>

            <AppButton
              disabled={!visibleNotifications.length || isMarkingAll}
              label="Mark All As Read"
              loading={isMarkingAll}
              onPress={handleMarkAllAsRead}
              size="md"
              textClassName="text-white"
              variant="accent"
            />
          </View>
        </View>

        {isLoading ? (
          <View className="gap-4 pb-24">
            <AppLoader card label="Loading notifications..." />
            <AppLoader card label="Preparing alert center..." />
          </View>
        ) : errorMessage ? (
          <AppListState
            actionLabel="Retry"
            description={errorMessage}
            mode="empty"
            onActionPress={loadNotifications}
            title="Notifications unavailable"
          />
        ) : visibleNotifications.length ? (
          <>
            <View className="gap-3">
              <View>
                <Text className="text-section font-semibold text-textPrimary">Unread</Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Only active unread notifications appear here.
                </Text>
              </View>

              {visibleNotifications.length ? (
                <AppCard padding="sm">
                  <View>
                    {visibleNotifications.map((item, index) =>
                      renderNotificationRow(item, index !== visibleNotifications.length - 1),
                    )}
                  </View>
                </AppCard>
              ) : (
                <AppEmptyState
                  description="There are no unread alerts right now. New events will show up here first."
                  iconLabel="0"
                  title="No unread notifications"
                />
              )}
            </View>
          </>
        ) : (
          <View className="pb-24">
            <AppEmptyState
              description="When a new unread notification arrives, it will appear here."
              iconLabel="0"
              title="No unread notifications"
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
