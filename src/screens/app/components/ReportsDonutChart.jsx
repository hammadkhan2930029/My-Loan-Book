import React from 'react';
import {Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export const ReportsDonutChart = ({gave, took, total}) => {
  const size = 190;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const gavePercent = total > 0 ? gave / total : 0;
  const tookPercent = total > 0 ? took / total : 0;
  const gaveOffset = circumference * (1 - gavePercent);
  const tookOffset = circumference * (1 - tookPercent);

  return (
    <View className="items-center justify-center">
      <Svg height={size} width={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke="#f0ebf7"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation="-90"
          stroke="#9442f1"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={gaveOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation={gavePercent * 360 - 90}
          stroke="#e5e844"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={tookOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View className="absolute items-center justify-center">
        <Text className="text-caption font-normal text-textSecondary">Total Flow</Text>
        <View className="mt-1">
          <Text className="text-title font-bold tracking-[-0.3px] text-textPrimary">${total}</Text>
        </View>
        <View className="mt-1">
          <Text className="text-caption font-normal text-textMuted">gave vs took</Text>
        </View>
      </View>
    </View>
  );
};
