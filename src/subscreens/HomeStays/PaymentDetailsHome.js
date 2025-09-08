import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function PaymentDetailsHome() {
  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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
    }

    Alert.alert('Success', 'Your payment has been processed successfully');
    // navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" />

      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow">
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Payment Details
        </Text>

        {/* Right placeholder for alignment */}
        <View className="h-11 w-11" />
      </View>

      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Progress Steps */}
        <View className="mb-6 flex-row items-center justify-between px-2">
          {/* Step 1 */}
          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <Ionicons name="checkmark" size={20} color="white" />
            </View>
            <Text className="mt-1 text-xs text-green-500">Customer Details</Text>
          </View>

          <View className="mx-2 h-1 flex-1 bg-green-500" />

          {/* Step 2 - Changed to green to match customer details */}
          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-green-500">
              <Text className="text-sm text-white">2</Text>
            </View>
            <Text className="mt-1 text-xs text-green-500">Payment Details</Text>
          </View>

          <View className="mx-2 h-1 flex-1 bg-gray-300" />

          {/* Step 3 */}
          <View className="items-center">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-sm text-gray-600">3</Text>
            </View>
            <Text className="mt-1 text-xs text-gray-500">Completed</Text>
          </View>
        </View>

        {/* Price Details - Updated to match screenshot */}
        <View className="mt-4 rounded-lg bg-white p-4 shadow-sm">
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Original Price (1 Room x 1 Night)</Text>
            <Text className="text-gray-800">$175.00</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Room Price (1 Room x 1 Night)</Text>
            <Text className="text-gray-800">$159.00</Text>
          </View>
          <View className="flex-row justify-between border-b border-gray-200 py-2 pb-3">
            <Text className="text-gray-600">Taxes and fees</Text>
            <Text className="text-gray-800">$15.00</Text>
          </View>
          <View className="flex-row justify-between rounded-lg bg-cyan-700 p-3 pt-3">
            <Text className="text-lg font-bold text-white">Price</Text>
            <Text className="text-lg font-bold text-white">$164.00</Text>
          </View>
        </View>

        <View className="mt-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold text-gray-800">Payment Method</Text>

          {/* Enhanced security message with badge style */}
          <View className="mb-4 flex-row items-center rounded-md bg-green-50 p-3">
            <View className="mr-2 rounded-full bg-green-100 p-1">
              <Ionicons name="lock-closed" size={14} color="#10b981" />
            </View>
            <Text className="text-sm font-medium text-green-700">
              All payments data is encrypted and secure
            </Text>
          </View>

          <View className="mb-4 rounded-md border border-gray-300 p-4">
            <Text className="mb-2 font-medium text-gray-700">Credit / Debit card</Text>

            {/* Card icons - placed under the title */}
            <View className="mb-4 flex-row">
              <View className="mr-2 h-7 w-10 items-center justify-center rounded-sm bg-blue-900">
                <Text className="text-xs font-bold text-white">VISA</Text>
              </View>
              <View className="mr-2 h-7 w-10 items-center justify-center rounded-sm bg-red-600">
                <Text className="text-xs font-bold text-white">MC</Text>
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-1 text-sm text-gray-600">Credit / debit card number</Text>
              <TextInput
                className="rounded-md border border-gray-300 bg-white p-3"
                placeholder="Card Number"
                placeholderTextColor="#9CA3AF"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-1 text-sm text-gray-600">Card holder name*</Text>
              <TextInput
                className="rounded-md border border-gray-300 bg-white p-3"
                placeholder="Name on Card"
                placeholderTextColor="#9CA3AF"
                value={cardHolder}
                onChangeText={setCardHolder}
              />
            </View>

            <View className="mb-1 flex-row justify-between">
              <View className="w-2/5">
                <Text className="mb-1 text-sm text-gray-600">Expiry date *</Text>
                <TextInput
                  className="rounded-md border border-gray-300 bg-white p-3"
                  placeholder="MM/YYYY"
                  placeholderTextColor="#9CA3AF"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                />
              </View>
              <View className="w-2/5">
                <Text className="mb-1 text-sm text-gray-600">CVC/CVV *</Text>
                <TextInput
                  className="rounded-md border border-gray-300 bg-white p-3"
                  placeholder="XXX"
                  placeholderTextColor="#9CA3AF"
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="numeric"
                  secureTextEntry
                />
              </View>
            </View>

            {/* Policy text with blue links */}
            <View className="mt-4 pt-3">
              <Text className="text-sm leading-5 text-gray-600">
                By proceeding with this booking, I agree to srl lanka vista's{' '}
                <Text className="text-blue-500">Terms of Use</Text> and{' '}
                <Text className="text-blue-500">Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View className="mb-4 rounded-xl bg-white p-4 shadow-lg">
          <TouchableOpacity
            className="mb-4 flex-row items-start"
            onPress={() => setAgreeToTerms(!agreeToTerms)}></TouchableOpacity>

          <View className="flex-row items-start">
            <Ionicons name="mail" size={20} color="#EA4335" className="mr-3 mt-1" />
            <Text className="flex-1 text-gray-700">
              We'll send confirmation of your booking to user@gmail.com and 077123456
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar with Price and Button */}
      <View className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4">
        <TouchableOpacity
          className="items-center rounded-lg bg-cyan-700 py-4"
          onPress={handlePaymentProceed}>
          <Text className="text-lg font-bold text-white">Payment Proceed</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
