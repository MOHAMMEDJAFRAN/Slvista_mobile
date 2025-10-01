import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ListProperty() {
  const navigation = useNavigation();
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    // Later you can connect API here
    console.log({
      propertyName,
      location,
      propertyType,
      price,
      description,
    });
    alert("Property listed successfully!");
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">List Your Property</Text>
      </View>

      {/* Form Fields */}
      <View className="bg-white rounded-xl p-4 shadow-md">
        <Text className="text-gray-600 mb-1">Property Name</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Enter property name"
          value={propertyName}
          onChangeText={setPropertyName}
        />

        <Text className="text-gray-600 mb-1">Location</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
        />

        <Text className="text-gray-600 mb-1">Property Type</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="e.g. Apartment, Villa"
          value={propertyType}
          onChangeText={setPropertyType}
        />

        <Text className="text-gray-600 mb-1">Price</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <Text className="text-gray-600 mb-1">Description</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
          placeholder="Enter property description"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-[#006D77] py-3 rounded-lg mt-2"
          onPress={handleSubmit}
        >
          <Text className="text-center text-white font-bold text-base">
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
