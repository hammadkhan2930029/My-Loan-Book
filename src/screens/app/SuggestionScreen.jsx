import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {
  AppBadge,
  AppButton,
  AppCard,
  AppFormStatus,
  AppInput,
} from '@/components/ui';
import {submitSuggestion} from '@/services/supportApi';

const suggestionCategories = [
  'New Feature',
  'Improvement',
  'Design',
  'Reports',
  'Currency',
  'Other',
];

export const SuggestionScreen = () => {
  const [category, setCategory] = useState('New Feature');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async () => {
    const cleanSubject = subject.trim();
    const cleanMessage = message.trim();

    if (cleanSubject.length < 5) {
      setFormError('Suggestion title must be at least 5 characters.');
      return;
    }

    if (cleanMessage.length < 10) {
      setFormError('Please explain your suggestion in at least 10 characters.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormMessage('');

    try {
      const result = await submitSuggestion({
        category,
        subject: cleanSubject,
        message: cleanMessage,
      });
      const successMessage =
        result?.message || 'Your suggestion has been sent successfully.';

      setSubject('');
      setMessage('');
      setFormMessage(successMessage);
      Toast.show({
        type: 'customToast',
        text1: 'Suggestion sent',
        text2: successMessage,
        props: {
          bgColor: '#ffffff',
          borderColor: 'green',
        },
      });
    } catch (error) {
      const errorMessage =
        error.message || 'Could not send your suggestion.';

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
        contentContainerClassName="flex-grow gap-6 px-6 pb-32 pt-8"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <AppBadge
                className="self-start bg-white/15"
                label="Share Your Idea"
                variant="primary"
              />
              <Text className="mt-4 text-title font-bold text-white">
                Help us improve
              </Text>
              <Text className="mt-2 text-caption text-white/80">
                Tell us which feature or improvement would make Digital Loan
                Tracker better for you.
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-400">
              <Ionicons color="#ffffff" name="bulb-outline" size={22} />
            </View>
          </View>
        </View>

        <AppCard variant="elevated">
          <View className="gap-5">
            <View>
              <Text className="text-section font-semibold text-textPrimary">
                Your Suggestion
              </Text>
              <Text className="mt-1 text-caption text-textSecondary">
                Choose the closest category and explain your idea.
              </Text>
            </View>

            <View className="gap-3">
              <Text className="text-caption text-textSecondary">Category</Text>
              <View className="flex-row flex-wrap gap-2">
                {suggestionCategories.map(item => {
                  const isSelected = item === category;

                  return (
                    <Pressable
                      key={item}
                      className={`rounded-full border px-4 py-2.5 ${
                        isSelected
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-border bg-surface'
                      }`}
                      onPress={() => setCategory(item)}>
                      <Text
                        className={`text-caption font-semibold ${
                          isSelected ? 'text-white' : 'text-textSecondary'
                        }`}>
                        {item}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <AppInput
              label="Suggestion Title"
              maxLength={120}
              onChangeText={value => {
                setSubject(value);
                setFormError('');
              }}
              placeholder="Example: Add payment reminders"
              value={subject}
              variant="filled"
            />

            <AppInput
              helperText={`${message.length}/2000 characters`}
              label="Suggestion Details"
              maxLength={2000}
              multiline
              numberOfLines={7}
              onChangeText={value => {
                setMessage(value);
                setFormError('');
              }}
              placeholder="Explain how this idea should work and why it would help"
              value={message}
              variant="filled"
            />

            {formError ? (
              <View className="rounded-2xl bg-[#fff0f2] px-4 py-3">
                <Text className="text-caption text-danger">{formError}</Text>
              </View>
            ) : null}

            {formMessage ? (
              <View className="rounded-2xl bg-[#edf8f3] px-4 py-3">
                <Text className="text-caption text-[#2f7d62]">
                  {formMessage}
                </Text>
              </View>
            ) : null}

            <AppFormStatus
              idleMessage="Your suggestion will be emailed to info@cogentdevs.com."
              submitting={isSubmitting}
              submittingMessage="Sending suggestion..."
            />

            <AppButton
              disabled={!subject.trim() || !message.trim()}
              label="Submit Suggestion"
              loading={isSubmitting}
              onPress={handleSubmit}
              variant="primary"
            />
          </View>
        </AppCard>
      </ScrollView>
    </SafeAreaView>
  );
};
