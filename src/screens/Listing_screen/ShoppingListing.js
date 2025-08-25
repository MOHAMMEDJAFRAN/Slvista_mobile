import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ShoppingListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    sortBy: "recommended"
  });
  const [filteredData, setFilteredData] = useState([]);

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

  // Sample shopping data (removed images and priceRange)
  const shoppingData = [
    {
      id: 1,
      name: "City Center Mall",
      category: "Shopping Mall",
      description: "200+ stores, food court, cinema",
      location: "Downtown District",
    },
    {
      id: 2,
      name: "Artisan Craft Market",
      category: "Local Market",
      description: "Handmade crafts, local artisans",
      location: "Old Town Square",
    },
    {
      id: 3,
      name: "Boutique Fashion Street",
      category: "Fashion",
      description: "Designer boutiques, trendy fashion",
      location: "Fashion District",
    },
    {
      id: 4,
      name: "Tech Gadget Hub",
      category: "Electronics",
      description: "Latest gadgets, electronics, accessories",
      location: "Tech Plaza",
    },
    {
      id: 5,
      name: "Home Decor Gallery",
      category: "Home Goods",
      description: "Furniture, decor, interior design",
      location: "Design District",
    },
    {
      id: 6,
      name: "Fresh Produce Market",
      category: "Food Market",
      description: "Fresh fruits, vegetables, local produce",
      location: "Farmers Market Area",
    },
    {
      id: 7,
      name: "Antique Treasure House",
      category: "Antiques",
      description: "Vintage items, collectibles, antiques",
      location: "Historic District",
    },
    {
      id: 8,
      name: "Sports Gear Center",
      category: "Sports",
      description: "Sporting goods, equipment, apparel",
      location: "Stadium Complex",
    }
  ];

  const categories = ["Shopping Mall", "Local Market", "Fashion", "Electronics", "Home Goods", "Food Market", "Antiques", "Sports"];
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "name", label: "Name: A to Z" },
    { id: "nameDesc", label: "Name: Z to A" },
  ];

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
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "recommended":
        result.sort((a, b) => a.id - b.id);
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
          <Text className="text-white text-xl font-bold ml-4">Shopping</Text>
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
          Showing {filteredData.length} of {shoppingData.length} destinations
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`}
        </Text>
      </View>

      {/* Shopping Listings */}
      <ScrollView className="flex-1 p-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <View key={item.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center justify-between mb-2">
                    <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                    <View className="flex-row items-center bg-[#E6F6F8] px-3 py-1 rounded-full">
                      <FontAwesome 
                        name={categoryIcons[item.category]} 
                        size={12} 
                        color="#006D77" 
                      />
                      <Text className="text-[#006D77] text-xs ml-1">{item.category}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center mt-3">
                    <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-2 flex-1">{item.description}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-3">
                    <Ionicons name="location-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-2">{item.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <Ionicons name="cart-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No shopping destinations match your filters</Text>
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

export default ShoppingListing;