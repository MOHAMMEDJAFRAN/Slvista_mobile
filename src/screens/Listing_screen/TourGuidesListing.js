import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';
import Slider from '@react-native-community/slider';

const TourGuidesListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    specialty: [],
    location: [],
    language: [],
    priceRange: { min: 0, max: 100 },
    availability: [],
    sortBy: "recommended"
  });
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guidesData, setGuidesData] = useState([]);
  const [error, setError] = useState(null);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 100 });

  // Filter options - these will be populated from API data
  const [specialties, setSpecialties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [languages, setLanguages] = useState([]);
  const availabilityOptions = ["Available", "Not Available"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "experience", label: "Experience: High to Low", icon: "sort-descending" },
    { id: "priceLow", label: "Price: Low to High", icon: "sort-numeric-ascending" },
    { id: "priceHigh", label: "Price: High to Low", icon: "sort-numeric-descending" }
  ];

  // Fetch data from API
  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/guides`);
      
      if (response.data.success) {
        // Transform API data to match your component structure
        const transformedData = response.data.data.map(guide => ({
          id: guide.id,
          name: guide.guide_name,
          slug: guide.slug,
          specialty: guide.specialties?.[0] || "General Tour Guide",
          images: guide.images?.map(img => img.imageUrl) || [],
          location: guide.region,
          experience: `${new Date().getFullYear() - guide.experience} years`,
          rating: guide.rating || 3.5,  // Default rating since not in API
          pricePerDay: `${guide.ratePerDayCurrency} ${guide.ratePerDayAmount}`,
          priceAmount: parseFloat(guide.ratePerDayAmount) || 0,
          availability: guide.isActive ? "Available" : "Not Available",
          isActive: guide.isActive,
          languages: guide.languages || [],
          email: guide.email,
          phone: guide.phone,
          whatsapp: guide.whatsapp,
          instagram: guide.instagram,
          facebook: guide.facebook,
          license: guide.licenceId,
          description: guide.bio,
          specialties: guide.specialties || [],
          expiryDate: guide.expiryDate,
          vistaVerified: guide.vistaVerified,
          createdAt: guide.createdAt,
          updatedAt: guide.updatedAt
        }));
        
        setGuidesData(transformedData);
        setFilteredGuides(transformedData);
        
        // Extract filter options from data
        const allSpecialties = Array.from(
          new Set(transformedData.flatMap(guide => guide.specialties.map(s => s.trim())))
        );
        setSpecialties(allSpecialties);
        
        const allLocations = Array.from(
          new Set(transformedData.flatMap(guide => 
            guide.location.split(',').map(l => l.trim()).filter(l => l)
          ))
        );
        setLocations(allLocations);
        
        const allLanguages = Array.from(
          new Set(transformedData.flatMap(guide => guide.languages.map(l => l.trim())))
        );
        setLanguages(allLanguages);
        
        // Calculate max price for slider
        const prices = transformedData.map(guide => guide.priceAmount);
        const maxPrice = Math.max(...prices, 100); // Use at least 100 as default
        setActiveFilters(prev => ({
          ...prev,
          priceRange: { min: 0, max: maxPrice }
        }));
        setTempPriceRange({ min: 0, max: maxPrice });
      } else {
        setError("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("Error fetching guides:", error);
      setError("Failed to load tour guides. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters, guidesData]);

  const applyFiltersToData = () => {
    let result = [...guidesData];
    
    // Apply specialty filter
    if (activeFilters.specialty.length > 0) {
      result = result.filter(guide => 
        guide.specialties.some(specialty => 
          activeFilters.specialty.includes(specialty.trim())
        )
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(guide => 
        activeFilters.location.some(location => 
          guide.location.includes(location)
        )
      );
    }
    
    // Apply language filter
    if (activeFilters.language.length > 0) {
      result = result.filter(guide => 
        guide.languages.some(lang => 
          activeFilters.language.includes(lang.trim())
        )
      );
    }
    
    // Apply price range filter
    const { min, max } = activeFilters.priceRange;
    result = result.filter(guide => {
      return guide.priceAmount >= min && guide.priceAmount <= max;
    });
    
    // Apply availability filter
    if (activeFilters.availability.length > 0) {
      result = result.filter(guide => 
        activeFilters.availability.includes(guide.availability)
      );
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "experience":
        result.sort((a, b) => {
          const expA = parseInt(a.experience);
          const expB = parseInt(b.experience);
          return expB - expA;
        });
        break;
      case "priceLow":
        result.sort((a, b) => a.priceAmount - b.priceAmount);
        break;
      case "priceHigh":
        result.sort((a, b) => b.priceAmount - a.priceAmount);
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredGuides(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "specialty" || filterType === "location" || filterType === "language" || filterType === "availability") {
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
    // Calculate max price for slider
    const prices = guidesData.map(guide => guide.priceAmount);
    const maxPrice = Math.max(...prices, 100);
    
    setActiveFilters({
      specialty: [],
      location: [],
      language: [],
      priceRange: { min: 0, max: maxPrice },
      availability: [],
      sortBy: "recommended"
    });
    
    setTempPriceRange({ min: 0, max: maxPrice });
  };

  const applyFiltersAndClose = () => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: tempPriceRange
    }));
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("GuideDetails", { guideItem: item });
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

  const getAvailabilityColor = (status) => {
    return status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const handleRetry = () => {
    fetchGuides();
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading tour guides...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">{error}</Text>
        <TouchableOpacity 
          onPress={handleRetry}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="reload" size={18} color="white" style={{marginRight: 8}} />
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
          <Text className="text-white text-xl font-bold ml-4">Licensed Tour Guides</Text>
        </View>
        <TouchableOpacity 
          onPress={() => {
            setTempPriceRange(activeFilters.priceRange);
            setFiltersOpen(true);
          }}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.specialty.length > 0 || activeFilters.location.length > 0 || activeFilters.language.length > 0 || activeFilters.availability.length > 0 || activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < Math.max(...guidesData.map(guide => guide.priceAmount))) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.specialty.length + activeFilters.location.length + activeFilters.language.length + activeFilters.availability.length + 1}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredGuides.length} of {guidesData.length} tour guides
        </Text>
        {(activeFilters.specialty.length > 0 || activeFilters.location.length > 0 || activeFilters.language.length > 0 || activeFilters.availability.length > 0 || activeFilters.priceRange.min > 0 || activeFilters.priceRange.max < Math.max(...guidesData.map(guide => guide.priceAmount))) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Tour Guides Listings */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {filteredGuides.length > 0 ? (
          filteredGuides.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              className="bg-white rounded-2xl p-4 mb-4 shadow-sm shadow-black/5 border border-gray-100"
              onPress={() => handleViewDetails(item)}
              activeOpacity={0.7}
            >
              <View className="flex-row">
                <View className="w-28 h-28 rounded-xl overflow-hidden mr-4 relative">
                  <Image 
                    source={{ uri: item.images?.[0] || "https://via.placeholder.com/100" }} 
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
                    {item.vistaVerified && (
                      <View className="bg-blue-100 rounded-full px-2 py-1 flex-row items-center">
                        <Ionicons name="checkmark-circle" size={14} color="#006D77" />
                        <Text className="text-[#006D77] text-xs ml-1">Verified</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="location" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1 mr-5" numberOfLines={5}>{item.location}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    {renderStars(item.rating)}
                  </View>
                  
                  
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="ribbon" size={14} color="#006D77" />
                      <Text className="text-gray-500 text-sm ml-1 mr-5" numberOfLines={5}>{item.specialty}</Text>
                    </View>
                
                  
                  {/* <View className="flex-row items-center mt-2">
                    <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(item.availability)}`}>
                      <Text className="text-xs font-medium">{item.availability}</Text>
                    </View>
                    <Text className="text-gray-500 text-sm ml-2">{item.experience} experience</Text>
                  </View> */}
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="globe" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1 mr-5" numberOfLines={5}>
                      {item.languages.join(", ")}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-end items-center mt-3">
                    {/* <TouchableOpacity 
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
                    </TouchableOpacity> */}
                    <Text className="text-green-600 font-semibold mr-5">{item.pricePerDay}/day</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                className="mt-4 bg-[#E6F6F8] p-3 rounded-xl flex-row items-center justify-between"
                onPress={() => handleViewDetails(item)}
                activeOpacity={0.8}
              >
                <Text className="text-[#006D77] font-semibold">View Details & Book</Text>
                <Ionicons name="arrow-forward" size={18} color="#006D77" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center justify-center mt-8">
            <MaterialCommunityIcons name="guide-dog" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No tour guides found
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
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.specialty.includes(specialty)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {specialty}
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
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.location.includes(location)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.location.includes(location)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Language Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Language</Text>
                <View className="flex-row flex-wrap">
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language}
                      onPress={() => toggleFilter("language", language)}
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.language.includes(language)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.language.includes(language)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {language}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              {/* Price Range Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Price Range: {guidesData[0]?.pricePerDay?.split(' ')[0] || '$'} {tempPriceRange.min.toLocaleString()} - {guidesData[0]?.pricePerDay?.split(' ')[0] || '$'} {tempPriceRange.max.toLocaleString()}
                </Text>
                <View className="px-2">
                  <Slider
                    minimumValue={0}
                    maximumValue={Math.max(...guidesData.map(guide => guide.priceAmount), 100)}
                    step={10}
                    minimumTrackTintColor="#006D77"
                    maximumTrackTintColor="#d1d5db"
                    thumbTintColor="#006D77"
                    value={tempPriceRange.max}
                    onValueChange={(value) => {
                      setTempPriceRange(prev => ({ ...prev, max: value }));
                    }}
                  />
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-gray-500">{guidesData[0]?.pricePerDay?.split(' ')[0] || '$'} 0</Text>
                    <Text className="text-gray-500">
                      {guidesData[0]?.pricePerDay?.split(' ')[0] || '$'} {Math.max(...guidesData.map(guide => guide.priceAmount), 100).toLocaleString()}
                    </Text>
                  </View>
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
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.availability.includes(option)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.availability.includes(option)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }`}
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

export default TourGuidesListing;