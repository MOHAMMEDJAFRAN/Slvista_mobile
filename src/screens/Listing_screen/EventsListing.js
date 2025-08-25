import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const EventsListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    dateRange: "upcoming",
    sortBy: "date"
  });
  const [filteredData, setFilteredData] = useState([]);

  // Category icons mapping
  const categoryIcons = {
    "Music": "music",
    "Food & Drink": "utensils",
    "Art & Culture": "palette",
    "Sports": "running",
    "Business": "briefcase",
    "Entertainment": "film",
    "Wellness": "heart",
    "Community": "users"
  };

  // Sample events data (removed images)
  const eventsData = [
    {
      id: 1,
      name: "Summer Music Festival",
      category: "Music",
      date: "July 15, 2023",
      time: "6:00 PM - 11:00 PM",
      location: "City Park Amphitheater"
    },
    {
      id: 2,
      name: "Food & Wine Expo",
      category: "Food & Drink",
      date: "July 22, 2023",
      time: "12:00 PM - 8:00 PM",
      location: "Convention Center"
    },
    {
      id: 3,
      name: "Art Exhibition Opening",
      category: "Art & Culture",
      date: "August 5, 2023",
      time: "7:00 PM - 10:00 PM",
      location: "Modern Art Gallery"
    },
    {
      id: 4,
      name: "Marathon Race",
      category: "Sports",
      date: "August 12, 2023",
      time: "7:00 AM - 2:00 PM",
      location: "Downtown Streets"
    },
    {
      id: 5,
      name: "Tech Conference",
      category: "Business",
      date: "September 8, 2023",
      time: "9:00 AM - 5:00 PM",
      location: "Innovation Hub"
    },
    {
      id: 6,
      name: "Comedy Night",
      category: "Entertainment",
      date: "July 29, 2023",
      time: "8:00 PM - 10:30 PM",
      location: "Laugh Factory"
    },
    {
      id: 7,
      name: "Yoga in the Park",
      category: "Wellness",
      date: "Every Saturday",
      time: "8:00 AM - 9:00 AM",
      location: "Central Park"
    },
    {
      id: 8,
      name: "Farmers Market",
      category: "Community",
      date: "Every Sunday",
      time: "9:00 AM - 2:00 PM",
      location: "Town Square"
    }
  ];

  const categories = ["Music", "Food & Drink", "Art & Culture", "Sports", "Business", "Entertainment", "Wellness", "Community"];
  const dateRanges = [
    { id: "upcoming", label: "Upcoming Events" },
    { id: "thisWeek", label: "This Week" },
    { id: "thisMonth", label: "This Month" },
    { id: "all", label: "All Events" }
  ];
  const sortOptions = [
    { id: "date", label: "Date (Soonest First)" },
    { id: "dateDesc", label: "Date (Latest First)" },
    { id: "name", label: "Name: A to Z" },
    { id: "nameDesc", label: "Name: Z to A" }
  ];

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

  const applyFiltersToData = () => {
    let result = [...eventsData];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(item => 
        activeFilters.category.includes(item.category)
      );
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "date":
        // For simplicity, we'll just sort by ID (in a real app, you'd sort by actual dates)
        result.sort((a, b) => a.id - b.id);
        break;
      case "dateDesc":
        result.sort((a, b) => b.id - a.id);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "nameDesc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    
    setFilteredData(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "category") {
      if (activeFilters.category.includes(value)) {
        setActiveFilters({
          ...activeFilters,
          category: activeFilters.category.filter(item => item !== value)
        });
      } else {
        setActiveFilters({
          ...activeFilters,
          category: [...activeFilters.category, value]
        });
      }
    } else {
      setActiveFilters({ ...activeFilters, [filterType]: value });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      category: [],
      dateRange: "upcoming",
      sortBy: "date"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
    // Filters are already applied through useEffect
  };

  // Function to handle event selection
  const handleEventPress = (event) => {
    // Navigate to event details screen or show more information
    console.log("Selected event:", event);
    // navigation.navigate('EventDetails', { event });
  };

  // Calculate total number of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category.length > 0) count += activeFilters.category.length;
    if (activeFilters.dateRange !== "upcoming") count += 1;
    if (activeFilters.sortBy !== "date") count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

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
        <TouchableOpacity onPress={() => setFiltersOpen(true)}>
          <View className="flex-row items-center bg-blue-500 px-3 py-2 rounded-full">
            <MaterialIcons name="filter-list" size={20} color="white" />
            <Text className="text-white ml-2">Filters</Text>
            {activeFilterCount > 0 && (
              <View className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
                <Text className="text-white text-xs">{activeFilterCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-gray-600">
          Showing {filteredData.length} of {eventsData.length} events
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`}
        </Text>
      </View>

      {/* Events Listings */}
      <ScrollView className="flex-1 p-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => handleEventPress(item)}
              className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
            >
              <View className="flex-row justify-between">
                {/* Left side content */}
                <View className="flex-1 flex-row items-start">
                  <View className="bg-[#E6F6F8] p-3 rounded-full mr-4">
                    <FontAwesome 
                      name={categoryIcons[item.category]} 
                      size={20} 
                      color="#006D77" 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                    
                    <View className="flex-row items-center mt-2">
                      <Ionicons name="pricetag-outline" size={16} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">{item.category}</Text>
                    </View>
                    
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="location-outline" size={16} color="#6b7280" />
                      <Text className="text-gray-500 text-sm ml-1">{item.location}</Text>
                    </View>
                  </View>
                </View>
                
                {/* Right side date and time - Simplified one-line format */}
                <View className="items-end ml-4">
                  <Text className="text-[#006D77] font-bold text-sm">{item.date}</Text>
                  <Text className="text-gray-700 text-sm font-medium mt-1">{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No events match your filters</Text>
            <TouchableOpacity 
              onPress={clearAllFilters}
              className="mt-4 bg-[#006D77] px-6 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Clear Filters</Text>
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
          <View className="bg-white rounded-t-3xl h-3/5 p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-bold text-gray-800">Filters</Text>
              <TouchableOpacity onPress={() => setFiltersOpen(false)}>
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
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
                          : "bg-[#E6F6F8]"
                      }`}
                    >
                      <FontAwesome 
                        name={categoryIcons[category]} 
                        size={14} 
                        color={activeFilters.category.includes(category) ? "white" : "#006D77"} 
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={
                          activeFilters.category.includes(category)
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Date Range Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Date Range</Text>
                <View className="border border-gray-200 rounded-lg">
                  {dateRanges.map((range) => (
                    <TouchableOpacity
                      key={range.id}
                      onPress={() => toggleFilter("dateRange", range.id)}
                      className={`flex-row justify-between items-center py-3 px-4 border-b border-gray-100 last:border-b-0 ${
                        activeFilters.dateRange === range.id ? "bg-[#E6F6F8]" : ""
                      }`}
                    >
                      <Text className="text-gray-800">{range.label}</Text>
                      {activeFilters.dateRange === range.id && (
                        <Ionicons name="checkmark" size={20} color="#006D77" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Sort By Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Sort By</Text>
                <View className="border border-gray-200 rounded-lg">
                  {sortOptions.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      onPress={() => toggleFilter("sortBy", option.id)}
                      className={`flex-row justify-between items-center py-3 px-4 border-b border-gray-100 last:border-b-0 ${
                        activeFilters.sortBy === option.id ? "bg-[#E6F6F8]" : ""
                      }`}
                    >
                      <Text className="text-gray-800">{option.label}</Text>
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
                className="px-6 py-3 border border-gray-300 rounded-full"
              >
                <Text className="text-gray-700 font-semibold">Clear All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={applyFiltersAndClose}
                className="px-6 py-3 bg-[#006D77] rounded-full flex-1 ml-4"
              >
                <Text className="text-white font-semibold text-center">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EventsListing;