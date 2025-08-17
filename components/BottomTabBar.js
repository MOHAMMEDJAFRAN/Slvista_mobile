import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BottomTabBar = ({ activeTab }) => {
  const navigation = useNavigation();

  const tabs = [
    { 
      id: 'home', 
      name: 'Home', 
      icon: (active) => (
        <Ionicons 
          name={active ? 'home' : 'home-outline'} 
          size={26} 
          color={active ? '#006D77' : '#9CA3AF'} 
        />
      ),
      screen: 'Home'
    },
    { 
      id: 'explore', 
      name: 'Explore', 
      icon: (active) => (
        <Ionicons 
          name={active ? 'compass' : 'compass-outline'} 
          size={26} 
          color={active ? '#006D77' : '#9CA3AF'} 
        />
      ),
      screen: 'Explore'
    },
    { 
      id: 'saved', 
      name: 'Saved', 
      icon: (active) => (
        <Ionicons 
          name={active ? 'bookmark' : 'bookmark-outline'} 
          size={26} 
          color={active ? '#006D77' : '#9CA3AF'} 
        />
      ),
      screen: 'Saved'
    },
    { 
      id: 'bookings', 
      name: 'Bookings', 
      icon: (active) => (
        <MaterialCommunityIcons 
          name={active ? 'notebook' : 'notebook-outline'} 
          size={26} 
          color={active ? '#006D77' : '#9CA3AF'} 
        />
      ),
      screen: 'Bookings'
    },
    { 
      id: 'account', 
      name: 'Account', 
      icon: (active) => (
        <Ionicons 
          name={active ? 'person' : 'person-outline'} 
          size={26} 
          color={active ? '#006D77' : '#9CA3AF'} 
        />
      ),
      screen: 'Account'
    },
  ];

  const handleTabPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 pt-3 pb-6 px-6 flex-row justify-between items-center">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.screen;
        return (
          <TouchableOpacity 
            key={tab.id}
            className="items-center"
            onPress={() => handleTabPress(tab.screen)}
            activeOpacity={0.7}
          >
            <View className={`p-2 rounded-full ${isActive ? 'bg-[#E6F6F8]' : ''}`}>
              {tab.icon(isActive)}
            </View>
            <Text 
              className={`text-xs mt-1 ${isActive ? 'text-[#006D77] font-medium' : 'text-gray-500'}`}
            >
              {tab.name}
            </Text>
            {isActive && (
              <View className="w-1 h-1 bg-[#006D77] rounded-full mt-1" />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;