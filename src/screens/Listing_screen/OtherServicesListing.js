import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Linking, ActivityIndicator } from "react-native";
import { MaterialIcons, Ionicons, FontAwesome, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const OtherServicesListing = () => {
  const navigation = useNavigation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: [],
    location: [],
    availability: [],
    sortBy: "recommended"
  });
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category icons mapping
  const categoryIcons = {
    "Healthcare": "medical-services",
    "Business Services": "business-center",
    "Storage": "storage",
    "Repair Services": "build",
    "Legal Services": "gavel",
    "Laundry Services": "local-laundry-service",
    "Pet Services": "pets",
    "Financial Services": "attach-money",
    "Fitness": "fitness-center",
    "Beauty Services": "spa",
    "Home Services": "home-repair-service",
    "Translation": "translate"
  };

  // Sample other services data with additional details
  const servicesData = [
    {
      id: 1,
      name: "City Medical Center",
      category: "Healthcare",
      images: [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGljYWwlMjBjZW50ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG1lZGljYWwlMjBjZW50ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Central District",
      rating: 4.7,
      availability: "24/7 Available",
      languages: ["English", "Spanish", "Mandarin"],
      email: "info@citymedical.com",
      phone: "+1 (555) 123-4567",
      website: "https://citymedical.com",
      specialties: ["Emergency Care", "Consultations", "Lab Services"],
      description: "Full-service medical center providing 24/7 emergency care, specialist consultations, and laboratory services.",
      cancellationPolicy: "24 hours notice required for appointments",
      reviews: [
        {
          id: 1,
          user: "Michael Brown",
          rating: 5,
          comment: "Excellent medical care. The staff was professional and caring.",
          date: "2023-10-15",
          userImage: "https://randomuser.me/api/portraits/men/32.jpg"
        }
      ]
    },
    {
      id: 2,
      name: "QuickPrint Solutions",
      category: "Business Services",
      images: [
        "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJpbnRpbmclMjBzZXJ2aWNlfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJpbnRpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Business District",
      rating: 4.5,
      availability: "Open Now",
      languages: ["English", "French"],
      email: "contact@quickprint.com",
      phone: "+1 (555) 234-5678",
      website: "https://quickprint.com",
      specialties: ["Printing", "Copying", "Document Services"],
      description: "Comprehensive printing and document services for businesses and individuals.",
      cancellationPolicy: "No cancellation fee for printing orders",
      reviews: [
        {
          id: 1,
          user: "Sarah Johnson",
          rating: 4,
          comment: "Fast and reliable printing services. Great for business documents.",
          date: "2023-10-12",
          userImage: "https://randomuser.me/api/portraits/women/22.jpg"
        }
      ]
    },
    {
      id: 3,
      name: "Secure Storage Facilities",
      category: "Storage",
      images: [
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmFnZSUyMGZhY2lsaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3RvcmFnZSUyMHVuaXR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Industrial Area",
      rating: 4.6,
      availability: "Open Now",
      languages: ["English", "Spanish"],
      email: "storage@securefacilities.com",
      phone: "+1 (555) 345-6789",
      website: "https://securestorage.com",
      specialties: ["Climate Control", "Various Sizes", "Security"],
      description: "Secure storage solutions with climate control and 24/7 security monitoring.",
      cancellationPolicy: "30-day notice for unit cancellation",
      reviews: [
        {
          id: 1,
          user: "David Kim",
          rating: 5,
          comment: "Great storage facility. Very secure and clean units.",
          date: "2023-10-10",
          userImage: "https://randomuser.me/api/portraits/men/42.jpg"
        }
      ]
    },
    {
      id: 4,
      name: "Mobile Repair Experts",
      category: "Repair Services",
      images: [
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGhvbmUlMjByZXBhaXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBob25lJTIwcmVwYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
      ],
      location: "Tech Plaza",
      rating: 4.8,
      availability: "Closed",
      languages: ["English", "Arabic"],
      email: "repair@mobileexperts.com",
      phone: "+1 (555) 456-7890",
      website: null,
      specialties: ["Phone Repair", "Tablet Repair", "Laptop Repair"],
      description: "Expert repair services for mobile devices, tablets, and laptops with quick turnaround.",
      cancellationPolicy: "No fee for appointment cancellation",
      reviews: [
        {
          id: 1,
          user: "Lisa Wang",
          rating: 5,
          comment: "Fixed my phone quickly and affordably. Highly recommend!",
          date: "2023-10-08",
          userImage: "https://randomuser.me/api/portraits/women/32.jpg"
        }
      ]
    },
    // Add more services following the same pattern...
  ];

  const categories = [
    "Healthcare", 
    "Business Services", 
    "Storage", 
    "Repair Services", 
    "Legal Services", 
    "Laundry Services", 
    "Pet Services", 
    "Financial Services",
    "Fitness",
    "Beauty Services",
    "Home Services",
    "Translation"
  ];
  
  const locations = ["Central District", "Business District", "Industrial Area", "Tech Plaza", "Courthouse District", "Residential Area", "Animal Care District", "Financial District", "Recreation Area", "Wellness Center", "Service available citywide", "Online & Office"];
  const availabilityOptions = ["Open Now", "24/7 Available", "Closed"];
  const sortOptions = [
    { id: "recommended", label: "Recommended", icon: "star" },
    { id: "name", label: "Name: A to Z", icon: "sort-alphabetical-ascending" },
    { id: "nameDesc", label: "Name: Z to A", icon: "sort-alphabetical-descending" },
    { id: "rating", label: "Highest Rated", icon: "sort-descending" }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilteredServices(servicesData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Apply filters whenever activeFilters changes
  useEffect(() => {
    applyFiltersToData();
  }, [activeFilters]);

  const applyFiltersToData = () => {
    let result = [...servicesData];
    
    // Apply category filter
    if (activeFilters.category.length > 0) {
      result = result.filter(service => 
        activeFilters.category.includes(service.category)
      );
    }
    
    // Apply location filter
    if (activeFilters.location.length > 0) {
      result = result.filter(service => 
        activeFilters.location.includes(service.location)
      );
    }
    
    // Apply availability filter
    if (activeFilters.availability.length > 0) {
      result = result.filter(service => 
        activeFilters.availability.includes(service.availability)
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
      case "recommended":
      default:
        // Keep original order for recommended
        break;
    }
    
    setFilteredServices(result);
  };

  const toggleFilter = (filterType, value) => {
    if (filterType === "category" || filterType === "location" || filterType === "availability") {
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
      availability: [],
      sortBy: "recommended"
    });
  };

  const applyFiltersAndClose = () => {
    setFiltersOpen(false);
  };

  const handleViewDetails = (item) => {
    navigation.navigate("ServiceDetails", { serviceItem: item });
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
    if (status === "Open Now") return "bg-green-100 text-green-800";
    if (status === "24/7 Available") return "bg-blue-100 text-blue-800";
    if (status === "Closed") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading services...</Text>
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
          <Text className="text-white text-xl font-bold ml-4">Other Services</Text>
        </View>
        <TouchableOpacity 
          onPress={() => setFiltersOpen(true)}
          className="p-2 bg-white/20 rounded-full"
        >
          <MaterialIcons name="filter-list" size={24} color="white" />
          {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.availability.length > 0) && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFilters.category.length + activeFilters.location.length + activeFilters.availability.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Summary */}
      <View className="p-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <Text className="text-gray-600 text-sm">
          {filteredServices.length} of {servicesData.length} services
        </Text>
        {(activeFilters.category.length > 0 || activeFilters.location.length > 0 || activeFilters.availability.length > 0) && (
          <TouchableOpacity onPress={clearAllFilters} className="flex-row items-center">
            <Text className="text-[#006D77] text-sm mr-1">Clear filters</Text>
            <Ionicons name="close-circle" size={16} color="#006D77" />
          </TouchableOpacity>
        )}
      </View>

      {/* Services Listings */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
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
                      <MaterialIcons 
                        name={categoryIcons[item.category]} 
                        size={14} 
                        color="#006D77" 
                        style={{ marginRight: 6 }}
                      />
                      <Text className="text-gray-500 text-sm">{item.category}</Text>
                    </View>
                    <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(item.availability)}`}>
                      <Text className="text-xs font-medium">{item.availability}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="globe" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                      {item.languages.join(", ")}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center mt-2">
                    <Ionicons name="ribbon" size={14} color="#666" />
                    <Text className="text-gray-500 text-sm ml-1" numberOfLines={1}>
                      {item.specialties.join(", ")}
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
            <MaterialCommunityIcons name="tools" size={48} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
              No services found
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
                <Text className="text-lg font-semibold text-gray-800 mb-3">Service Category</Text>
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
                      <MaterialIcons 
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

export default OtherServicesListing;