import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  TextInput,
  Modal,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  PanResponder
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// API_BASE_URL should be defined in your .env file
const API_BASE_URL = process.env.API_BASE_URL;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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
    case 'bike':
      return 'Bike';
    case 'scooter':
      return 'Scooter';
    case 'tuktuk':
      return 'Tuk-tuk';
    default:
      return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  }
};

// Transport Filter Component
const TransportFilter = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  availableTypes = [],
  availableLocations = [],
  availableFeatures = []
}) => {
  const [panY, setPanY] = useState(0);
  const modalHeight = screenHeight * 0.85;

  // Use available types, locations, and features from API
  const typeOptions = availableTypes.length > 0 ? availableTypes : ['Car Rental', 'Taxi', 'Bus', 'Train'];
  const locationOptions = availableLocations.length > 0 ? availableLocations : ['Colombo', 'Kandy', 'Galle'];
  const featuresOptions = availableFeatures.length > 0 ? availableFeatures : ['24/7 Support', 'Insurance Included', 'Free Cancellation'];

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 2);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        setPanY(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      }
      setPanY(0);
    },
  });

  const toggleFilter = (category, value) => {
    const currentValues = filters[category] || [];
    if (currentValues.includes(value)) {
      onFilterChange({
        ...filters,
        [category]: currentValues.filter(item => item !== value)
      });
    } else {
      onFilterChange({
        ...filters,
        [category]: [...currentValues, value]
      });
    }
  };

  const updateRating = (value) => {
    onFilterChange({
      ...filters,
      rating: value
    });
  };

  const resetAllFilters = () => {
    onFilterChange({
      rating: 0,
      type: [],
      location: [],
      features: []
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className="bg-white rounded-t-3xl p-5"
          style={{ 
            height: modalHeight,
            transform: [{ translateY: panY }] 
          }}
        >
          <View className="items-center mb-3" {...panResponder.panHandlers}>
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Transport Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={25} color="#006D77" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={true} className="mb-2" scrollEnabled={panY === 0}>
            {/* Type Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Transport Type</Text>
              <View className="flex-row flex-wrap">
                {typeOptions.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('type', type)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.type.includes(type) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.type.includes(type) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Location Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Location</Text>
              <View className="flex flex-wrap">
                {locationOptions.map((location) => (
                  <TouchableOpacity 
                    key={location}
                    className="flex-row items-center py-1 w-0/3"
                    onPress={() => toggleFilter('location', location)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.location.includes(location) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.location.includes(location) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{location}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Features Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Features</Text>
              <View className="flex-row flex-wrap">
                {featuresOptions.map((feature) => (
                  <TouchableOpacity 
                    key={feature}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('features', feature)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.features.includes(feature) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.features.includes(feature) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{feature}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Minimum Rating Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Minimum Rating</Text>
              <View className="flex-row justify-between items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => updateRating(star)}
                    className="flex-row items-center"
                  >
                    <Ionicons 
                      name={star <= filters.rating ? "star" : "star-outline"} 
                      size={24} 
                      color={star <= filters.rating ? "#f59e0b" : "#d1d5db"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-center text-gray-600 text-sm">
                {filters.rating > 0 ? `${filters.rating}+ stars` : "Any rating"}
              </Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            className="rounded-xl bg-cyan-700 py-3 mt-2"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold">Apply Filters</Text>
          </TouchableOpacity>
          <View className="py-3 mt-2 items-center">
            <TouchableOpacity onPress={resetAllFilters}>
              <Text className="text-cyan-700 text-md">Reset all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function Transport() {
  const navigation = useNavigation();
  const route = useRoute();
  const { searchQuery, transportType } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transports, setTransports] = useState([]);
  const [filteredTransports, setFilteredTransports] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [liked, setLiked] = useState({});
  const [apiError, setApiError] = useState(null);
  const [availableTransportTypes, setAvailableTransportTypes] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [availableFeatures, setAvailableFeatures] = useState([]);

  // Filter states - removed priceRange
  const [filters, setFilters] = useState({
    rating: 0,
    type: transportType ? [transportType] : [],
    location: [],
    features: []
  });

  const sortOptions = [
    "Recommended",
    "Rating: High to Low",
    "Rating: Low to High",
    "Most Reviews",
    "Distance: Nearest"
  ];

  // Fetch transports from API
  useEffect(() => {
    fetchTransports();
  }, []);

  const fetchTransports = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // API call to get transport agencies - Fixed API URL (removed extra 'p')
      const response = await axios.get(`${API_BASE_URL}/api/v1/transport-agencies`);
      
      if (response.data.success) {
        // Transform API data to match your component structure with safety checks
        const transformedTransports = response.data.data.map(agency => {
          // Get individual transport types for this agency with safety checks
          const transportTypes = (agency.transportTypes || [])
            .map(type => {
              const typeName = typeof type === 'string' ? type : (type?.name || 'Transport Service');
              return formatTransportType(typeName);
            })
            .filter(type => type && type.trim() !== ''); // Remove empty types

          // Ensure we have at least one transport type
          const safeTransportTypes = transportTypes.length > 0 ? transportTypes : ['Transport Service'];

          return {
            id: agency.id,
            name: agency.title || 'Transport Service',
            transportTypes: safeTransportTypes,
            type: safeTransportTypes.join(', '),
            // Removed price field
            rating: parseFloat((Math.random() * 1 + 4).toFixed(1)), // Keep rating for display
            reviews: Math.floor(Math.random() * 100) + 50,
            images: agency.images && agency.images.length > 0 
              ? agency.images.map(img => img.imageUrl)
              : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
            features: ['24/7 Support', 'Insurance Included', 'Free Cancellation'], // Default features
            location: agency.city || agency.district || 'Unknown Location',
            address: agency.address || 'Address not available',
            distance: `${(Math.random() * 10).toFixed(1)} km`,
            available: agency.isActive !== false,
            description: agency.description || 'Professional transport service',
            phone: agency.phone,
            email: agency.email,
            website: agency.website,
            isPopular: Math.random() > 0.5,
            serviceArea: agency.serviceArea,
            vistaVerified: agency.vistaVerified || false
          };
        });
        
        setTransports(transformedTransports);
        
        // Extract all unique data from all agencies for filters
        const allTypes = [...new Set(
          transformedTransports.flatMap(transport => transport.transportTypes || [])
        )].sort();
        
        const allLocations = [...new Set(
          transformedTransports.map(transport => transport.location).filter(location => location && location !== 'Unknown Location')
        )].sort();
        
        const allFeatures = [...new Set(
          transformedTransports.flatMap(transport => transport.features || [])
        )].sort();
        
        setAvailableTransportTypes(allTypes);
        setAvailableLocations(allLocations);
        setAvailableFeatures(allFeatures);
      } else {
        setApiError("Failed to fetch transports from server");
      }
    } catch (err) {
      console.error("API Error:", err);
      let errorMessage = "Failed to load transports. Please try again.";
      
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server error: ${err.response.status}. Please try again.`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection and try again.";
      } else {
        // Something else happened
        errorMessage = "An unexpected error occurred. Please try again.";
      }
      
      setApiError(errorMessage);
      setTransports([]); // Clear any previous data
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering with individual transport types
  useEffect(() => {
    if (loading) return;
    
    let results = transports;
    
    // Filter by search input (transport name, type, or location)
    if (searchInput) {
      const searchTerm = searchInput.toLowerCase();
      results = results.filter(transport => {
        const name = (transport.name || '').toLowerCase();
        const type = (transport.type || '').toLowerCase();
        const location = (transport.location || '').toLowerCase();
        const address = (transport.address || '').toLowerCase();
        const description = (transport.description || '').toLowerCase();
        
        return (
          name.includes(searchTerm) ||
          type.includes(searchTerm) ||
          location.includes(searchTerm) ||
          address.includes(searchTerm) ||
          description.includes(searchTerm)
        );
      });
    }
    
    // Filter by individual transport types if selected
    if (filters.type.length > 0) {
      results = results.filter(transport => 
        filters.type.some(selectedType => 
          (transport.transportTypes || []).some(transportType => 
            (transportType || '').toLowerCase().includes((selectedType || '').toLowerCase())
          )
        )
      );
    }
    
    // Filter by location if selected
    if (filters.location.length > 0) {
      results = results.filter(transport => 
        filters.location.some(loc => 
          (transport.location || '').toLowerCase().includes((loc || '').toLowerCase())
        )
      );
    }
    
    // Filter by features if selected
    if (filters.features.length > 0) {
      results = results.filter(transport => 
        filters.features.some(feature => 
          (transport.features || []).map(f => (f || '').toLowerCase()).includes((feature || '').toLowerCase())
        )
      );
    }
    
    // Filter by minimum rating
    if (filters.rating > 0) {
      results = results.filter(transport => 
        transport.rating >= filters.rating
      );
    }
    
    // Filter by availability
    results = results.filter(transport => transport.available !== false);
    
    // Sort results - removed price sorting options
    switch(selectedSort) {
      case "Rating: High to Low":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "Rating: Low to High":
        results.sort((a, b) => a.rating - b.rating);
        break;
      case "Most Reviews":
        results.sort((a, b) => b.reviews - a.reviews);
        break;
      case "Distance: Nearest":
        results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        // Recommended (by rating and popularity)
        results.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.rating - a.rating;
        });
    }
    
    setFilteredTransports(results);
  }, [transports, searchInput, filters, selectedSort, loading]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTransports();
    setRefreshing(false);
  };

  const retryFetch = () => {
    fetchTransports();
  };

  const resetAllFilters = () => {
    setFilters({
      rating: 0,
      type: [],
      location: [],
      features: []
    });
  };

  const clearSearch = () => {
    setSearchInput('');
  };

  const clearTypeFilter = () => {
    setFilters(prev => ({ ...prev, type: [] }));
  };

  const clearLocationFilter = () => {
    setFilters(prev => ({ ...prev, location: [] }));
  };

  const handleTransportSelect = (transport) => {
    navigation.navigate('TransportDetailsView', {
      transport
    });
  };

  const toggleLike = (transportId) => {
    setLiked(prev => ({
      ...prev,
      [transportId]: !prev[transportId]
    }));
  };

  const renderStarRating = (rating, size = 14) => {
    const safeRating = rating || 0;
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= safeRating ? "star" : "star-outline"}
            size={size}
            color={star <= safeRating ? "#f59e0b" : "#d1d5db"}
          />
        ))}
      </View>
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  const renderTransportItem = ({ item }) => {
    // Ensure transportTypes exists with safety check
    const transportTypes = item.transportTypes || [item.type || 'Transport Service'];
    
    return (
      <TouchableOpacity 
        className="mb-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
        onPress={() => handleTransportSelect(item)}
      >
        <View className="flex-row">
          {/* Transport Image */}
          <View className="relative">
            <Image
              source={{ uri: item.images?.[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop' }}
              className="w-28 h-28 rounded-lg"
              resizeMode="cover"
            />
            
            {item.isPopular && (
              <View className="absolute top-1 left-1 bg-amber-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">Popular</Text>
              </View>
            )}
            {item.vistaVerified && (
              <View className="absolute top-1 right-1 bg-green-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">Verified</Text>
              </View>
            )}
            {!item.available && (
              <View className="absolute inset-0 bg-black/50 rounded-lg items-center justify-center">
                <Text className="text-white font-bold text-sm">Unavailable</Text>
              </View>
            )}
          </View>

          {/* Transport Info */}
          <View className="flex-1 ml-4">
            <View className="flex-row justify-between items-start">
              <Text className="text-lg font-semibold text-gray-800 flex-1 mr-5 pr-5" numberOfLines={5}>
                {item.name || 'Transport Service'}
              </Text>
              <TouchableOpacity 
                className="absolute top-1 right-1 w-8 h-8 rounded-full bg-[#dfebec] items-center justify-center shadow"
                onPress={(e) => {
                  e.stopPropagation();
                  toggleLike(item.id);
                }}
              >
                <Ionicons
                  name={liked[item.id] ? "heart" : "heart-outline"}
                  size={20}
                  color={liked[item.id] ? "red" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>

            {/* Individual Transport Type Tags with safety check */}
            <View className="flex-row flex-wrap mt-1">
              {transportTypes.slice(0, 3).map((type, index) => (
                <View key={index} className="bg-cyan-50 rounded-full px-2 py-1 mr-2 mb-1">
                  <Text className="text-xs text-cyan-700 font-medium">{type}</Text>
                </View>
              ))}
              {transportTypes.length > 3 && (
                <Text className="text-xs text-gray-500">+{transportTypes.length - 3}</Text>
              )}
            </View>

            <View className="flex-row items-center mt-1">
              <MaterialIcons name="location-on" size={14} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600 flex-1" numberOfLines={5}>
                {item.location || 'Unknown Location'} • {item.distance || '0 km'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center">
                {renderStarRating(item.rating || 0)}
                <Text className="ml-2 text-xs text-gray-500">({item.reviews || 0})</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap mt-2">
              {(item.features || []).slice(0, 2).map((feature, index) => (
                <View key={index} className="bg-[#dfebec] rounded-full px-2 py-1 mr-2 mb-1">
                  <Text className="text-xs text-gray-700">{feature}</Text>
                </View>
              ))}
              {(item.features || []).length > 2 && (
                <Text className="text-xs text-gray-500">+{(item.features || []).length - 2}</Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Show API error screen when there's an error and no data
  if (apiError && transports.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Ionicons name="warning-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">{apiError}</Text>
        <TouchableOpacity 
          className="mt-6 bg-[#006D77] rounded-full px-6 py-3"
          onPress={retryFetch}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="mt-3 bg-gray-200 rounded-full px-6 py-3"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with search bar */}
      <View className="bg-white px-4 py-3 shadow-sm flex-row items-center">
        <TouchableOpacity 
          className="rounded-full p-3 mr-2 bg-gray-100"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#006D77" />
        </TouchableOpacity>
        
        <View className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-full px-4 py-2 bg-white">
          <View className="flex-row items-center flex-1">
            <Ionicons name="search" size={20} color="#006D77" />
            <TextInput
              className="ml-3 flex-1 text-base font-semibold text-gray-800"
              placeholder="Search transports, types, or locations..."
              value={searchInput}
              onChangeText={setSearchInput}
              onSubmitEditing={() => setSearchInput(searchInput.trim())}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" size={20} color="#006D77" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Error Message (for non-fatal errors when we have some data) */}
      {apiError && transports.length > 0 && (
        <View className="bg-red-50 border border-red-200 mx-4 mt-3 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-red-700 flex-1">{apiError}</Text>
            <TouchableOpacity onPress={retryFetch} className="ml-2">
              <MaterialIcons name="refresh" size={20} color="#006D77" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Filters Bar */}
      {(filters.type.length > 0 || filters.location.length > 0 || searchInput) && (
        <View className="bg-white px-4 py-1 border-b border-gray-200">
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {searchInput && (
              <View className="flex-row items-center bg-cyan-50 rounded-full px-3 py-1 mr-2">
                <Text className="text-cyan-700 text-sm font-medium">Search: {searchInput}</Text>
                <TouchableOpacity onPress={clearSearch} className="ml-2">
                  <Ionicons name="close" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            )}
            {filters.type.map((type, index) => (
              <View key={index} className="flex-row items-center bg-cyan-50 rounded-full px-3 py-1 mr-2">
                <Text className="text-cyan-700 text-sm font-medium">{type}</Text>
                <TouchableOpacity onPress={clearTypeFilter} className="ml-2">
                  <Ionicons name="close" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            ))}
            {filters.location.map((loc, index) => (
              <View key={index} className="flex-row items-center bg-cyan-50 rounded-full px-3 py-1 mr-2">
                <Text className="text-cyan-700 text-sm font-medium">{loc}</Text>
                <TouchableOpacity onPress={clearLocationFilter} className="ml-2">
                  <Ionicons name="close" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView> */}
        </View>
      )}

      {/* Filter Bar */}
      <View className="flex-row justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setSortModalVisible(true)}
        >
          <MaterialIcons name="sort" size={18} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">Sort</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setFilterModalVisible(true)}
        >
          <FontAwesome name="filter" size={16} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">
            Filter {getActiveFiltersCount() > 0 ? `(${getActiveFiltersCount()})` : ''}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setMapModalVisible(true)}
        >
          <Entypo name="map" size={18} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">Map</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View className="px-4 py-3 bg-white mt-1">
        <Text className="text-gray-600">{filteredTransports.length} transports found</Text>
        {searchInput && (
          <Text className="text-gray-500 text-xs mt-1">
            Searching for {searchInput}
          </Text>
        )}
        {(filters.type.length > 0 || filters.location.length > 0) && (
          <Text className="text-gray-500 text-xs mt-1">
            {filters.type.length > 0 && `${filters.type.join(', ')} type`}
            {filters.type.length > 0 && filters.location.length > 0 && ' • '}
            {filters.location.length > 0 && `in ${filters.location.join(', ')}`}
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006D77" />
          <Text className="mt-4 text-gray-600">Loading transports from API...</Text>
        </View>
      )}

      {/* Transports List */}
      {!loading && (
        <View className="flex-1 px-4 py-3">
          {filteredTransports.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">No transports found</Text>
              <Text className="text-gray-500 text-center mt-2">
                {searchInput || filters.type.length > 0 || filters.location.length > 0 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'No transports available in this area'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredTransports}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={renderTransportItem}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#006D77']}
                />
              }
              ListFooterComponent={<View className="h-20" />}
            />
          )}
        </View>
      )}

      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4">Sort by</Text>
            
            {sortOptions.map((option) => (
              <TouchableOpacity 
                key={option}
                className="py-4 border-b border-gray-100"
                onPress={() => {
                  setSelectedSort(option);
                  setSortModalVisible(false);
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-lg ${selectedSort === option ? 'text-cyan-700 font-semibold' : 'text-gray-700'}`}>
                    {option}
                  </Text>
                  {selectedSort === option && (
                    <Ionicons name="checkmark" size={20} color="#006D77" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              className="mt-4 rounded-xl bg-gray-100 py-4"
              onPress={() => setSortModalVisible(false)}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Transport Filter Modal */}
      <TransportFilter
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
        availableTypes={availableTransportTypes}
        availableLocations={availableLocations}
        availableFeatures={availableFeatures}
      />

      {/* Map Modal - Placeholder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mapModalVisible}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 h-4/5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Map View</Text>
              <TouchableOpacity onPress={() => setMapModalVisible(false)}>
                <Ionicons name="close" size={24} color="#006D77" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-1 bg-gray-200 items-center justify-center rounded-xl mb-4">
              <Text className="text-gray-500">Transports map would be displayed here</Text>
              <Text className="text-gray-400 text-sm mt-2">
                {filteredTransports.length} transports in this area
              </Text>
            </View>
            
            <TouchableOpacity 
              className="rounded-xl bg-[#006D77] py-4"
              onPress={() => setMapModalVisible(false)}
            >
              <Text className="text-center text-white font-semibold">Close Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}