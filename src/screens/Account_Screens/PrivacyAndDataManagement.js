import React, { useState } from "react";
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function PrivacyAndData() {
  const [analytics, setAnalytics] = useState(true);
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  const handleDeleteData = () => {
    Alert.alert(
      "Delete Data",
      "Are you sure you want to delete all your personal data? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Data Deleted") }
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Page Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900">Privacy & Data</Text>
        <Text className="text-gray-500 mt-1 text-sm">
          Manage your privacy settings and data preferences.
        </Text>
      </View>

      {/* Section 1: Privacy Settings */}
      <View className="bg-white rounded-xl p-4 shadow mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Privacy Settings</Text>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-700">Allow Analytics</Text>
          <Switch value={analytics} onValueChange={setAnalytics} />
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-gray-700">Personalized Ads</Text>
          <Switch value={personalizedAds} onValueChange={setPersonalizedAds} />
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-gray-700">Location Access</Text>
          <Switch value={locationAccess} onValueChange={setLocationAccess} />
        </View>
      </View>

      {/* Section 2: Data Management */}
      <View className="bg-white rounded-xl p-4 shadow mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Data Management</Text>

        <TouchableOpacity
          className="flex-row items-center justify-between py-3 border-b border-gray-200"
          onPress={() => console.log("Download Data")}
        >
          <Text className="text-gray-700">Download My Data</Text>
          <Ionicons name="download-outline" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-between py-3"
          onPress={handleDeleteData}
        >
          <Text className="text-red-600 font-medium">Delete My Data</Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>

      {/* Section 3: Privacy Policy */}
      <View className="bg-white rounded-xl p-4 shadow">
        <Text className="text-lg font-semibold text-gray-800 mb-3">Privacy Policy</Text>
        <Text className="text-gray-600 text-sm leading-5">
          We respect your privacy and are committed to protecting your personal data. 
          For more information, please review our{" "}
          <Text className="text-blue-600 underline">Privacy Policy</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}
