import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

// Skeleton Loader Component
const SkeletonLoader = () => (
  <View className="flex-1 p-4">
    {/* Progress Steps Skeleton */}
    <View className="mb-6 flex-row justify-between items-center px-2">
      {[1, 2, 3].map((item) => (
        <View key={item} className="items-center">
          <View className="w-8 h-8 rounded-full bg-gray-300" />
          <View className="mt-1 h-3 w-16 rounded bg-gray-300" />
        </View>
      ))}
    </View>

    {/* Confirmation Message Skeleton */}
    <View className="bg-white p-6 rounded-2xl shadow-lg mb-6 items-center">
      <View className="w-20 h-20 bg-gray-300 rounded-full mb-4" />
      <View className="h-6 w-48 bg-gray-300 rounded mb-2" />
      <View className="h-4 w-32 bg-gray-300 rounded mb-4" />
      <View className="h-3 w-40 bg-gray-300 rounded" />
    </View>

    {/* Booking Reference Skeleton */}
    <View className="bg-gray-200 p-4 rounded-2xl mb-6">
      <View className="flex-row justify-between items-center">
        <View>
          <View className="h-4 w-32 bg-gray-300 rounded mb-2" />
          <View className="h-6 w-24 bg-gray-400 rounded" />
        </View>
        <View className="w-6 h-6 bg-gray-400 rounded" />
      </View>
      <View className="h-3 w-40 bg-gray-300 rounded mt-2" />
    </View>

    {/* Booking Summary Skeleton */}
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-lg">
      <View className="h-6 w-40 bg-gray-300 rounded mb-4" />
      
      <View className="flex-row mb-5">
        <View className="w-24 h-24 bg-gray-300 rounded-xl mr-4" />
        <View className="flex-1 justify-between">
          <View>
            <View className="h-5 w-32 bg-gray-300 rounded mb-2" />
            <View className="h-4 w-24 bg-gray-300 rounded mb-1" />
            <View className="h-4 w-28 bg-gray-300 rounded" />
          </View>
          <View className="flex-row items-center mt-2">
            <View className="w-4 h-4 bg-gray-300 rounded mr-1" />
            <View className="h-3 w-20 bg-gray-300 rounded" />
          </View>
        </View>
      </View>

      {/* Dates Skeleton */}
      <View className="bg-gray-200 p-4 rounded-xl mb-4">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <View className="h-3 w-16 bg-gray-400 rounded mb-2" />
            <View className="h-4 w-28 bg-gray-400 rounded mb-1" />
            <View className="h-3 w-12 bg-gray-400 rounded" />
          </View>
          <View className="items-center mx-4">
            <View className="h-3 w-12 bg-gray-400 rounded mb-2" />
            <View className="flex-row items-center my-1">
              <View className="w-6 h-0.5 bg-gray-400" />
              <View className="w-4 h-4 bg-gray-400 rounded mx-1" />
              <View className="w-6 h-0.5 bg-gray-400" />
            </View>
          </View>
          <View className="flex-1 items-end">
            <View className="h-3 w-16 bg-gray-400 rounded mb-2" />
            <View className="h-4 w-28 bg-gray-400 rounded mb-1" />
            <View className="h-3 w-12 bg-gray-400 rounded" />
          </View>
        </View>
      </View>

      {/* Guest Details Skeleton */}
      <View className="mb-4">
        <View className="h-4 w-32 bg-gray-300 rounded mb-2" />
        <View className="bg-gray-200 p-3 rounded-lg">
          <View className="h-4 w-40 bg-gray-400 rounded mb-2" />
          <View className="h-3 w-32 bg-gray-400 rounded mb-1" />
          <View className="h-3 w-28 bg-gray-400 rounded" />
        </View>
      </View>

      {/* Price Breakdown Skeleton */}
      <View className="border-t border-gray-200 pt-4">
        <View className="flex-row justify-between mb-2">
          <View className="h-4 w-24 bg-gray-300 rounded" />
          <View className="h-4 w-12 bg-gray-300 rounded" />
        </View>
        <View className="flex-row justify-between mb-2">
          <View className="h-4 w-20 bg-gray-300 rounded" />
          <View className="h-4 w-10 bg-gray-300 rounded" />
        </View>
        <View className="h-px bg-gray-200 my-2" />
        <View className="flex-row justify-between">
          <View className="h-5 w-20 bg-gray-400 rounded" />
          <View className="h-5 w-16 bg-gray-400 rounded" />
        </View>
      </View>
    </View>

    {/* Support Information Skeleton */}
    <View className="bg-white rounded-2xl shadow-lg p-5 mb-6">
      <View className="h-5 w-32 bg-gray-300 rounded mb-3" />
      <View className="space-y-3">
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-row items-center">
            <View className="w-8 h-8 bg-gray-300 rounded-full mr-3" />
            <View className="flex-1">
              <View className="h-4 w-40 bg-gray-300 rounded" />
            </View>
          </View>
        ))}
      </View>
    </View>

    {/* Next Steps Skeleton */}
    <View className="bg-white rounded-2xl shadow-lg p-5">
      <View className="h-5 w-32 bg-gray-300 rounded mb-3" />
      <View className="space-y-2">
        {[1, 2, 3].map((item) => (
          <View key={item} className="h-3 w-56 bg-gray-300 rounded" />
        ))}
      </View>
    </View>
  </View>
);

export default function BookingConfirmationHotel() {
  const navigation = useNavigation();
  const route = useRoute();
  const { room, hotel, totalPrice, customerDetails, nights, checkInDate, checkOutDate } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);
  const [confirmationStatus, setConfirmationStatus] = useState('processing');

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  

  const handleViewBooking = () => {
    navigation.navigate('MyBookings');
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  // Simulate confirmation process
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setConfirmationStatus('confirmed');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate booking details
  const bookingNumber = `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const bookingDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const bookingTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="arrow-back" size={22} color="#006D77" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">Booking Confirmation</Text>

        <View className="h-11 w-11" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Progress Steps */}
          <View className="mb-6 flex-row justify-between items-center px-2">
            {/* Step 1 */}
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-[#0e7490] items-center justify-center">
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
              <Text className="mt-1 text-xs text-[#0e7490]">Customer Details</Text>
            </View>

            <View className="h-1 flex-1 bg-[#0e7490] mx-2" />

            {/* Step 2 */}
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-[#0e7490] items-center justify-center">
                <Ionicons name="checkmark" size={20} color="white" />
              </View>
              <Text className="mt-1 text-xs text-[#0e7490]">Payment Details</Text>
            </View>

            <View className="h-1 flex-1 bg-[#0e7490] mx-2" />

            {/* Step 3 */}
            <View className="items-center">
              <View className="w-8 h-8 rounded-full bg-[#0e7490] items-center justify-center">
                <Text className="text-white text-sm">3</Text>
              </View>
              <Text className="mt-1 text-xs text-[#0e7490]">Completed</Text>
            </View>

        </View>

        {/* Confirmation Message */}
        <View className="bg-white p-6 rounded-2xl shadow-lg mb-6 items-center">
          <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
            confirmationStatus === 'confirmed' ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            <Ionicons 
              name={confirmationStatus === 'confirmed' ? 'checkmark-done' : 'time'} 
              size={36} 
              color={confirmationStatus === 'confirmed' ? '#10b981' : '#3b82f6'} 
            />
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
            {confirmationStatus === 'confirmed' ? 'Booking Confirmed!' : 'Processing...'}
          </Text>
          <Text className="text-gray-600 text-center mb-4">
            {confirmationStatus === 'confirmed' 
              ? 'Your reservation has been successfully processed' 
              : 'Please wait while we confirm your booking'}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Confirmation sent to {customerDetails?.email || 'your email'}
          </Text>
        </View>

        {/* Booking Reference */}
        <View className="bg-blue-50 p-4 rounded-2xl mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-blue-800 font-semibold">Booking Reference</Text>
              <Text className="text-blue-900 text-lg font-bold">{bookingNumber}</Text>
            </View>
            <Ionicons name="document-text" size={24} color="#1e40af" />
          </View>
          <Text className="text-blue-700 text-sm mt-2">
            Booked on {bookingDate} at {bookingTime}
          </Text>
        </View>

        {/* Booking Summary */}
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-lg">
          <Text className="mb-4 text-xl font-bold text-gray-800">Booking Details</Text>
          
          {/* Hotel Info */}
          <View className="flex-row mb-5">
            <Image 
              source={{ uri: room?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
              className="w-24 h-24 rounded-xl mr-4"
            />
            <View className="flex-1 justify-between">
              <View>
                <Text className="text-lg font-bold text-gray-800">
                  {room?.title || 'Deluxe Ocean View'}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">
                  {hotel?.name || 'Luxury Resort'}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  {hotel?.location || 'Colombo, Sri Lanka'}
                </Text>
              </View>
              <View className="flex-row items-center mt-2">
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text className="text-amber-500 text-sm ml-1">
                  {room?.rating || 4.8} • {room?.reviews || 147} Reviews
                </Text>
              </View>
            </View>
          </View>
          
          {/* Dates */}
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm">Check-in</Text>
                <Text className="font-semibold text-gray-800">
                  {formatDate(checkInDate) || 'Thursday, Jul 8, 2025'}
                </Text>
                <Text className="text-gray-600 text-sm">From 2:00 PM</Text>
              </View>
              
              <View className="items-center mx-4">
                <Text className="text-gray-500 text-sm">{nights} {nights === 1 ? 'night' : 'nights'}</Text>
                <View className="flex-row items-center my-1">
                  <View className="w-6 h-0.5 bg-gray-400" />
                  <Ionicons name="bed" size={16} color="#6b7280" />
                  <View className="w-6 h-0.5 bg-gray-400" />
                </View>
              </View>
              
              <View className="flex-1 items-end">
                <Text className="text-gray-500 text-sm">Check-out</Text>
                <Text className="font-semibold text-gray-800 text-right">
                  {formatDate(checkOutDate) || 'Wednesday, Jul 9, 2025'}
                </Text>
                <Text className="text-gray-600 text-sm">Until 11:00 AM</Text>
              </View>
            </View>
          </View>
          
          {/* Guest Details */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Guest Information</Text>
            <View className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-800">
                {customerDetails?.firstName} {customerDetails?.lastName}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">
                {customerDetails?.email || 'user@gmail.com'}
              </Text>
              <Text className="text-gray-600 text-sm">
                {customerDetails?.phoneNumber || '+1 234 567 8900'}
              </Text>
            </View>
          </View>

          {/* Price Breakdown */}
          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Room ({nights} nights)</Text>
              <Text className="text-gray-800 font-medium">
                ${totalPrice?.toFixed(2) || '159.00'}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Taxes & Fees</Text>
              <Text className="text-gray-800 font-medium">
                ${(totalPrice ? totalPrice * 0.1 : 15.90).toFixed(2)}
              </Text>
            </View>
            <View className="h-px bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-800">Total Paid</Text>
              <Text className="text-lg font-bold text-cyan-600">
                ${(totalPrice ? totalPrice * 1.1 : 174.90).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Support Information */}
        <View className="bg-white rounded-2xl shadow-lg p-5 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">Need Help?</Text>
          
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="document-text" size={16} color="#3b82f6" />
              </View>
              <Text className="text-gray-700 flex-1">
                Booking details and invoice available in{' '}
                <Text className="text-blue-600 font-semibold">My Bookings</Text>
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="headset" size={16} color="#10b981" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700">24/7 Customer Support</Text>
                <Text className="text-blue-600 font-semibold">+94 112 345 678</Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3">
                <Ionicons name="mail" size={16} color="#f59e0b" />
              </View>
              <Text className="text-gray-700 flex-1">
                Email: support@srilankavista.com
              </Text>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View className="bg-white rounded-2xl shadow-lg p-5">
          <Text className="text-lg font-bold text-gray-800 mb-3">What's Next?</Text>
          <View className="space-y-2">
            <Text className="text-gray-600">• You'll receive a confirmation email shortly</Text>
            <Text className="text-gray-600">• Present your booking reference at check-in</Text>
            <Text className="text-gray-600">• Free cancellation up to 24 hours before check-in</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        
        <TouchableOpacity
          onPress={handleViewBooking}
          className="w-full bg-cyan-600 py-4 rounded-xl items-center mb-2"
        >
          <Text className="text-white font-semibold text-lg">View My Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGoHome}
          className="w-full bg-gray-100 py-3 rounded-xl items-center"
        >
          <Text className="text-gray-700 font-semibold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}