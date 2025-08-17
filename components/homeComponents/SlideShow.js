import React, { useState, useRef } from "react";
import { View, Text, Dimensions, FlatList, Animated } from "react-native"; // ✅ Animated from react-native
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const itemsPerScreen = 4;
const itemWidth = width / itemsPerScreen;

const categories = [
  { name: "Hotels & Apartments", icon: <MaterialIcons name="hotel" size={32} color="#3b82f6" /> },
  { name: "Home Stays", icon: <MaterialIcons name="home-work" size={32} color="#10b981" /> },
  { name: "Activities", icon: <FontAwesome name="ticket" size={32} color="#f59e0b" /> },
  { name: "Transport", icon: <FontAwesome name="bus" size={32} color="#ef4444" /> },
  { name: "Food & Beverages", icon: <MaterialIcons name="restaurant" size={32} color="#8b5cf6" /> },
  { name: "Shopping", icon: <FontAwesome name="shopping-bag" size={32} color="#ec4899" /> },
  { name: "Events", icon: <MaterialIcons name="event" size={32} color="#06b6d4" /> },
  { name: "License & Tour Guide", icon: <MaterialIcons name="assignment-ind" size={32} color="#14b8a6" /> },
];

export default function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View className="mb-8">
      <View className="bg-sky-200 p-4 rounded-xl shadow-md">
        <View className="h-30">
          <Animated.FlatList
            ref={slidesRef}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={itemWidth}
            decelerationRate="fast"
            keyExtractor={(item, index) => index.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={viewConfig}
            renderItem={({ item }) => (
              <View
                className="mx-1 h-[140px] rounded-xl border border-gray-200 bg-white items-center justify-center shadow-sm"
                style={{ width: itemWidth - 8 }}
              >
                <View className="mb-2 rounded-full bg-white p-3 shadow-md">
                  {item.icon}
                </View>
                <Text className="text-center text-black text-sm font-bold leading-tight px-2">
                  {item.name}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
}
