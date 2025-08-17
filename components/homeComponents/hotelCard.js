import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Import local image
import hotelImage from '../../assets/Hotelimage.png';

function Amenity({ icon, label }) {
  return (
    <View className="mb-2 mr-2 flex-row items-center rounded-full bg-gray-100 px-3 py-1.5">
      <MaterialIcons name={icon} size={20} />
      <Text className="ml-2 text-sm font-semibold text-gray-800">{label}</Text>
    </View>
  );
}

export default function HotelCard() {
  const amenities = [
    { icon: 'wifi', label: 'Free WiFi' },
    { icon: 'pool', label: 'Swimming pool' },
    { icon: 'ac-unit', label: 'Air Conditioning' },
    { icon: 'free-breakfast', label: 'Free Breakfast' },
    { icon: 'local-parking', label: 'Free Parking' },
  ];

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-lg">
      {/* Hotel image */}

      <Image
        source={hotelImage}
        style={{ width: '100%', height: 220, borderRadius: 16 }}
        resizeMode="cover"
      />

      <View className="p-4">
        {/* Sponsored tag */}
        <View className="mb-3 self-start rounded-full bg-yellow-400 px-4 py-2">
          <Text className="text-base font-bold text-gray-800">Sponsored</Text>
        </View>

        {/* Title + Location */}
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900">The Capital Hotel</Text>
          <View className="flex-row items-center">
            <MaterialIcons name="location-on" size={18} color="#ef4444" />
            <Text className="ml-1 text-sm text-gray-600">Colombo</Text>
          </View>
        </View>

        {/* Rating stars */}
        <View className="mb-2 mt-1 flex-row items-center">
          {[...Array(5)].map((_, i) => (
            <MaterialIcons
              key={i}
              name="star"
              size={18}
              color={i < 4 ? '#fbbf24' : '#d1d5db'} // 4 filled stars, 1 grey
            />
          ))}
          <Text className="ml-2 text-sm text-gray-600">(120 reviews)</Text>
        </View>

        {/* Amenities */}
        <View className="flex-row flex-wrap">
          {amenities.map((a, i) => (
            <Amenity key={i} {...a} />
          ))}
        </View>

        {/* Button */}
        <View className="mt-4 flex-row justify-end">
          <TouchableOpacity
            className="rounded-full bg-cyan-700 px-4 py-2"
            onPress={() => console.log('Details pressed')}>
            <Text className="text-base font-bold text-white">Get More Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
