import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from 'components/CustomBotton';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setIsLoading(true);
    try {
      console.log('Sign in successful');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center relative">
      {/* Close Icon */}
      <TouchableOpacity className="absolute top-10 left-5">
        <Ionicons name="close" size={24} color="black" />
      </TouchableOpacity>

      {/* App Name */}
      <Text className="text-xl font-bold text-[#006D77] text-center mb-6">
        SL VISTA
      </Text>

      {/* Tabs */}
      <View className="flex-row justify-center mb-8">
        <TouchableOpacity className="items-center mx-4">
          <Text className="text-base font-medium text-black">Sign in</Text>
          <View className="mt-1 h-0.5 bg-black w-full" />
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center mx-4"
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text className="text-base font-medium text-gray-400">Sign up</Text>
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-4 border border-gray-300 shadow-sm"
        placeholder="Email"
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password Input */}
      <TextInput
        className="bg-white rounded-lg p-4 text-base text-gray-800 mb-3 border border-gray-300 shadow-sm"
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Forgot Password */}
      <TouchableOpacity
        className="self-end mb-6"
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text className="text-gray-500 text-sm">Forgot password?</Text>
      </TouchableOpacity>

      {/* Sign In Button */}
      <CustomButton
        title="Sign in"
        onPress={handleSignIn}
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

export default SignInScreen;
