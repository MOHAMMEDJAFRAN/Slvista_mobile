import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TourGuidesListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    specialty: [],
    language: [],
    sortBy: "recommended"
  });
  const [filteredGuides, setFilteredGuides] = useState([]);

  // Sample tour guides data (removed image, name, tours, and languages)
  const guidesData = [
    {
      id: 1,
      specialty: "Historical Tours",
      experience: "8 years",
      rating: 4.9,
      contact: "+1 (555) 123-4567",
      license: "LTG-12345"
    },
    {
      id: 2,
      specialty: "Cultural Experiences",
      experience: "6 years",
      rating: 4.8,
      contact: "+1 (555) 234-5678",
      license: "LTG-23456"
    },
    {
      id: 3,
      specialty: "Adventure Tours",
      experience: "10 years",
      rating: 4.9,
      contact: "+1 (555) 345-6789",
      license: "LTG-34567"
    },
    {
      id: 4,
      specialty: "Food Tours",
      experience: "5 years",
      rating: 4.7,
      contact: "+1 (555) 456-7890",
      license: "LTG-45678"
    },
    {
      id: 5,
      specialty: "Nature & Wildlife",
      experience: "12 years",
      rating: 4.9,
      contact: "+1 (555) 567-8901",
      license: "LTG-56789"
    },
    {
      id: 6,
      specialty: "Art & Architecture",
      experience: "7 years",
      rating: 4.8,
      contact: "+1 (555) 678-9012",
      license: "LTG-67890"
    },
    {
      id: 7,
      specialty: "Photography Tours",
      experience: "4 years",
      rating: 4.6,
      contact: "+1 (555) 789-0123",
      license: "LTG-78901"
    },
    {
      id: 8,
      specialty: "Wine & Vineyard Tours",
      experience: "9 years",
      rating: 4.9,
      contact: "+1 (555) 890-1234",
      license: "LTG-89012"
    }
  ];

  const specialties = ["Historical Tours", "Cultural Experiences", "Adventure Tours", "Food Tours", "Nature & Wildlife", "Art & Architecture", "Photography Tours", "Wine & Vineyard Tours"];
  const languages = ["English", "Spanish", "Mandarin", "French", "German", "Arabic", "Italian", "Japanese", "Korean", "Portuguese"];
  const sortOptions = [
    { id: "recommended", label: "Recommended" },
    { id: "experience", label: "Experience: High to Low" },
    { id: "rating", label: "Rating: High to Low" },
  ];

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

  const applyFiltersToData = () => {
    let result = [...guidesData];
    
    // Apply specialty filter
    if (activeFilters.specialty.length > 0) {
      result = result.filter(guide => 
        activeFilters.specialty.includes(guide.specialty)
      );
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "recommended":
        result.sort((a, b) => a.id - b.id);
        break;
      case "experience":
        result.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredGuides(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "specialty" || filterType === "language") {
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
      specialty: [],
      language: [],
      sortBy: "recommended"
    });
  };

  const applyFilters = () => {
    setFiltersOpen(false);
  };

  // Calculate active filter count for badge
  const getActiveFilterCount = () => {
    let count = activeFilters.specialty.length + activeFilters.language.length;
    if (activeFilters.sortBy !== "recommended") count += 1;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // Function to handle contact button press
  const handleContact = (contactNumber) => {
    // In a real app, this would open the phone dialer or messaging app
    alert(`Contacting: ${contactNumber}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold ml-4">Licensed Tour Guides</Text>
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
          Showing {filteredGuides.length} of {guidesData.length} tour guides
          {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied)`}
        </Text>
      </View>

      {/* Tour Guides Listings */}
      <ScrollView className="flex-1 p-4">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((item) => (
            <View key={item.id} className="bg-white rounded-3xl mb-4 shadow-sm overflow-hidden border border-gray-100 p-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center">
                    <Ionicons name="ribbon-outline" size={18} color="#006D77" />
                    <Text className="text-[#006D77] font-semibold ml-3">{item.specialty}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="star" size={14} color="#f59e0b" />
                    <Text className="text-gray-700 text-sm ml-1">{item.rating} • {item.experience} experience</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="document-text-outline" size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">License: {item.license}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="call-outline" size={14} color="#6b7280" />
                    <Text className="text-gray-500 text-sm ml-1">{item.contact}</Text>
                  </View>
                </View>
              </View>
              
            </View>
          ))
        ) : (
          <View className="bg-white rounded-xl p-8 items-center justify-center">
            <Ionicons name="people-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center">No tour guides match your filters</Text>
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
              {/* Specialty Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Specialty</Text>
                <View className="flex-row flex-wrap">
                  {specialties.map((specialty) => (
                    <TouchableOpacity
                      key={specialty}
                      onPress={() => toggleFilter("specialty", specialty)}
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.specialty.includes(specialty)
                          ? "bg-[#006D77]"
                          : "bg-[#E6F6F8]"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.specialty.includes(specialty)
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {specialty}
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

export default TourGuidesListing;