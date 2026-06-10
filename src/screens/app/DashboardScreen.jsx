import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { AppButton, AppCard, AppListState, AppLoader } from '@/components/ui';
import { ROUTES, useAuth } from '@/navigation';
import { getContacts } from '@/services/contactApi';
import { getDashboard } from '@/services/dashboardApi';
import { getNotifications, markNotificationAsRead } from '@/services/notificationApi';
import {
    approveRepaymentRequest,
    confirmLoanRequest,
    rejectLoanRequest,
} from '@/services/transactionApi';

import { DashboardActivityItem } from './components/DashboardActivityItem';
import { DashboardContactCard } from './components/DashboardContactCard';
import { DashboardSummaryCard } from './components/DashboardSummaryCard';
import { ReportsDonutChart } from './components/ReportsDonutChart';

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
    loan_assigned: {
        accent: 'bg-accent-400',
        icon: 'cash-outline',
    },
    loan_confirmed: {
        accent: 'bg-primary-500',
        icon: 'checkmark-circle-outline',
    },
    loan_rejected: {
        accent: 'bg-danger',
        icon: 'close-circle-outline',
    },
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

export const DashboardScreen = () => {
    const navigation = useNavigation();
    const { session } = useAuth();
    const profile = session?.user || {};
    const profileName = profile.fullName || 'Digital Loan Tracker User';
    const firstName = profileName.split(' ').filter(Boolean)[0] || profileName;
    const [dashboard, setDashboard] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationContacts, setNotificationContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvingTransactionId, setApprovingTransactionId] = useState('');
    const [markingNotificationId, setMarkingNotificationId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadDashboard = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const [dashboardResult, notificationsResult, contactsResult] = await Promise.all([
                getDashboard(),
                getNotifications(),
                getContacts(),
            ]);
            const nextNotifications = Array.isArray(notificationsResult?.data)
                ? notificationsResult.data
                : Array.isArray(notificationsResult?.notifications)
                    ? notificationsResult.notifications
                    : [];
            const nextContacts = Array.isArray(contactsResult?.contacts) ? contactsResult.contacts : [];

            setDashboard(dashboardResult?.dashboard || {});
            setNotifications(nextNotifications);
            setNotificationContacts(nextContacts);
        } catch (error) {
            const nextErrorMessage = error.message || 'Could not load dashboard data.';

            setDashboard(null);
            setNotifications([]);
            setNotificationContacts([]);
            setErrorMessage(nextErrorMessage);
            Toast.show({
                type: 'customToast',
                text1: 'Error',
                text2: nextErrorMessage,
                visibilityTime: 3500,
                props: {
                    bgColor: '#ffffff',
                    borderColor: '#d95f70',
                },
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadDashboard();
        }, [loadDashboard]),
    );

    const summary =
        dashboard?.summary && typeof dashboard.summary === 'object' ? dashboard.summary : null;
    const contacts = Array.isArray(dashboard?.contacts) ? dashboard.contacts : [];
    const pendingApprovals = Array.isArray(dashboard?.pendingApprovals)
        ? dashboard.pendingApprovals
        : [];
    const recentActivity = Array.isArray(dashboard?.recentActivity)
        ? dashboard.recentActivity
        : [];
    const topNotifications = useMemo(
        () =>
            notifications.filter(
                item => item.status === 'unread' && item.type !== 'report' && item.type !== 'monthly_report',
            ),
        [notifications],
    );
    const contactIdByUserId = useMemo(
        () =>
            notificationContacts.reduce((lookup, item) => {
                if (item?.contactUserId && item?.id) {
                    lookup[item.contactUserId] = item.id;
                }

                return lookup;
            }, {}),
        [notificationContacts],
    );
    const summaryCards = useMemo(() => {
        if (!summary) {
            return [];
        }

        return [
            {
                id: 'receive',
                title: 'You Will Receive',
                amount: summary.receiveAmount,
                note: `${summary.receiveCount} loan records`,
                variant: 'receive',
            },
            {
                id: 'pay',
                title: 'You Need to Pay',
                amount: summary.repayAmount,
                note: `${summary.borrowCount} borrow records`,
                variant: 'pay',
            },
        ];
    }, [summary]);

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
                [
                    'loan_assigned',
                    'loan_confirmed',
                    'loan_rejected',
                    'payment_submitted',
                    'payment_confirmed',
                    'payment_rejected',
                    'contact_added',
                ].includes(notification?.type)
            ) {
                navigation.navigate(ROUTES.CONTACT_DETAIL, {
                    contactId: senderContactId,
                });
                return;
            }

            navigation.navigate(ROUTES.NOTIFICATIONS);
        },
        [contactIdByUserId, navigation],
    );

    const handleNotificationAction = async (notification, shouldNavigate) => {
        if (!notification?.id || notification.status === 'read') {
            if (shouldNavigate) {
                navigateFromNotification(notification);
            }

            return;
        }

        setMarkingNotificationId(notification.id);

        try {
            await markNotificationAsRead(notification.id);
            setNotifications(current =>
                current.map(item =>
                    item.id === notification.id ? { ...item, status: 'read' } : item,
                ),
            );
            refreshHeaderBadge();

            if (shouldNavigate) {
                navigateFromNotification(notification);
            }
        } catch (error) {
            Toast.show({
                type: 'customToast',
                text1: 'Error',
                text2: error.message || 'Could not update notification.',
                visibilityTime: 3500,
                props: {
                    bgColor: '#ffffff',
                    borderColor: '#d95f70',
                },
            });
        } finally {
            setMarkingNotificationId('');
        }
    };

    const handleApproveRepayment = async transaction => {
        setApprovingTransactionId(transaction.id);

        try {
            if (transaction.category === 'loan') {
                await confirmLoanRequest(transaction.id);
            } else {
                await approveRepaymentRequest(transaction.id);
            }
            Toast.show({
                type: 'customToast',
                text1: 'Success',
                text2:
                    transaction.category === 'loan'
                        ? 'Loan confirmed successfully.'
                        : 'Repayment approved successfully.',
                props: {
                    bgColor: '#ffffff',
                    borderColor: 'green',
                },
            });
            await loadDashboard();
        } catch (error) {
            Toast.show({
                type: 'customToast',
                text1: 'Error',
                text2:
                    error.message ||
                    (transaction.category === 'loan'
                        ? 'Could not confirm loan.'
                        : 'Could not approve repayment.'),
                visibilityTime: 3500,
                props: {
                    bgColor: '#ffffff',
                    borderColor: '#d95f70',
                },
            });
        } finally {
            setApprovingTransactionId('');
        }
    };

    const handleRejectLoan = async transaction => {
        setApprovingTransactionId(transaction.id);

        try {
            await rejectLoanRequest(transaction.id);
            Toast.show({
                type: 'customToast',
                text1: 'Success',
                text2: 'Loan rejected successfully.',
                props: {
                    bgColor: '#ffffff',
                    borderColor: 'green',
                },
            });
            await loadDashboard();
        } catch (error) {
            Toast.show({
                type: 'customToast',
                text1: 'Error',
                text2: error.message || 'Could not reject loan.',
                visibilityTime: 3500,
                props: {
                    bgColor: '#ffffff',
                    borderColor: '#d95f70',
                },
            });
        } finally {
            setApprovingTransactionId('');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <ScrollView
                bounces={false}
                contentContainerClassName="flex-grow px-5 py-5 gap-6 "
                showsVerticalScrollIndicator={false}>
                <View className="gap-3">
                    <View>
                        <Text className="text-[25px] leading-[30px] font-bold text-textPrimary">
                            Hello, {firstName}
                        </Text>
                        {/* <Text className="mt-0.5 text-[13px] leading-[18px] font-semibold text-textPrimary">
                            {pendingApprovals.length
                                ? `${pendingApprovals.length} pending approvals need review`
                                : 'Your balances are ready to review'}
                        </Text> */}
                    </View>
                </View>

                {isLoading ? (
                    <View className="gap-4 pb-24">
                        <AppLoader card label="Loading dashboard..." />
                        <AppLoader card label="Checking balances..." />
                        <AppLoader card label="Preparing activity..." />
                    </View>
                ) : (
                    <>
                        {topNotifications.length ? (
                            <View className="gap-3">
                                {topNotifications.slice(0, 3).map(item => {
                                    const theme = notificationTheme[item.type] || notificationTheme.contact_added;
                                    const isUpdating = markingNotificationId === item.id;

                                    return (
                                        <Pressable
                                            key={item.id}
                                            className="overflow-hidden rounded-[24px] border border-border bg-surface px-4 py-4 shadow-card"
                                            hitSlop={6}
                                            onPress={() => handleNotificationAction(item, true)}>
                                            <View className="flex-row items-start gap-3">
                                                <View
                                                    className={`h-12 w-12 items-center justify-center rounded-full ${theme.accent}`}>
                                                    <Ionicons color="#ffffff" name={theme.icon} size={20} />
                                                </View>

                                                <View className="flex-1">
                                                    <View className="flex-row items-start justify-between gap-3">
                                                        <View className="flex-1">
                                                            <Text className="text-body font-semibold text-textPrimary">
                                                                {item.title}
                                                            </Text>
                                                            <Text className="mt-1 text-caption font-normal text-textSecondary">
                                                                {item.message}
                                                            </Text>
                                                        </View>

                                                        <Pressable
                                                            className="h-8 w-8 items-center justify-center rounded-full bg-surfaceMuted"
                                                            hitSlop={6}
                                                            onPress={event => {
                                                                event.stopPropagation();
                                                                handleNotificationAction(item, false);
                                                            }}>
                                                            <Ionicons color="#6b7280" name="close" size={16} />
                                                        </Pressable>
                                                    </View>

                                                    <View className="mt-3 flex-row items-center justify-between gap-3">
                                                        <Text className="text-caption font-normal text-textMuted">
                                                            {formatRelativeTime(item.createdAt)}
                                                        </Text>
                                                        <Text className="text-caption font-semibold text-primary-500">
                                                            {isUpdating ? 'Updating...' : 'Tap to open'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ) : null}

                        <View className="flex-row items-end gap-3">
                            {summaryCards.length ? (
                                summaryCards.map(card => <DashboardSummaryCard key={card.id} {...card} />)
                            ) : (
                                <AppCard className="flex-1 rounded-[22px] bg-surface px-4 py-5" padding="sm">
                                    <Text className="text-caption font-normal text-textSecondary">
                                        {errorMessage
                                            ? 'Dashboard summary is temporarily unavailable.'
                                            : 'Summary cards will appear when dashboard data is ready.'}
                                    </Text>
                                </AppCard>
                            )}
                        </View>

                        {summary ? (
                            <AppCard className="rounded-[22px] bg-surface px-4 py-5" padding="sm">
                                <View className="gap-5">
                                    <View className="flex-row items-start justify-between gap-4">
                                        <View className="flex-1">
                                            <Text className="text-section font-semibold text-textPrimary">
                                                Loan Recovery Overview
                                            </Text>
                                            <Text className="mt-1 text-caption font-normal text-textSecondary">
                                                Total loaned amount, returned so far, and remaining recovery.
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="items-center">
                                        <ReportsDonutChart
                                            centerLabel="Loaned vs Returned"
                                            centerValue={summary.loanedAmount}
                                            footerLabel="total loaned amount"
                                            gave={summary.rawLoanedAmount}
                                            primaryColor="#203049"
                                            secondaryColor="#EC7418"
                                            took={summary.rawCollectedAmount}
                                            total={summary.rawLoanedAmount || 1}
                                        />
                                    </View>

                                    <View className="flex-row gap-4">
                                        <View className="flex-1 rounded-2xl bg-primary-500 px-4 py-4">
                                            <Text className="text-caption font-normal text-white/80">
                                                Total Loaned
                                            </Text>
                                            <Text className="mt-2 text-section font-semibold text-white">
                                                {summary.loanedAmount}
                                            </Text>
                                        </View>

                                        <View className="flex-1 rounded-2xl bg-accent-400 px-4 py-4">
                                            <Text className="text-caption font-normal text-white/80">
                                                Returned So Far
                                            </Text>
                                            <Text className="mt-2 text-section font-semibold text-white">
                                                {summary.collectedAmount}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="rounded-2xl bg-surfaceMuted px-4 py-4">
                                        <Text className="text-caption font-normal text-textSecondary">
                                            Remaining to Recover
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-textPrimary">
                                            {summary.remainingToRecoverAmount}
                                        </Text>
                                    </View>
                                </View>
                            </AppCard>
                        ) : null}

                        <View className="gap-3">
                            <AppCard className="rounded-[22px] bg-surface px-4 py-4" padding="sm">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-section font-semibold text-textPrimary">My People</Text>
                                    <Pressable hitSlop={8} onPress={() => navigation.navigate(ROUTES.MY_PEOPLE)}>
                                        <Text className="text-caption font-normal text-textSecondary">See all</Text>
                                    </Pressable>
                                </View>

                                {contacts.length ? (
                                    <ScrollView
                                        horizontal
                                        contentContainerClassName="gap-4 pt-4"
                                        showsHorizontalScrollIndicator={false}>
                                        {contacts.map(contact => (
                                            <DashboardContactCard
                                                key={contact.id}
                                                {...contact}
                                                onPress={() =>
                                                    contact.contactId
                                                        ? navigation.navigate(ROUTES.CONTACT_DETAIL, {
                                                            contactId: contact.contactId,
                                                        })
                                                        : null
                                                }
                                            />
                                        ))}
                                    </ScrollView>
                                ) : (
                                    <View className="pt-4">
                                        <AppListState
                                            actionLabel="Open My People"
                                            description="Your people list will appear here when contacts are available."
                                            mode="empty"
                                            onActionPress={() => navigation.navigate(ROUTES.MY_PEOPLE)}
                                            title="No people to show"
                                        />
                                    </View>
                                )}
                            </AppCard>
                        </View>

                        {pendingApprovals.length ? (
                            <View className="gap-3">
                                <View className="flex-row items-center justify-between">
                                    <Text className="text-section font-semibold text-textPrimary">
                                        Pending Approvals
                                    </Text>
                                    <Pressable
                                        hitSlop={8}
                                        onPress={() => navigation.navigate(ROUTES.TRANSACTION_HISTORY)}>
                                        <Text className="text-caption font-normal text-textSecondary">See all</Text>
                                    </Pressable>
                                </View>

                                <AppCard className="rounded-[22px] bg-surface" padding="sm">
                                    <View className="gap-3">
                                        {pendingApprovals.slice(0, 3).map(transaction => (
                                            <View
                                                key={transaction.id}
                                                className={`rounded-[20px] px-4 py-4 ${
                                                    transaction.category === 'loan'
                                                        ? 'border border-accent-300 bg-[#fff6ee]'
                                                        : 'bg-[#fcfbf7]'
                                                }`}>
                                                <Text className="text-body font-semibold text-textPrimary">
                                                    {transaction.category === 'loan'
                                                        ? transaction.type === 'took'
                                                            ? `${transaction.counterpartyName} assigned you a loan`
                                                            : `${transaction.counterpartyName} recorded a loan they gave you`
                                                        : `${transaction.counterpartyName} sent a repayment request`}
                                                </Text>
                                                <View className="mt-2 flex-row items-center justify-between gap-3">
                                                    <Text className="text-caption font-normal text-textSecondary">
                                                        {transaction.amount}
                                                        {transaction.note ? ` - ${transaction.note}` : ''}
                                                    </Text>
                                                    {transaction.category === 'loan' ? (
                                                        <View className="rounded-full bg-accent-400 px-3 py-1.5">
                                                            <Text className="text-caption font-semibold text-white">
                                                                Pending
                                                            </Text>
                                                        </View>
                                                    ) : null}
                                                </View>
                                                <View className="mt-3 flex-row gap-3">
                                                    <AppButton
                                                        fullWidth={false}
                                                        label="Review"
                                                        onPress={() =>
                                                            navigation.navigate(ROUTES.CONTACT_DETAIL, {
                                                                contactId: transaction.contactId,
                                                            })
                                                        }
                                                        size="md"
                                                        variant="secondary"
                                                    />
                                                    {transaction.category === 'loan' ? (
                                                        <AppButton
                                                            fullWidth={false}
                                                            label="Reject"
                                                            loading={approvingTransactionId === transaction.id}
                                                            onPress={() => handleRejectLoan(transaction)}
                                                            size="md"
                                                            variant="secondary"
                                                        />
                                                    ) : null}
                                                    <AppButton
                                                        fullWidth={false}
                                                        label={
                                                            transaction.category === 'loan'
                                                                ? 'Confirm Loan'
                                                                : 'Confirm'
                                                        }
                                                        loading={approvingTransactionId === transaction.id}
                                                        onPress={() => handleApproveRepayment(transaction)}
                                                        size="md"
                                                        variant="accent"
                                                    />
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </AppCard>
                            </View>
                        ) : null}

                        <View className="gap-3 pb-24">
                            <View className="flex-row items-center justify-between">
                                <Text className="text-section font-semibold text-textPrimary">Recent Activity</Text>
                                <Pressable
                                    className="flex-row items-center gap-1 rounded-full px-1 py-1"
                                    hitSlop={8}
                                    onPress={() => navigation.navigate(ROUTES.TRANSACTION_HISTORY)}>
                                    <Text className="text-caption font-semibold text-primary-500">
                                        Open history
                                    </Text>
                                    <Ionicons color="#203049" name="chevron-forward" size={14} />
                                </Pressable>
                            </View>

                            {errorMessage ? (
                                <AppListState
                                    actionLabel="Retry"
                                    description={errorMessage}
                                    mode="empty"
                                    onActionPress={loadDashboard}
                                    title="Dashboard unavailable"
                                />
                            ) : recentActivity.length ? (
                                <AppCard className="rounded-[22px] bg-surface" padding="sm">
                                    <View className="gap-3">
                                        {recentActivity.map((item, index) => (
                                            <DashboardActivityItem
                                                key={item.id}
                                                {...item}
                                                showDivider={index !== recentActivity.length - 1}
                                            />
                                        ))}
                                    </View>
                                </AppCard>
                            ) : (
                                <AppListState
                                    actionLabel="Refresh"
                                    description="Recent activity will appear here after transactions are loaded."
                                    mode="empty"
                                    onActionPress={loadDashboard}
                                    title="No recent activity"
                                />
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};
