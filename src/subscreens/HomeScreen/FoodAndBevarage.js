import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";

// Configure axios base URL
const API_BASE_URL = process.env.API_BASE_URL;

export default function Food() {
  const [search, setSearch] = useState("");
  const [foodTypeOpen, setFoodTypeOpen] = useState(false);
  const [foodType, setFoodType] = useState("Select Food Type");
  const [animation] = useState(new Animated.Value(0));
  const [foodOptions, setFoodOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Fetch cuisine types from API
  useEffect(() => {
    fetchCuisineTypes();
  }, []);

  const fetchCuisineTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/food-and-beverages`);
      
      if (response.data.success) {
        // Extract unique cuisine types from the response data
        const cuisineTypes = [...new Set(
          response.data.data
            .map(item => item.cuisineType)
            .filter(type => type && type.trim() !== "") // Filter out empty/null values
        )].sort(); // Sort alphabetically
        
        setFoodOptions(cuisineTypes);
      } else {
        setError("Failed to fetch cuisine types");
      }
    } catch (err) {
      console.error("Error fetching cuisine types:", err);
      setError("Failed to load cuisine types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with space trimming
  const handleSearchChange = (text) => {
    const trimmedText = text.replace(/\s+$/, '');
    setSearch(trimmedText);
  };

  const handleSearch = () => {
    const trimmedSearch = search.trim();
    
    console.log("Searching for:", trimmedSearch, "Food type:", foodType);
    
    // Add animation feedback
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();

    // Navigate to Food Listing page with search parameters
    navigation.navigate('FoodListing', {
      searchQuery: trimmedSearch,
      foodType: foodType !== "Select Food Type" ? foodType : ""
    });
  };

  const handleFoodTypeSelect = (option) => {
    setFoodType(option);
    setFoodTypeOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const clearFoodType = () => {
    setFoodType("Select Food Type");
  };

  const retryFetchCuisineTypes = () => {
    fetchCuisineTypes();
  };

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Search Field */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Search Restaurants<Text className="text-red-500">*</Text></Text>
        <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-2 shadow-sm">
          <MaterialIcons name="search" size={22} color="#006D77" />
          <TextInput
            className="ml-3 flex-1 text-base font-semibold text-gray-800"
            placeholder="Restaurant, cuisine, or location..."
            value={search}
            onChangeText={handleSearchChange}
            placeholderTextColor="#9ca3af"
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} className="p-1">
              <MaterialIcons name="close" size={18} color="#006D77" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Food Type Dropdown */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Food Type</Text>
          {foodType !== "Select Food Type" && (
            <TouchableOpacity onPress={clearFoodType}>
              <Text className="text-xs text-cyan-700 font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View className="flex-row items-center justify-between rounded-full border-2 border-gray-300 px-4 py-3 bg-gray-50">
            <View className="flex-row items-center flex-1">
              <MaterialIcons name="restaurant" size={20} color="#9ca3af" />
              <Text className="ml-2 text-md font-semibold text-gray-500 flex-1">
                cuisine types...
              </Text>
            </View>
            <MaterialIcons name="refresh" size={20} color="#9ca3af" />
          </View>
        ) : error ? (
          <View className="rounded-full border-2 border-red-300 px-4 py-3 bg-red-50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <MaterialIcons name="error-outline" size={20} color="#dc2626" />
                <Text className="ml-2 text-md font-semibold text-red-700 flex-1">
                  {error}
                </Text>
              </View>
              <TouchableOpacity onPress={retryFetchCuisineTypes}>
                <MaterialIcons name="refresh" size={22} color="#dc2626" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setFoodTypeOpen(!foodTypeOpen)}
              className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] px-4 py-3 bg-white shadow-sm"
              activeOpacity={0.7}
              disabled={foodOptions.length === 0}
            >
              <View className="flex-row items-center flex-1">
                <MaterialIcons name="restaurant" size={20} color="#006D77" />
                <Text className="ml-2 text-md font-semibold text-gray-800 flex-1">
                  {foodOptions.length === 0 ? "Food types unavailable" : foodType}
                </Text>
              </View>
              {foodOptions.length > 0 && (
                <MaterialIcons
                  name={foodTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={26}
                  color="#006D77"
                />
              )}
            </TouchableOpacity>

            {foodTypeOpen && foodOptions.length > 0 && (
              <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
                <ScrollView 
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {foodOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleFoodTypeSelect(option)}
                      className={`px-4 py-3 ${idx !== foodOptions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                        } active:bg-cyan-50`}
                      activeOpacity={0.6}
                    >
                      <View className="flex-row items-center">
                        <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                          ${foodType === option ? 'border-[#006D77] bg-[#006D77]' : 'border-gray-300'}`}>
                          {foodType === option && (
                            <MaterialIcons name="check" size={14} color="white" />
                          )}
                        </View>
                        <Text className="text-base font-medium text-gray-800">{option}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </View>

      {/* Divider line between form and button */}
      <View className="border-t border-gray-200 my-4" />

      {/* Search Button */}
      <Animated.View style={{ transform: [{ scale: scaleInterpolate }] }}>
        <TouchableOpacity
          className="items-center rounded-full bg-[#006D77] py-4 shadow-md active:opacity-80"
          onPress={handleSearch}
          activeOpacity={0.7}
          disabled={(!search && foodType === "Select Food Type") || loading}
        >
          <Text className="text-lg font-semibold text-white">
            {loading 
              ? "Loading..." 
              : (!search && foodType === "Select Food Type") 
                ? "Enter search criteria" 
                : "Search Restaurants"
            }
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Search Tips */}
      <View className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Search Tips:</Text>
        <Text className="text-xs text-gray-600 mb-1">• Search by restaurant name (e.g., "Pizza Hut")</Text>
        <Text className="text-xs text-gray-600 mb-1">• Select by cuisine type from available options</Text>
        
      </View>
    </View>
  );
}