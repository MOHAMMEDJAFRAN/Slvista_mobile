import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function RoomCard({ 
  title, 
  price, 
  description,
  image, 
  amenities,
  maxGuests,
  bedType,
  size,
  rating,
  reviews,
  view,
  type,
  onSelect,
  isPopular
}) {
  const [isLiked, setIsLiked] = useState(false);

  const sampleImages = [
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457",
  ];
  const fallbackImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];

  const formatPrice = (p) => {
    if (!p) return "$120";
    const priceNumber = typeof p === "string" ? parseFloat(p.replace(/[^\d.]/g, "")) : p;
    return `$${priceNumber || 120}`;
  };

  return (
    <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 border border-gray-100">
      {/* Popular Badge */}
      {isPopular && (
        <View className="absolute top-2 left-2 z-10 bg-amber-500 px-2 py-1 rounded-full">
          <Text className="text-white text-xs font-semibold">Popular</Text>
        </View>
      )}
      
      <View className="flex-row">
        {/* Image Section */}
        <View className="w-2/5 relative">
          <Image
            source={{ uri: image || fallbackImage }}
            className="w-full h-full"
            style={{ height: 190 }}
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
          <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
            {title || "Deluxe Room"}
          </Text>
          

          {/* Rating */}
          {rating && (
            <View className="flex-row items-center mt-1">
              {/* Room Type Badge */}
              <View className="mb-1 mr-2">
                <Text className="text-xs text-cyan-700 font-medium bg-cyan-50 px-2 py-1 rounded-full self-start">
                  {type || "Standard"}
                </Text>
              </View>
              <View className="flex-row items-center bg-amber-100 px-2 py-1 rounded-full">
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text className="ml-1 text-xs font-semibold text-amber-800">{rating}</Text>
                {reviews && (
                  <Text className="ml-1 text-xs text-amber-700">({reviews})</Text>
                )}
              </View>
            </View>
          )}

          {/* Room Details */}
          <View className="mt-2 space-y-1">
            <View className="flex-row items-center">
              <Ionicons name="people" size={14} color="#6b7280"  />
              <Text className="text-xs text-gray-600 ml-1">{maxGuests || 2} Guests</Text>
            
            
            
              <Ionicons name="bed" size={14} color="#6b7280" className="ml-3" />
              <Text className="text-xs text-gray-600 ml-1">{bedType || "King Bed"}</Text>
            
            
            {size && (
              <View className="flex-row items-center">
                <Ionicons name="expand" size={14} color="#6b7280" className="ml-3" />
                <Text className="text-xs text-gray-600 ml-1">{size} m²</Text>
              </View>
            )}
            </View>
            
            {view && (
              <View className="flex-row items-center">
                <Ionicons name="eye" size={14} color="#6b7280" />
                <Text className="text-xs text-gray-600 ml-1">{view}</Text>
              </View>
            )}
          </View>

          {/* Amenities Preview */}
          {amenities && amenities.length > 0 && (
            <View className="flex-row flex-wrap mt-2">
              {amenities.slice(0, 2).map((amenity, index) => (
                <View key={index} className="flex-row items-center mr-2 mb-1">
                  <Ionicons name="checkmark-circle" size={10} color="#0e7490" />
                  <Text className="text-xs text-cyan-700 ml-1">{amenity}</Text>
                </View>
              ))}
              {amenities.length > 2 && (
                <Text className="text-xs text-cyan-700">
                  +{amenities.length - 2} more
                </Text>
              )}
            </View>
          )}

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
              <Text className="text-white font-medium text-sm">View Deal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}