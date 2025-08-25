import React, { useState, useRef } from "react";
import { View, Text, Dimensions, Animated, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const itemsPerScreen = 4;
const itemWidth = width / itemsPerScreen;

// Updated categories as requested
const categories = [
  { 
    name: "Transport", 
    icon: <FontAwesome name="bus" size={25} color="#ef4444" />,
    page: "TransportListing"
  },
  { 
    name: "Activities", 
    icon: <FontAwesome name="ticket" size={25} color="#f59e0b" />,
    page: "ActivitiesListing"
  },
  { 
    name: "Food & Beverage", 
    icon: <MaterialIcons name="restaurant" size={25} color="#8b5cf6" />,
    page: "FoodBeverageListing"
  },
  { 
    name: "Events", 
    icon: <MaterialIcons name="event" size={25} color="#06b6d4" />,
    page: "EventsListing"
  },
  { 
    name: "Local Artists", 
    icon: <FontAwesome5 name="paint-brush" size={25} color="#ec4899" />,
    page: "LocalArtistsListing"
  },
  { 
    name: "Shopping", 
    icon: <FontAwesome name="shopping-bag" size={25} color="#14b8a6" />,
    page: "ShoppingListing"
  },
  { 
    name: "Licensed Tour Guides", 
    icon: <MaterialIcons name="assignment-ind" size={25} color="#10b981" />,
    page: "TourGuidesListing"
  },
  { 
    name: "Other Services", 
    icon: <MaterialIcons name="miscellaneous-services" size={25} color="#3b82f6" />,
    page: "OtherServicesListing"
  },
];

export default function SlideShow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const navigation = useNavigation();

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  // Function to handle category press
  const handleCategoryPress = (pageName) => {
    if (pageName) {
      navigation.navigate(pageName);
    }
  };

  return (
    <View className="mb-3 mt-3">
      <View className="bg-[#E6F6F8] p-3 mx-2 rounded-xl shadow-lg border border-[#006D77]">
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
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.page)}
                activeOpacity={0.7}
                className="mx-1 h-28 rounded-xl border border-[#006D77] bg-white items-center justify-center shadow-md"
                style={{ width: itemWidth - 10 }}
              >
                <View className="mb-2 rounded-full bg-[#E6F6F8] p-3 shadow-sm">
                  {item.icon}
                </View>
                <Text className="text-center text-blue-900 text-xs font-semibold px-1">
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}