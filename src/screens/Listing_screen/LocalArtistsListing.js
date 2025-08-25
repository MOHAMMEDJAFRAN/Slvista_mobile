import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const LocalArtistsListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    sortBy: "recommended"
  });
  const [filteredArtists, setFilteredArtists] = useState([]);

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

  // Sample local artists data (removed name, location, and rating)
  const artistsData = [
    {
      id: 1,
      category: "Painting",
      specialty: "Oil Paintings, Landscapes",
    },
    {
      id: 2,
      category: "Sculpture",
      specialty: "Metal Sculptures, Abstract Art",
    },
    {
      id: 3,
      category: "Photography",
      specialty: "Nature Photography, Portraits",
    },
    {
      id: 4,
      category: "Music",
      specialty: "Jazz Guitar, Original Compositions",
    },
    {
      id: 5,
      category: "Pottery",
      specialty: "Handcrafted Ceramics, Functional Art",
    },
    {
      id: 6,
      category: "Digital Art",
      specialty: "Digital Illustrations, NFTs",
    },
    {
      id: 7,
      category: "Textile Art",
      specialty: "Handwoven Fabrics, Traditional Patterns",
    },
    {
      id: 8,
      category: "Performance",
      specialty: "Street Theater, Physical Comedy",
    }
  ];

  const categories = ["Painting", "Sculpture", "Photography", "Music", "Pottery", "Digital Art", "Textile Art", "Performance"];
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "category", label: "By Category" },
    { id: "specialtyAZ", label: "Specialty: A to Z" },
    { id: "specialtyZA", label: "Specialty: Z to A" }
  ];

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
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "recommended":
        // Simple sort by ID as recommended
        result.sort((a, b) => a.id - b.id);
        break;
      case "category":
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case "specialtyAZ":
        result.sort((a, b) => a.specialty.localeCompare(b.specialty));
        break;
      case "specialtyZA":
        result.sort((a, b) => b.specialty.localeCompare(a.specialty));
        break;
      default:
        break;
    }
    
    setFilteredArtists(result);
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
      sortBy: "recommended"
    });
  };

  const applyFilters = () => {
    setFiltersOpen(false);
  };

  // Calculate active filter count for badge
  const getActiveFilterCount = () => {
    let count = activeFilters.category.length;
    if (activeFilters.sortBy !== "recommended") count += 1;
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
          <Text className="text-white text-xl font-bold ml-4">Local Artists</Text>
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
          Showing {filteredArtists.length} of {artistsData.length} artists
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`}
        </Text>
      </View>

      {/* Artists Listings */}
      <ScrollView className="flex-1 p-4">
        {filteredArtists.length > 0 ? (
          filteredArtists.map((item) => (
            <View key={item.id} className="bg-white rounded-full p-2 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row items-start">
                <View className="bg-[#E6F6F8] p-3 rounded-full mr-4">
                  <FontAwesome 
                    name={categoryIcons[item.category]} 
                    size={20} 
                    color="#006D77" 
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Ionicons name="brush-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">{item.category}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="star-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">{item.specialty}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No artists match your filters</Text>
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
                <Text className="text-lg font-semibold text-gray-800 mb-3">Art Category</Text>
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
                        color={activeFilters.category.includes(category) ? "white" : "#4b5563"} 
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
                onPress={applyFilters}
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

export default LocalArtistsListing;