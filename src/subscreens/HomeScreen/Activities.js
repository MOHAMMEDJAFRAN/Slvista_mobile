import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, ScrollView, Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Configure axios base URL
const API_BASE_URL = process.env.API_BASE_URL;

export default function Activities() {
  const [search, setSearch] = useState("");
  const [activityTypeOpen, setActivityTypeOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [activityType, setActivityType] = useState("Select Activity Type");
  const [location, setLocation] = useState("Select Location");
  const [animation] = useState(new Animated.Value(0));
  const [activityOptions, setActivityOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Location options (static as per your requirement)
  const locationOptions = [
    "Colombo", "Kandy", "Galle", "Sigiriya", "Ella", "Nuwara Eliya", 
    "Yala", "Bentota", "Mirissa", "Hikkaduwa", "Unawatuna", "Dambulla",
    "Anuradhapura", "Polonnaruwa", "Jaffna", "Trincomalee", "Negombo"
  ];

  // Fetch activity types from API
  const fetchActivityTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/v1/activities`);
      
      if (response.data.success) {
        // Extract unique activity types from the response
        const types = [...new Set(response.data.data.map(activity => activity.type))];
        
        // Filter out null/undefined values and sort alphabetically
        const filteredTypes = types
          .filter(type => type && type.trim() !== "")
          .sort((a, b) => a.localeCompare(b));
        
        setActivityOptions(filteredTypes);
      } else {
        Alert.alert("Error", "Failed to fetch activity types");
      }
    } catch (error) {
      console.error("Error fetching activity types:", error);
      Alert.alert("Error", "Failed to load activity types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityTypes();
  }, []);

  // Handle search input change with space trimming
  const handleSearchChange = (text) => {
    // Remove trailing spaces from the input
    const trimmedText = text.replace(/\s+$/, '');
    setSearch(trimmedText);
  };

  const handleSearch = () => {
    // Trim the search text before using it
    const trimmedSearch = search.trim();
    
    console.log("Searching for:", trimmedSearch, "Activity type:", activityType, "Location:", location);
    
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

    // Navigate to Activities page with search parameters
    navigation.navigate('Activity', {
      searchQuery: trimmedSearch,
      activityType: activityType !== "Select Activity Type" ? activityType : "",
      location: location !== "Select Location" ? location : ""
    });
  };

  const handleActivityTypeSelect = (option) => {
    setActivityType(option);
    setActivityTypeOpen(false);
  };

  const handleLocationSelect = (option) => {
    setLocation(option);
    setLocationOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const clearActivityType = () => {
    setActivityType("Select Activity Type");
  };

  const clearLocation = () => {
    setLocation("Select Location");
  };

  const refreshActivityTypes = () => {
    fetchActivityTypes();
  };

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Search Field */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">
          Search Activities
          <Text className="text-red-500">*</Text>
        </Text>
        <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-2 shadow-sm">
          <MaterialIcons name="search" size={22} color="#006D77" />
          <TextInput
            className="ml-3 flex-1 text-base font-semibold text-gray-800"
            placeholder="Activity name, type, or location..."
            value={search}
            onChangeText={handleSearchChange} // Updated to use the new handler
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

      {/* Activity Type Dropdown */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Activity Type</Text>
          <View className="flex-row items-center">
            {activityType !== "Select Activity Type" && (
              <TouchableOpacity onPress={clearActivityType} className="mr-3">
                <Text className="text-xs text-cyan-700 font-medium">Clear</Text>
              </TouchableOpacity>
            )}
            {/* <TouchableOpacity onPress={refreshActivityTypes}>
              <MaterialIcons name="refresh" size={18} color="#006D77" />
            </TouchableOpacity> */}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => {
            setActivityTypeOpen(!activityTypeOpen);
            setLocationOpen(false);
          }}
          className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] px-4 py-3 bg-white shadow-sm"
          activeOpacity={0.7}
          disabled={loading}
        >
          <View className="flex-row items-center flex-1">
            <MaterialIcons name="directions-run" size={20} color="#006D77" />
            {loading ? (
              <Text className="ml-2 text-md font-semibold text-gray-500 flex-1">
                Activity types...
              </Text>
            ) : (
              <Text className="ml-2 text-md font-semibold text-gray-800 flex-1">
                {activityType}
              </Text>
            )}
          </View>
          {!loading && (
            <MaterialIcons
              name={activityTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={26}
              color="#006D77"
            />
          )}
        </TouchableOpacity>

        {activityTypeOpen && !loading && (
          <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
            {activityOptions.length === 0 ? (
              <View className="px-4 py-3">
                <Text className="text-base font-medium text-gray-500 text-center">
                  No activity types available
                </Text>
              </View>
            ) : (
              <ScrollView 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {activityOptions.map((option, idx) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleActivityTypeSelect(option)}
                    className={`px-4 py-3 ${idx !== activityOptions.length - 1
                      ? "border-b border-gray-100"
                      : ""
                      } active:bg-cyan-50`}
                    activeOpacity={0.6}
                  >
                    <View className="flex-row items-center">
                      <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                        ${activityType === option ? 'border-[#006D77] bg-[#006D77]' : 'border-gray-300'}`}>
                        {activityType === option && (
                          <MaterialIcons name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text className="text-base font-medium text-gray-800">{option}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>

      {/* Location Dropdown (unchanged) */}
      {/* <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Location</Text>
          {location !== "Select Location" && (
            <TouchableOpacity onPress={clearLocation}>
              <Text className="text-xs text-cyan-700 font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => {
            setLocationOpen(!locationOpen);
            setActivityTypeOpen(false);
          }}
          className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] px-4 py-3 bg-white shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center flex-1">
            <MaterialIcons name="location-on" size={20} color="#006D77" />
            <Text className="ml-2 text-md font-semibold text-gray-800 flex-1">
              {location}
            </Text>
          </View>
          <MaterialIcons
            name={locationOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={26}
            color="#006D77"
          />
        </TouchableOpacity>

        {locationOpen && (
          <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {locationOptions.map((option, idx) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleLocationSelect(option)}
                  className={`px-4 py-3 ${idx !== locationOptions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                    } active:bg-cyan-50`}
                  activeOpacity={0.6}
                >
                  <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                      ${location === option ? 'border-[#006D77] bg-[#006D77]' : 'border-gray-300'}`}>
                      {location === option && (
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
      </View> */}

      {/* Divider line between form and button */}
      <View className="border-t border-gray-200 my-4" />

      {/* Search Button */}
      <Animated.View style={{ transform: [{ scale: scaleInterpolate }] }}>
        <TouchableOpacity
          className="items-center rounded-full bg-[#006D77] py-4 shadow-md active:opacity-80"
          onPress={handleSearch}
          activeOpacity={0.7}
          disabled={!search && activityType === "Select Activity Type" && location === "Select Location"}
        >
          <Text className="text-lg font-semibold text-white">
            {!search && activityType === "Select Activity Type" && location === "Select Location" 
              ? "Enter search criteria" 
              : "Search Activities"
            }
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Search Tips */}
      <View className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Search Tips:</Text>
        <Text className="text-xs text-gray-600 mb-1">• Search by activity name (e.g., "Sigiriya Rock Climbing")</Text>
        <Text className="text-xs text-gray-600 mb-1">• Select by activity type (e.g., "Adventure activities")</Text>
      </View>
    </View>
  );
}