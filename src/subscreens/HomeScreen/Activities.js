import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Activities() {
  const [search, setSearch] = useState("");
  const [animation] = useState(new Animated.Value(0));

  const handleSearch = () => {
    console.log("Searching for:", search);
    
    // Add animation feedback
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
    
    // You can add navigation or API call here
  };

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Search Field */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Search Activities</Text>
        <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-3 shadow-sm">
          <MaterialIcons name="search" size={22} color="#006D77" />
          <TextInput
            className="ml-3 flex-1 text-base font-semibold text-gray-800"
            placeholder="Search by city or activity"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Divider line between search field and button */}
      <View className="border-t border-gray-200 my-4" />

      {/* Search Button */}
      <Animated.View style={{ transform: [{ scale: scaleInterpolate }] }}>
        <TouchableOpacity
          className="items-center rounded-full bg-[#006D77] py-4 shadow-md active:opacity-80"
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text className="text-lg font-semibold text-white">Search Activities</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}