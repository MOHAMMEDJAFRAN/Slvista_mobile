import React, { useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Sample reviews
const dummyReviews = [
  {
    id: '1',
    user: 'John Doe',
    rating: 5,
    comment: 'Amazing experience! Highly recommend.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    date: '2025-09-12',
  },
  {
    id: '2',
    user: 'Jane Smith',
    rating: 4,
    comment: 'Great service, but the room was small.',
    avatar: 'https://i.pravatar.cc/150?img=2',
    date: '2025-09-10',
  },
  {
    id: '3',
    user: 'Alice Johnson',
    rating: 3,
    comment: 'Average experience, could be better.',
    avatar: 'https://i.pravatar.cc/150?img=3',
    date: '2025-09-08',
  },
  {
    id: '4',
    user: 'Michael Brown',
    rating: 5,
    comment: 'Excellent staff and very clean rooms.',
    avatar: 'https://i.pravatar.cc/150?img=4',
    date: '2025-09-05',
  },
  {
    id: '5',
    user: 'Emily Davis',
    rating: 2,
    comment: 'Not satisfied, expected better amenities.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    date: '2025-09-01',
  },
];

export default function MyReviews() {
  const [reviews, setReviews] = useState(dummyReviews); // Removed TypeScript annotation

  const renderReview = ({ item }) => (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
      <View className="flex-row items-center mb-2">
        {item.avatar ? (
          <Image
            source={{ uri: item.avatar }}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-10 h-10 rounded-full bg-gray-300" />
        )}
        <View className="flex-1 ml-3">
          <Text className="font-bold text-base text-gray-900">{item.user}</Text>
          <Text className="text-gray-500 text-sm">{item.date}</Text>
        </View>
        <View className="flex-row">
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name={index < item.rating ? 'star' : 'star-outline'}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <Text className="text-gray-700 text-sm">{item.comment}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {reviews.length === 0 ? (
        <Text className="text-center text-gray-400 mt-20 text-base">
          You have no reviews yet.
        </Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={renderReview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}
