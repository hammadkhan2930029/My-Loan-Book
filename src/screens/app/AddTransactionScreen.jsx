import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {
  AppAvatar,
  AppBadge,
  AppButton,
  AppCard,
  AppInput,
} from '@/components/ui';

import {TransactionTypeToggle} from './components';

export const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const [transactionType, setTransactionType] = useState('gave');
  const [focusedField, setFocusedField] = useState('');
  const [form, setForm] = useState({
    amount: '120',
    date: 'Apr 17, 2026',
    note: 'Dinner split at the cafe',
  });

  const selectedContact = {
    name: 'Sara Khan',
    meta: 'Selected contact',
    variant: transactionType === 'gave' ? 'primary' : 'accent',
  };

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
                Create a clean money record with contact, amount, note, and proof placeholder.
              </Text>
              <Text className="mt-2 text-title font-bold tracking-[-0.3px] text-textPrimary">
                Add Transaction
              </Text>
            </View>
            <AppBadge label="Draft" variant="accent" />
          </View>
        </View>

        <AppCard variant="elevated">
          <View className="gap-4">
            <Text className="text-section font-semibold text-textPrimary">Transaction Type</Text>
            <TransactionTypeToggle onChange={setTransactionType} value={transactionType} />
            <Text className="text-caption font-normal text-textSecondary">
              Choose whether you gave money or took money for this entry.
            </Text>
          </View>
        </AppCard>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">Contact</Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Attach this entry to a person for a clearer balance view.
            </Text>
          </View>

          <Pressable className="flex-row items-center gap-4 rounded-3xl bg-surface px-5 py-5" hitSlop={6}>
            <AppAvatar
              name={selectedContact.name}
              size="md"
              variant={selectedContact.variant}
            />
            <View className="flex-1">
              <Text className="text-body font-normal text-textPrimary">{selectedContact.name}</Text>
              <Text className="mt-1 text-caption font-normal text-textSecondary">
                {selectedContact.meta}
              </Text>
            </View>
            <AppBadge
              label={transactionType === 'gave' ? 'You Gave' : 'You Took'}
              variant={transactionType === 'gave' ? 'primary' : 'accent'}
            />
          </Pressable>
        </View>

        <View className="gap-3">
          <View>
            <Text className="text-section font-semibold text-textPrimary">
              Transaction Details
            </Text>
            <Text className="mt-1 text-caption font-normal text-textSecondary">
              Use static placeholders for now. No saving or upload integration yet.
            </Text>
          </View>

          <AppCard variant="elevated">
            <View className="gap-4">
              <AppInput
                helperText="Amount placeholder only for now."
                isFocused={focusedField === 'amount'}
                keyboardType="numeric"
                label="Amount"
                leftElement={<Text className="text-section font-semibold text-textSecondary">$</Text>}
                onBlur={() => setFocusedField('')}
                onChangeText={amount => setForm(current => ({...current, amount}))}
                onFocus={() => setFocusedField('amount')}
                placeholder="Enter amount"
                value={form.amount}
              />

              <AppInput
                helperText="Static date field placeholder."
                isFocused={focusedField === 'date'}
                label="Date"
                onBlur={() => setFocusedField('')}
                onChangeText={date => setForm(current => ({...current, date}))}
                onFocus={() => setFocusedField('date')}
                placeholder="Select date"
                value={form.date}
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
              Proof upload placeholder for future receipt or payment slip support.
            </Text>
          </View>

          <AppCard variant="elevated">
            <Pressable className="items-center rounded-3xl border border-dashed border-border px-5 py-8" hitSlop={6}>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-primary-100">
                <Text className="text-title font-bold tracking-[-0.3px] text-primary-500">+</Text>
              </View>
              <Text className="mt-4 text-section font-semibold text-textPrimary">
                Upload Receipt / Slip
              </Text>
              <Text className="mt-2 text-caption font-normal text-textSecondary text-center">
                Tap here later to attach an image or payment proof.
              </Text>
            </Pressable>
          </AppCard>
        </View>

        <AppButton
          label={transactionType === 'gave' ? 'Save Gave Entry' : 'Save Took Entry'}
          variant={transactionType === 'gave' ? 'primary' : 'accent'}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
