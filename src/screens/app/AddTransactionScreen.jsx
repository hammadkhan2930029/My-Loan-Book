import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppFormStatus,
  AppInput,
  AppListState,
  AppLoader,
} from '@/components/ui';
import {ROUTES} from '@/navigation';
import {getContacts} from '@/services/contactApi';
import {createTransaction} from '@/services/transactionApi';

import {PeopleContactRow, TransactionTypeToggle} from './components';

const formatContact = contact => ({
  id: contact?.id || '',
  name: contact?.fullName || 'Unknown Contact',
  imageUri: contact?.profilePhoto,
  summary: `Reg code ${contact?.reg_code || 'N/A'}`,
  balance: 'PKR 0',
  balanceType: 'gave',
  variant: 'primary',
});

const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const currencyOptions = [
  {code: 'PKR', label: 'Pakistani Rupee'},
  {code: 'USD', label: 'US Dollar'},
  {code: 'SAR', label: 'Saudi Riyal'},
  {code: 'AED', label: 'UAE Dirham'},
  {code: 'EUR', label: 'Euro'},
  {code: 'GBP', label: 'British Pound'},
];

const formatDisplayDate = value =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(value);

const getMonthLabel = value =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(value);

const buildCalendarDays = monthDate => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let index = 0; index < startWeekday; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
};

export const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const initialContactId = route.params?.contactId;
  const hasAppliedInitialContact = useRef(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactQuery, setContactQuery] = useState('');
  const [transactionType, setTransactionType] = useState('gave');
  const [focusedField, setFocusedField] = useState('');
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDueDate, setSelectedDueDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [activeCalendarField, setActiveCalendarField] = useState('date');
  const [attachmentPreview, setAttachmentPreview] = useState({
    name: '',
    uri: '',
  });
  const [form, setForm] = useState({
    amount: '',
    currency: 'PKR',
    date: '',
    dueDate: '',
    monthlyPaymentDay: '',
    note: '',
    attachment: '',
  });

  const loadContacts = useCallback(async () => {
    setIsLoadingContacts(true);
    setFormError('');

    try {
      const result = await getContacts();
      const nextContacts = Array.isArray(result?.contacts) ? result.contacts : [];

      setContacts(nextContacts);

      if (initialContactId && !hasAppliedInitialContact.current) {
        const matchedContact = nextContacts.find(contact => contact.id === initialContactId);

        if (matchedContact) {
          setSelectedContact(formatContact(matchedContact));
        }

        hasAppliedInitialContact.current = true;
      }
    } catch (error) {
      setFormError(error.message || 'Could not load contacts.');
    } finally {
      setIsLoadingContacts(false);
    }
  }, [initialContactId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const formattedContacts = useMemo(
    () => (Array.isArray(contacts) ? contacts : []).map(formatContact),
    [contacts],
  );

  const filteredContacts = useMemo(() => {
    const normalized = contactQuery.trim().toLowerCase();

    if (!normalized) {
      return formattedContacts;
    }

    return formattedContacts.filter(contact =>
      contact.name.toLowerCase().includes(normalized),
    );
  }, [contactQuery, formattedContacts]);

  const filteredCurrencyOptions = useMemo(() => {
    const normalizedQuery = currencyQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return currencyOptions;
    }

    return currencyOptions.filter(currency =>
      currency.code.toLowerCase().includes(normalizedQuery),
    );
  }, [currencyQuery]);

  const handleSelectContact = contact => {
    setSelectedContact(contact);
    setFormMessage(`${contact.name} selected. Add transaction details below.`);
    setFormError('');
  };

  const handleOpenCalendar = () => {
    setFocusedField('');
    setActiveCalendarField('date');
    setCalendarMonth(selectedDate || new Date());
    setIsCalendarOpen(true);
  };

  const handleOpenDueDateCalendar = () => {
    setFocusedField('');
    setActiveCalendarField('dueDate');
    setCalendarMonth(selectedDueDate || selectedDate || new Date());
    setIsCalendarOpen(true);
  };

  const handleSelectDate = value => {
    setCalendarMonth(value);
    if (activeCalendarField === 'dueDate') {
      setSelectedDueDate(value);
      setForm(current => ({
        ...current,
        dueDate: formatDisplayDate(value),
      }));
    } else {
      setSelectedDate(value);
      setForm(current => ({
        ...current,
        date: formatDisplayDate(value),
      }));
    }
    setFormError('');
    setIsCalendarOpen(false);
  };

  const handlePickAttachment = async () => {
    let result;

    try {
      result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: true,
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.7,
        selectionLimit: 1,
      });
    } catch (pickerError) {
      const errorMessage =
        pickerError.message || 'Could not open image picker. Please try again.';

      setFormError(errorMessage);
      return;
    }

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      setFormError(result.errorMessage || 'Could not select slip image.');
      return;
    }

    const selectedAsset = result.assets?.[0];

    if (!selectedAsset?.base64) {
      setFormError('Selected slip image could not be prepared. Please try another image.');
      return;
    }

    const imageType = selectedAsset.type || 'image/jpeg';
    const imageData = `data:${imageType};base64,${selectedAsset.base64}`;

    setAttachmentPreview({
      name: selectedAsset.fileName || 'Selected slip',
      uri: selectedAsset.uri || '',
    });
    setForm(current => ({
      ...current,
      attachment: imageData,
    }));
    setFormError('');
    setFormMessage('Slip image selected. Save transaction to upload it.');
  };

  const handleRemoveAttachment = () => {
    setAttachmentPreview({
      name: '',
      uri: '',
    });
    setForm(current => ({
      ...current,
      attachment: '',
    }));
    setFormError('');
    setFormMessage('Slip image removed.');
  };

  const hasSelectedContact = Boolean(selectedContact);
  const canSaveTransaction =
    hasSelectedContact &&
    Boolean(form.amount.trim()) &&
    Boolean(form.date.trim()) &&
    Boolean(form.dueDate.trim());
  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  const handleSelectCurrency = currency => {
    setForm(current => ({
      ...current,
      currency: currency.code,
    }));
    setCurrencyQuery('');
    setFormError('');
    setIsCurrencyPickerOpen(false);
  };

  const handleSaveTransaction = async () => {
    const trimmedAmount = form.amount.trim().replace(/,/g, '');
    const parsedAmount = Number(trimmedAmount);
    const parsedDate = selectedDate;
    const parsedDueDate = selectedDueDate;
    const trimmedMonthlyPaymentDay = form.monthlyPaymentDay.trim();
    const parsedMonthlyPaymentDay = trimmedMonthlyPaymentDay
      ? Number(trimmedMonthlyPaymentDay)
      : null;

    setFormMessage('');
    setFormError('');

    if (!selectedContact?.id) {
      setFormError('Select a contact before saving the transaction.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter a valid amount greater than zero.');
      return;
    }

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      setFormError('Enter a valid transaction date.');
      return;
    }

    if (!parsedDueDate || Number.isNaN(parsedDueDate.getTime())) {
      setFormError('Select a valid return due date.');
      return;
    }

    if (parsedDueDate < parsedDate) {
      setFormError('Return due date must be on or after the loan date.');
      return;
    }

    if (
      trimmedMonthlyPaymentDay &&
      (!Number.isInteger(parsedMonthlyPaymentDay) ||
        parsedMonthlyPaymentDay < 1 ||
        parsedMonthlyPaymentDay > 31)
    ) {
      setFormError('Monthly payment date must be between 1 and 31.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createTransaction({
        contactId: selectedContact.id,
        type: transactionType,
        amount: parsedAmount,
        currency: form.currency,
        transactionDate: parsedDate.toISOString(),
        dueDate: parsedDueDate.toISOString(),
        ...(parsedMonthlyPaymentDay ? {monthlyPaymentDay: parsedMonthlyPaymentDay} : {}),
        note: form.note.trim(),
        attachment: form.attachment,
      });
      const successMessage = `${selectedContact.name} transaction saved successfully.`;

      setForm({
        amount: '',
        currency: 'PKR',
        date: '',
        dueDate: '',
        monthlyPaymentDay: '',
        note: '',
        attachment: '',
      });
      setSelectedContact(null);
      setContactQuery('');
      setSelectedDate(null);
      setSelectedDueDate(null);
      setCalendarMonth(new Date());
      setAttachmentPreview({
        name: '',
        uri: '',
      });
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
      if (result?.transaction?.contactId) {
        navigation.navigate(ROUTES.CONTACT_DETAIL, {
          contactId: result.transaction.contactId,
        });
      } else {
        navigation.navigate(ROUTES.MY_PEOPLE);
      }
    } catch (error) {
      const errorMessage = error.message || 'Could not save transaction.';

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
      setIsSubmitting(false);
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
        <View className="gap-4">
          <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
            <Text className="text-caption font-semibold text-primary-500">Back</Text>
          </Pressable>

          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <Text className="text-caption font-normal text-textSecondary">
                Select a contact first, then add amount, date, note, and proof.
              </Text>
              <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                Add Transaction
              </Text>
            </View>
            <AppBadge label={hasSelectedContact ? 'Details' : 'Contact'} variant="accent" />
          </View>
        </View>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Contact</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Search and select one of your My People contacts.
            </Text>
          </View>

          {selectedContact ? (
            <View className="rounded-[24px] border border-accent-300 bg-accent-100 px-5 py-5 shadow-card">
              <View className="gap-4">
                <View className="flex-row items-center gap-4">
                  <AppAvatar
                    imageUri={selectedContact.imageUri}
                    name={selectedContact.name}
                    size="md"
                    variant="accent"
                  />
                  <View className="flex-1">
                    <Text className="text-body font-normal text-textPrimary">
                      {selectedContact.name}
                    </Text>
                    <Text className="mt-1 text-caption font-normal text-accent-500">
                      Selected contact
                    </Text>
                  </View>
                  <AppBadge label="Selected" variant="accent" />
                </View>

                <AppButton
                  label="Change Contact"
                  onPress={() => setSelectedContact(null)}
                  size="md"
                  variant="accent"
                />
              </View>
            </View>
          ) : (
            <>
              <AppCard variant="elevated">
                <AppInput
                  helperText="Search by contact name"
                  isFocused={isSearchFocused}
                  leftElement={<Text className="text-section font-semibold text-textMuted">S</Text>}
                  onBlur={() => setIsSearchFocused(false)}
                  onChangeText={setContactQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search contacts"
                  value={contactQuery}
                  variant="filled"
                />
              </AppCard>

              {isLoadingContacts ? (
                <AppLoader card label="Loading contacts..." />
              ) : !formattedContacts.length ? (
                <AppListState
                  actionLabel="Refresh"
                  description="Add contacts from My People before creating a transaction."
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
                        onPress={() => handleSelectContact(contact)}
                        selected={selectedContact?.id === contact.id}
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
            </>
          )}
        </View>

        {hasSelectedContact ? (
          <>
            <AppCard variant="elevated">
              <View className="gap-4">
                <Text className="text-section font-semibold text-textPrimary">
                  Transaction Type
                </Text>
                <TransactionTypeToggle onChange={setTransactionType} value={transactionType} />
                <Text className="text-caption font-normal text-textSecondary">
                  Choose whether you gave money or took money for this entry.
                </Text>
              </View>
            </AppCard>

            <View className="gap-3">
              <View>
                <Text className="text-section font-semibold text-textPrimary">
                  Transaction Details
                </Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Fill these details after selecting a contact.
                </Text>
              </View>

              <AppCard variant="elevated">
                <View className="gap-4">
                  <AppInput
                    helperText="Enter the transaction amount."
                    isFocused={focusedField === 'amount'}
                    keyboardType="numeric"
                    label="Amount"
                    onBlur={() => setFocusedField('')}
                    onChangeText={amount => setForm(current => ({...current, amount}))}
                    onFocus={() => setFocusedField('amount')}
                    placeholder="Enter amount"
                    value={form.amount}
                  />

                  <Pressable hitSlop={6} onPress={() => setIsCurrencyPickerOpen(true)}>
                    <View pointerEvents="none">
                      <AppInput
                        helperText="Select the currency for this loan amount."
                        isFocused={false}
                        label="Currency"
                        editable={false}
                        placeholder="Select currency"
                        rightElement={
                          <Text className="text-caption font-semibold text-primary-500">
                            Pick
                          </Text>
                        }
                        value={form.currency}
                      />
                    </View>
                  </Pressable>

                  <Pressable hitSlop={6} onPress={handleOpenCalendar}>
                    <View pointerEvents="none">
                      <AppInput
                        helperText="Select the date when you gave or took the loan."
                        isFocused={false}
                        label="Loan Date"
                        editable={false}
                        placeholder="Select loan date"
                        rightElement={
                          <Text className="text-caption font-semibold text-primary-500">
                            Pick
                          </Text>
                        }
                        value={form.date}
                      />
                    </View>
                  </Pressable>

                  <Pressable hitSlop={6} onPress={handleOpenDueDateCalendar}>
                    <View pointerEvents="none">
                      <AppInput
                        helperText="Select the last date for loan return."
                        isFocused={false}
                        label="Return End Date"
                        editable={false}
                        placeholder="Select return end date"
                        rightElement={
                          <Text className="text-caption font-semibold text-primary-500">
                            Pick
                          </Text>
                        }
                        value={form.dueDate}
                      />
                    </View>
                  </Pressable>

                  <AppInput
                    helperText="Optional: if repayment will happen in parts, enter the monthly payment date from 1 to 31."
                    isFocused={focusedField === 'monthlyPaymentDay'}
                    keyboardType="number-pad"
                    label="Monthly Payment Date"
                    onBlur={() => setFocusedField('')}
                    onChangeText={monthlyPaymentDay =>
                      setForm(current => ({...current, monthlyPaymentDay}))
                    }
                    onFocus={() => setFocusedField('monthlyPaymentDay')}
                    placeholder="Optional, e.g. 5"
                    value={form.monthlyPaymentDay}
                  />

                  <AppInput
                    helperText="Add a short note to describe this transaction."
                    isFocused={focusedField === 'note'}
                    label="Note"
                    multiline
                    onBlur={() => setFocusedField('')}
                    onChangeText={note => setForm(current => ({...current, note}))}
                    onFocus={() => setFocusedField('note')}
                    placeholder="Write a note"
                    value={form.note}
                  />
                </View>
              </AppCard>
            </View>

            <View className="gap-3">
              <View>
                <Text className="text-section font-semibold text-textPrimary">Attachment</Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Upload the receipt or slip image with this transaction.
                </Text>
              </View>

              <AppCard variant="elevated">
                <View className="gap-4">
                  <Pressable
                    className="items-center rounded-3xl border border-dashed border-border px-5 py-8"
                    hitSlop={6}
                    onPress={handlePickAttachment}>
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                      <Text className="text-title font-bold tracking-[-0.3px] text-primary-500">
                        +
                      </Text>
                    </View>
                    <Text className="mt-4 text-section font-semibold text-textPrimary">
                      Upload Receipt / Slip
                    </Text>
                    <Text className="mt-2 text-caption font-normal text-textSecondary text-center">
                      Tap to select a slip image from your gallery.
                    </Text>
                  </Pressable>

                  {attachmentPreview.name ? (
                    <View className="rounded-3xl bg-surfaceMuted px-4 py-4">
                      <Text className="text-body font-normal text-textPrimary">
                        {attachmentPreview.name}
                      </Text>
                      <Text className="mt-1 text-caption font-normal text-textSecondary">
                        Slip image is ready to upload with this transaction.
                      </Text>
                      <View className="mt-3 flex-row gap-3">
                        <AppButton
                          fullWidth={false}
                          label="Change Slip"
                          onPress={handlePickAttachment}
                          size="md"
                          variant="secondary"
                        />
                        <AppButton
                          fullWidth={false}
                          label="Remove Slip"
                          onPress={handleRemoveAttachment}
                          size="md"
                          variant="ghost"
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </AppCard>
            </View>

            <AppFormStatus
              submitting={isSubmitting}
              idleMessage={
                formError ||
                formMessage ||
                'Save transaction to your ledger.'
              }
              submittingMessage="Saving transaction..."
            />

            <AppButton
              disabled={!canSaveTransaction}
              label={transactionType === 'gave' ? 'Save Gave Entry' : 'Save Took Entry'}
              loading={isSubmitting}
              onPress={handleSaveTransaction}
              variant={canSaveTransaction ? 'accent' : 'secondary'}
            />
          </>
        ) : (
          <AppFormStatus
            idleMessage={
              formError ||
              formMessage ||
              'Select a contact to open the transaction details form.'
            }
          />
        )}
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isCurrencyPickerOpen}
        onRequestClose={() => {
          setCurrencyQuery('');
          setIsCurrencyPickerOpen(false);
        }}>
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            className="absolute inset-0 bg-primary-500/30"
            onPress={() => {
              setCurrencyQuery('');
              setIsCurrencyPickerOpen(false);
            }}
          />
          <View className="w-full max-w-[360px] rounded-[28px] bg-background px-5 py-5 shadow-card">
            <View className="flex-row items-center justify-between">
              <Text className="text-section font-semibold text-textPrimary">
                Select Currency
              </Text>
              <Pressable
                hitSlop={6}
                onPress={() => {
                  setCurrencyQuery('');
                  setIsCurrencyPickerOpen(false);
                }}>
                <Text className="text-caption font-semibold text-primary-500">Close</Text>
              </Pressable>
            </View>

            <View className="mt-5">
              <AppInput
                helperText="Search by currency code"
                isFocused={false}
                onChangeText={setCurrencyQuery}
                placeholder="Search currency"
                value={currencyQuery}
                variant="filled"
              />
            </View>

            {filteredCurrencyOptions.length ? (
              <ScrollView
                className="mt-5 max-h-[280px]"
                contentContainerClassName="gap-3"
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                {filteredCurrencyOptions.map(currency => {
                  const isSelected = currency.code === form.currency;

                  return (
                    <Pressable
                      key={currency.code}
                      className={`rounded-2xl border px-4 py-4 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-100'
                          : 'border-border bg-surface'
                      }`}
                      hitSlop={4}
                      onPress={() => handleSelectCurrency(currency)}>
                      <Text
                        className={`text-body font-semibold ${
                          isSelected ? 'text-primary-500' : 'text-textPrimary'
                        }`}>
                        {currency.code}
                      </Text>
                      <Text className="mt-1 text-caption font-normal text-textSecondary">
                        {currency.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            ) : (
              <View className="mt-5 rounded-2xl bg-surface px-4 py-5">
                <Text className="text-body font-semibold text-textPrimary">
                  No currency found
                </Text>
                <Text className="mt-1 text-caption font-normal text-textSecondary">
                  Try a different search term.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={isCalendarOpen}
        onRequestClose={() => setIsCalendarOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-primary-500/30 px-6"
          onPress={() => setIsCalendarOpen(false)}>
          <Pressable
            className="w-full max-w-[360px] rounded-[28px] bg-background px-5 py-5 shadow-card"
            onPress={() => {}}>
            <View className="flex-row items-center justify-between">
              <Text className="text-section font-semibold text-textPrimary">
                {activeCalendarField === 'dueDate' ? 'Select Return End Date' : 'Select Loan Date'}
              </Text>
              <Pressable hitSlop={6} onPress={() => setIsCalendarOpen(false)}>
                <Text className="text-caption font-semibold text-primary-500">Close</Text>
              </Pressable>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <Pressable
                hitSlop={6}
                onPress={() =>
                  setCalendarMonth(
                    current =>
                      new Date(current.getFullYear(), current.getMonth() - 1, 1),
                  )
                }>
                <Text className="text-body font-semibold text-primary-500">{'<'}</Text>
              </Pressable>

              <Text className="text-body font-semibold text-textPrimary">
                {getMonthLabel(calendarMonth)}
              </Text>

              <Pressable
                hitSlop={6}
                onPress={() =>
                  setCalendarMonth(
                    current =>
                      new Date(current.getFullYear(), current.getMonth() + 1, 1),
                  )
                }>
                <Text className="text-body font-semibold text-primary-500">{'>'}</Text>
              </Pressable>
            </View>

            <View className="mt-5 flex-row flex-wrap">
              {dayLabels.map(label => (
                <View key={label} className="mb-2 w-[14.28%] items-center">
                  <Text className="text-caption font-semibold text-textMuted">{label}</Text>
                </View>
              ))}

              {calendarDays.map((day, index) => {
                if (!day) {
                  return <View key={`empty-${index}`} className="mb-2 w-[14.28%] h-11" />;
                }

                const isSelected =
                  selectedDate &&
                  day.getFullYear() === selectedDate.getFullYear() &&
                  day.getMonth() === selectedDate.getMonth() &&
                  day.getDate() === selectedDate.getDate();
                const isToday = day.toDateString() === new Date().toDateString();

                return (
                  <View key={day.toISOString()} className="mb-2 w-[14.28%] items-center">
                    <Pressable
                      className={`h-11 w-11 items-center justify-center rounded-full ${
                        isSelected
                          ? 'bg-primary-500'
                          : isToday
                            ? 'border border-primary-300 bg-primary-100'
                            : 'bg-surface'
                      }`}
                      hitSlop={4}
                      onPress={() => handleSelectDate(day)}>
                      <Text
                        className={`text-caption font-semibold ${
                          isSelected ? 'text-white' : 'text-textPrimary'
                        }`}>
                        {day.getDate()}
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};
