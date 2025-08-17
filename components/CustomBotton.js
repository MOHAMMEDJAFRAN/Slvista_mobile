// components/CustomButton.jsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  bgColor = '#006D77',
  textColor = 'white',
}) => {
  return (
    <TouchableOpacity
      className={`py-4 rounded-full items-center justify-center ${
        isLoading || disabled ? 'opacity-70' : ''
      }`}
      style={{ backgroundColor: bgColor }}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          className="font-semibold text-lg"
          style={{ color: textColor }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
