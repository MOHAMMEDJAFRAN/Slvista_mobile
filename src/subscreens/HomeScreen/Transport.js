import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Animated, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// API_BASE_URL should be defined in your .env file
const API_BASE_URL = process.env.API_BASE_URL;

export default function Transport() {
  const [search, setSearch] = useState("");
  const [transportTypeOpen, setTransportTypeOpen] = useState(false);
  const [transportType, setTransportType] = useState("Select Transport Type");
  const [animation] = useState(new Animated.Value(0));
  const [transportOptions, setTransportOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  // Fetch transport types from API
  useEffect(() => {
    fetchTransportTypes();
  }, []);

  // Safe format function
  const formatTransportType = (typeName) => {
    if (!typeName || typeof typeName !== 'string') {
      return 'Transport Service';
    }
    
    switch(typeName.toLowerCase()) {
      case 'threewheelars':
        return 'Three Wheelers';
      case 'car':
        return 'Car';
      default:
        return typeName.charAt(0).toUpperCase() + typeName.slice(1);
    }
  };

  const fetchTransportTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API call to get transport agencies
      const response = await axios.get(`${API_BASE_URL}/api/v1/transport-agencies`);
      
      if (response.data.success) {
        // Extract unique transport types from the API response with safety checks
        const allTransportTypes = response.data.data.flatMap(agency => 
          (agency.transportTypes || []).map(type => {
            const typeName = typeof type === 'string' ? type : (type?.name || 'Transport Service');
            return formatTransportType(typeName);
          })
        );
        
        // Get unique types and format them properly
        const uniqueTypes = [...new Set(allTransportTypes)]
          .filter(type => type && type.trim() !== '' && type.trim() !== ',')
          .map(type => formatTransportType(type));
        
        // Add additional common transport types if not already present
        const additionalTypes = [
          "Taxi", 
          "Bus", 
          "Train", 
          "Airplane", 
          "Bike", 
          "Scooter", 
          "Tuk-tuk", 
          "Boat", 
          "Ferry", 
          "Limousine", 
          "Shuttle", 
          "Motorcycle", 
          "Van", 
        ];
        
        const combinedTypes = [...new Set([...uniqueTypes, ...additionalTypes])];
        setTransportOptions(combinedTypes.sort());
      } else {
        setError("Failed to fetch transport types");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load transport types. Please try again.");
      
      // Fallback to default options if API fails
      setTransportOptions([
        "Car Rental", 
        "Taxi", 
        "Bus", 
        "Train", 
        "Airplane", 
        "Bike Rental", 
        "Scooter Rental", 
        "Tuk-tuk", 
        "Boat", 
        "Ferry", 
        "Limousine", 
        "Shuttle Service", 
        "Motorcycle Rental", 
        "Van Rental", 
        "Private Driver"
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change with space trimming
  const handleSearchChange = (text) => {
    // Remove trailing spaces from the input
    const trimmedText = text.replace(/\s+$/, '');
    setSearch(trimmedText);
  };

  const handleSearch = () => {
    // Trim the search text before using it
    const trimmedSearch = search.trim();
    
    console.log("Searching for transport:", trimmedSearch, "Transport type:", transportType);
    
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

    // Navigate to Transport Listing page with search parameters
    navigation.navigate('Transport', {
      searchQuery: trimmedSearch,
      transportType: transportType !== "Select Transport Type" ? transportType : ""
    });
  };

  const handleTransportTypeSelect = (option) => {
    setTransportType(option);
    setTransportTypeOpen(false);
  };

  const clearSearch = () => {
    setSearch("");
  };

  const clearTransportType = () => {
    setTransportType("Select Transport Type");
  };

  const retryFetchTransportTypes = () => {
    setError(null);
    fetchTransportTypes();
  };

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Search Field */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Search Transport<Text className="text-red-500">*</Text></Text>
        <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-2 shadow-sm">
          <MaterialIcons name="directions" size={22} color="#006D77" />
          <TextInput
            className="ml-3 flex-1 text-base font-semibold text-gray-800"
            placeholder="Destination, location, or service..."
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

      {/* Transport Type Dropdown */}
      <View className="mb-5">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-medium text-gray-700">Transport Type</Text>
          {transportType !== "Select Transport Type" && (
            <TouchableOpacity onPress={clearTransportType}>
              <Text className="text-xs text-cyan-700 font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {loading ? (
          <View className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] px-4 py-3 bg-gray-100">
            <View className="flex-row items-center flex-1">
              <MaterialIcons name="directions-car" size={20} color="#006D77" />
              <Text className="ml-2 text-md font-semibold text-gray-500 flex-1">
                Loading transport types...
              </Text>
            </View>
            <ActivityIndicator size="small" color="#006D77" />
          </View>
        ) : error ? (
          <View className="rounded-full border-2 border-red-300 bg-red-50 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-md font-semibold text-red-700 flex-1">{error}</Text>
              <TouchableOpacity onPress={retryFetchTransportTypes} className="ml-2">
                <MaterialIcons name="refresh" size={20} color="#006D77" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => setTransportTypeOpen(!transportTypeOpen)}
              className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] px-4 py-3 bg-white shadow-sm"
              activeOpacity={0.7}
              disabled={transportOptions.length === 0}
            >
              <View className="flex-row items-center flex-1">
                <MaterialIcons name="directions-car" size={20} color="#006D77" />
                <Text className="ml-2 text-md font-semibold text-gray-800 flex-1">
                  {transportOptions.length === 0 ? "No transport types available" : transportType}
                </Text>
              </View>
              {transportOptions.length > 0 && (
                <MaterialIcons
                  name={transportTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                  size={26}
                  color="#006D77"
                />
              )}
            </TouchableOpacity>

            {transportTypeOpen && transportOptions.length > 0 && (
              <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
                <ScrollView 
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {transportOptions.map((option, idx) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleTransportTypeSelect(option)}
                      className={`px-4 py-3 ${idx !== transportOptions.length - 1
                        ? "border-b border-gray-100"
                        : ""
                        } active:bg-cyan-50`}
                      activeOpacity={0.6}
                    >
                      <View className="flex-row items-center">
                        <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                          ${transportType === option ? 'border-[#006D77] bg-[#006D77]' : 'border-gray-300'}`}>
                          {transportType === option && (
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
          disabled={(!search && transportType === "Select Transport Type") || loading}
        >
          <Text className="text-lg font-semibold text-white">
            {loading ? "Loading..." : 
             !search && transportType === "Select Transport Type" 
              ? "Enter search criteria" 
              : "Search Transport"
            }
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Quick Search Tips */}
      <View className="mt-4 p-3 bg-gray-50 rounded-lg">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Search Tips:</Text>
        <Text className="text-xs text-gray-600 mb-1">• Search by destination (e.g., "Colombo")</Text>
        <Text className="text-xs text-gray-600 mb-1">• Select by service type (e.g., "taxi")</Text>
      </View>
    </View>
  );
}