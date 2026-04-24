import React from 'react';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const toastThemes = {
  default: {
    background: '#ffffff',
    border: '#203049',
    glow: '#eef3f8',
    iconBg: '#203049',
    iconName: 'notifications',
    eyebrow: 'Notice',
    title: '#203049',
    message: '#607086',
  },
  success: {
    background: '#ffffff',
    border: '#0f8a5f',
    glow: '#e9f6ef',
    iconBg: '#0f8a5f',
    iconName: 'checkmark',
    eyebrow: 'Success',
    title: '#203049',
    message: '#607086',
  },
  error: {
    background: '#ffffff',
    border: '#d95f70',
    glow: '#fdecef',
    iconBg: '#d95f70',
    iconName: 'close',
    eyebrow: 'Error',
    title: '#203049',
    message: '#607086',
  },
};

const getToastTheme = props => {
  const explicitVariant = props.variant;

  if (explicitVariant && toastThemes[explicitVariant]) {
    return toastThemes[explicitVariant];
  }

  if (props.borderColor === 'green' || props.borderColor === '#0f8a5f') {
    return toastThemes.success;
  }

  if (props.borderColor === '#d95f70') {
    return toastThemes.error;
  }

  return toastThemes.default;
};

const CustomToast = ({text1, text2, props = {}}) => {
  const theme = getToastTheme(props);

  return (
    <View className="mx-4 w-[92%]">
      <View
        className="overflow-hidden rounded-[24px] border shadow-float"
        style={{
          backgroundColor: props.bgColor || theme.background,
          borderColor: props.borderColor || theme.border,
        }}>
        <View
          className="absolute left-0 top-0 h-full w-1.5"
          style={{backgroundColor: props.borderColor || theme.border}}
        />

        <View
          className="absolute -right-10 -top-8 h-24 w-24 rounded-full opacity-100"
          style={{backgroundColor: theme.glow}}
        />

        <View className="flex-row items-start gap-3 px-4 py-4">
          <View
            className="mt-0.5 h-11 w-11 items-center justify-center rounded-full"
            style={{backgroundColor: theme.iconBg}}>
            <Ionicons color="#ffffff" name={theme.iconName} size={18} />
          </View>

          <View className="flex-1 pr-4">
            <Text
              className="text-[11px] font-bold uppercase tracking-[1px]"
              style={{color: props.borderColor || theme.border}}>
              {props.eyebrow || theme.eyebrow}
            </Text>

            {text1 ? (
              <Text
                className="mt-1 text-[15px] font-bold leading-5"
                style={{color: theme.title}}>
                {text1}
              </Text>
            ) : null}

            {text2 ? (
              <Text
                className="mt-1 text-[13px] font-normal leading-5"
                style={{color: theme.message}}>
                {text2}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

export const toastConfig = {
  customToast: toastProps => <CustomToast {...toastProps} />,
};
