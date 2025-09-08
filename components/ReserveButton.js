import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function ReserveButton({
  title = 'Button',
  onPress = () => {},
  bgColor = 'bg-cyan-700',
  textColor = 'text-white',
  widthClass = 'px-10', // Tailwind padding horizontal
  pyClass = 'py-3', // Tailwind padding vertical
}) {
  return (
    <View className="w-full items-center">
      <TouchableOpacity
        className={`${bgColor} rounded-full ${pyClass} ${widthClass} items-center justify-center shadow-lg`}
        onPress={onPress}>
        <Text className={`${textColor} text-lg font-semibold`}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
