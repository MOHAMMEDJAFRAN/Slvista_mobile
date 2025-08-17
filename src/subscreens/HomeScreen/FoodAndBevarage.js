import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Food() {
  const [search, setSearch] = useState("");
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [foodType, setFoodType] = useState("Select Food Type");

  const foodOptions = ["Italian", "Chinese", "Dessert", "Fast Food"];

  const handleSearch = () => {
    console.log("Searching for:", search, "Food type:", foodType);
  };

  return (
    <ScrollView className="m-6 rounded-2xl bg-white p-5 shadow-lg">
      {/* Search Field */}
      <View className="mb-5 flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
        <MaterialIcons name="search" size={22} color="#555" />
        <TextInput
          className="ml-3 flex-1 text-base text-black"
          placeholder="Where are you going"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Food Type Dropdown */}
      <TouchableOpacity
        onPress={() => setFoodTypeOpen(!foodTypeOpen)}
        className={`mb-5 flex-row items-center justify-between rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 shadow-sm`}
      >
        <Text className="text-xl font-bold text-black">{foodType}</Text>
        <MaterialIcons
          name={foodTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={26}
        />
      </TouchableOpacity>

      {foodTypeOpen && (
        <View className="mb-5 rounded-xl border border-gray-300 bg-white shadow-sm">
          {foodOptions.map((option, idx) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setFoodType(option);
                setFoodTypeOpen(false);
              }}
              className={`px-4 py-3 ${idx !== foodOptions.length - 1 ? "border-b border-gray-200" : ""}`}
            >
              <Text className="text-base text-black">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Search Button */}
      <TouchableOpacity
        className="items-center rounded-full bg-cyan-700 py-4 shadow-md active:scale-95"
        onPress={handleSearch}
      >
        <Text className="text-lg font-semibold text-white">Search Food</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
