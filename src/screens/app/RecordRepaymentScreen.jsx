import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
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
import {getContact} from '@/services/contactApi';
import {createRepaymentRequest} from '@/services/transactionApi';

const currencyOptions = [
  'PKR', // Pakistan
  'USD', // United States
  'SAR', // Saudi Arabia
  'AED', // UAE
  'EUR', // Europe
  'GBP', // United Kingdom
  'INR', // India
  'CNY', // China
  'JPY', // Japan
  'CAD', // Canada
  'AUD', // Australia
  'CHF', // Switzerland
  'TRY', // Turkey
  'QAR', // Qatar
  'KWD', // Kuwait
  'OMR', // Oman
  'BHD', // Bahrain
  'MYR', // Malaysia
  'SGD', // Singapore
  'THB', // Thailand
];
const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

export const RecordRepaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const contactId = route.params?.contactId;
  const [contact, setContact] = useState(null);
  const [isLoadingContact, setIsLoadingContact] = useState(true);
  const [focusedField, setFocusedField] = useState('');
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCurrencyPickerOpen, setIsCurrencyPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [attachmentPreview, setAttachmentPreview] = useState({name: ''});
  const [form, setForm] = useState({
    amount: '',
    currency: 'PKR',
    date: '',
    note: '',
    attachment: '',
  });

  const loadContact = useCallback(async () => {
    if (!contactId) {
      setFormError('Contact is missing.');
      return;
    }

    setIsLoadingContact(true);
    try {
      const result = await getContact(contactId);
      setContact(result?.contact || null);
    } catch (error) {
      setContact(null);
      setFormError(error.message || 'Could not load contact.');
    } finally {
      setIsLoadingContact(false);
    }
  }, [contactId]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  const calendarDays = useMemo(() => buildCalendarDays(calendarMonth), [calendarMonth]);

  const handleSelectCurrency = currency => {
    setForm(current => ({...current, currency}));
    setIsCurrencyPickerOpen(false);
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
      setFormError(pickerError.message || 'Could not open image picker.');
      return;
    }

    if (result.didCancel) {
      return;
    }

    if (result.errorCode) {
      setFormError(result.errorMessage || 'Could not select receipt.');
      return;
    }

    const selectedAsset = result.assets?.[0];

    if (!selectedAsset?.base64) {
      setFormError('Selected receipt could not be prepared.');
      return;
    }

    const imageType = selectedAsset.type || 'image/jpeg';

    setAttachmentPreview({
      name: selectedAsset.fileName || 'Selected receipt',
    });
    setForm(current => ({
      ...current,
      attachment: `data:${imageType};base64,${selectedAsset.base64}`,
    }));
    setFormError('');
  };

  const handleSubmit = async () => {
    const parsedAmount = Number(form.amount.trim().replace(/,/g, ''));

    setFormError('');
    setFormMessage('');

    if (!contactId) {
      setFormError('Contact is missing.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter a valid repayment amount.');
      return;
    }

    if (!selectedDate) {
      setFormError('Select a repayment date.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createRepaymentRequest({
        contactId,
        amount: parsedAmount,
        currency: form.currency,
        transactionDate: selectedDate.toISOString(),
        note: form.note.trim(),
        attachment: form.attachment,
      });
      Toast.show({
        type: 'customToast',
        text1: 'Success',
        text2: 'Repayment request sent for approval.',
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
      navigation.navigate(ROUTES.CONTACT_DETAIL, {contactId});
    } catch (error) {
      setFormError(error.message || 'Could not send repayment request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(form.amount.trim()) && Boolean(form.date.trim()) && !isSubmitting;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow px-6 py-8 gap-6"
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
                Request a repayment confirmation from this contact.
              </Text>
              <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                Record Repayment
              </Text>
            </View>
            <AppBadge label="Pending Request" variant="accent" />
          </View>
        </View>

        {isLoadingContact ? <AppLoader card label="Loading contact..." /> : null}

        {contact ? (
          <AppCard variant="elevated">
            <View className="gap-2">
              <Text className="text-section font-semibold text-textPrimary">
                Returning to {contact.fullName}
              </Text>
              <Text className="text-caption font-normal text-textSecondary">
                Once approved, this repayment will reduce the outstanding balance.
              </Text>
            </View>
          </AppCard>
        ) : !isLoadingContact ? (
          <AppListState
            actionLabel="Back to People"
            description="Repayment form needs a valid contact before you can submit it."
            mode="empty"
            onActionPress={() => navigation.navigate(ROUTES.MY_PEOPLE)}
            title="Contact unavailable"
          />
        ) : null}

        <AppCard variant="elevated">
          <View className="gap-4">
            <AppInput
              helperText="Enter the amount you are returning."
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
                  helperText="Select repayment currency."
                  label="Currency"
                  editable={false}
                  placeholder="Select currency"
                  rightElement={
                    <Text className="text-caption font-semibold text-primary-500">Pick</Text>
                  }
                  value={form.currency}
                />
              </View>
            </Pressable>

            <Pressable
              hitSlop={6}
              onPress={() => {
                setCalendarMonth(selectedDate || new Date());
                setIsCalendarOpen(true);
              }}>
              <View pointerEvents="none">
                <AppInput
                  helperText="Select the date you paid this amount."
                  label="Repayment Date"
                  editable={false}
                  placeholder="Select repayment date"
                  rightElement={
                    <Text className="text-caption font-semibold text-primary-500">Pick</Text>
                  }
                  value={form.date}
                />
              </View>
            </Pressable>

            <AppInput
              helperText="Optional purpose or note for this repayment."
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

        <AppCard variant="elevated">
          <View className="gap-4">
            <Pressable
              className="items-center rounded-3xl border border-dashed border-border px-5 py-8"
              hitSlop={6}
              onPress={handlePickAttachment}>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                <Text className="text-title font-bold tracking-[-0.3px] text-primary-500">+</Text>
              </View>
              <Text className="mt-4 text-section font-semibold text-textPrimary">
                Upload Receipt
              </Text>
              <Text className="mt-2 text-caption font-normal text-textSecondary text-center">
                Attach the payment slip or repayment receipt.
              </Text>
            </Pressable>

            {attachmentPreview.name ? (
              <Text className="text-caption font-normal text-textSecondary">
                {attachmentPreview.name}
              </Text>
            ) : null}
          </View>
        </AppCard>

        <AppFormStatus
          idleMessage={formError || formMessage || 'Send repayment request for confirmation.'}
          submitting={isSubmitting}
          submittingMessage="Sending repayment request..."
        />

        <AppButton
          disabled={!canSubmit || !contact}
          label="Send Repayment Request"
          loading={isSubmitting}
          onPress={handleSubmit}
          variant={canSubmit && contact ? 'accent' : 'secondary'}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={isCurrencyPickerOpen}
        onRequestClose={() => setIsCurrencyPickerOpen(false)}>
        <Pressable
          className="flex-1 items-center justify-center bg-primary-500/30 px-6"
          onPress={() => setIsCurrencyPickerOpen(false)}>
          <Pressable
            className="w-full max-w-[360px] rounded-[28px] bg-background px-5 py-5 shadow-card"
            onPress={() => {}}>
            <View className="flex-row items-center justify-between">
              <Text className="text-section font-semibold text-textPrimary">Select Currency</Text>
              <Pressable hitSlop={6} onPress={() => setIsCurrencyPickerOpen(false)}>
                <Text className="text-caption font-semibold text-primary-500">Close</Text>
              </Pressable>
            </View>

            <View className="mt-5 gap-3">
              {currencyOptions.map(currency => (
                <Pressable
                  key={currency}
                  className={`rounded-2xl border px-4 py-4 ${
                    currency === form.currency
                      ? 'border-primary-500 bg-primary-100'
                      : 'border-border bg-surface'
                  }`}
                  onPress={() => handleSelectCurrency(currency)}>
                  <Text className="text-body font-semibold text-textPrimary">{currency}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
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
                Select Repayment Date
              </Text>
              <Pressable hitSlop={6} onPress={() => setIsCalendarOpen(false)}>
                <Text className="text-caption font-semibold text-primary-500">Close</Text>
              </Pressable>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    current => new Date(current.getFullYear(), current.getMonth() - 1, 1),
                  )
                }>
                <Text className="text-body font-semibold text-primary-500">{'<'}</Text>
              </Pressable>
              <Text className="text-body font-semibold text-textPrimary">
                {getMonthLabel(calendarMonth)}
              </Text>
              <Pressable
                onPress={() =>
                  setCalendarMonth(
                    current => new Date(current.getFullYear(), current.getMonth() + 1, 1),
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
                  return <View key={`empty-${index}`} className="mb-2 h-11 w-[14.28%]" />;
                }

                return (
                  <View key={day.toISOString()} className="mb-2 w-[14.28%] items-center">
                    <Pressable
                      className={`h-11 w-11 items-center justify-center rounded-full ${
                        selectedDate?.toDateString() === day.toDateString()
                          ? 'bg-primary-500'
                          : 'bg-surface'
                      }`}
                      onPress={() => {
                        setSelectedDate(day);
                        setForm(current => ({...current, date: formatDisplayDate(day)}));
                        setIsCalendarOpen(false);
                      }}>
                      <Text
                        className={`text-caption font-semibold ${
                          selectedDate?.toDateString() === day.toDateString()
                            ? 'text-white'
                            : 'text-textPrimary'
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
