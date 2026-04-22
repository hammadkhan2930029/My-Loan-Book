import React from 'react';
import {Text, View} from 'react-native';

const defaultToastColors = {
  background: '#ffffff',
  border: '#203049',
  title: '#203049',
  message: '#607086',
};

const CustomToast = ({text1, text2, props = {}}) => {
  const bgColor = props.bgColor || defaultToastColors.background;
  const borderColor = props.borderColor || defaultToastColors.border;

  return (
    <View
      className="mx-4 w-[92%] rounded-[18px] border px-4 py-3 shadow-float"
      style={{backgroundColor: bgColor, borderColor}}>
      {text1 ? (
        <Text className="text-[15px] font-semibold leading-5 text-textPrimary">
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Text className="mt-1 text-[13px] font-normal leading-5 text-textSecondary">
          {text2}
        </Text>
      ) : null}
    </View>
  );
};

export const toastConfig = {
  customToast: props => <CustomToast {...props} />,
};
