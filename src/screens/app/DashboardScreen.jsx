import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {AppAvatar, AppButton, AppCard, AppListState, AppLoader} from '@/components/ui';
import {ROUTES, useAuth} from '@/navigation';
import {getDashboard} from '@/services/dashboardApi';
import {approveRepaymentRequest} from '@/services/transactionApi';

import {DashboardActivityItem} from './components/DashboardActivityItem';
import {DashboardContactCard} from './components/DashboardContactCard';
import {DashboardSummaryCard} from './components/DashboardSummaryCard';
import {ReportsDonutChart} from './components/ReportsDonutChart';

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const {session} = useAuth();
  const profile = session?.user || {};
  const profileName = profile.fullName || 'MyLoanBook User';
  const firstName = profileName.split(' ').filter(Boolean)[0] || profileName;
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingTransactionId, setApprovingTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getDashboard();
      setDashboard(result?.dashboard || {});
    } catch (error) {
      const nextErrorMessage = error.message || 'Could not load dashboard data.';

      setDashboard(null);
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
  const pendingRepayments = Array.isArray(dashboard?.pendingApprovals)
    ? dashboard.pendingApprovals
    : [];
  const recentActivity = Array.isArray(dashboard?.recentActivity)
    ? dashboard.recentActivity
    : [];
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

  const handleApproveRepayment = async transaction => {
    setApprovingTransactionId(transaction.id);

    try {
      await approveRepaymentRequest(transaction.id);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: 'Repayment approved successfully.',
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
        text2: error.message || 'Could not approve repayment.',
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
        contentContainerClassName="flex-grow px-5 py-5 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.PROFILE)}>
              <AppAvatar
                className="border-2 border-white"
                imageUri={profile.profilePhoto}
                name={profileName}
                size="sm"
                variant="accent"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="h-10 w-10 items-center justify-center rounded-full bg-primary-500"
              hitSlop={8}>
              <Ionicons color="#ffffff" name="notifications-outline" size={18} />
            </TouchableOpacity>
          </View>

          <View>
            <Text className="text-[25px] leading-[30px] font-bold text-textPrimary">
              Hello, {firstName}
            </Text>
            <Text className="mt-0.5 text-[13px] leading-[18px] font-semibold text-textPrimary">
              {pendingRepayments.length
                ? `${pendingRepayments.length} pending approvals need review`
                : 'Your balances are ready to review'}
            </Text>
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
                    <View className="flex-1 rounded-2xl bg-primary-100 px-4 py-4">
                      <Text className="text-caption font-normal text-textSecondary">
                        Total Loaned
                      </Text>
                      <Text className="mt-2 text-section font-semibold text-textPrimary">
                        {summary.loanedAmount}
                      </Text>
                    </View>

                    <View className="flex-1 rounded-2xl bg-accent-100 px-4 py-4">
                      <Text className="text-caption font-normal text-textSecondary">
                        Returned So Far
                      </Text>
                      <Text className="mt-2 text-section font-semibold text-textPrimary">
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

            {pendingRepayments.length ? (
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
              {pendingRepayments.slice(0, 3).map(transaction => (
                  <View key={transaction.id} className="rounded-[18px] bg-[#fcfbf7] px-3 py-3">
                    <Text className="text-body font-semibold text-textPrimary">
                      {transaction.counterpartyName} sent a repayment request
                    </Text>
                    <Text className="mt-1 text-caption font-normal text-textSecondary">
                      {transaction.amount}
                      {transaction.note ? ` - ${transaction.note}` : ''}
                    </Text>
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
                      <AppButton
                        fullWidth={false}
                        label="Confirm"
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
                  hitSlop={8}
                  onPress={() => navigation.navigate(ROUTES.TRANSACTION_HISTORY)}>
                  <Text className="text-caption font-normal text-textSecondary">See all</Text>
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
