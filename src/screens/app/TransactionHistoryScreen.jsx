import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

import {
  AppBadge,
  AppCard,
  AppInput,
  AppListState,
  AppLoader,
} from '@/components/ui';
import {getTransactions} from '@/services/transactionApi';
import {mapTransactionToHistoryRow} from '@/utils/transactions';

import {TransactionHistoryRow} from './components';

const filters = ['All', 'Gave', 'Took'];

export const TransactionHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await getTransactions();
      setTransactions(Array.isArray(result?.transactions) ? result.transactions : []);
    } catch (error) {
      setErrorMessage(error.message || 'Could not load transactions.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return transactions.filter(item => {
      const matchesFilter =
        activeFilter === 'All' || item.type === activeFilter.toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        item.contactName?.toLowerCase().includes(normalizedQuery) ||
        item.note?.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query, transactions]);

  const formattedTransactions = useMemo(
    () => filteredTransactions.map(mapTransactionToHistoryRow),
    [filteredTransactions],
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Browse every record with quick filters for gave and took entries.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              Transaction History
            </Text>
          </View>
          <AppBadge label={`${transactions.length} total`} variant="accent" />
        </View>

        <View className="flex-row items-center gap-3">
          {filters.map(filter => {
            const isActive = filter === activeFilter;

            return (
              <Pressable
                key={filter}
                hitSlop={6}
                className={`h-11 min-w-[76px] items-center justify-center rounded-full border px-4 ${
                  isActive
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-border bg-surface'
                }`}
                onPress={() => setActiveFilter(filter)}>
                <Text
                  className={`text-center text-caption leading-[16px] font-normal ${
                    isActive ? 'text-white' : 'text-textSecondary'
                  }`}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <AppCard variant="elevated">
          <AppInput
            helperText="Search by title or note"
            isFocused={isSearchFocused}
            leftElement={<Text className="text-section font-semibold text-textMuted">S</Text>}
            onBlur={() => setIsSearchFocused(false)}
            onChangeText={setQuery}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search transactions"
            value={query}
            variant="filled"
          />
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">
              All Transactions
            </Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Your full ledger appears here with gave and took filters.
            </Text>
          </View>

          {isLoading ? (
            <AppLoader card label="Loading transactions..." />
          ) : errorMessage ? (
            <AppListState
              actionLabel="Retry"
              description={errorMessage}
              mode="empty"
              onActionPress={loadTransactions}
              title="Transactions unavailable"
            />
          ) : !transactions.length ? (
            <AppListState
              actionLabel="Create Transaction"
              description="New transaction records will appear here once you start tracking them."
              mode="empty"
              title="No transactions yet"
            />
          ) : formattedTransactions.length ? (
            <AppCard padding="sm">
              <View className="gap-4">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="text-section font-semibold text-textPrimary">History List</Text>
                  <AppBadge label={`${formattedTransactions.length} shown`} variant="primary" />
                </View>
                {formattedTransactions.map((item, index) => (
                  <TransactionHistoryRow
                    key={item.id}
                    {...item}
                    showDivider={index !== formattedTransactions.length - 1}
                  />
                ))}
              </View>
            </AppCard>
          ) : (
            <AppListState
              description="Try another filter or search term to find your records."
              mode="search"
              title="No transactions found"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
