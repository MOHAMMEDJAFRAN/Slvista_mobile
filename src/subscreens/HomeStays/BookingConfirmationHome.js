import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BookingConfirmationHome() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow">
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">Sri Lanka Vista</Text>

        <View className="h-11 w-11" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 160 }}>
        {/* Progress Steps */}
        <View className="mb-6 flex-row justify-between items-center px-2">
          {/* Step 1 */}
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
            <Text className="mt-1 text-xs text-green-500">Customer Details</Text>
          </View>

          <View className="h-1 flex-1 bg-green-500 mx-2" />

          {/* Step 2 */}
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
            <Text className="mt-1 text-xs text-green-500">Payment Details</Text>
          </View>

          <View className="h-1 flex-1 bg-green-500 mx-2" />

          {/* Step 3 */}
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-green-500 items-center justify-center">
              <Text className="text-white text-sm">3</Text>
            </View>
            <Text className="mt-1 text-xs text-green-500">Completed</Text>
          </View>
        </View>

        {/* Confirmation Message */}
        <View className="bg-white p-6 rounded-xl shadow-lg mb-6 items-center">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark" size={32} color="#10b981" />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">Your booking is now confirmed!</Text>
          <Text className="text-gray-600 text-center">We've sent a confirmation email to user@gmail.com</Text>
        </View>

        {/* Booking Summary */}
        <View className="mb-6 rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-3 text-lg font-bold text-gray-800">Booking Summary</Text>
          
          {/* Hotel Info with Image */}
          <View className="flex-row mb-4">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
              className="w-20 h-20 rounded-lg mr-4"
            />
            <View className="flex-1 justify-between">
              <View>
                <Text className="text-lg font-bold text-gray-800">Deluxe Ocean View</Text>
                <Text className="text-gray-600 text-sm">2 guests - 1 King Bed - 42 m³</Text>
                <Text className="text-gray-800 font-medium mt-1">Down Town</Text>
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text className="text-amber-500 text-sm ml-1">4.8 • 147 Reviews</Text>
              </View>
            </View>
          </View>
          
          {/* Check-in/Check-out Dates */}
          <View className="flex-row justify-between mb-3 p-3 bg-gray-50 rounded-lg">
            <View>
              <Text className="text-gray-500 text-sm">Check-in</Text>
              <Text className="font-semibold text-gray-800">Thursday, Jul 8, 2025</Text>
              <Text className="text-gray-600 text-sm">14.00</Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">1 night</Text>
              <View className="flex-row items-center">
                <View className="w-4 h-0.5 bg-gray-400" />
                <Ionicons name="airplane" size={16} color="#6b7280" />
                <View className="w-4 h-0.5 bg-gray-400" />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">Check-out</Text>
              <Text className="font-semibold text-gray-800">Wednesday, Jul 9, 2025</Text>
              <Text className="text-gray-600 text-sm">11.00</Text>
            </View>
          </View>
          
          {/* Booking Details */}
          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Rooms</Text>
              <Text className="text-gray-800 font-medium">1</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Guests</Text>
              <Text className="text-gray-800 font-medium">2 Adults</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total</Text>
              <Text className="text-lg font-bold text-blue-600">$164.00</Text>
            </View>
          </View>
        </View>

        {/* Additional Info */}
        <View className="bg-white rounded-xl shadow-lg p-5 mb-6">
          <Text className="text-gray-600 text-sm mb-3">
            You can also easily find out property policies and amenities in My bookings
          </Text>
          <Text className="text-gray-600 text-sm">
            For any question related to the property, please contact them directly.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Buttons (stacked) */}
      <View className="px-6 py-4 bg-white border-t border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.navigate('Booking')}
          className="w-full bg-blue-600 py-3 rounded-full items-center mb-3">
          <Text className="text-white font-semibold text-lg">My Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="w-full bg-cyan-700 py-3 rounded-full items-center">
          <Text className="text-white font-semibold text-lg">Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
