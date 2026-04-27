import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export const DashboardSummaryCard = ({
    title,
    amount,
    note,
    variant = 'receive',
}) => {
    const isReceive = variant === 'receive';
    const topLabel = isReceive ? 'Receivable' : 'Payable';

    return (
        <View className="flex-1">
            <View
                className={`min-h-[132px] justify-between rounded-[14px] px-4 pb-4 pt-5 shadow-card ${isReceive ? 'bg-primary-500' : 'bg-accent-400'
                    }`}
                style={{ elevation: 8 }}>
                <View className="flex-row items-start">
                    <View className="flex-1 pr-8">
                        <Text className="text-[12px] leading-[15px] font-bold text-white/80">
                            {topLabel}
                        </Text>
                        <Text className="text-[12px] leading-[15px] font-semibold text-white/80">
                            {title}
                        </Text>
                    </View>

                    <Pressable
                        className={`absolute -right-4 -top-4 h-11 w-11 items-center justify-center rounded-full ${isReceive ? 'bg-accent-300' : 'bg-primary-500'
                            }`}
                        hitSlop={12}>
                        <Text className="text-lg font-bold text-white">
                            <Icon color="#ffffff" name="north-east" size={16} />
                        </Text>
                    </Pressable>
                </View>

                <View className="mt-3">
                    <Text
                        adjustsFontSizeToFit
                        minimumFontScale={0.7}
                        numberOfLines={1}
                        className="w-full text-[26px] font-black tracking-[-0.4px] text-white">
                        {amount}
                    </Text>

                    <View className="mt-1">
                        <Text
                            numberOfLines={1}
                            className="text-[12px] leading-[16px] font-bold text-white/80">
                            {note}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
