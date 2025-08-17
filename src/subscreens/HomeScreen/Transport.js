import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Transport() {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching for transport in:", search);
    // Add navigation or API call here
  };

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-lg">
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

      {/* Search Button */}
      <TouchableOpacity
        className="items-center rounded-full bg-cyan-700 py-4 shadow-md active:scale-95"
        onPress={handleSearch}
      >
        <Text className="text-lg font-semibold text-white">
          Search Transport
        </Text>
      </TouchableOpacity>
    </View>
  );
}
