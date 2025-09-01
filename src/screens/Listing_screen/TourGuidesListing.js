import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const TourGuidesListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    specialty: [],
    location: [],
    language: [],
    priceRange: [],
    availability: [],
    sortBy: "recommended"
  });
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample tour guides data with additional details
  const guidesData = [
    {
      id: 1,
      name: "Sarah Johnson",
      specialty: "Historical Tours",
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG91ciUyMGd1aWRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG91ciUyMGd1aWRlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Downtown District",
      experience: "8 years",
      rating: 4.9,
      pricePerDay: "$120",
      availability: "Available",
      languages: ["English", "Spanish"],
      email: "sarah@historicaltours.com",
      phone: "+1 (555) 123-4567",
      website: "https://historicaltours.com",
      license: "LTG-12345",
      description: "Expert in historical tours with extensive knowledge of local history and architecture.",
      specialties: ["Historical Sites", "Architecture", "Museums"],
      reviews: [
        {
          id: 1,
          user: "Michael Brown",
          rating: 5,
          comment: "Sarah's historical knowledge is incredible! She made the city's history come alive.",
          date: "2023-10-15",
          userImage: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      specialty: "Cultural Experiences",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHRvdXIlMjBndWlkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRvdXIlMjBndWlkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Cultural District",
      experience: "6 years",
      rating: 4.8,
      pricePerDay: "$100",
      availability: "Available",
      languages: ["English", "Spanish", "Portuguese"],
      email: "carlos@culturaltours.com",
      phone: "+1 (555) 234-5678",
      website: "https://culturaltours.com",
      license: "LTG-23456",
      description: "Passionate about sharing cultural insights and authentic local experiences.",
      specialties: ["Local Culture", "Traditional Crafts", "Community Visits"],
      reviews: [
        {
          id: 1,
          user: "Lisa Wang",
          rating: 4,
          comment: "Carlos showed us parts of the city we would never have found on our own. Great cultural insights!",
          date: "2023-10-12",
          userImage: "https://randomuser.me/api/portraits/women/22.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Emma Thompson",
      specialty: "Adventure Tours",
      images: [
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRvdXIlMjBndWlkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHRvdXIlMjBndWlkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Mountain Region",
      experience: "10 years",
      rating: 4.9,
      pricePerDay: "$150",
      availability: "Available",
      languages: ["English", "French"],
      email: "emma@adventuretours.com",
      phone: "+1 (555) 345-6789",
      website: "https://adventuretours.com",
      license: "LTG-34567",
      description: "Certified adventure guide with expertise in hiking, climbing, and outdoor activities.",
      specialties: ["Hiking", "Rock Climbing", "Wilderness Survival"],
      reviews: [
        {
          id: 1,
          user: "David Kim",
          rating: 5,
          comment: "Emma's adventure tour was the highlight of our trip! She's knowledgeable and safety-conscious.",
          date: "2023-10-10",
          userImage: "https://randomuser.me/api/portraits/men/42.jpg"
        }
      ]
    },
    {
      id: 4,
      name: "James Wilson",
      specialty: "Food Tours",
      images: [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRvdXIlMjBndWlkZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVyc29ufGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Market District",
      experience: "5 years",
      rating: 4.7,
      pricePerDay: "$90",
      availability: "Not Available",
      languages: ["English", "Italian"],
      email: "james@foodtours.com",
      phone: "+1 (555) 456-7890",
      website: null,
      license: "LTG-45678",
      description: "Food enthusiast and culinary expert who loves sharing local food traditions and hidden gems.",
      specialties: ["Local Cuisine", "Street Food", "Cooking Demonstrations"],
      reviews: [
        {
          id: 1,
          user: "Maria Garcia",
          rating: 5,
          comment: "James introduced us to amazing local dishes we would never have tried on our own. Highly recommend!",
          date: "2023-10-08",
          userImage: "https://randomuser.me/api/portraits/women/32.jpg"
        }
      ]
    },
    // Add more tour guides following the same pattern...
  ];

  const specialties = ["Historical Tours", "Cultural Experiences", "Adventure Tours", "Food Tours", "Nature & Wildlife", "Art & Architecture", "Photography Tours", "Wine & Vineyard Tours"];
  const locations = ["Downtown District", "Cultural District", "Mountain Region", "Market District", "Coastal Area", "Historic Quarter", "Business District", "Countryside"];
  const languages = ["English", "Spanish", "Mandarin", "French", "German", "Arabic", "Italian", "Japanese", "Korean", "Portuguese"];
  const priceRanges = ["$50-$99", "$100-$149", "$150-$199", "$200+"];
  const availabilityOptions = ["Available", "Not Available"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "experience", label: "Experience: High to Low", icon: "sort-descending" },
    { id: "rating", label: "Rating: High to Low", icon: "sort-descending" },
    { id: "priceLow", label: "Price: Low to High", icon: "sort-numeric-ascending" },
    { id: "priceHigh", label: "Price: High to Low", icon: "sort-numeric-descending" }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredGuides(guidesData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(guide => 
        activeFilters.location.includes(guide.location)
      );
    }
    
    // Apply language filter
    if (activeFilters.language.length > 0) {
      result = result.filter(guide => 
        guide.languages.some(lang => activeFilters.language.includes(lang))
      );
    }
    
    // Apply price range filter
    if (activeFilters.priceRange.length > 0) {
      result = result.filter(guide => {
        const price = parseInt(guide.pricePerDay.replace('$', ''));
        return activeFilters.priceRange.some(range => {
          if (range === "$50-$99") return price >= 50 && price <= 99;
          if (range === "$100-$149") return price >= 100 && price <= 149;
          if (range === "$150-$199") return price >= 150 && price <= 199;
          if (range === "$200+") return price >= 200;
          return false;
        });
      });
    }
    
    // Apply availability filter
    if (activeFilters.availability.length > 0) {
      result = result.filter(guide => 
        activeFilters.availability.includes(guide.availability)
      );
    }
    
    // Apply sorting
    switch(activeFilters.sortBy) {
      case "experience":
        result.sort((a, b) => parseInt(b.experience) - parseInt(a.experience));
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "priceLow":
        result.sort((a, b) => parseInt(a.pricePerDay.replace('$', '')) - parseInt(b.pricePerDay.replace('$', '')));
        break;
      case "priceHigh":
        result.sort((a, b) => parseInt(b.pricePerDay.replace('$', '')) - parseInt(a.pricePerDay.replace('$', '')));
        break;
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredGuides(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "specialty" || filterType === "location" || filterType === "language" || filterType === "priceRange" || filterType === "availability") {
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
      location: [],
      language: [],
      priceRange: [],
      availability: [],
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
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

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading tour guides...</Text>
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
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.specialty.length > 0 || activeFilters.location.length > 0 || activeFilters.language.length > 0 || activeFilters.priceRange.length > 0 || activeFilters.availability.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.specialty.length + activeFilters.location.length + activeFilters.language.length + activeFilters.priceRange.length + activeFilters.availability.length}
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
        {(activeFilters.specialty.length > 0 || activeFilters.location.length > 0 || activeFilters.language.length > 0 || activeFilters.priceRange.length > 0 || activeFilters.availability.length > 0) && (
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
                    {item.website && (
                      <TouchableOpacity 
                        onPress={(e) => {
                          e.stopPropagation();
                          Linking.openURL(item.website);
                        }}
                        className="p-2 bg-gray-100 rounded-full"
                      >
                        <Feather name="external-link" size={16} color="#006D77" />
                      </TouchableOpacity>
                    )}
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
                      <Ionicons name="ribbon" size={14} color="#006D77" style={{ marginRight: 6 }} />
                      <Text className="text-gray-500 text-sm">{item.specialty}</Text>
                    </View>
                    <Text className="text-green-600 font-semibold">{item.pricePerDay}/day</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(item.availability)}`}>
                      <Text className="text-xs font-medium">{item.availability}</Text>
                    </View>
                    <Text className="text-gray-500 text-sm ml-2">{item.experience} experience</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="globe" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                      {item.languages.join(", ")}
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
                <Text className="text-lg font-semibold text-gray-800 mb-3">Price Range (per day)</Text>
                <View className="flex-row flex-wrap">
                  {priceRanges.map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => toggleFilter("priceRange", range)}
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                        activeFilters.priceRange.includes(range)
                          ? "bg-[#006D77]"
                          : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          activeFilters.priceRange.includes(range)
                            ? "text-white font-semibold"
                            : "text-gray-700"
                        }`}
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