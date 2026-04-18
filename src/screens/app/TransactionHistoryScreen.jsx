import React, {useMemo, useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppBadge,
  AppCard,
  AppInput,
  AppListState,
} from '@/components/ui';

import {TransactionHistoryRow} from './components';

const filters = ['All', 'Gave', 'Took'];

const transactions = [
  {
    id: '1',
    title: 'Dinner split with Sara',
    date: 'Apr 17',
    note: 'Cafe meetup',
    amount: '-$120',
    type: 'gave',
  },
  {
    id: '2',
    title: 'Ali repayment',
    date: 'Apr 16',
    note: 'Partial payback',
    amount: '+$90',
    type: 'took',
  },
  {
    id: '3',
    title: 'Fuel share',
    date: 'Apr 14',
    note: 'Road trip expense',
    amount: '-$45',
    type: 'gave',
  },
  {
    id: '4',
    title: 'Office lunch return',
    date: 'Apr 12',
    note: 'Lunch split',
    amount: '+$70',
    type: 'took',
  },
  {
    id: '5',
    title: 'Movie tickets',
    date: 'Apr 10',
    note: 'Weekend outing',
    amount: '-$60',
    type: 'gave',
  },
];

export const TransactionHistoryScreen = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return transactions.filter(item => {
      const matchesFilter =
        activeFilter === 'All' || item.type === activeFilter.toLowerCase();
      const matchesQuery =
        !normalizedQuery ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.note.toLowerCase().includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, query]);

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

        <ScrollView
          horizontal
          contentContainerClassName="gap-3"
          showsHorizontalScrollIndicator={false}>
          {filters.map(filter => {
            const isActive = filter === activeFilter;

            return (
              <Pressable
                key={filter}
                hitSlop={6}
                className={`rounded-full border px-4 py-2 ${
                  isActive
                    ? 'border-primary-500 bg-primary-100'
                    : 'border-border bg-surface'
                }`}
                onPress={() => setActiveFilter(filter)}>
                <Text
                  className={`text-caption font-normal ${
                    isActive ? 'text-primary-500' : 'text-textSecondary'
                  }`}>
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

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
              Static records for now, ready for API-backed history later.
            </Text>
          </View>

          {!transactions.length ? (
            <AppListState
              actionLabel="Create Transaction"
              description="New transaction records will appear here once you start tracking them."
              mode="empty"
              title="No transactions yet"
            />
          ) : filteredTransactions.length ? (
            <AppCard padding="sm">
              <View className="gap-4">
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="text-section font-semibold text-textPrimary">History List</Text>
                  <AppBadge label={`${filteredTransactions.length} shown`} variant="primary" />
                </View>
                {filteredTransactions.map((item, index) => (
                  <TransactionHistoryRow
                    key={item.id}
                    {...item}
                    showDivider={index !== filteredTransactions.length - 1}
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
