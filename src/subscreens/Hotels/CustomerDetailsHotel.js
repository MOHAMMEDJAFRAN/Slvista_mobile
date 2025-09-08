import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ReserveButton from 'components/ReserveButton';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

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

    {/* Booking Summary Skeleton */}
    <View className="mb-6 rounded-xl bg-white p-4 shadow-lg">
      <View className="h-6 w-40 bg-gray-300 rounded mb-3" />
      
      <View className="flex-row mb-4">
        <View className="w-20 h-20 bg-gray-300 rounded-lg mr-4" />
        <View className="flex-1 justify-between">
          <View>
            <View className="h-5 w-32 bg-gray-300 rounded mb-1" />
            <View className="h-4 w-24 bg-gray-300 rounded" />
          </View>
          <View className="h-6 w-20 bg-gray-300 rounded" />
        </View>
      </View>
      
      {/* Dates Skeleton */}
      <View className="flex-row justify-between mb-3 p-3 bg-gray-100 rounded-lg">
        <View>
          <View className="h-3 w-16 bg-gray-400 rounded mb-1" />
          <View className="h-4 w-20 bg-gray-400 rounded" />
        </View>
        <View className="items-center">
          <View className="h-3 w-12 bg-gray-400 rounded mb-1" />
          <View className="flex-row items-center">
            <View className="w-4 h-0.5 bg-gray-400" />
            <View className="w-4 h-4 bg-gray-400 rounded mx-1" />
            <View className="w-4 h-0.5 bg-gray-400" />
          </View>
        </View>
        <View className="items-end">
          <View className="h-3 w-16 bg-gray-400 rounded mb-1" />
          <View className="h-4 w-20 bg-gray-400 rounded" />
        </View>
      </View>
      
      {/* Booking Details Skeleton */}
      <View className="border-t border-gray-200 pt-3">
        {[1, 2, 3, 4, 5].map((item) => (
          <View key={item} className="flex-row justify-between mb-2">
            <View className="h-4 w-20 bg-gray-300 rounded" />
            <View className="h-4 w-16 bg-gray-300 rounded" />
          </View>
        ))}
      </View>
    </View>

    {/* Customer Info Form Skeleton */}
    <View className="mb-4 rounded-xl bg-white p-4 shadow-lg">
      <View className="h-6 w-40 bg-gray-300 rounded mb-4" />
      
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <View key={item} className="mb-4">
          <View className="h-4 w-24 bg-gray-300 rounded mb-2" />
          <View className="h-12 bg-gray-200 rounded-lg" />
        </View>
      ))}
    </View>
  </View>
);

// Sample country data with flags (using emoji flags)
const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
];

export default function CustomerDetailsHotel() {
  const navigation = useNavigation();
  const route = useRoute();
  const { room, hotel, checkInDate, checkOutDate, guests, totalPrice, nights } = route.params || {};

  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('US');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[0-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  };

  const handleProceedToPayment = () => {
    // Validate all fields
    if (!firstName.trim()) {
      Alert.alert('Validation Error', 'First name is required');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error', 'Last name is required');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Email address is required');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return;
    }
    if (!zipCode.trim()) {
      Alert.alert('Validation Error', 'ZIP code is required');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Validation Error', 'City is required');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Validation Error', 'Mobile number is required');
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      Alert.alert('Validation Error', 'Please enter a valid mobile number');
      return;
    }

    // If all validations pass, proceed to payment
    navigation.navigate('PaymentDetailsHotel', {
      room,
      hotel,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      nights,
      customerDetails: {
        firstName,
        lastName,
        email,
        address,
        zipCode,
        city,
        country,
        phoneNumber
      }
    });
  };

  // Calculate original price and discount
  const originalPrice = room?.originalPrice ? room.originalPrice * nights : totalPrice;
  const discount = originalPrice - totalPrice;
  const hasDiscount = discount > 0;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100">
        <StatusBar barStyle="dark-content" />
        <SkeletonLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="arrow-back" size={22} color="#006D77" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Customer Details
        </Text>

        {/* Right placeholder for alignment */}
        <View className="h-11 w-11" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 160 }}>
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
              source={{ uri: room?.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }} 
              className="w-20 h-20 rounded-lg mr-4"
            />
            <View className="flex-1 justify-between">
              <View>
                <Text className="text-lg font-bold text-gray-800">{hotel?.name || 'Luxury Resort'}</Text>
                <Text className="text-gray-600 text-sm">{hotel?.location || 'Beachfront, Colombo'}</Text>
              </View>
              <View className="flex-row items-center">
                <View className="flex-row items-center bg-blue-100 px-2 py-1 rounded">
                  <Ionicons name="star" size={14} color="#f59e0b" />
                  <Text className="text-amber-500 text-sm ml-1">{room?.rating || 4.5} Excellent</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Check-in/Check-out Dates */}
          <View className="flex-row justify-between mb-3 p-3 bg-gray-50 rounded-lg">
            <View>
              <Text className="text-gray-500 text-sm">Check-in</Text>
              <Text className="font-semibold text-gray-800">
                {checkInDate ? new Date(checkInDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Select date'}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-gray-500 text-sm">{nights} {nights === 1 ? 'night' : 'nights'}</Text>
              <View className="flex-row items-center">
                <View className="w-4 h-0.5 bg-gray-400" />
                <Ionicons name="arrow-forward" size={16} color="#6b7280" />
                <View className="w-4 h-0.5 bg-gray-400" />
              </View>
            </View>
            <View className="items-end">
              <Text className="text-gray-500 text-sm">Check-out</Text>
              <Text className="font-semibold text-gray-800">
                {checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                }) : 'Select date'}
              </Text>
            </View>
          </View>
          
          {/* Booking Details */}
          <View className="border-t border-gray-200 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Room Type</Text>
              <Text className="text-gray-800 font-medium">{room?.title || 'Deluxe Ocean View'}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Rooms</Text>
              <Text className="text-gray-800 font-medium">{guests?.rooms || 1}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Guests</Text>
              <Text className="text-gray-800 font-medium">
                {guests ? `${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}${guests.children ? `, ${guests.children} Child${guests.children !== 1 ? 'ren' : ''}` : ''}${guests.infants ? `, ${guests.infants} Infant${guests.infants !== 1 ? 's' : ''}` : ''}` : '2 Adults'}
              </Text>
            </View>
            {hasDiscount && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Original Price</Text>
                <Text className="text-gray-800 font-medium line-through">${originalPrice}</Text>
              </View>
            )}
            {hasDiscount && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-green-600">Discount</Text>
                <Text className="text-green-600 font-medium">-${discount}</Text>
              </View>
            )}
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total</Text>
              <Text className="text-lg font-bold text-blue-600">${totalPrice || 159}</Text>
            </View>
          </View>
        </View>

        {/* Customer Info Form */}
        <View className="mb-4 rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-4 text-lg font-bold text-gray-800">Your Information</Text>

          {/* First Name */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">First Name *</Text>
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
            <Text className="mb-1 text-gray-700">Last Name *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your last name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          {/* Email Address */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Email Address *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your email address"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Address */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Address *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your street address"
              placeholderTextColor="#9CA3AF"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {/* City */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">City *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your city"
              placeholderTextColor="#9CA3AF"
              value={city}
              onChangeText={setCity}
            />
          </View>

          {/* ZIP Code */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">ZIP Code *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your ZIP code"
              placeholderTextColor="#9CA3AF"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>

          {/* Country */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Country *</Text>
            <View className="border border-gray-300 rounded-lg">
              <Picker
                selectedValue={country}
                onValueChange={(itemValue) => setCountry(itemValue)}
              >
                {countries.map((countryItem) => (
                  <Picker.Item 
                    key={countryItem.code} 
                    label={`${countryItem.flag} ${countryItem.name}`} 
                    value={countryItem.code} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="mb-1 text-gray-700">Mobile Number *</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Enter your mobile number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              maxLength={10}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar with Price and Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        {hasDiscount && (
          <View className="mb-2 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="bg-red-100 px-2 py-1 rounded">
                <Text className="text-red-600 text-sm font-semibold">-${discount} OFF</Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark" size={16} color="#10b981" />
              <Text className="text-green-500 text-xs ml-1">Best Price Guarantee</Text>
            </View>
          </View>
        )}
        
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-gray-600">Total</Text>
            <Text className="text-xl font-bold text-gray-800">${totalPrice}</Text>
            {hasDiscount && (
              <Text className="text-sm text-gray-500 line-through">${originalPrice}</Text>
            )}
          </View>
          {!hasDiscount && (
            <View className="flex-row items-center">
              <Ionicons name="ribbon" size={20} color="#10b981" />
              <Text className="text-[#10b981] text-sm ml-2">Best Price Guarantee</Text>
            </View>
          )}
        </View>
        <ReserveButton 
          title="Proceed to Payment" 
          onPress={handleProceedToPayment} 
        />
      </View>
    </SafeAreaView>
  );
}