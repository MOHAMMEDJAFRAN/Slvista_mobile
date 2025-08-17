import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NavBar = ({ 
  title, 
  onBackPress, 
  onNotificationPress,
  backgroundColor = 'bg-white',
  textColor = 'text-[#006D77]',
  iconColor = '#006D77'
}) => (
  <View className={`flex-row items-center justify-between px-4 py-3 ${backgroundColor}`}>
    <TouchableOpacity 
      onPress={onBackPress} 
      className="p-2 bg-[#E6F6F8] rounded-full"
    >
      <Ionicons name="chevron-back" size={20} color={iconColor} />
    </TouchableOpacity>
    <Text className={`text-lg font-semibold ${textColor}`}>{title}</Text>
    <TouchableOpacity 
      onPress={onNotificationPress} 
      className="p-2"
    >
      <Ionicons name="notifications-outline" size={22} color={iconColor} />
    </TouchableOpacity>
  </View>
);

export default NavBar;