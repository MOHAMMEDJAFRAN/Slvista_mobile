import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

  // Category icons mapping
  const categoryIcons = {
    "Shopping Mall": "shopping-cart",
    "Local Market": "store",
    "Fashion": "tshirt",
    "Electronics": "mobile",
    "Home Goods": "home",
    "Food Market": "shopping-basket",
    "Antiques": "history",
    "Sports": "futbol-o"
  };

  // Sample shopping data with additional details
  const shoppingData = [
    {
      id: 1,
      name: "City Center Mall",
      category: "Shopping Mall",
      images: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcHBpbmclMjBtYWxsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1590649880760-2d4b0f523de7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvcHBpbmclMjBtYWxsfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Downtown District",
      rating: 4.5,
      priceRange: "$$$",
      availability: "Open Now",
      website: "https://citycentermall.com",
      email: "info@citycentermall.com",
      phone: "+1 (555) 123-4567",
      hours: "9:00 AM - 10:00 PM",
      description: "Largest shopping mall in the city with 200+ stores, food court, cinema, and entertainment facilities.",
      products: [
        { name: "Clothing", price: "$20-$200" },
        { name: "Electronics", price: "$50-$2000" },
        { name: "Home Decor", price: "$15-$500" },
        { name: "Jewelry", price: "$30-$1500" }
      ],
      reviews: [
        {
          id: 1,
          user: "Sarah Johnson",
          rating: 5,
          comment: "Great mall with a wide variety of stores. The food court has excellent options!",
          date: "2023-10-15",
          userImage: "https://randomuser.me/api/portraits/women/12.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Artisan Craft Market",
      category: "Local Market",
      images: [
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aXNhbiUyMG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hcmtldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Old Town Square",
      rating: 4.8,
      priceRange: "$$",
      availability: "Open Now",
      website: "https://artisanmarket.com",
      email: "contact@artisanmarket.com",
      phone: "+1 (555) 234-5678",
      hours: "8:00 AM - 8:00 PM",
      description: "Charming market featuring handmade crafts, local artisans, and unique souvenirs. Perfect for finding one-of-a-kind items.",
      products: [
        { name: "Handmade Jewelry", price: "$15-$120" },
        { name: "Pottery", price: "$25-$200" },
        { name: "Textiles", price: "$20-$150" },
        { name: "Wood Crafts", price: "$30-$250" }
      ],
      reviews: [
        {
          id: 1,
          user: "Mike Thompson",
          rating: 4,
          comment: "Loved the unique handmade items. Great place to find special gifts.",
          date: "2023-10-12",
          userImage: "https://randomuser.me/api/portraits/men/22.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Tech Gadget Hub",
      category: "Electronics",
      images: [
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGVsZWN0cm9uaWNzJTIwc3RvcmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVsZWN0cm9uaWNzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Tech Plaza",
      rating: 4.6,
      priceRange: "$$$",
      availability: "Open Now",
      website: "https://techgadgethub.com",
      email: "support@techgadgethub.com",
      phone: "+1 (555) 345-6789",
      hours: "10:00 AM - 9:00 PM",
      description: "Premiere destination for the latest gadgets, electronics, and tech accessories. Expert staff available for consultations.",
      products: [
        { name: "Smartphones", price: "$200-$1500" },
        { name: "Laptops", price: "$500-$3000" },
        { name: "Headphones", price: "$50-$400" },
        { name: "Smart Watches", price: "$150-$800" }
      ],
      reviews: [
        {
          id: 1,
          user: "David Kim",
          rating: 5,
          comment: "Best place for tech gadgets! Knowledgeable staff and great prices.",
          date: "2023-10-10",
          userImage: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      ]
    },
    {
      id: 4,
      name: "Fresh Produce Market",
      category: "Food Market",
      images: [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeSUyMHN0b3JlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnJlc2glMjBwcm9kdWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Farmers Market Area",
      rating: 4.7,
      priceRange: "$",
      availability: "Closed",
      website: "https://freshproducemarket.com",
      email: "hello@freshproducemarket.com",
      phone: "+1 (555) 456-7890",
      hours: "7:00 AM - 6:00 PM",
      description: "Vibrant market offering fresh fruits, vegetables, and local produce. Supporting local farmers and sustainable agriculture.",
      products: [
        { name: "Fresh Fruits", price: "$2-$10" },
        { name: "Vegetables", price: "$1-$8" },
        { name: "Organic Products", price: "$3-$15" },
        { name: "Local Honey", price: "$8-$20" }
      ],
      reviews: [
        {
          id: 1,
          user: "Emma Wilson",
          rating: 4,
          comment: "Fresh and affordable produce. Love supporting local farmers!",
          date: "2023-10-08",
          userImage: "https://randomuser.me/api/portraits/women/42.jpg"
        }
      ]
    },
    // Add more shopping destinations following the same pattern...
  ];

  const categories = ["Shopping Mall", "Local Market", "Fashion", "Electronics", "Home Goods", "Food Market", "Antiques", "Sports"];
  const locations = ["Downtown District", "Old Town Square", "Tech Plaza", "Farmers Market Area", "Fashion District", "Design District", "Historic District", "Stadium Complex"];
  const priceRanges = ["$", "$$", "$$$", "$$$$"];
  const availabilityOptions = ["Open Now", "Closed"];
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
      setFilteredData(shoppingData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

  const applyFiltersToData = () => {
    let result = [...shoppingData];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(item => 
        activeFilters.category.includes(item.category)
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(item => 
        activeFilters.location.includes(item.location)
      );
    }
    
    // Apply price range filter
    if (activeFilters.priceRange.length > 0) {
      result = result.filter(item => 
        activeFilters.priceRange.includes(item.priceRange)
      );
    }
    
    // Apply availability filter
    if (activeFilters.availability.length > 0) {
      result = result.filter(item => 
        activeFilters.availability.includes(item.availability)
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
        result.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case "priceDesc":
        result.sort((a, b) => b.priceRange.length - a.priceRange.length);
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

  const renderPriceRange = (priceRange) => {
    return (
      <View className="flex-row">
        {priceRange.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
      </View>
    );
  };

  const getAvailabilityColor = (status) => {
    return status === "Open Now" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading shopping destinations...</Text>
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
          {filteredData.length} of {shoppingData.length} destinations
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
                    {renderPriceRange(item.priceRange)}
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(item.availability)}`}>
                      <Text className="text-xs font-medium">{item.availability}</Text>
                    </View>
                    <Text className="text-gray-500 text-sm ml-2">{item.hours}</Text>
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
                <Text className="text-[#006D77] font-semibold">View Details & Products</Text>
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
              
              {/* Availability Filter */}
              <View className="mb-6">
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

export default ShoppingListing;