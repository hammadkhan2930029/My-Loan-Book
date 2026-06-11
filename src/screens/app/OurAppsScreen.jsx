import React from 'react';
import {Image, Linking, ScrollView, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import {AppBadge, AppButton, AppCard} from '@/components/ui';

const apps = [
  {
    id: 'ctr',
    name: 'CTR Currency Transfer Rates',
    logo: require('../../assets/ourApps/ctr.png'),
    description:
      'Compare currency exchange rates and transfer charges before sending money internationally. Monitor remittance rates for Pakistan, Bangladesh, the Philippines, India, Nepal, Indonesia and Sri Lanka, then set the currencies and amount you want to track.',
    url: 'https://play.google.com/store/apps/details?id=com.currencytransfer.ctr&pcampaignid=web_share',
  },
  {
    id: 'bachat-committee',
    name: 'Bachat Committee',
    logo: require('../../assets/ourApps/bachatCommittee.png'),
    description:
      'Make community savings simple, reliable and digital. Create or join rotating savings groups, set contribution amounts, schedule payments and receive the lump-sum payout when it is your turn.',
    url: 'https://play.google.com/store/apps/details?id=com.comitte&pcampaignid=web_share',
  },
  {
    id: 'daily-utilities',
    name: 'Daily Utilities',
    logo: require('../../assets/ourApps/dailyUtilities.png'),
    description:
      'Track commodity prices and currency exchange rates in one place. Follow gold, silver, oil and global currency rates with current market information for traders, investors and everyday users.',
    url: 'https://play.google.com/store/apps/details?id=com.dailyUtilities&pcampaignid=web_share',
  },
];

export const OurAppsScreen = () => {
  const handleOpenApp = async app => {
    try {
      await Linking.openURL(app.url);
    } catch (error) {
      Toast.show({
        type: 'customToast',
        text1: 'Could not open Play Store',
        text2: error.message || 'Please try again.',
        visibilityTime: 3500,
        props: {
          bgColor: '#ffffff',
          borderColor: '#d95f70',
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        bounces={false}
        contentContainerClassName="flex-grow gap-6 px-6 pb-32 pt-8"
        showsVerticalScrollIndicator={false}>
        <View className="overflow-hidden rounded-[30px] border border-primary-500 bg-primary-500 px-5 py-5 shadow-card">
          <View className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1">
              <AppBadge
                className="self-start bg-white/15"
                label="More From Us"
                variant="primary"
              />
              <Text className="mt-4 text-title font-bold tracking-[-0.3px] text-white">
                Explore Our Apps
              </Text>
              <Text className="mt-2 text-caption font-normal text-white/80">
                Useful apps for currency rates, community savings and daily
                market information.
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-accent-400">
              <Ionicons color="#ffffff" name="apps-outline" size={22} />
            </View>
          </View>
        </View>

        <View className="gap-5">
          {apps.map(app => (
            <AppCard key={app.id} variant="elevated">
              <View className="gap-4">
                <View className="h-36 items-center justify-center overflow-hidden rounded-[24px] border border-border bg-white px-5 py-4">
                  <Image
                    className="h-full w-full"
                    resizeMode="contain"
                    source={app.logo}
                  />
                </View>

                <View>
                  <Text className="text-section font-semibold text-textPrimary">
                    {app.name}
                  </Text>
                  <Text className="mt-2 text-body font-normal leading-6 text-textSecondary">
                    {app.description}
                  </Text>
                </View>

                <AppButton
                  label="View on Play Store"
                  onPress={() => handleOpenApp(app)}
                  variant="primary"
                />
              </View>
            </AppCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
