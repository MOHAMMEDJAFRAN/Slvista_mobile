import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const EventsListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    location: [],
    priceType: [],
    sortBy: "date"
  });
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventsData, setEventsData] = useState([]);
  const [error, setError] = useState(null);

  // Category icons mapping
  const categoryIcons = {
    "Music": "music",
    "Food & Drink": "utensils",
    "Art & Culture": "palette",
    "Sports": "running",
    "Business": "briefcase",
    "Entertainment": "film",
    "Wellness": "heart",
    "Community": "users",
    "General": "calendar"
  };

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching events from:", `${API_BASE_URL}/api/v1/events`);
        
        const response = await axios.get(`${API_BASE_URL}/api/v1/events`, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        console.log("API Response status:", response.status);
        
        // Handle different response structures
        let eventsArray = [];
        
        if (Array.isArray(response.data)) {
          // If response.data is directly an array
          eventsArray = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          // If response.data has a data property that's an array
          eventsArray = response.data.data;
        } else if (response.data && Array.isArray(response.data.events)) {
          // If response.data has an events property that's an array
          eventsArray = response.data.events;
        } else {
          throw new Error("Invalid API response format: Expected array of events");
        }
        
        console.log("Events array length:", eventsArray.length);
        
        // Transform API data to match your component's expected format
        const transformedData = eventsArray.map(event => ({
          id: event.id || Math.random(),
          name: event.title || "Untitled Event",
          category: event.category || "General",
          images: event.images ? event.images.map(img => img.imageUrl) : [],
          date: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date TBA",
          time: event.eventTime || "TBA",
          location: event.venue || "Location TBA",
          rating: event.rating || 4.5, // Default rating
          price: "$$", // Default price indicator
          priceType: "paid", // Default to paid
          ticketStatus: "Available",
          website: event.website || "#",
          email: event.email || "",
          phone: event.phone || "",
          description: event.description || "",
          city: event.city || "",
          province: event.province || "",
          vistaVerified: event.vistaVerified || false,
          isActive: event.isActive || true, // Add active status from API, default to true
          // Include original API data for reference
          originalData: event
        }));
        
        setEventsData(transformedData);
        setFilteredData(transformedData);
        
      } catch (err) {
        console.error("Error fetching events:", err);
        console.error("Error details:", err.response?.data || err.message);
        
        let errorMessage = "Failed to connect to server.";
        
        if (err.response) {
          errorMessage = `Server error: ${err.response.status}`;
          if (err.response.status === 404) {
            errorMessage = "Faild to connect to server";
          } else if (err.response.status === 500) {
            errorMessage = "Server error. Please try again later.";
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = "Request timeout. Please try again.";
        }
        
        setError(errorMessage);
        setEventsData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Extract unique categories, locations, etc. from data
  const categories = [...new Set(eventsData.map(item => item.category))].filter(Boolean);
  const locations = [...new Set(eventsData.map(item => item.location))].filter(Boolean);
  const priceTypes = ["free", "paid"];
  const sortOptions = [
    { id: "date", label: "Date (Soonest First)", icon: "sort-calendar-ascending" },
    { id: "dateDesc", label: "Date (Latest First)", icon: "sort-calendar-descending" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" },
  ];

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters, eventsData]);

  const applyFiltersToData = () => {
    let result = [...eventsData];
    
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
    
    // Apply price type filter
    if (activeFilters.priceType.length > 0) {
      result = result.filter(item => 
        activeFilters.priceType.includes(item.priceType)
      );
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "date":
        result.sort((a, b) => {
          const dateA = new Date(a.originalData?.eventDate || a.date);
          const dateB = new Date(b.originalData?.eventDate || b.date);
          return dateA - dateB;
        });
        break;
      case "dateDesc":
        result.sort((a, b) => {
          const dateA = new Date(a.originalData?.eventDate || a.date);
          const dateB = new Date(b.originalData?.eventDate || b.date);
          return dateB - dateA;
        });
        break;
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
        result.sort((a, b) => {
          if (a.priceType === "free" && b.priceType !== "free") return -1;
          if (a.priceType !== "free" && b.priceType === "free") return 1;
          return a.price.length - b.price.length;
        });
        break;
      case "priceDesc":
        result.sort((a, b) => {
          if (a.priceType !== "free" && b.priceType === "free") return -1;
          if (a.priceType === "free" && b.priceType !== "free") return 1;
          return b.price.length - a.price.length;
        });
        break;
      default:
        break;
    }
    
    setFilteredData(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "category" || filterType === "location" || filterType === "priceType") {
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
      priceType: [],
      sortBy: "date"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("EventDetails", { eventItem: item });
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
    if (price === "Free") {
      return (
        <View className="flex-row items-center">
          <Text className="text-green-600 font-semibold">Free</Text>
        </View>
      );
    }
    
    return (
      <View className="flex-row items-center">
        {price.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
      </View>
    );
  };

  const getTicketStatusColor = (status) => {
    switch(status) {
      case "Selling Fast":
        return "bg-orange-100 text-orange-800";
      case "Almost Sold Out":
        return "bg-red-100 text-red-800";
      case "Available":
        return "bg-green-100 text-green-800";
      case "RSVP Required":
        return "bg-blue-100 text-blue-800";
      case "Drop-in":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    // Re-fetch events
    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/v1/events`);
          if (Array.isArray(response.data)) {
            const transformedData = response.data.map(event => ({
              id: event.id,
              name: event.title,
              category: "General",
              images: event.images ? event.images.map(img => img.imageUrl) : [],
              date: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date TBA",
              time: event.eventTime || "TBA",
              location: event.venue || "Location TBA",
              rating: 4.5,
              price: "$$",
              priceType: "paid",
              ticketStatus: "Available",
              website: event.website || "#",
              email: event.email || "",
              phone: event.phone || "",
              description: event.description || "",
              isActive: event.isActive || true, // Add active status
              originalData: event
            }));
            setEventsData(transformedData);
            setFilteredData(transformedData);
          }
        } catch (err) {
          setError("Failed to connect to server");
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }, []);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading events...</Text>
      </View>
    );
  }

  if (error && eventsData.length === 0) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">{error}</Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Please check your connection and try again
        </Text>
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
          <Text className="text-white text-xl font-bold ml-4">Events</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceType.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.category.length + activeFilters.location.length + activeFilters.priceType.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredData.length} of {eventsData.length} events
        </Text>
        {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.priceType.length > 0) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Events Listings */}
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
                  <Image 
                    source={{ uri: item.images?.[0] || "https://via.placeholder.com/150" }} 
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
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="calendar" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1">{item.date}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="time" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1">{item.time}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars(item.rating)}
                  </View>
                  
                  <View className="flex-row justify-between items-center mt-2">
                    <View className="flex-row items-center">
                      <FontAwesome 
                        name={categoryIcons[item.category] || "calendar"} 
                        size={14} 
                        color="#006D77" 
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-gray-500 text-sm mr-5">{item.category}</Text>
                    </View>
                  </View>
                  
                  
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
            <MaterialCommunityIcons name="calendar" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No events found
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
                        name={categoryIcons[category] || "calendar"} 
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

export default EventsListing;