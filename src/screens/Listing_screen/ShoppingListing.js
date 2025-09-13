import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const ShoppingListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    location: [],
    priceRange: [],
    availability: [],
    sortBy: "recommended"
  });
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState([]);
  const [error, setError] = useState(null);

  // Category icons mapping - updated based on your API categories
  const categoryIcons = {
    "Jewelry": "diamond",
    "Clothing": "tshirt",
    "Electronics": "mobile",
    "Food": "shopping-basket",
    "Home": "home",
    "Sports": "futbol-o",
    "Books": "book",
    "Other": "shopping-cart",
    // Add more categories as needed based on your API data
  };

  // Get unique categories from API data
  const getCategories = () => {
    const categories = [...new Set(apiData.map(item => item.category))];
    return categories.filter(category => category !== null && category !== undefined);
  };

  // Get unique locations from API data
  const getLocations = () => {
    const cities = [...new Set(apiData.map(item => item.city))];
    const provinces = [...new Set(apiData.map(item => item.province))];
    return [...cities, ...provinces].filter(location => location !== null && location !== undefined);
  };

  const priceRanges = ["$", "$$", "$$$", "$$$$"];
  const availabilityOptions = ["Open Now", "Closed"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" },
    { id: "createdAt", label: "Newest First", icon: "sort-descending" },
    { id: "createdAtDesc", label: "Oldest First", icon: "sort-ascending" }
  ];

  // Fetch data from API
  const fetchShoppingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/shopping`);
      
      if (response.data.success) {
        setApiData(response.data.data);
        setFilteredData(response.data.data);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingData();
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters, apiData]);

  const applyFiltersToData = () => {
    let result = [...apiData];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(item => 
        activeFilters.category.includes(item.category)
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(item => 
        activeFilters.location.includes(item.city) || 
        activeFilters.location.includes(item.province)
      );
    }
    
    // Apply price range filter (you might need to adjust this based on your API data)
    if (activeFilters.priceRange.length > 0) {
      // Since your API doesn't have priceRange, we'll skip this filter
      // You might want to add priceRange to your API or handle differently
    }
    
    // Apply availability filter
    if (activeFilters.availability.length > 0) {
      // Map API isActive to availability options
      result = result.filter(item => {
        const availability = item.isActive ? "Open Now" : "Closed";
        return activeFilters.availability.includes(availability);
      });
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        // Your API doesn't have rating, so we'll sort by name as fallback
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "createdAt":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "createdAtDesc":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredData(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "category" || filterType === "location" || filterType === "priceRange" || filterType === "availability") {
      if (activeFilters[filterType].includes(value)) {
        setActiveFilters({
          ...activeFilters,
          [filterType]: activeFilters[filterType].filter(item => item !== value)
        });
      } else {
        setActiveFilters({
          ...activeFilters,
          [filterType]: [...activeFilters[filterType], value]
        });
      }
    } else {
      setActiveFilters({ ...activeFilters, [filterType]: value });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      location: [],
      priceRange: [],
      availability: [],
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("ShoppingDetails", { shoppingItem: item });
  };

  const renderStars = (rating) => {
    // Since your API doesn't have rating, we'll show a placeholder
    const placeholderRating = 4.0; // You can remove this when you add ratings to your API
    const stars = [];
    const fullStars = Math.floor(placeholderRating);
    const hasHalfStar = placeholderRating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#FFD700" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#FFD700" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#FFD700" />);
      }
    }
    
    return (
      <View className="flex-row items-center">
        {stars}
        <Text className="text-gray-600 ml-1 text-sm">({placeholderRating})</Text>
      </View>
    );
  };

  const renderPriceRange = () => {
    // Placeholder since your API doesn't have price range
    return (
      <View className="flex-row">
        <Text className="text-green-600 font-semibold">$$</Text>
      </View>
    );
  };

  const getAvailabilityColor = (isActive) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getAvailabilityText = (isActive) => {
    return isActive ? "Open Now" : "Closed";
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading shopping destinations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">
          {error}
        </Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Please check your connection and try again
        </Text>
        <TouchableOpacity 
          onPress={fetchShoppingData}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="refresh" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Shopping</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceRange.length > 0 || activeFilters.availability.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.category.length + activeFilters.location.length + activeFilters.priceRange.length + activeFilters.availability.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredData.length} of {apiData.length} destinations
        </Text>
        {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceRange.length > 0 || activeFilters.availability.length > 0) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Shopping Listings */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5 border border-gray-100"
              onPress={() => handleViewDetails(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row">
                <View className="w-28 h-28 rounded-xl overflow-hidden mr-4 relative">
                  {item.images && item.images.length > 0 ? (
                    <Image 
                      source={{ uri: item.images[0].imageUrl }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <MaterialCommunityIcons name="store" size={32} color="#9ca3af" />
                    </View>
                  )}
                  {/* Active Status Badge */}
                  <View className="absolute top-2 left-2 flex-row">
                    {/* Active Status Indicator */}
                    <View className={`rounded-full px-2 py-1 flex-row items-center ${item.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Ionicons 
                        name={item.isActive ? 'checkmark' : 'close'} 
                        size={12} 
                        olor={item.isActive ? '#16a34a' : '#dc2626'} 
                      />
                      <Text className={`text-xs ml-1 ${item.isActive ? 'text-green-800' : 'text-red-800'}`}>
                        {item.isActive ? 'Available' : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                  
                  
                  {item.images && item.images.length > 1 && (
                    <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
                      <Text className="text-white text-xs">
                        +{item.images.length - 1}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2" numberOfLines={5}>
                      {item.name}
                    </Text>
                    {/* {item.email && (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL(`mailto:${item.email}`);
                        }}
                        className="p-2 bg-gray-100 rounded-full"
                      >
                        <Feather name="mail" size={16} color="#006D77" />
                      </TouchableOpacity>
                    )} */}
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1 mr-5">
                      {item.city}, {item.province}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars()}
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <FontAwesome 
                        name={categoryIcons[item.category] || "shopping-cart"} 
                        size={14} 
                        color="#006D77" 
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-gray-500 text-sm mr-5">{item.category || "Other"}</Text>
                    </View>
                    {/* {renderPriceRange()} */}
                  </View>
                  
                  {/* <View className="flex-row items-center mt-2">
                    <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(item.isActive)}`}>
                      <Text className="text-xs font-medium">
                        {getAvailabilityText(item.isActive)}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm ml-2">Hours not specified</Text>
                  </View> */}
                  
                  {/* <View className="flex-row mt-3">
                    {item.phone && (
                      <TouchableOpacity 
                        className="p-2 bg-gray-100 rounded-full mr-2"
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL(`tel:${item.phone}`);
                        }}
                      >
                        <Feather name="phone" size={16} color="#006D77" />
                      </TouchableOpacity>
                    )}
                    {item.email && (
                      <TouchableOpacity 
                        className="p-2 bg-gray-100 rounded-full mr-2"
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL(`mailto:${item.email}`);
                        }}
                      >
                        <Feather name="mail" size={16} color="#006D77" />
                      </TouchableOpacity>
                    )}
                  </View> */}
                </View>
              </View>
              <TouchableOpacity 
                className="mt-4 bg-[#E6F6F8] p-3 rounded-xl flex-row items-center justify-between"
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.8}
              >
                <Text className="text-[#006D77] font-semibold">View Details</Text>
                <Ionicons name="arrow-forward" size={18} color="#006D77" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center justify-center mt-8">
            <MaterialCommunityIcons name="shopping" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No shopping destinations found
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Try adjusting your filters or search criteria
            </Text>
            <TouchableOpacity 
              onPress={clearAllFilters}
              className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
            >
              <Ionicons name="close-circle-outline" size={18} color="white" style={{marginRight: 8}} />
              <Text className="text-white font-semibold">Clear All Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={filtersOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setFiltersOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl h-4/5 p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">Filters & Sort</Text>
              <TouchableOpacity 
                onPress={() => setFiltersOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
              {/* Category Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Category</Text>
                <View className="flex-row flex-wrap">
                  {getCategories().map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => toggleFilter("category", category)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center ${
                        activeFilters.category.includes(category)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <FontAwesome 
                        name={categoryIcons[category] || "shopping-cart"} 
                        size={14} 
                        color={activeFilters.category.includes(category) ? "white" : "#4b5563"} 
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={
                          activeFilters.category.includes(category)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Location Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Location</Text>
                <View className="flex-row flex-wrap">
                  {getLocations().map((location) => (
                    <TouchableOpacity
                      key={location}
                      onPress={() => toggleFilter("location", location)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.location.includes(location)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={
                          activeFilters.location.includes(location)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Price Range Filter */}
              {/* <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Price Range</Text>
                <View className="flex-row flex-wrap">
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => toggleFilter("priceRange", range)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.priceRange.includes(range)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={
                          activeFilters.priceRange.includes(range)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}
              
              {/* Availability Filter */}
              {/* <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Availability</Text>
                <View className="flex-row flex-wrap">
                  {availabilityOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => toggleFilter("availability", option)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.availability.includes(option)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={
                          activeFilters.availability.includes(option)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View> */}
              
              {/* Sort By Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Sort By</Text>
                <View className="border border-gray-200 rounded-xl overflow-hidden">
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleFilter("sortBy", option.id)}
                      className={`flex-row items-center py-4 px-4 border-b border-gray-100 last:border-b-0 ${
                        activeFilters.sortBy === option.id ? "bg-[#E6F6F8]" : "bg-white"
                      }`}
                    >
                      <MaterialCommunityIcons 
                        name={option.icon} 
                        size={20} 
                        color={activeFilters.sortBy === option.id ? "#006D77" : "#4b5563"} 
                        style={{ marginRight: 12 }}
                      />
                      <Text className={`flex-1 text-base ${activeFilters.sortBy === option.id ? "font-semibold text-[#006D77]" : "text-gray-800"}`}>
                        {option.label}
                      </Text>
                      {activeFilters.sortBy === option.id && (
                        <Ionicons name="checkmark" size={20} color="#006D77" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
            
            {/* Filter Actions */}
            <View className="flex-row justify-between pt-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={clearAllFilters}
                className="px-6 py-3 border border-gray-300 rounded-xl flex-row items-center"
              >
                <Ionicons name="close-circle-outline" size={18} color="#4b5563" style={{marginRight: 6}} />
                <Text className="text-gray-700 font-semibold">Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFiltersAndClose}
                className="px-6 py-3 bg-[#006D77] rounded-xl flex-1 ml-4 flex-row items-center justify-center"
              >
                <Ionicons name="checkmark" size={18} color="white" style={{marginRight: 6}} />
                <Text className="text-white font-semibold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShoppingListing;