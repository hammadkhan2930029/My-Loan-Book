import React, {useMemo, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  AppBadge,
  AppButton,
  AppCard,
  AppInput,
  AppListState,
} from '@/components/ui';

import {PeopleContactRow} from './components';

const contacts = [
  {
    id: '1',
    name: 'Sara Khan',
    summary: '3 open records - last update today',
    balance: '$540',
    balanceType: 'gave',
    variant: 'primary',
  },
  {
    id: '2',
    name: 'Ali Raza',
    summary: '2 open records - last update yesterday',
    balance: '$220',
    balanceType: 'took',
    variant: 'accent',
  },
  {
    id: '3',
    name: 'Maya Lee',
    summary: '1 open record - last update 2 days ago',
    balance: '$110',
    balanceType: 'gave',
    variant: 'muted',
  },
  {
    id: '4',
    name: 'Omar Ali',
    summary: '4 records - last update this week',
    balance: '$75',
    balanceType: 'took',
    variant: 'primary',
  },
  {
    id: '5',
    name: 'Noah James',
    summary: '1 recent settlement - last update 5 days ago',
    balance: '$310',
    balanceType: 'gave',
    variant: 'accent',
  },
];

export const MyPeopleScreen = () => {
  const [query, setQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return contacts;
    }

    return contacts.filter(contact => contact.name.toLowerCase().includes(normalized));
  }, [query]);

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
              Track who owes you, who you paid, and who needs a follow-up.
            </Text>
            <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
              My People
            </Text>
          </View>
          <AppBadge label={`${contacts.length} contacts`} variant="accent" />
        </View>

        <AppCard variant="elevated">
          <View className="gap-4">
            <AppInput
              helperText="Search by contact name"
              isFocused={isSearchFocused}
              leftElement={<Text className="text-section font-semibold text-textMuted">S</Text>}
              onBlur={() => setIsSearchFocused(false)}
              onChangeText={setQuery}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search contacts"
              value={query}
              variant="filled"
            />

            <AppButton label="Add Contact" variant="primary" />
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Contacts</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              A quick view of current balances and recent activity.
            </Text>
          </View>

          {!contacts.length ? (
            <AppListState
              actionLabel="Add Contact"
              description="Your contact ledger will appear here once you add people."
              mode="empty"
              title="No contacts yet"
            />
          ) : filteredContacts.length ? (
            <AppCard padding="sm">
              <View>
                {filteredContacts.map((contact, index) => (
                  <PeopleContactRow
                    key={contact.id}
                    {...contact}
                    showDivider={index !== filteredContacts.length - 1}
                  />
                ))}
              </View>
            </AppCard>
          ) : (
            <AppListState
              description="Try another name or clear the search to see all contacts."
              mode="search"
              title="No matching contacts"
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
