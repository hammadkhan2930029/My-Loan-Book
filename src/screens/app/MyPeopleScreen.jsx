import React, {useCallback, useMemo, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {
  AppBadge,
  AppButton,
  AppCard,
  AppFormStatus,
  AppInput,
  AppListState,
  AppLoader,
} from '@/components/ui';
import {ROUTES} from '@/navigation';
import {addContactByRegCode, getContacts} from '@/services/contactApi';

import {PeopleContactRow} from './components';

const formatContact = contact => ({
  id: contact?.id || '',
  contactUserId: contact?.contactUserId,
  name: contact?.fullName || 'Unknown Contact',
  imageUri: contact?.profilePhoto,
  summary: `Reg code ${contact?.reg_code || 'N/A'} - ready for ledger`,
  balance: 'PKR 0',
  balanceType: 'gave',
  variant: 'primary',
});

export const MyPeopleScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [regCode, setRegCode] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRegCodeFocused, setIsRegCodeFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setFormError('');

    try {
      const result = await getContacts();
      setContacts(Array.isArray(result?.contacts) ? result.contacts : []);
    } catch (error) {
      const errorMessage = error.message || 'Could not load contacts.';

      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts]),
  );

  const formattedContacts = useMemo(
    () => (Array.isArray(contacts) ? contacts : []).map(formatContact),
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return formattedContacts;
    }

    return formattedContacts.filter(contact =>
      contact.name.toLowerCase().includes(normalized),
    );
  }, [formattedContacts, query]);

  const handleAddContact = async () => {
    const normalizedRegCode = regCode.trim().toUpperCase();

    setFormMessage('');
    setFormError('');

    if (!normalizedRegCode) {
      setFormError('Enter a registration code to add a contact.');
      return;
    }

    setIsAdding(true);

    try {
      const result = await addContactByRegCode({regCode: normalizedRegCode});
      const successMessage = `${result.contact.fullName} added to your contacts.`;

      setRegCode('');
      setContacts(current => [result.contact, ...current]);
      setFormMessage(successMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: successMessage,
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
    } catch (error) {
      const errorMessage = error.message || 'Could not add contact.';

      setFormError(errorMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Error',
        text2: errorMessage,
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 pt-8 pb-36 gap-6"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-caption font-normal text-textSecondary">
              Add registered MyLoanBook users by registration code and track balances.
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
              autoCapitalize="characters"
              helperText="Ask the other user for their 6-character registration code."
              isFocused={isRegCodeFocused}
              label="Add Contact"
              onBlur={() => setIsRegCodeFocused(false)}
              onChangeText={value => setRegCode(value.toUpperCase())}
              onFocus={() => setIsRegCodeFocused(true)}
              placeholder="Enter reg code"
              value={regCode}
              variant="filled"
            />

            <AppButton
              disabled={isAdding}
              label="Add Contact"
              loading={isAdding}
              onPress={handleAddContact}
              variant="primary"
            />

            <AppFormStatus
              idleMessage={
                formError ||
                formMessage ||
                (isLoading ? 'Loading contacts...' : 'Contacts are added using reg codes only.')
              }
            />
          </View>
        </AppCard>

        <AppCard variant="elevated">
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
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Contacts</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              A quick view of people connected to your account.
            </Text>
          </View>

          {isLoading ? (
            <AppLoader card label="Loading contacts..." />
          ) : !formattedContacts.length ? (
            <AppListState
              actionLabel="Refresh"
              description="Add a contact using their registration code to start your ledger."
              mode="empty"
              onActionPress={loadContacts}
              title="No contacts yet"
            />
          ) : filteredContacts.length ? (
            <AppCard padding="sm">
              <View>
                {filteredContacts.map((contact, index) => (
                  <PeopleContactRow
                    key={contact.id}
                    {...contact}
                    onPress={() =>
                      navigation.navigate(ROUTES.CONTACT_DETAIL, {
                        contactId: contact.id,
                      })
                    }
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
