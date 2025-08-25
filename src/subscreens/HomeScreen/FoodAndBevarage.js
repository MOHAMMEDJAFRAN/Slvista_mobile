import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Food() {
  const [search, setSearch] = useState("");
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [foodType, setFoodType] = useState("Select Food Type");
  const [animation] = useState(new Animated.Value(0));

  const foodOptions = ["Italian", "Chinese", "Dessert", "Fast Food", "Indian", "Mexican", "Japanese", "Thai", "American", "Mediterranean"];

  const handleSearch = () => {
    console.log("Searching for:", search, "Food type:", foodType);
    
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
  };

  const handleFoodTypeSelect = (option) => {
    setFoodType(option);
    setFoodTypeOpen(false);
  };

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Search Field */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Food Search</Text>
        <View className="flex-row items-center rounded-full border-2 border-cyan-700 bg-white px-4 py-3 shadow-sm">
          <MaterialIcons name="search" size={22} color="#0e7490" />
          <TextInput
            className="ml-3 flex-1 text-base font-semibold text-gray-800"
            placeholder="Where are you going?"
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Food Type Dropdown */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Food Type</Text>
        <TouchableOpacity
          onPress={() => setFoodTypeOpen(!foodTypeOpen)}
          className="flex-row items-center justify-between rounded-full border-2 border-cyan-700 px-4 py-3 bg-white shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <MaterialIcons name="restaurant" size={20} color="#0e7490" />
            <Text className="ml-2 text-md font-semibold text-gray-800">
              {foodType}
            </Text>
          </View>
          <MaterialIcons
            name={foodTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={26}
            color="#0e7490"
          />
        </TouchableOpacity>

        {foodTypeOpen && (
          <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {foodOptions.map((option, idx) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleFoodTypeSelect(option)}
                  className={`px-4 py-4 ${idx !== foodOptions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                    } active:bg-cyan-50`}
                  activeOpacity={0.6}
                >
                  <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                      ${foodType === option ? 'border-cyan-600 bg-cyan-600' : 'border-gray-300'}`}>
                      {foodType === option && (
                        <MaterialIcons name="check" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-base font-medium text-gray-800">{option}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Divider line between form and button */}
      <View className="border-t border-gray-200 my-4" />

      {/* Search Button */}
      <Animated.View style={{ transform: [{ scale: scaleInterpolate }] }}>
        <TouchableOpacity
          className="items-center rounded-full bg-cyan-700 py-4 shadow-md active:opacity-80"
          onPress={handleSearch}
          activeOpacity={0.7}
        >
          <Text className="text-lg font-semibold text-white">Search Food</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}