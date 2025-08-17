import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

export default function ListingButtons({ onSelectCategory }) {
  const [selected, setSelected] = useState(0);

  const categories = ['Hotels', 'Home Stays', 'Activities', 'Transport', 'Food'];

  const handlePress = (index) => {
    setSelected(index);
    if (onSelectCategory) onSelectCategory(categories[index]);
  };

  return (
    <View className="bg-cyan-700 p-4">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 8 }}>
        <View className="flex-row rounded-full bg-white p-1">
          {categories.map((cat, index) => {
            const isSelected = selected === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handlePress(index)}
                className={`m-1 items-center rounded-full px-4 py-2 ${
                  isSelected ? 'bg-cyan-700' : 'bg-white'
                }`}>
                <Text className={`font-medium ${isSelected ? 'text-white' : 'text-black'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
