import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReserveButton from 'components/ReserveButton';
import { useNavigation } from '@react-navigation/native';

export default function CustomerDetailsHome() {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

    <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow">
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Customer Details
        </Text>

        {/* Right placeholder for alignment */}
        <View className="h-11 w-11" />
      </View>


      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
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
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-gray-600 text-sm">2</Text>
            </View>
            <Text className="mt-1 text-xs text-gray-500">Payment Details</Text>
          </View>

          <View className="h-1 flex-1 bg-gray-300 mx-2" />

          {/* Step 3 */}
          <View className="items-center">
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-gray-600 text-sm">3</Text>
            </View>
            <Text className="mt-1 text-xs text-gray-500">Completed</Text>
          </View>
        </View>

        {/* Booking Summary with Image */}
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
                <Text className="text-lg font-bold text-gray-800">The Capital Hotel</Text>
                <Text className="text-gray-600 text-sm">Colombo</Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-row items-center bg-blue-100 px-2 py-1 rounded">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className="text-amber-500 text-sm ml-1">4.5 Excellent</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Check-in/Check-out Dates */}
          <View className="flex-row justify-between mb-3 p-3 bg-gray-50 rounded-lg">
            <View>
              <Text className="text-gray-500 text-sm">Check-in</Text>
              <Text className="font-semibold text-gray-800">Thu, Jul 8</Text>
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
              <Text className="font-semibold text-gray-800">Wed, Jul 9</Text>
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
              <Text className="text-lg font-bold text-blue-600">$159.00</Text>
            </View>
          </View>
        </View>

        {/* Customer Info Form */}
        <View className="mb-4 rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-lg font-bold text-gray-800">Your Information</Text>

          {/* First Name */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">First Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your first name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          {/* Last Name */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Last Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your phone number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar with Price and Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-gray-600">Total</Text>
            <Text className="text-xl font-bold text-gray-800">$159.00</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            <Text className="text-green-500 text-sm ml-2">Best Price Guarantee</Text>
          </View>
        </View>
        <ReserveButton 
          title="Proceed to Payment" 
          onPress={() => alert('Proceeding to payment')} 
        />
      </View>
    </SafeAreaView>
  );
}