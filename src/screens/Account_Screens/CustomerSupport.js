import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CustomerSupport() {
  const navigation = useNavigation();

  const supportOptions = [
    {
      id: 1,
      title: "Email Support",
      description: "Get help via email within 24 hours.",
      icon: "mail",
      action: () => Linking.openURL("mailto:support@yourapp.com"),
    },
    {
      id: 2,
      title: "Call Us",
      description: "Talk to our support team directly.",
      icon: "call",
      action: () => Linking.openURL("tel:+1234567890"),
    },
    {
      id: 3,
      title: "Live Chat",
      description: "Chat with our support team instantly.",
      icon: "chatbubble-ellipses",
      action: () => console.log("Live chat clicked"), // Replace with actual chat screen navigation
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white shadow">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Customer Support</Text>
      </View>

      {/* Support Options */}
      <ScrollView className="flex-1 p-4">
        {supportOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm flex-row items-center"
            onPress={option.action}
          >
            <Ionicons name={option.icon} size={28} color="#2563eb" />
            <View className="ml-3 flex-1">
              <Text className="text-lg font-semibold text-gray-800">
                {option.title}
              </Text>
              <Text className="text-gray-600 text-sm mt-1">{option.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <View className="mt-6 mb-10">
          <Text className="text-gray-500 text-center text-sm">
            We're here to help you 24/7. Reach out anytime.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
