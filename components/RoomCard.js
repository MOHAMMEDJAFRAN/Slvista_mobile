import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function RoomCard({ 
  title, 
  price, 
  description,
  image, 
  features,
  maxGuests,
  bedType,
  roomSize,
  rating,
  reviews,
  onSelect
}) {
  const [isLiked, setIsLiked] = useState(false);

  // Online fallback images
  const sampleImages = [
    "https://images.unsplash.com/photo-1501117716987-c8e2a3d57c9b",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
  ];
  const fallbackImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

  // Auto format price to always show "$" and handle numbers/strings safely
  const formatPrice = (p) => {
    if (!p) return "$120"; // default
    const priceNumber = typeof p === "string" ? parseFloat(p.replace(/[^\d.]/g, "")) : p;
    return `$${priceNumber || 120}`;
  };

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl shadow-sm overflow-hidden mb-4"
      onPress={onSelect}
      activeOpacity={0.9}
    >
      <View className="flex-row">
        {/* Image Section */}
        <View className="w-2/5 relative">
          <Image
            source={{ uri: image || fallbackImage }}
            className="w-full h-full"
            style={{ height: 200 }}
            resizeMode="cover"
          />
          
          {/* Like Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 p-2 z-10"
            onPress={() => setIsLiked(!isLiked)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={isLiked ? 'favorite' : 'favorite-border'}
              size={24}
              color={isLiked ? '#FF0000' : '#FFFFFF'}
              style={{
                textShadowColor: 'rgba(0,0,0,0.7)',
                textShadowRadius: 4,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View className="w-3/5 p-4 flex-col justify-between">
          {/* Title */}
          <Text className="font-bold text-gray-800 text-lg" numberOfLines={1}>
            {title || "Deluxe Room"}
          </Text>

          {/* Rating Stars */}
          {rating && (
            <View className="flex-row items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <Ionicons 
                  key={i} 
                  name="star" 
                  size={14} 
                  color={i < Math.floor(rating) ? "#FFD700" : "#D1D5DB"} 
                />
              ))}
              <Text className="ml-2 text-sm text-gray-600">{rating}</Text>
              {reviews && (
                <Text className="ml-1 text-sm text-gray-500">({reviews} reviews)</Text>
              )}
            </View>
          )}

          {/* Guest capacity, bed type, and room size */}
          <View className="flex-row items-center mt-2">
            <Ionicons name="people" size={14} color="#6b7280" />
            <Text className="text-sm text-gray-600 ml-1">{maxGuests || 2}</Text>
            
            <Ionicons name="bed" size={14} color="#6b7280" className="ml-3" />
            <Text className="text-sm text-gray-600 ml-1">{bedType || "King Bed"}</Text>
            
            {roomSize && (
              <>
                <Ionicons name="expand" size={14} color="#6b7280" className="ml-3" />
                <Text className="text-sm text-gray-600 ml-1">{roomSize} m²</Text>
              </>
            )}
          </View>

          {/* Features */}
          <View className="flex-row flex-wrap mt-2">
            {features && features.slice(0, 3).map((feature, index) => (
              <View key={index} className="flex-row items-center mr-2 mb-1">
                <Ionicons name="checkmark-circle" size={12} color="#0e7490" />
                <Text className="text-xs text-cyan-700 ml-1">{feature}</Text>
              </View>
            ))}
            {features && features.length > 3 && (
              <Text className="text-xs text-cyan-700">
                +{features.length - 3} more
              </Text>
            )}
          </View>

          {/* Price + CTA */}
          <View className="flex-row justify-between items-center mt-3">
            <View>
              <Text className="text-xs text-gray-500">Per night</Text>
              <Text className="text-lg font-bold text-cyan-800">
                {formatPrice(price)}
              </Text>
            </View>
            <TouchableOpacity
              className="rounded-lg bg-cyan-700 py-2 px-4"
              activeOpacity={0.8}
              onPress={onSelect}
            >
              <Text className="text-white font-medium text-sm">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}