import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

// Skeleton Loader Component
const SkeletonLoader = () => (
  <View className="flex-1 p-4">
    {/* Progress Steps Skeleton */}
    <View className="mb-6 flex-row items-center justify-between px-2">
      {[1, 2, 3].map((item) => (
        <View key={item} className="items-center">
          <View className="h-8 w-8 rounded-full bg-gray-300" />
          <View className="mt-1 h-3 w-16 rounded bg-gray-300" />
        </View>
      ))}
    </View>

    {/* Price Breakdown Skeleton */}
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <View className="mb-4 h-6 w-40 rounded bg-gray-300" />
      <View className="space-y-3">
        {[1, 2, 3].map((item) => (
          <View key={item} className="flex-row justify-between">
            <View className="h-4 w-32 rounded bg-gray-300" />
            <View className="h-4 w-16 rounded bg-gray-300" />
          </View>
        ))}
      </View>
    </View>

    {/* Payment Method Skeleton */}
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <View className="mb-4 h-6 w-40 rounded bg-gray-300" />
      <View className="mb-5 h-20 rounded-xl bg-gray-200" />
      <View className="rounded-xl border border-gray-200 p-4">
        {[1, 2, 3, 4].map((item) => (
          <View key={item} className="mb-4">
            <View className="mb-2 h-4 w-32 rounded bg-gray-300" />
            <View className="h-12 rounded-lg bg-gray-200" />
          </View>
        ))}
      </View>
    </View>

    {/* Terms Skeleton */}
    <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
      <View className="mb-4 h-5 w-full rounded bg-gray-300" />
      <View className="h-20 rounded-lg bg-gray-200" />
    </View>
  </View>
);

export default function PaymentDetailsHotel() {
  const navigation = useNavigation();
  const route = useRoute();
  const { totalPrice, customerDetails, room, hotel, nights } = route.params || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Detect card type based on first digit
  const getCardType = (number) => {
    const cleaned = number.replace(/\s+/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    return null;
  };

  const cardType = getCardType(cardNumber);

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = cleaned.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    return parts.length ? parts.join(' ') : cleaned;
  };

  const handleCardNumberChange = (text) => {
    setCardNumber(formatCardNumber(text));
  };

  // Format expiry date
  const formatExpiryDate = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleExpiryDateChange = (text) => {
    setExpiryDate(formatExpiryDate(text));
  };

  const handlePaymentProceed = () => {
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Use and Privacy Policy');
      return;
    }

    if (paymentMethod === 'card') {
      if (!cardNumber || !cardHolder || !expiryDate || !cvc) {
        Alert.alert('Error', 'Please fill all card details');
        return;
      }

      if (cardNumber.replace(/\s/g, '').length !== 16) {
        Alert.alert('Error', 'Please enter a valid 16-digit card number');
        return;
      }

      if (cvc.length !== 3) {
        Alert.alert('Error', 'Please enter a valid 3-digit CVC');
        return;
      }
    }

    
    navigation.navigate('BookingConfirmationHotel', {
      room,
      hotel,
      totalPrice,
      customerDetails,
      nights
    });
  };

  // Calculate taxes and total
  const taxes = totalPrice ? totalPrice * 0.1 : 15.90;
  const finalTotal = totalPrice ? totalPrice + taxes : 174.90;

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

      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="arrow-back" size={22} color="#006D77" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">Payment Details</Text>
        
        <View className="h-11 w-11" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Progress Steps */}
        <View className="mb-6 flex-row items-center justify-between px-2">
          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0e7490]">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
            <Text className="mt-1 text-xs text-[#0e7490]">Customer Details</Text>
          </View>

            <View className="mx-2 h-1 flex-1 bg-[#0e7490]" />

          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-[#0e7490]">
              <Text className="text-sm text-white">2</Text>
            </View>
            <Text className="mt-1 text-xs text-[#0e7490]">Payment Details</Text>
          </View>

          <View className="mx-2 h-1 flex-1 bg-gray-300" />

          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-sm text-gray-600">3</Text>
            </View>
            <Text className="mt-1 text-xs text-gray-500">Completed</Text>
          </View>
        </View>

        {/* Price Breakdown */}
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-gray-800">Price Breakdown</Text>
          
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Room Price ({nights} {nights === 1 ? 'night' : 'nights'})</Text>
              <Text className="text-gray-800">${totalPrice?.toFixed(2) || '159.00'}</Text>
            </View>
            
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Taxes and fees</Text>
              <Text className="text-gray-800">${taxes.toFixed(2)}</Text>
            </View>
            
            <View className="h-px bg-gray-200 my-2" />
            
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold text-gray-800">Total</Text>
              <Text className="text-lg font-bold text-cyan-600">${finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-lg font-bold text-gray-800">Payment Method</Text>

          {/* Security Badge */}
          <View className="mb-5 flex-row items-center rounded-xl bg-green-50 p-4">
            <View className="mr-3 rounded-full bg-green-100 p-2">
              <Ionicons name="shield-checkmark" size={20} color="#10b981" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-green-800">Secure Payment</Text>
              <Text className="text-sm text-green-600">Your payment information is encrypted and secure</Text>
            </View>
          </View>

          {/* Card Payment Section */}
          <View className="rounded-xl border border-gray-200 p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-semibold text-gray-800">Credit/Debit Card</Text>
              <View className="flex-row">
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg' }} 
                  className="h-6 w-10 mr-2"
                  resizeMode="contain"
                />
                <Image 
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg' }} 
                  className="h-6 w-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Card Number with dynamic card icon */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Card Number</Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4">
                <Ionicons name="card" size={20} color="#6b7280" className="mr-2" />
                <TextInput
                  className="flex-1 py-3"
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor="#9CA3AF"
                  value={cardNumber}
                  onChangeText={handleCardNumberChange}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {/* Dynamic Card Icon */}
                {cardType && (
                  <Image 
                    source={{ 
                      uri: cardType === 'visa' 
                        ? 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg'
                        : 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg'
                    }} 
                    className="h-6 w-8 ml-2"
                    resizeMode="contain"
                  />
                )}
              </View>
            </View>

            {/* Card Holder */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Card Holder Name</Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4">
                <Ionicons name="person" size={20} color="#6b7280" className="mr-2" />
                <TextInput
                  className="flex-1 py-3"
                  placeholder="John Doe"
                  placeholderTextColor="#9CA3AF"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Expiry and CVC */}
            <View className="mb-4 flex-row justify-between">
              <View className="w-[48%]">
                <Text className="mb-2 text-sm font-medium text-gray-700">Expiry Date</Text>
                <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4">
                  <Ionicons name="calendar" size={18} color="#6b7280" className="mr-2" />
                  <TextInput
                    className="flex-1 py-3"
                    placeholder="MM/YY"
                    placeholderTextColor="#9CA3AF"
                    value={expiryDate}
                    onChangeText={handleExpiryDateChange}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </View>
              
              <View className="w-[48%]">
                <Text className="mb-2 text-sm font-medium text-gray-700">CVC/CVV</Text>
                <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-4">
                  <Ionicons name="lock-closed" size={18} color="#6b7280" className="mr-2" />
                  <TextInput
                    className="flex-1 py-3"
                    placeholder="123"
                    placeholderTextColor="#9CA3AF"
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="numeric"
                    maxLength={3}
                    secureTextEntry
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <TouchableOpacity 
            className="flex-row items-center mb-4"
            onPress={() => setAgreeToTerms(!agreeToTerms)}
          >
            <View className={`h-5 w-5 items-center justify-center rounded border-2 mr-3 ${
              agreeToTerms ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'
            }`}>
              {agreeToTerms && <Ionicons name="checkmark" size={14} color="white" />}
            </View>
            <Text className="flex-1 text-gray-700">
              I agree to the{' '}
              <Text className="text-cyan-600">Terms of Use</Text> and{' '}
              <Text className="text-cyan-600">Privacy Policy</Text>
            </Text>
          </TouchableOpacity>

          {/* Contact Information */}
          <View className="flex-row items-start rounded-lg bg-blue-50 p-4">
            <Ionicons name="mail" size={20} color="#3b82f6" className="mr-3 mt-0.5" />
            <View className="flex-1">
              <Text className="text-sm text-blue-800">
                Booking confirmation will be sent to:{'\n'}
                <Text className="font-semibold">{customerDetails?.email || 'user@gmail.com'}</Text>{'\n'}
                <Text className="font-semibold">{customerDetails?.phoneNumber || '+1 234 567 8900'}</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600">Total Amount</Text>
            <Text className="text-xl font-bold text-cyan-600">${finalTotal.toFixed(2)}</Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text className="ml-1 text-xs text-green-600">SSL Secure</Text>
          </View>
        </View>
        
        <TouchableOpacity
          className={`items-center rounded-xl py-4 ${
            agreeToTerms ? 'bg-cyan-600' : 'bg-gray-300'
          }`}
          onPress={handlePaymentProceed}
          disabled={!agreeToTerms}
        >
          <Text className="text-lg font-bold text-white">
            Pay ${finalTotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}