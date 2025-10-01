import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Guidelines() {
  const navigation = useNavigation();

  const guidelines = [
    {
      id: 1,
      title: "Respect Others",
      description: "Treat everyone with respect. Harassment, hate speech, and abusive content are not tolerated.",
    },
    {
      id: 2,
      title: "Keep Content Relevant",
      description: "Share only content relevant to the community and platform guidelines.",
    },
    {
      id: 3,
      title: "Protect Your Privacy",
      description: "Do not share personal information like addresses, phone numbers, or financial details.",
    },
    {
      id: 4,
      title: "Report Violations",
      description: "If you find inappropriate content or behavior, please report it immediately.",
    },
    {
      id: 5,
      title: "Follow Legal Requirements",
      description: "Do not post content that violates local or international laws.",
    },
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center p-4 bg-white shadow">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Guidelines</Text>
      </View>

      {/* Guidelines List */}
      <ScrollView className="flex-1 p-4">
        {guidelines.map((item) => (
          <View
            key={item.id}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <Text className="text-lg font-semibold text-gray-800 mb-1">
              {item.title}
            </Text>
            <Text className="text-gray-600 text-sm leading-5">
              {item.description}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View className="mt-6 mb-10">
          <Text className="text-gray-500 text-center text-sm">
            By using this app, you agree to follow all the guidelines above.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
