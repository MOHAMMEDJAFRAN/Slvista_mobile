import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TransportListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    vehicleType: [],
    sortBy: "recommended"
  });
  const [filteredData, setFilteredData] = useState([]);

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
    Ship: "ship"
  };

  // Sample transport data
  const transportData = [
    { id: 1, name: "City Bus Service", type: "Bus" },
    { id: 2, name: "Premium Taxi", type: "Taxi" },
    { id: 3, name: "Metro Express", type: "Train" },
    { id: 4, name: "Bike Rental", type: "Bicycle" },
    { id: 5, name: "Airport Shuttle", type: "Shuttle" },
    { id: 6, name: "Luxury Car Service", type: "Car" },
    { id: 7, name: "Express Train Service", type: "Train" },
    { id: 8, name: "Eco Bike Sharing", type: "Bicycle" },
    { id: 9, name: "City Tour Bus", type: "Bus" },
    { id: 10, name: "Executive Car Service", type: "Car" },
    { id: 11, name: "International Airlines", type: "Airplane" },
    { id: 12, name: "Domestic Flights", type: "Flight" },
    { id: 13, name: "Tour Helicopter", type: "Helicopter" },
    { id: 14, name: "River Boat Tours", type: "Boat" },
    { id: 15, name: "Cruise Ship Line", type: "Ship" }
  ];

  const vehicleTypes = ["Bus", "Taxi", "Train", "Bicycle", "Shuttle", "Car", "Airplane", "Flight", "Helicopter", "Boat", "Ship"];
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "name", label: "Name: A to Z" },
    { id: "nameDesc", label: "Name: Z to A" }
  ];

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

  const applyFiltersToData = () => {
    let result = [...transportData];
    
    // Apply vehicle type filter
    if (activeFilters.vehicleType.length > 0) {
      result = result.filter(item => 
        activeFilters.vehicleType.includes(item.type)
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
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredData(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "vehicleType") {
      if (activeFilters.vehicleType.includes(value)) {
        setActiveFilters({
          ...activeFilters,
          vehicleType: activeFilters.vehicleType.filter(item => item !== value)
        });
      } else {
        setActiveFilters({
          ...activeFilters,
          vehicleType: [...activeFilters.vehicleType, value]
        });
      }
    } else {
      setActiveFilters({ ...activeFilters, [filterType]: value });
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      vehicleType: [],
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
    // Filters are already applied through useEffect
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Transport</Text>
        </View>
        <TouchableOpacity onPress={() => setFiltersOpen(true)}>
          <View className="flex-row items-center bg-blue-500 px-3 py-2 rounded-full">
            <MaterialIcons name="filter-list" size={20} color="white" />
            <Text className="text-white ml-2">Filters</Text>
            {activeFilters.vehicleType.length > 0 && (
              <View className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center ml-2">
                <Text className="text-white text-xs">{activeFilters.vehicleType.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-gray-600">
          Showing {filteredData.length} of {transportData.length} transport options
          {activeFilters.vehicleType.length > 0 && ` (${activeFilters.vehicleType.length} filter${activeFilters.vehicleType.length > 1 ? 's' : ''} applied)`}
        </Text>
      </View>

      {/* Transport Listings */}
      <ScrollView className="flex-1 p-4">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <View key={item.id} className="bg-white rounded-full p-2 mb-3 shadow-sm border border-gray-100 flex-row items-center">
              <View className="bg-[#E6F6F8] p-3 rounded-full mr-4">
                <FontAwesome5 
                  name={vehicleIcons[item.type]} 
                  size={20} 
                  color="#006D77" 
                />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
                <Text className="text-gray-500 text-sm mt-1">{item.type}</Text>
              </View>
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <MaterialIcons name="directions-bus" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No transport options match your filters</Text>
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
                          : "bg-[#E6F6F8]"
                      }`}
                    >
                      <FontAwesome5 
                        name={vehicleIcons[type]} 
                        size={14} 
                        color={activeFilters.vehicleType.includes(type) ? "white" : "#006D77"} 
                        style={{ marginRight: 6 }}
                      />
                      <Text
                        className={
                          activeFilters.vehicleType.includes(type)
                            ? "text-white"
                            : "text-gray-700"
                        }
                      >
                        {type}
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

export default TransportListing;