import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
    AppAvatar,
    AppBadge,
    AppButton,
    AppCard,
    AppListState,
    AppLoader,
} from '@/components/ui';
import { ROUTES } from '@/navigation';
import { getContact } from '@/services/contactApi';
import {
    approveRepaymentRequest,
    confirmLoanRequest,
    getTransactions,
    rejectLoanRequest,
} from '@/services/transactionApi';
import {
    formatLedgerAmount,
    mapTransactionToContactRow,
    summarizeTransactions,
} from '@/utils/transactions';

import { ContactTransactionRow } from './components';

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
                getTransactions({ contactId }),
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
    const hasReceivableBalance = summary.remainingToReceive > 0;
    const hasPayableBalance = summary.remainingToPay > 0;
    const overallBalanceLabel =
        hasReceivableBalance && !hasPayableBalance
            ? 'Remaining To Receive'
            : hasPayableBalance && !hasReceivableBalance
                ? 'Remaining To Pay'
                : hasReceivableBalance && hasPayableBalance
                    ? 'Net Outstanding Balance'
                    : 'Outstanding Balance';
    const pendingRepaymentRequests = transactions.filter(
        transaction =>
            transaction.category === 'repayment' &&
            transaction.status === 'pending' &&
            transaction.viewerRole === 'counterparty',
    );
    const pendingLoanRequests = transactions.filter(
        transaction =>
            transaction.category === 'loan' &&
            transaction.status === 'pending' &&
            transaction.viewerRole === 'counterparty',
    );
    const overallBalanceAmount =
        hasReceivableBalance && !hasPayableBalance
            ? summary.remainingToReceive
            : hasPayableBalance && !hasReceivableBalance
                ? summary.remainingToPay
                : Math.abs(summary.balance);
    const balanceLabel =
        hasReceivableBalance && !hasPayableBalance
            ? 'This is the amount still expected back from this contact.'
            : hasPayableBalance && !hasReceivableBalance
                ? 'This is the amount you still need to return to this contact.'
                : hasReceivableBalance && hasPayableBalance
                    ? 'This contact has both receivable and payable activity. The net difference is shown here.'
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

    const handleConfirmLoan = async transactionId => {
        setApprovingTransactionId(transactionId);

        try {
            await confirmLoanRequest(transactionId);
            Toast.show({
                type: 'customToast',
                text1: 'Success',
                text2: 'Loan confirmed successfully.',
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
                text2: error.message || 'Could not confirm loan.',
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

    const handleRejectLoan = async transactionId => {
        setApprovingTransactionId(transactionId);

        try {
            await rejectLoanRequest(transactionId);
            Toast.show({
                type: 'customToast',
                text1: 'Success',
                text2: 'Loan rejected successfully.',
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
                contentContainerClassName="flex-grow px-6 py-8 gap-6"
                showsVerticalScrollIndicator={false}>
                <View className="gap-4">
                    <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                        <Text className="text-caption font-semibold text-primary-500">Back</Text>
                    </Pressable>

                    {/* <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Contact details, balance summary, and transaction history.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Contact Detail
            </Text>
          </View> */}
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
                        {pendingLoanRequests.length ? (
                            <AppCard variant="elevated">
                                <View className="gap-4">
                                    <View className="rounded-[24px] bg-accent-400 px-4 py-4">
                                        <View className="flex-row items-center justify-between gap-3">
                                            <Text className="text-section font-semibold text-white">
                                                Pending Loan Requests
                                            </Text>
                                            <AppBadge label="Action Needed" variant="primary" />
                                        </View>
                                        <Text className="mt-2 text-caption font-normal text-white/85">
                                            Confirm these loans before they are added to the ledger totals.
                                        </Text>
                                    </View>
                                    {pendingLoanRequests.map(item => (
                                        <View
                                            key={item.id}
                                            className="overflow-hidden rounded-[24px] border border-accent-300 bg-[#fff6ee] px-4 py-4">
                                            <View className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent-300/40" />
                                            <View className="flex-row items-start justify-between gap-3">
                                                <View className="flex-1">
                                                    <Text className="text-body font-semibold text-textPrimary">
                                                        {item.type === 'took'
                                                            ? `${item.counterpartyName || 'This contact'} assigned you ${formatLedgerAmount(
                                                                item.amount,
                                                                item.currency,
                                                            )}`
                                                            : `${item.counterpartyName || 'This contact'} recorded borrowing ${formatLedgerAmount(
                                                                item.amount,
                                                                item.currency,
                                                            )} from you`}
                                                    </Text>
                                                    <Text className="mt-2 text-caption font-normal text-textSecondary">
                                                        {item.note || 'No note added'}
                                                    </Text>
                                                </View>
                                                <View className="rounded-full bg-accent-400 px-3 py-1.5">
                                                    <Text className="text-caption font-semibold text-white">Pending</Text>
                                                </View>
                                            </View>
                                            <View className="mt-4 rounded-2xl bg-white px-3 py-3">
                                                <Text className="text-caption font-semibold text-accent-400">
                                                    Review this request carefully before updating your ledger.
                                                </Text>
                                            </View>
                                            <View className="mt-4 flex-row gap-3">
                                                <AppButton
                                                    fullWidth={false}
                                                    label="Reject Loan"
                                                    loading={approvingTransactionId === item.id}
                                                    onPress={() => handleRejectLoan(item.id)}
                                                    size="md"
                                                    variant="secondary"
                                                />
                                                <AppButton
                                                    fullWidth={false}
                                                    label="Confirm Loan"
                                                    loading={approvingTransactionId === item.id}
                                                    onPress={() => handleConfirmLoan(item.id)}
                                                    size="md"
                                                    variant="accent"
                                                />
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </AppCard>
                        ) : null}

                        <AppCard variant="elevated">
                            <View className="flex-row items-center gap-4">
                                {contact?.profilePhoto ? (
                                    <Image
                                        className="h-16 w-16 rounded-full"
                                        resizeMode="cover"
                                        source={{ uri: contact.profilePhoto }}
                                    />
                                ) : (
                                    <AppAvatar
                                        imageUri={contact?.profilePhoto}
                                        name={contactName}
                                        size="lg"
                                        variant="primary"
                                    />
                                )}
                                <View className="flex-1 flex-row items-center gap-3">
                                    <Text
                                        className="text-[16px] font-bold tracking-[-0.3px] text-textPrimary"
                                        numberOfLines={1}>
                                        {contactName}
                                    </Text>
                                    <AppBadge label="Connected" variant="primary" />
                                </View>
                            </View>
                        </AppCard>

                        <AppCard variant="elevated">
                            <View className="gap-5">
                                <View className="flex-row items-start justify-between gap-4">
                                    <View className="flex-1">
                                        <Text className="text-caption font-normal text-textSecondary">
                                            {overallBalanceLabel}
                                        </Text>
                                        <Text
                                            adjustsFontSizeToFit
                                            className="mt-2 text-hero font-bold tracking-[-0.4px] text-textPrimary"
                                            minimumFontScale={0.55}
                                            numberOfLines={1}>
                                            {formatLedgerAmount(overallBalanceAmount, summary.currency)}
                                        </Text>
                                        <Text className="mt-2 text-caption font-normal text-textSecondary">
                                            {balanceLabel}
                                        </Text>
                                    </View>
                                    <AppBadge label="Open Ledger" variant="accent" />
                                </View>

                                <View className="flex-row flex-wrap justify-between">
                                    <View className=" w-[48%] rounded-2xl bg-primary-700 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Total Loaned
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.gave, summary.currency)}
                                        </Text>
                                    </View>

                                    <View className="w-[48%] rounded-2xl bg-accent-500 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Total Borrowed
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.took, summary.currency)}
                                        </Text>
                                    </View>


                                </View>
                                <View className="flex-row flex-wrap justify-between">
                                    <View className=" w-[48%] rounded-2xl bg-primary-500 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Collected Back
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.collected, summary.currency)}
                                        </Text>
                                    </View>



                                    <View className="w-[48%] rounded-2xl bg-accent-400 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Paid Back
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.repaid, summary.currency)}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row gap-4">
                                    <View className="flex-1 rounded-2xl bg-primary-300 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Remaining To Receive
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.remainingToReceive, summary.currency)}
                                        </Text>
                                    </View>

                                    <View className="flex-1 rounded-2xl bg-accent-300 px-4 py-4">
                                        <Text className="text-caption font-normal text-white/80">
                                            Remaining To Pay
                                        </Text>
                                        <Text className="mt-2 text-section font-semibold text-white">
                                            {formatLedgerAmount(summary.remainingToPay, summary.currency)}
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
                            label={summary.remainingToPay > 0 ? 'Record Repayment' : 'Add Transaction'}
                            onPress={() => {
                                if (summary.remainingToPay > 0) {
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
