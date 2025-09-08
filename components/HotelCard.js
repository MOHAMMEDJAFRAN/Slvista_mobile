import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const HotelCard = ({ hotel, onViewDeal }) => {
  return (
    <View className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
      <View className="relative">
        <Image 
          source={{ uri: hotel.image }} 
          className="w-full h-48" 
          resizeMode="cover"
        />
        {hotel.sponsored && (
          <View className="absolute top-2 left-2 bg-amber-500 py-1 px-2 rounded">
            <Text className="text-white text-xs font-medium">Sponsored</Text>
          </View>
        )}
        <TouchableOpacity className="absolute top-2 right-2 bg-white p-2 rounded-full">
          <Ionicons name="heart-outline" size={20} color="#006D77" />
        </TouchableOpacity>
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">{hotel.name}</Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text className="text-sm text-gray-500 ml-1">{hotel.location} • {hotel.distance}</Text>
            </View>
          </View>
          <View className="bg-cyan-50 rounded-lg p-2 items-center">
            <Text className="text-xs text-gray-500">From</Text>
            <Text className="text-xl font-bold text-cyan-800">
              {hotel.currency}{hotel.price}
            </Text>
            <Text className="text-xs text-gray-500">per night</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mt-3">
          <View className="flex-row">
            {[...Array(5)].map((_, i) => (
              <Ionicons 
                key={i} 
                name="star" 
                size={14} 
                color={i < hotel.stars ? "#FFD700" : "#D1D5DB"} 
              />
            ))}
          </View>
          <Text className="text-amber-600 text-sm ml-1">{hotel.rating}</Text>
          <Text className="text-gray-500 text-sm ml-1">({hotel.reviews} reviews)</Text>
        </View>
        
        <View className="flex-row flex-wrap mt-3">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} className="flex-row items-center mr-3 mb-2">
              <Ionicons name="checkmark-circle" size={14} color="#0e7490" />
              <Text className="text-xs text-cyan-700 ml-1">{amenity}</Text>
            </View>
          ))}
          {hotel.amenities.length > 3 && (
            <Text className="text-xs text-cyan-700">
              +{hotel.amenities.length - 3} more
            </Text>
          )}
        </View>
        
        <TouchableOpacity 
          className="mt-4 bg-cyan-700 rounded-lg py-3 items-center"
          onPress={onViewDeal}
        >
          <Text className="text-white font-semibold">View Deal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotelCard;