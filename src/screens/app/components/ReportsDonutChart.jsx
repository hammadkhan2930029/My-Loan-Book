import React from 'react';
import {Text, View} from 'react-native';
import Svg, {Circle} from 'react-native-svg';

export const ReportsDonutChart = ({
  centerLabel = 'Total Flow',
  centerValue,
  footerLabel = 'gave vs took',
  gave,
  primaryColor = '#203049',
  secondaryColor = '#EC7418',
  took,
  total,
}) => {
  const size = 240;
  const strokeWidth = 22;
  const centerContentWidth = size - strokeWidth * 4;
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
          stroke="#eef2f6"
          strokeWidth={strokeWidth}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          rotation="-90"
          stroke={primaryColor}
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
          stroke={secondaryColor}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={tookOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View
        className="absolute items-center justify-center"
        style={{width: centerContentWidth}}>
        <Text
          className="text-center text-caption font-normal text-textSecondary"
          numberOfLines={1}>
          {centerLabel}
        </Text>
        <View className="mt-2 w-full">
          <Text
            adjustsFontSizeToFit
            className="text-center text-[20px] font-bold tracking-[-0.3px] text-textPrimary"
            minimumFontScale={0.55}
            numberOfLines={1}>
            {centerValue || `$${total}`}
          </Text>
        </View>
        <View className="mt-2">
          <Text
            className="text-center text-caption font-normal text-textMuted"
            numberOfLines={1}>
            {footerLabel}
          </Text>
        </View>
      </View>
    </View>
  );
};
