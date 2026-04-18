import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
export const DashboardSummaryCard = ({
  title,
  amount,
  note,
  variant = 'receive',
}) => {
  const isReceive = variant === 'receive';

  return (
    <View className="mb-4 flex-1 px-2">
      <View
        className={`min-h-[160px] justify-between rounded-[32px] p-5 shadow-xl ${
          isReceive ? 'bg-primary-500' : 'bg-accent-300'
        }`}
        style={{elevation: 8}}>
        <View className="flex-row items-start justify-between">
          <View className="mr-2 flex-1">
            <Text
              className={`text-[13px] font-bold uppercase tracking-wider ${
                isReceive ? 'text-white/80' : 'text-textPrimary/70'
              }`}>
              {title}
            </Text>
          </View>

          <Pressable
            className={`h-10 w-10 items-center justify-center rounded-2xl ${
              isReceive ? 'bg-white/20' : 'bg-black/10'
            }`}
            hitSlop={12}>
            <Text
              className={`text-lg font-bold ${
                isReceive ? 'text-white' : 'text-textPrimary'
              }`}>
              <Icon name='arrow-right' size={16}/>
            </Text>
          </Pressable>
        </View>

        <View className="mt-4">
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            numberOfLines={1}
            className={`w-full text-[26px] font-black tracking-tighter ${
              isReceive ? 'text-white' : 'text-textPrimary'
            }`}>
            {amount}
          </Text>

          <View className="mt-1 flex-row items-center">
            <View
              className={`mr-2 h-1 w-1 rounded-full ${
                isReceive ? 'bg-white/80' : 'bg-textPrimary/70'
              }`}
            />
            <Text
              numberOfLines={1}
              className={`flex-1 text-[12px] font-medium italic ${
                isReceive ? 'text-white/60' : 'text-textPrimary/60'
              }`}>
              {note}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
