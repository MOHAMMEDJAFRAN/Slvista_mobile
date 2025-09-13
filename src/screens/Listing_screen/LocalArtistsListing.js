import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const LocalArtistsListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    location: [],
    priceRange: [],
    sortBy: "recommended"
  });
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [artistsData, setArtistsData] = useState([]);
  const [error, setError] = useState(null);

  // Category icons mapping
  const categoryIcons = {
    "Painting": "palette",
    "Sculpture": "cube",
    "Photography": "camera",
    "Music": "music",
    "Pottery": "circle",
    "Digital Art": "digital",
    "Textile Art": "cut",
    "Performance": "theater-masks",
    "sdfasaef": "palette" // Default icon for your API category
  };

  // Fetch artists from API
  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/local-artists`);
      
      if (response.data.success) {
        // Transform API data to match your component structure
        const transformedData = response.data.data.map(artist => ({
          id: artist.id,
          name: artist.name,
          category: artist.artistTypes?.[0]?.name || "sdfasaef", // Use first artist type or default
          images: artist.images?.map(img => img.imageUrl) || [],
          location: artist.city || "Unknown Location",
          rating: artist.rating || 4.5, // Default rating since API doesn't provide
          price: "$$", // Default price
          specialty: artist.specialization || "No specialization provided",
          website: artist.website || "#",
          email: artist.email || "",
          phone: artist.phone || "",
          socialMedia: {
            instagram: "",
            facebook: "",
            youtube: ""
          },
          performanceDetails: {
            duration: "2-3 hours",
            groupSize: "Up to 10 people",
            requirements: "Contact for details"
          },
          languages: ["English"],
          cancellationPolicy: "Contact for details",
          performanceHistory: artist.description || "No description provided",
          reviews: [],
          isActive: artist.isActive || true // Add active status from API, default to true
        }));
        
        setArtistsData(transformedData);
        setFilteredArtists(transformedData);
      } else {
        setError("Failed to fetch artists");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load artists. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Extract unique categories from API data
  const getCategoriesFromData = () => {
    const categories = new Set();
    artistsData.forEach(artist => {
      if (artist.category) {
        categories.add(artist.category);
      }
    });
    return Array.from(categories);
  };

  // Extract unique locations from API data
  const getLocationsFromData = () => {
    const locations = new Set();
    artistsData.forEach(artist => {
      if (artist.location && artist.location !== "Unknown Location") {
        locations.add(artist.location);
      }
    });
    return Array.from(locations);
  };

  const categories = getCategoriesFromData();
  const locations = getLocationsFromData();
  const priceRanges = ["$", "$$", "$$$", "$$$$"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" },
    // { id: "price", label: "Price: Low to High", icon: "sort-numeric-ascending" },
    // { id: "priceDesc", label: "Price: High to Low", icon: "sort-numeric-descending" }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchArtists();
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters, artistsData]);

  const applyFiltersToData = () => {
    let result = [...artistsData];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(artist => 
        activeFilters.category.includes(artist.category)
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(artist => 
        activeFilters.location.includes(artist.location)
      );
    }
    
    // Apply price range filter
    if (activeFilters.priceRange.length > 0) {
      result = result.filter(artist => 
        activeFilters.priceRange.includes(artist.price)
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
      case "price":
        result.sort((a, b) => a.price.length - b.price.length);
        break;
      case "priceDesc":
        result.sort((a, b) => b.price.length - a.price.length);
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredArtists(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "category" || filterType === "location" || filterType === "priceRange") {
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
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("ArtistDetails", { artistItem: item });
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

  const renderPriceRange = (price) => {
    return (
      <View className="flex-row">
        {price.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading local artists...</Text>
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
          onPress={fetchArtists}
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
          <Text className="text-white text-xl font-bold ml-4">Local Artists</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceRange.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.category.length + activeFilters.location.length + activeFilters.priceRange.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredArtists.length} of {artistsData.length} artists
        </Text>
        {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceRange.length > 0) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Artists Listings */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {filteredArtists.length > 0 ? (
          filteredArtists.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5 border border-gray-100"
              onPress={() => handleViewDetails(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row">
                <View className="w-28 h-28 rounded-xl overflow-hidden mr-4 relative">
                  <Image 
                    source={{ uri: item.images?.[0] || "https://via.placeholder.com/100x100?text=No+Image" }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {/* Active Status Badge */}
                  <View className="absolute top-2 left-2 flex-row">
                    {/* Active Status Indicator */}
                    <View className={`rounded-full px-2 py-1 flex-row items-center ${item.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Ionicons 
                        name={item.isActive ? 'checkmark' : 'close'} 
                        size={12} 
                        color={item.isActive ? '#16a34a' : '#dc2626'} 
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
                    
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1 mr-5">{item.location}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars(item.rating)}
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <FontAwesome 
                        name={categoryIcons[item.category] || "palette"} 
                        size={14} 
                        color="#006D77" 
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-gray-500 text-sm mr-5">{item.category}</Text>
                    </View>
                    {/* {renderPriceRange(item.price)} */}
                  </View>
                  
                  {/* <View className="flex-row items-center mt-2">
                    <Ionicons name="brush" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                      {item.specialty}
                    </Text>
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
            <MaterialCommunityIcons name="palette" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No artists found
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
                <Text className="text-lg font-semibold text-gray-800 mb-3">Art Category</Text>
                <View className="flex-row flex-wrap">
                  {categories.map((category) => (
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
                        name={categoryIcons[category] || "palette"} 
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

export default LocalArtistsListing;