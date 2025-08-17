import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from 'components/CustomBotton';

const SignUpScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Account created successfully');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-10 justify-center relative">
      {/* Back Arrow */}
      <TouchableOpacity
        className="absolute top-10 left-5"
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* App Name */}
      <Text className="text-xl font-bold text-[#006D77] text-center mb-6">
        SL VISTA
      </Text>

      {/* Tabs */}
      <View className="flex-row justify-center mb-8">
        <TouchableOpacity
          className="items-center mx-4"
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text className="text-base font-medium text-gray-400">Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center mx-4">
          <Text className="text-base font-medium text-black">Sign up</Text>
          <View className="mt-1 h-0.5 bg-[#006D77] w-full" />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-4 border border-gray-300 shadow-sm"
        placeholder="First name"
        placeholderTextColor="#9CA3AF"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-4 border border-gray-300 shadow-sm"
        placeholder="Last name"
        placeholderTextColor="#9CA3AF"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-4 border border-gray-300 shadow-sm"
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-4 border border-gray-300 shadow-sm"
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-6 border border-gray-300 shadow-sm"
        placeholder="Phone"
        placeholderTextColor="#9CA3AF"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      {/* Create Account Button */}
      <CustomButton
        title="Create an account"
        onPress={handleSignUp}
        isLoading={isLoading}
        />

      {/* Or sign in with */}
      <Text className="text-gray-500 text-center mb-4">or sign in with</Text>

      {/* Social Buttons */}
      <View className="flex-row justify-center mb-6">
        <TouchableOpacity className="border border-gray-300 p-3 rounded-full mx-2">
          <Image
            source={require('../../assets/google.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="border border-gray-300 p-3 rounded-full mx-2">
          <Image
            source={require('../../assets/apple-logo.png')}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <Text className="text-xs text-gray-500 text-center">
        By continuing, you agree to our{' '}
        <Text className="text-[#006D77]">Terms of Service</Text> and{' '}
        <Text className="text-[#006D77]">Privacy Policy</Text>
      </Text>

      {/* Decorative Background */}
      {/* <Image
        source={require('./assets/bg-left.png')}
        className="absolute bottom-0 left-0 w-28 h-28"
        resizeMode="contain"
      />
      <Image
        source={require('./assets/bg-right.png')}
        className="absolute bottom-0 right-0 w-28 h-28"
        resizeMode="contain"
      /> */}
    </View>
  );
};

export default SignUpScreen;
