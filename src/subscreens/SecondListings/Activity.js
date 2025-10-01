import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ActivityFilter from '../../../components/ActivityFilter';
import axios from 'axios';

// API_BASE_URL should be defined in your .env file
const API_BASE_URL = process.env.API_BASE_URL;

const { width: screenWidth } = Dimensions.get('window');

export default function Activity() {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchQuery, activityType, location } = route.params || {};

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery || '');
  const [activityTypeInput, setActivityTypeInput] = useState(activityType || '');
  const [locationInput, setLocationInput] = useState(location || '');
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [apiError, setApiError] = useState(null);
  const [wishlist, setWishlist] = useState([]);

  // Filter states - updated for database fields
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    type: [],
    city: [],
    district: [],
    vistaVerified: false,
    rating: 0
  });

  const sortOptions = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Rating"
  ];

  // Fetch activities from API
  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/activities`);
      
      if (response.data.success) {
        const transformedActivities = response.data.data.map(activity => ({
          id: activity.id,
          title: activity.title,
          type: activity.type,
          city: activity.city,
          district: activity.district,
          price: parseInt(activity.pricerange) || 50,
          vistaVerified: activity.vistaVerified || false,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 100) + 50,
          duration: '4 hours',
          difficulty: 'Moderate',
          images: activity.images && activity.images.length > 0 
            ? activity.images.map(img => img.imageUrl)
            : ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
          description: activity.description || 'No description available',
          highlights: [
            'Professional guide',
            activity.type ? `${activity.type} experience` : 'Local experience',
            activity.vistaVerified ? 'Vista Verified' : 'Local operator'
          ].filter(Boolean)
        }));
        
        setActivities(transformedActivities);
        
        const initialIndexes = {};
        transformedActivities.forEach(activity => {
          initialIndexes[activity.id] = 0;
        });
        setCurrentImageIndexes(initialIndexes);
      } else {
        setApiError("Failed to fetch activities from server");
      }
    } catch (err) {
      console.error("API Error:", err);
      setApiError("Failed to load activities. Please check your connection and try again.");
      setActivities([]); // Clear activities on error
    } finally {
      setLoading(false);
    }
  };

  // Enhanced filtering with database fields
  useEffect(() => {
    if (loading) return;
    
    let results = activities;
    
    // Filter by search input
    if (searchInput) {
      const searchTerm = searchInput.toLowerCase();
      results = results.filter(activity => 
        activity.title?.toLowerCase().includes(searchTerm) ||
        activity.description?.toLowerCase().includes(searchTerm) ||
        activity.type?.toLowerCase().includes(searchTerm) ||
        activity.city?.toLowerCase().includes(searchTerm) ||
        activity.district?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by activity type if provided
    if (activityTypeInput) {
      results = results.filter(activity => 
        activity.type?.toLowerCase().includes(activityTypeInput.toLowerCase())
      );
    }
    
    // Filter by location if provided
    if (locationInput) {
      results = results.filter(activity => 
        activity.city?.toLowerCase().includes(locationInput.toLowerCase()) ||
        activity.district?.toLowerCase().includes(locationInput.toLowerCase())
      );
    }
    
    // Filter by price range
    results = results.filter(activity => 
      activity.price >= filters.priceRange[0] && 
      activity.price <= filters.priceRange[1]
    );
    
    // Filter by type if selected
    if (filters.type.length > 0) {
      results = results.filter(activity => 
        filters.type.includes(activity.type)
      );
    }
    
    // Filter by city if selected
    if (filters.city.length > 0) {
      results = results.filter(activity => 
        filters.city.includes(activity.city)
      );
    }
    
    // Filter by district if selected
    if (filters.district.length > 0) {
      results = results.filter(activity => 
        filters.district.includes(activity.district)
      );
    }
    
    // Filter by Vista Verified
    if (filters.vistaVerified) {
      results = results.filter(activity => 
        activity.vistaVerified === true
      );
    }
    
    // Filter by minimum rating
    if (filters.rating > 0) {
      results = results.filter(activity => 
        activity.rating >= filters.rating
      );
    }
    
    // Sort results
    switch(selectedSort) {
      case "Price: Low to High":
        results.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        results.sort((a, b) => b.price - a.price);
        break;
      case "Rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        results.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredActivities(results);
  }, [activities, searchInput, activityTypeInput, locationInput, filters, selectedSort, loading]);

  // Wishlist functions
  const toggleWishlist = (activityId) => {
    setWishlist(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const clearSearch = () => {
    setSearchInput('');
  };

  const clearActivityType = () => {
    setActivityTypeInput('');
  };

  const clearLocation = () => {
    setLocationInput('');
  };

  const handleActivitySelect = (activity) => {
    navigation.navigate('ActivityDetailsView', {
      activity
    });
  };

  const retryFetch = () => {
    setApiError(null);
    fetchActivities();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type.length > 0) count++;
    if (filters.city.length > 0) count++;
    if (filters.district.length > 0) count++;
    if (filters.vistaVerified) count++;
    if (filters.rating > 0) count++;
    return count;
  };

  // Show error screen when API fails and no activities are loaded
  if (apiError && activities.length === 0) {
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

  const renderActivityItem = ({ item }) => {
    const currentIndex = currentImageIndexes[item.id] || 0;
    const totalImages = item.images.length;
    const isWishlisted = wishlist.includes(item.id);

    return (
      <TouchableOpacity 
        className="mb-4 rounded-xl bg-white p-4 shadow-sm border border-gray-100"
        onPress={() => handleActivitySelect(item)}
      >
        {/* Image with Wishlist Heart */}
        <View className="mb-3 h-48 w-full overflow-hidden rounded-lg relative">
          <Image
            source={{ uri: item.images[currentIndex] }}
            className="h-full w-full"
            resizeMode="cover"
          />
          
          {/* Vista Verified Badge */}
          {item.vistaVerified && (
            <View className="absolute top-2 left-2 bg-green-500 rounded-full px-2 py-1 flex-row items-center">
              <Ionicons name="shield-checkmark" size={12} color="white" />
              <Text className="text-white text-xs font-medium ml-1">Verified</Text>
            </View>
          )}
          
          {/* Wishlist Heart */}
          <TouchableOpacity 
            className="absolute top-2 right-2 bg-white/90 rounded-full p-2"
            onPress={(e) => {
              e.stopPropagation();
              toggleWishlist(item.id);
            }}
          >
            <Ionicons 
              name={isWishlisted ? "heart" : "heart-outline"} 
              size={20} 
              color={isWishlisted ? "#ef4444" : "#374151"} 
            />
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold text-gray-800">
          {item.title}
        </Text>

        <View className="mt-2 flex-row items-center">
          <MaterialIcons name="access-time" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600">
            {item.duration}
          </Text>

          <View className="mx-3 h-4 w-px bg-gray-300" />

          <MaterialIcons name="terrain" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600">
            {item.difficulty}
          </Text>
        </View>

        <View className="mt-1 flex-row items-center">
          <MaterialIcons name="location-on" size={16} color="#6b7280" />
          <Text className="ml-1 text-sm text-gray-600">
            {item.city}, {item.district}
          </Text>
        </View>

        {/* Activity Type Tags */}
        <View className="flex-row flex-wrap mt-2">
          {item.type && (
            <View className="bg-cyan-50 rounded-full px-3 py-1 mr-2 mb-1">
              <Text className="text-xs text-cyan-700 font-medium">{item.type}</Text>
            </View>
          )}
        </View>

        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <MaterialIcons name="star" size={16} color="#f59e0b" />
            <Text className="ml-1 text-sm text-gray-700">
              {item.rating}
            </Text>
            <Text className="ml-1 text-sm text-gray-500">
              ({item.reviews} reviews)
            </Text>
          </View>

          <Text className="text-lg font-bold text-black">
            ${item.price}
          </Text>
        </View>

        {/* Highlights Preview */}
        <View className="mt-2 flex-row flex-wrap">
          {item.highlights.slice(0, 2).map((highlight, index) => (
            <View key={index} className="flex-row items-center mr-3 mb-1">
              <Ionicons name="checkmark-circle" size={14} color="#10b981" />
              <Text className="ml-1 text-xs text-gray-600">{highlight}</Text>
            </View>
          ))}
          {item.highlights.length > 2 && (
            <Text className="text-xs text-gray-500">
              +{item.highlights.length - 2} more
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with enhanced search bar */}
      <View className="bg-white px-4 py-3 shadow-sm">
        <View className="flex-row items-center">
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
                placeholder="Search activities, types, or locations..."
                value={searchInput}
                onChangeText={setSearchInput}
                onSubmitEditing={() => setSearchInput(searchInput.trim())}
                returnKeyType="search"
              />
            </View>
            {searchInput.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <MaterialIcons name="close" size={20} color="#006D77" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Error Message (for partial errors when some activities are loaded) */}
      {apiError && activities.length > 0 && (
        <View className="bg-yellow-50 border border-yellow-200 mx-4 mt-3 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="warning" size={20} color="#d97706" />
              <Text className="text-yellow-700 ml-2 flex-1">{apiError}</Text>
            </View>
            <TouchableOpacity onPress={retryFetch} className="ml-2">
              <MaterialIcons name="refresh" size={20} color="#006D77" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Active Filters Bar */}
      {(activityTypeInput || locationInput || searchInput) && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {activityTypeInput && (
              <View className="flex-row items-center bg-cyan-50 rounded-full px-3 py-1 mr-2">
                <Text className="text-cyan-700 text-sm font-medium">{activityTypeInput}</Text>
                <TouchableOpacity onPress={clearActivityType} className="ml-2">
                  <Ionicons name="close" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            )}
            {locationInput && (
              <View className="flex-row items-center bg-cyan-50 rounded-full px-3 py-1 mr-2">
                <Text className="text-cyan-700 text-sm font-medium">{locationInput}</Text>
                <TouchableOpacity onPress={clearLocation} className="ml-2">
                  <Ionicons name="close" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
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
        <Text className="text-gray-600">{filteredActivities.length} activities found</Text>
        {searchInput && (
          <Text className="text-gray-500 text-xs mt-1">
            Searching for "{searchInput}"
          </Text>
        )}
        {(activityTypeInput || locationInput) && (
          <Text className="text-gray-500 text-xs mt-1">
            {activityTypeInput && `${activityTypeInput} activities`}
            {activityTypeInput && locationInput && ' • '}
            {locationInput && `in ${locationInput}`}
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006D77" />
          <Text className="mt-4 text-gray-600">Loading activities...</Text>
        </View>
      )}

      {/* Activities List */}
      {!loading && (
        <View className="flex-1 px-4 py-3">
          {filteredActivities.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">No activities found</Text>
              <Text className="text-gray-500 text-center mt-2">
                {searchInput || activityTypeInput || locationInput 
                  ? 'Try adjusting your search criteria or filters' 
                  : 'No activities available'
                }
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredActivities}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderActivityItem}
              showsVerticalScrollIndicator={false}
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

      {/* Filter Modal */}
      <ActivityFilter
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
        activities={activities} // Pass activities data to filter
      />

      {/* Map Modal */}
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
              <Text className="text-gray-500">Activities map would be displayed here</Text>
              <Text className="text-gray-400 text-sm mt-2">
                {filteredActivities.length} activities in this area
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