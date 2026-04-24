import React, {useCallback, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppListState,
  AppLoader,
} from '@/components/ui';
import {ROUTES} from '@/navigation';
import {getContact} from '@/services/contactApi';
import {approveRepaymentRequest, getTransactions} from '@/services/transactionApi';
import {
  formatLedgerAmount,
  mapTransactionToContactRow,
  summarizeTransactions,
} from '@/utils/transactions';

import {ContactTransactionRow} from './components';

export const ContactDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const contactId = route.params?.contactId;
  const [contact, setContact] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [approvingTransactionId, setApprovingTransactionId] = useState('');

  const loadContact = useCallback(async () => {
    if (!contactId) {
      const missingContactMessage = 'Contact ID is missing.';

      setErrorMessage(missingContactMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: missingContactMessage,
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const [contactResult, transactionsResult] = await Promise.all([
        getContact(contactId),
        getTransactions({contactId}),
      ]);

      setContact(contactResult?.contact || null);
      setTransactions(Array.isArray(transactionsResult?.transactions) ? transactionsResult.transactions : []);
    } catch (error) {
      const loadErrorMessage = error.message || 'Could not load contact.';

      setContact(null);
      setTransactions([]);
      setErrorMessage(loadErrorMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: loadErrorMessage,
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [contactId]);

  useFocusEffect(
    useCallback(() => {
      loadContact();
    }, [loadContact]),
  );

  const contactName = contact?.fullName || 'Contact';
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const summary = summarizeTransactions(safeTransactions);
  const formattedTransactions = safeTransactions.map(mapTransactionToContactRow);
  const isBorrowerView = summary.balance < 0;
  const primaryTotalLabel = isBorrowerView ? 'Total Borrowed' : 'Total Loaned';
  const primaryTotalAmount = isBorrowerView ? summary.took : summary.gave;
  const paidBackLabel = isBorrowerView ? 'Paid Back' : 'Collected Back';
  const paidBackAmount = isBorrowerView ? summary.repaid : summary.collected;
  const pendingRepaymentRequests = transactions.filter(
    transaction =>
      transaction.category === 'repayment' &&
      transaction.status === 'pending' &&
      transaction.type === 'took',
  );
  const balanceLabel =
    summary.balance > 0
      ? 'You gave more overall.'
      : summary.balance < 0
        ? 'You took more overall.'
        : transactions.length
          ? 'This contact is currently settled.'
          : 'No transactions recorded yet.';

  const handleApproveRepayment = async transactionId => {
    setApprovingTransactionId(transactionId);

    try {
      await approveRepaymentRequest(transactionId);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: 'Repayment approved successfully.',
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      await loadContact();
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
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Text className="text-caption font-semibold text-primary-500">Back</Text>
          </Pressable>

          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Contact details, balance summary, and transaction history.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Contact Detail
            </Text>
          </View>
        </View>

        {isLoading ? (
          <AppLoader card label="Loading contact..." />
        ) : errorMessage ? (
          <AppListState
            actionLabel="Retry"
            description={errorMessage}
            mode="empty"
            onActionPress={loadContact}
            title="Contact unavailable"
          />
        ) : !contact ? (
          <AppListState
            actionLabel="Back to People"
            description="This contact could not be loaded right now."
            mode="empty"
            onActionPress={() => navigation.navigate(ROUTES.MY_PEOPLE)}
            title="Contact data unavailable"
          />
        ) : (
          <>
            <AppCard variant="elevated">
              <View className="flex-row items-start gap-4">
                <AppAvatar
                  imageUri={contact?.profilePhoto}
                  name={contactName}
                  size="lg"
                  variant="primary"
                />
                <View className="flex-1">
                  <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">
                    {contactName}
                  </Text>
                  <Text className="mt-1 text-caption font-normal text-textSecondary">
                    {contact?.phone || 'Phone not available'}
                  </Text>
                  <Text className="mt-1 text-caption font-normal text-textSecondary">
                    {contact?.email || 'Email not available'}
                  </Text>
                  <Text className="mt-1 text-caption font-normal text-textSecondary">
                    Reg code {contact?.reg_code || 'N/A'}
                  </Text>
                </View>
                <AppBadge label="Connected" variant="primary" />
              </View>
            </AppCard>

            <AppCard variant="elevated">
              <View className="gap-5">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="flex-1">
                    <Text className="text-caption font-normal text-textSecondary">
                      Overall Balance
                    </Text>
                    <Text className="mt-2 text-hero font-bold tracking-[-0.4px] text-textPrimary">
                      {formatLedgerAmount(summary.balance, summary.currency)}
                    </Text>
                    <Text className="mt-2 text-caption font-normal text-textSecondary">
                      {balanceLabel}
                    </Text>
                  </View>
                  <AppBadge label="Open Ledger" variant="accent" />
                </View>

                <View className="flex-row gap-4">
                  <View className="flex-1 rounded-2xl bg-primary-100 px-4 py-4">
                    <Text className="text-caption font-normal text-textSecondary">
                      {primaryTotalLabel}
                    </Text>
                    <Text className="mt-2 text-section font-semibold text-textPrimary">
                      {formatLedgerAmount(primaryTotalAmount, summary.currency)}
                    </Text>
                  </View>

                  <View className="flex-1 rounded-2xl bg-accent-100 px-4 py-4">
                    <Text className="text-caption font-normal text-textSecondary">
                      {paidBackLabel}
                    </Text>
                    <Text className="mt-2 text-section font-semibold text-textPrimary">
                      {formatLedgerAmount(paidBackAmount, summary.currency)}
                    </Text>
                  </View>
                </View>

                {(summary.pendingRepaymentReceived || summary.pendingRepaymentSent) ? (
                  <View className="rounded-2xl bg-surfaceMuted px-4 py-4">
                    <Text className="text-caption font-normal text-textSecondary">
                      Pending repayments
                    </Text>
                    <Text className="mt-2 text-section font-semibold text-textPrimary">
                      {formatLedgerAmount(
                        summary.pendingRepaymentReceived + summary.pendingRepaymentSent,
                        summary.currency,
                      )}
                    </Text>
                  </View>
                ) : null}
              </View>
            </AppCard>

            {pendingRepaymentRequests.length ? (
              <AppCard variant="elevated">
                <View className="gap-4">
                  <View>
                    <Text className="text-section font-semibold text-textPrimary">
                      Pending Repayment Requests
                    </Text>
                    <Text className="mt-1 text-caption font-normal text-textSecondary">
                      Confirm these repayments to reduce the outstanding balance.
                    </Text>
                  </View>
                  {pendingRepaymentRequests.map(item => (
                    <View key={item.id} className="rounded-2xl bg-surfaceMuted px-4 py-4">
                      <Text className="text-body font-normal text-textPrimary">
                        {item.counterpartyName || 'This contact'} returned{' '}
                        {formatLedgerAmount(item.amount, item.currency)}
                      </Text>
                      <Text className="mt-1 text-caption font-normal text-textSecondary">
                        {item.note || 'No note added'}
                      </Text>
                      <View className="mt-3">
                        <AppButton
                          label="Confirm Repayment"
                          loading={approvingTransactionId === item.id}
                          onPress={() => handleApproveRepayment(item.id)}
                          size="md"
                          variant="accent"
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </AppCard>
            ) : null}

            <View className="gap-3">
              <View>
                <Text className="text-section font-semibold text-textPrimary">
                  Transaction History
                </Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Ledger entries for this contact appear here.
                </Text>
              </View>

              {!formattedTransactions.length ? (
                <AppListState
                  description="Create the first transaction to start this contact ledger."
                  mode="empty"
                  title="No transactions yet"
                />
              ) : (
                <AppCard padding="sm">
                  <View>
                    {formattedTransactions.map((transaction, index) => (
                      <ContactTransactionRow
                        key={transaction.id}
                        {...transaction}
                        showDivider={index !== formattedTransactions.length - 1}
                      />
                    ))}
                  </View>
                </AppCard>
              )}
            </View>

            <AppButton
              label={summary.balance < 0 ? 'Record Repayment' : 'Add Transaction'}
              onPress={() => {
                if (summary.balance < 0) {
                    navigation.navigate(ROUTES.RECORD_REPAYMENT, {
                    contactId: contact?.id,
                  });
                  return;
                }

                navigation.navigate(ROUTES.MAIN_TABS, {
                  params: {
                    contactId: contact?.id,
                  },
                  screen: ROUTES.ADD_TRANSACTION,
                });
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
