import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RoomCard from '../../../components/RoomCard';

export default function HomeView1({ navigation }) {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      {/* Header with Back Button */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow"
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Rooms
        </Text>

        {/* Right placeholder for alignment */}
        <View className="h-11 w-11" />
      </View>

      {/* Room Cards */}
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="mt-4">
          <RoomCard title="Deluxe Room" price="$120 / night" />
        </View>
        <View className="mt-4">
          <RoomCard title="Deluxe Room" price="$120 / night" />
        </View>
        <View className="mt-4 mb-24">
          <RoomCard title="Deluxe Room" price="$120 / night" />
        </View>
      </ScrollView>

    
      
    </SafeAreaView>
  );
}
