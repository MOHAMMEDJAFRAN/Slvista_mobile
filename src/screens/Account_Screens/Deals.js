import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const dealsData = [
  {
    id: 1,
    title: "Luxury Beach Resort",
    price: "$250/night",
    discount: "20% OFF",
    description: "Experience luxury with stunning sea views.",
    image: "https://picsum.photos/400/200?random=1",
  },
  {
    id: 2,
    title: "Mountain View Villa",
    price: "$180/night",
    discount: "15% OFF",
    description: "Relax in the calm mountain atmosphere.",
    image: "https://picsum.photos/400/200?random=2",
  },
  {
    id: 3,
    title: "City Center Hotel",
    price: "$120/night",
    discount: "10% OFF",
    description: "Stay close to the main attractions.",
    image: "https://picsum.photos/400/200?random=3",
  },
];

export default function DealsPage() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Header with Back Button */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Exclusive Deals</Text>
      </View>

      {/* Deals Cards */}
      {dealsData.map((deal) => (
        <View
          key={deal.id}
          className="bg-white rounded-xl shadow-md mb-5 overflow-hidden"
        >
          <Image
            source={{ uri: deal.image }}
            className="w-full h-40"
            resizeMode="cover"
          />
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-lg font-bold">{deal.title}</Text>
              <Text className="text-green-600 font-bold">{deal.discount}</Text>
            </View>
            <Text className="text-gray-600 mb-1">{deal.description}</Text>
            <Text className="text-[#006D77] font-bold mb-2">{deal.price}</Text>
            <TouchableOpacity className="bg-[#006D77] py-2 rounded-lg">
              <Text className="text-center text-white font-bold">Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
