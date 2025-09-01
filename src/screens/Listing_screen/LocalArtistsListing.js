import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

  // Category icons mapping
  const categoryIcons = {
    "Painting": "palette",
    "Sculpture": "cube",
    "Photography": "camera",
    "Music": "music",
    "Pottery": "circle",
    "Digital Art": "laptop",
    "Textile Art": "cut",
    "Performance": "theater-masks"
  };

  // Sample local artists data with additional details
  const artistsData = [
    {
      id: 1,
      name: "Emma Thompson",
      category: "Painting",
      images: [
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXJ0aXN0fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Downtown Arts District",
      rating: 4.8,
      price: "$$$",
      specialty: "Oil Paintings, Landscapes",
      website: "https://emmathompsonart.com",
      email: "emma@thompsonart.com",
      phone: "+1 (555) 123-4567",
      socialMedia: {
        instagram: "@emma_artist",
        facebook: "EmmaThompsonArt",
        youtube: "jafran"
      },
      performanceDetails: {
        duration: "2-3 hours",
        groupSize: "Up to 10 people",
        requirements: "Well-lit space, easels provided"
      },
      languages: ["English", "Spanish"],
      cancellationPolicy: "48 hours notice for full refund",
      performanceHistory: "Exhibited in 5 national galleries, 10+ years experience",
      reviews: [
        {
          id: 1,
          user: "Sarah Johnson",
          rating: 5,
          comment: "Emma's painting workshop was incredible! She's so talented and patient with beginners.",
          date: "2023-10-15",
          userImage: "https://randomuser.me/api/portraits/women/12.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      category: "Sculpture",
      images: [
        "https://images.unsplash.com/photo-1544168190-79c17527004f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFydGlzdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1501084817091-a4f3d1d19e07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGFydGlzdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Riverfront Studios",
      rating: 4.9,
      price: "$$$$",
      specialty: "Metal Sculptures, Abstract Art",
      website: "https://michaelsculptures.com",
      email: "michael@rodriguezart.com",
      phone: "+1 (555) 234-5678",
      socialMedia: {
        instagram: "@michael_sculpts",
        facebook: "MichaelRodriguezSculptures"
      },
      performanceDetails: {
        duration: "3-4 hours",
        groupSize: "Up to 8 people",
        requirements: "Outdoor space preferred, all materials provided"
      },
      languages: ["English", "French"],
      cancellationPolicy: "72 hours notice for full refund",
      performanceHistory: "International exhibitions, public installations in 3 cities",
      reviews: [
        {
          id: 1,
          user: "David Kim",
          rating: 5,
          comment: "Michael's sculpture workshop was transformative. His expertise with metal is unmatched.",
          date: "2023-10-12",
          userImage: "https://randomuser.me/api/portraits/men/22.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Sophia Chen",
      category: "Photography",
      images: [
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cGhvdG9ncmFwaGVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "City Center Gallery",
      rating: 4.7,
      price: "$$",
      specialty: "Nature Photography, Portraits",
      website: "https://sophiachenphotography.com",
      email: "sophia@chenphoto.com",
      phone: "+1 (555) 345-6789",
      socialMedia: {
        instagram: "@sophia_photos",
        facebook: "SophiaChenPhotography"
      },
      performanceDetails: {
        duration: "2 hours",
        groupSize: "Up to 6 people",
        requirements: "DSLR camera recommended but not required"
      },
      languages: ["English", "Mandarin"],
      cancellationPolicy: "24 hours notice for full refund",
      performanceHistory: "Published in National Geographic, 8 years professional experience",
      reviews: [
        {
          id: 1,
          user: "Lisa Wang",
          rating: 5,
          comment: "Sophia's photography workshop improved my skills dramatically. Her feedback was invaluable.",
          date: "2023-10-10",
          userImage: "https://randomuser.me/api/portraits/women/32.jpg"
        }
      ]
    },
    // Add more artists following the same pattern...
  ];

  const categories = ["Painting", "Sculpture", "Photography", "Music", "Pottery", "Digital Art", "Textile Art", "Performance"];
  const locations = ["Downtown Arts District", "Riverfront Studios", "City Center Gallery", "West End Cultural Center", "Eastside Art Collective", "North Park Creative Space"];
  const priceRanges = ["$", "$$", "$$$", "$$$$"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" },
    { id: "price", label: "Price: Low to High", icon: "sort-numeric-ascending" },
    { id: "priceDesc", label: "Price: High to Low", icon: "sort-numeric-descending" }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredArtists(artistsData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

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
                <View className="w-24 h-24 rounded-xl overflow-hidden mr-4 relative">
                  <Image 
                    source={{ uri: item.images?.[0] }} 
                    className="w-full h-full"
                    resizeMode="cover"
                  />
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
                    <Text className="text-lg font-bold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity 
                      onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(item.website);
                      }}
                      className="p-2 bg-gray-100 rounded-full"
                    >
                      <Feather name="external-link" size={16} color="#006D77" />
                    </TouchableOpacity>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1">{item.location}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars(item.rating)}
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <FontAwesome 
                        name={categoryIcons[item.category]} 
                        size={14} 
                        color="#006D77" 
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-gray-500 text-sm">{item.category}</Text>
                    </View>
                    {renderPriceRange(item.price)}
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="brush" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                      {item.specialty}
                    </Text>
                  </View>
                  
                  <View className="flex-row mt-3">
                    <TouchableOpacity 
                      className="p-2 bg-gray-100 rounded-full mr-2"
                      onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(`tel:${item.phone}`);
                      }}
                    >
                      <Feather name="phone" size={16} color="#006D77" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      className="p-2 bg-gray-100 rounded-full mr-2"
                      onPress={(e) => {
                        e.stopPropagation();
                        Linking.openURL(`mailto:${item.email}`);
                      }}
                    >
                      <Feather name="mail" size={16} color="#006D77" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                className="mt-4 bg-[#E6F6F8] p-3 rounded-xl flex-row items-center justify-between"
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.8}
              >
                <Text className="text-[#006D77] font-semibold">View Details & Contact</Text>
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
                        name={categoryIcons[category]} 
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
              <View className="mb-6">
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

export default LocalArtistsListing;