import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, View, Animated, Easing, Dimensions } from 'react-native';

export default function ReserveButton({
  title = 'Reserve Now',
  onPress = () => {},
  bgColor = 'bg-cyan-800', // Using Tailwind's cyan-700
  textColor = 'text-white',
  width = Dimensions.get('window').width * 0.6,
  height = 60,
}) {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.96,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const startShimmer = () => {
    shimmerAnim.setValue(0);
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300]
  });

  return (
    <View className="w-full items-center my-4">
      <Animated.View 
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          width: width,
          height: height,
          shadowColor: '#0e7490', // cyan-700 equivalent
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 10,
        }}
        className="rounded-full overflow-hidden"
      >
        {/* Glassmorphism Background with Tailwind cyan-700 */}
        <View 
          className={`absolute inset-0 ${bgColor} opacity-90`}
          style={{ borderRadius: 16 }}
        />
        
        {/* Background Blur (simulated with gradient) */}
        <View 
          className="absolute inset-0 opacity-30 bg-white"
          style={{ borderRadius: 16 }}
        />
        
        {/* Shimmer Effect */}
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            transform: [{ translateX: shimmerTranslateX }, { skewX: '20deg' }],
          }}
        />
        
        {/* Inner Border Highlight */}
        <View 
          className="absolute inset-0"
          style={{ 
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
          }}
        />

        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            startShimmer();
            onPress();
          }}
          activeOpacity={1}
          className="flex-1 items-center justify-center"
        >
          <Text className={`${textColor} text-lg font-bold tracking-wider`}>
            {title}
          </Text>
          
          {/* Subtle Icon */}
          <View className="absolute right-6">
            <Text className={`${textColor} text-lg font-bold`}>→</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
    </View>
  );
}