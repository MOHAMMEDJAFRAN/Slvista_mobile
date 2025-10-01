import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import logo from '../../assets/logo (3).png';


const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Simulate loading or auth check
    const timer = setTimeout(() => {
      navigation.replace('Main'); // Navigate to main app with tabs
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View className="flex-1 bg-[#006D77] items-center justify-center ">
      <Image
        source={logo}
        className="w-40 h-40 rounded-full"
        resizeMode="contain"
      />
    </View>
  );
};

export default SplashScreen;