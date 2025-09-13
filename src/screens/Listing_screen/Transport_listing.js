import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, Dimensions, ActivityIndicator, Alert } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

// Import environment variables
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const TransportListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    vehicleType: [],
    location: [],
    sortBy: "recommended"
  });
  const [filteredData, setFilteredData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Vehicle type icons mapping
  const vehicleIcons = {
    Bus: "bus",
    Taxi: "taxi",
    Train: "train",
    Bicycle: "bicycle",
    Shuttle: "shuttle-van",
    Car: "car",
    Airplane: "plane",
    Flight: "plane-departure",
    Helicopter: "helicopter",
    Boat: "ship",
    Ship: "ship",
    threewheelars: "car" // Using car icon for threewheelars
  };

  // Extract unique vehicle types and locations from API data
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" }
  ];

  // Fetch transport data from API
  const fetchTransportData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("API Base URL:", API_BASE_URL);
      const response = await axios.get(`${API_BASE_URL}/api/v1/transport-agencies`);
      
      if (response.data.success) {
        // Transform API data to match your component's expected format
        const transformedData = response.data.data.map(agency => ({
          id: agency.id,
          name: agency.title,
          type: agency.transportTypes.length > 0 ? agency.transportTypes[0].name : "Car",
          types: agency.transportTypes.map(t => t.name),
          images: agency.images.map(img => img.imageUrl),
          location: agency.city || agency.district || agency.address,
          rating: agency.rating || 4.2, // Default rating
          website: agency.website,
          email: agency.email,
          phone: agency.phone,
          specialties: [
            agency.serviceArea && `Service: ${agency.serviceArea}`,
            agency.vistaVerified && "Vista Verified"
          ].filter(Boolean),
          address: agency.address,
          city: agency.city,
          district: agency.district,
          active: agency.isActive, // This is the active status from API
          province: agency.province,
          description: agency.description,
          vistaVerified: agency.vistaVerified,
          originalData: agency
        }));
        
        setTransportData(transformedData);
        setFilteredData(transformedData);
        
        // Extract unique vehicle types from all agencies
        const allVehicleTypes = [...new Set(
          transformedData.flatMap(agency => agency.types)
        )];
        setVehicleTypes(allVehicleTypes);
        
        // Extract unique locations
        const allLocations = [...new Set(
          transformedData.map(agency => agency.location)
        )].filter(Boolean);
        setLocations(allLocations);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      console.error("Error fetching transport data:", err);
      setError("Failed to load transport options. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchTransportData();
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters, transportData]);

  const applyFiltersToData = () => {
    let result = [...transportData];
    
    // Apply vehicle type filter
    if (activeFilters.vehicleType.length > 0) {
      result = result.filter(item => 
        item.types.some(type => activeFilters.vehicleType.includes(type))
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(item => 
        activeFilters.location.includes(item.location)
      );
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
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredData(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "vehicleType" || filterType === "location") {
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
      vehicleType: [],
      location: [],
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("TransportDetails", { transportItem: item });
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
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
        <Text className="text-gray-600 ml-1 text-sm">({rating})</Text>
      </View>
    );
  };

  const retryFetch = () => {
    fetchTransportData();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading transport options...</Text>
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
        <TouchableOpacity 
          onPress={retryFetch}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl"
        >
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
          <Text className="text-white text-xl font-bold ml-4">Transport Services</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.vehicleType.length > 0 || activeFilters.location.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.vehicleType.length + activeFilters.location.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredData.length} of {transportData.length} options
        </Text>
        {(activeFilters.vehicleType.length > 0 || activeFilters.location.length > 0) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Transport Listings */}
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
                <View className="w-28 h-28 rounded-xl overflow-hidden mr-3 relative">
                  <Image 
                    source={{ uri: item.images?.[0] }} 
                    className="w-full h-full"
                    resizeMode="cover"
                    onError={() => console.log("Image failed to load")}
                  />
                  {item.images && item.images.length > 1 && (
                    <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
                      <Text className="text-white text-xs">
                        +{item.images.length - 1}
                      </Text>
                    </View>
                  )}
                  
                  {/* Active Status Indicator */}
                  <View className="absolute top-2 left-2 flex-row">
                    {item.vistaVerified && (
                      <View className="bg-green-500 rounded-full px-2 py-1 mr-1">
                        <Text className="text-white text-xs">Verified</Text>
                      </View>
                    )}
                    {/* <View className={`rounded-full w-6 h-6 flex items-center justify-center ${item.active ? 'bg-green-500' : 'bg-red-500'}`}>
                      <Ionicons 
                        name={item.active ? 'checkmark' : 'close'} 
                        size={16} 
                        color="white" 
                      />
                    </View> */}
                    {/* Active Status Indicator */}
                    <View className={`rounded-full px-2 py-1 flex-row items-center ${item.active ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Ionicons 
                        name={item.active ? 'checkmark' : 'close'} 
                        size={12} 
                        color={item.active ? '#16a34a' : '#dc2626'} 
                        />
                      <Text className={`text-xs ml-1 ${item.active ? 'text-green-800' : 'text-red-800'}`}>
                          {item.active ? 'Available' : 'Unavailable'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2" numberOfLines={5}>
                      {item.name}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1 mr-5">{item.location}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars(item.rating)}
                  </View>
                  
                  {item.types && item.types.length > 0 && (
                    <View className="flex-row flex-wrap mt-2">
                      {item.types.slice(0, 2).map((type, index) => (
                        <View key={index} className="bg-[#E6F6F8] rounded-full px-2 py-1 mr-1 mb-1">
                          <Text className="text-[#006D77] text-xs">{type}</Text>
                        </View>
                      ))}
                      {item.types.length > 2 && (
                        <View className="bg-[#E6F6F8] rounded-full px-2 py-1">
                          <Text className="text-[#006D77] text-xs">
                            +{item.types.length - 2}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
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
            <MaterialCommunityIcons name="taxi" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No transport options found
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
              {/* Vehicle Type Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Vehicle Type</Text>
                <View className="flex-row flex-wrap">
                  {vehicleTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => toggleFilter("vehicleType", type)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center ${
                        activeFilters.vehicleType.includes(type)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <FontAwesome5 
                        name={vehicleIcons[type] || "car"} 
                        size={14} 
                        color={activeFilters.vehicleType.includes(type) ? "white" : "#4b5563"} 
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={
                          activeFilters.vehicleType.includes(type)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Location Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Location</Text>
                <View className="flex-row flex-wrap">
                  {locations.map((location) => (
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

export default TransportListing;