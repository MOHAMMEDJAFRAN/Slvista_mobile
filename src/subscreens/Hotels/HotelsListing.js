import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, TextInput, Alert, ActivityIndicator } from "react-native";
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import HotelCard from "../../../components/HotelCard";
import FilterComponent from "../../../components/HotelFilter"; // We'll create this component

export default function HotelsListing() {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchParams } = route.params || {};
  
  // Get today's date and tomorrow's date for default values
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDateToYYYYMMDD = (date) => {
    return date.toISOString().split('T')[0];
  };
  
  // Sample hotel data with availability
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filteredHotels, setFilteredHotels] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [guestsModalVisible, setGuestsModalVisible] = useState(false);
  
  // Search parameters with default dates
  const [destination, setDestination] = useState(searchParams?.destination || "");
  const [checkInDate, setCheckInDate] = useState(
    searchParams?.checkInDate || formatDateToYYYYMMDD(today)
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams?.checkOutDate || formatDateToYYYYMMDD(tomorrow)
  );
  const [guests, setGuests] = useState(searchParams?.guests || {
    adults: 1,
    children: 0,
    rooms: 1,
    infants: 0
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [50, 1000],
    starRating: [],
    facilities: [],
    accessibility: [],
    sustainability: [],
    paymentOptions: []
  });

  const sortOptions = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Star Rating",
    "Distance"
  ];

  const facilitiesOptions = [
    "Free WiFi", "Swimming Pool", "Air Conditioning", "Free Breakfast", 
    "Free Parking", "Fitness Center", "Spa", "Restaurant", "Bar"
  ];
  
  const accessibilityOptions = [
    "Wheelchair Access", "Elevator", "Accessible Bathroom", 
    "Braille Signage", "Hearing Accessibility"
  ];
  
  const sustainabilityOptions = [
    "Green Key Certified", "Energy Efficient", "Water Conservation", 
    "Waste Reduction", "Local Sourcing"
  ];
  
  const paymentOptions = [
    "Credit Card", "Debit Card", "PayPal", "Cash", "Cryptocurrency"
  ];

  // Check if dates are valid and check-out is after check-in
  const validateDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true; // Allow empty dates
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      Alert.alert("Invalid Dates", "Check-out date must be after check-in date");
      return false;
    }
    
    return true;
  };

  // Check if hotel is available for selected dates
  const isHotelAvailable = (hotel, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true; // Show all hotels if no dates selected
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    return hotel.availability.some(period => {
      const availableFrom = new Date(period.from);
      const availableTo = new Date(period.to);
      
      return checkInDate >= availableFrom && checkOutDate <= availableTo;
    });
  };

  // Filter hotels based on search parameters
  useEffect(() => {
    if (loading) return;
    
    let results = allHotels;
    
    // Filter by destination
    if (destination && destination !== "Colombo, Sri Lanka") {
      results = results.filter(hotel => 
        hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
        hotel.name.toLowerCase().includes(destination.toLowerCase())
      );
    }
    
    // Filter by availability if dates are selected
    if (checkInDate && checkOutDate) {
      results = results.filter(hotel => 
        isHotelAvailable(hotel, checkInDate, checkOutDate)
      );
    }
    
    // Filter by star rating if selected
    if (filters.starRating.length > 0) {
      results = results.filter(hotel => 
        filters.starRating.includes(hotel.stars)
      );
    }
    
    // Filter by price range
    results = results.filter(hotel => 
      hotel.price >= filters.priceRange[0] && 
      hotel.price <= filters.priceRange[1]
    );
    
    // Filter by facilities if selected
    if (filters.facilities.length > 0) {
      results = results.filter(hotel => 
        filters.facilities.some(facility => 
          hotel.amenities.map(a => a.toLowerCase()).includes(facility.toLowerCase())
        )
      );
    }
    
    // Filter by accessibility if selected
    if (filters.accessibility.length > 0) {
      results = results.filter(hotel => 
        filters.accessibility.some(accessibility => 
          hotel.accessibility.map(a => a.toLowerCase()).includes(accessibility.toLowerCase())
        )
      );
    }
    
    // Filter by sustainability if selected
    if (filters.sustainability.length > 0) {
      results = results.filter(hotel => 
        filters.sustainability.some(sustainability => 
          hotel.sustainability.map(s => s.toLowerCase()).includes(sustainability.toLowerCase())
        )
      );
    }
    
    // Filter by payment options if selected
    if (filters.paymentOptions.length > 0) {
      results = results.filter(hotel => 
        filters.paymentOptions.some(payment => 
          hotel.paymentOptions.map(p => p.toLowerCase()).includes(payment.toLowerCase())
        )
      );
    }
    
    // Sort results
    switch(selectedSort) {
      case "Price: Low to High":
        results.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        results.sort((a, b) => b.price - a.price);
        break;
      case "Star Rating":
        results.sort((a, b) => b.stars - a.stars);
        break;
      case "Distance":
        // For demo purposes, sort by a mock distance property
        results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      default:
        // Recommended (sponsored first, then by rating)
        results.sort((a, b) => {
          if (a.sponsored && !b.sponsored) return -1;
          if (!a.sponsored && b.sponsored) return 1;
          return b.rating - a.rating;
        });
    }
    
    setFilteredHotels(results);
  }, [allHotels, destination, checkInDate, checkOutDate, filters, selectedSort, loading]);

  const toggleFilter = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [category]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [category]: [...currentValues, value]
        };
      }
    });
  };

  // Update price range
  const updatePriceRange = (values) => {
    setFilters(prev => ({
      ...prev,
      priceRange: values
    }));
  };

  // Handle date selection
  const handleDateSelect = (event, selectedDate) => {
    setShowDatePicker(null);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      if (showDatePicker === "checkin") {
        // Validate check-out date if it exists
        if (checkOutDate && !validateDates(formattedDate, checkOutDate)) {
          return;
        }
        setCheckInDate(formattedDate);
      } else if (showDatePicker === "checkout") {
        // Validate check-in date if it exists
        if (checkInDate && !validateDates(checkInDate, formattedDate)) {
          return;
        }
        setCheckOutDate(formattedDate);
      }
    }
  };

  // Update guests count
  const updateGuests = (type, value) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value)
    }));
  };

  // Format guests text without zero values
  const getGuestsText = () => {
    const parts = [];
    if (guests.adults > 0) parts.push(`${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}`);
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children !== 1 ? 'ren' : ''}`);
    if (guests.rooms > 0) parts.push(`${guests.rooms} Room${guests.rooms !== 1 ? 's' : ''}`);
    if (guests.infants > 0) parts.push(`${guests.infants} Infant${guests.infants !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Select guests';
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Select date";
    
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Handle View Deal button press
  const handleViewDeal = (hotel) => {
    console.log('Navigating with hotel:', hotel); // Check if hotel has rooms property
    
    navigation.navigate('HotelView1WithSafeArea', { 
      hotel: { ...hotel }, // Make sure to pass the full hotel object
      checkInDate,
      checkOutDate,
      guests
    });
  };
  
  // Apply search filters
  const applySearch = () => {
    // Validate dates if both are selected
    if (checkInDate && checkOutDate && !validateDates(checkInDate, checkOutDate)) {
      return;
    }
    setSearchModalVisible(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters({
      priceRange: [50, 1000],
      starRating: [],
      facilities: [],
      accessibility: [],
      sustainability: [],
      paymentOptions: []
    });
  };

  // Simulate loading data
  useEffect(() => {
    const loadHotels = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const hotelsData = [
        {
          id: 1,
          name: "The Capital Hotel",
          rating: 4.5,
          stars: 4,
          amenities: ["Free WiFi", "Swimming pool", "Air Conditioning", "Free Breakfast", "Free Parking"],
          price: 120,
          currency: "$",
          sponsored: true,
          location: "Colombo",
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          distance: "2.5 km from center",
          reviews: 1247,
          availability: [
            { from: "2025-09-09", to: "2025-09-10" } // Available all year
          ],
          accessibility: ["Wheelchair Access", "Elevator"],
          sustainability: ["Energy Efficient", "Water Conservation"],
          paymentOptions: ["Credit Card", "Debit Card", "Cash"]
        },
        {
          id: 2,
          name: "Oceanview Resort",
          rating: 4.8,
          stars: 5,
          amenities: ["Beach Access", "Spa", "Restaurant", "Pool Bar", "Fitness Center"],
          price: 220,
          currency: "$",
          sponsored: false,
          location: "Galle",
          image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          distance: "0.5 km from beach",
          reviews: 892,
          availability: [
            { from: "2025-09-09", to: "2025-09-10" } // Available March to November
          ],
          accessibility: ["Wheelchair Access", "Elevator", "Accessible Bathroom"],
          sustainability: ["Green Key Certified", "Energy Efficient", "Local Sourcing"],
          paymentOptions: ["Credit Card", "PayPal", "Cash"]
        },
        {
          id: 3,
          name: "City Center Hotel",
          rating: 4.2,
          stars: 3,
          amenities: ["Business Center", "Meeting Rooms", "Restaurant", "24-hour Front Desk"],
          price: 85,
          currency: "$",
          sponsored: false,
          location: "Colombo",
          image: "https://images.unsplash.com/phone-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          distance: "City center",
          reviews: 567,
          availability: [
            { from: "2025-09-09", to: "2025-09-10" } // Available all year
          ],
          accessibility: ["Elevator"],
          sustainability: ["Energy Efficient"],
          paymentOptions: ["Credit Card", "Debit Card", "Cash"]
        },
        {
          id: 4,
          name: "Mountain Retreat",
          rating: 4.6,
          stars: 4,
          amenities: ["Mountain View", "Hiking Trails", "Fireplace", "Restaurant", "Free Parking"],
          price: 150,
          currency: "$",
          sponsored: true,
          location: "Kandy",
          image: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          distance: "3.2 km from city",
          reviews: 1034,
          availability: [
            { from: "2025-08-09", to: "2025-08-10" } // Available April to October
          ],
          accessibility: ["Wheelchair Access"],
          sustainability: ["Water Conservation", "Waste Reduction", "Local Sourcing"],
          paymentOptions: ["Credit Card", "Cash"]
        },
      ];
      
      setAllHotels(hotelsData);
      setLoading(false);
    };
    
    loadHotels();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header with search bar and back button */}
      <View className="bg-white px-4 py-3 shadow-sm flex-row items-center">
        <TouchableOpacity 
          className="rounded-full p-3 mr-2 bg-gray-100"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#006D77" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-between border border-gray-300 rounded-full px-4 py-3"
          onPress={() => setSearchModalVisible(true)}
        >
          <View className="flex-row items-center flex-1">
            <Ionicons name="search" size={20} color="#006D77" />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-800" numberOfLines={1}>
                {destination || "Where are you going?"}
              </Text>
              <Text className="text-gray-500 text-xs" numberOfLines={1}>
                {formatDateForDisplay(checkInDate)} - {formatDateForDisplay(checkOutDate)} • {getGuestsText()}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View className="flex-row justify-between bg-white px-4 py-3 shadow-sm">
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setSortModalVisible(true)}
        >
          <MaterialIcons name="sort" size={18} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">Sort</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setFilterModalVisible(true)}
        >
          <FontAwesome name="filter" size={16} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">Filter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="flex-row items-center px-3 py-2 rounded-full bg-cyan-50"
          onPress={() => setMapModalVisible(true)}
        >
          <Entypo name="map" size={18} color="#006D77" />
          <Text className="ml-1 text-cyan-800 font-medium">Map</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View className="px-4 py-3 bg-white mt-1">
        <Text className="text-gray-600">{filteredHotels.length} properties found</Text>
        {checkInDate && checkOutDate && (
          <Text className="text-gray-500 text-xs mt-1">
            Showing availability for {formatDateForDisplay(checkInDate)} to {formatDateForDisplay(checkOutDate)}
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006D77" />
          <Text className="mt-4 text-gray-600">Loading hotels...</Text>
        </View>
      )}

      {/* Hotels List */}
      {!loading && (
        <ScrollView className="flex-1 px-4 py-3">
          {filteredHotels.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">No hotels found</Text>
              <Text className="text-gray-500 text-center mt-2">
                Try adjusting your search criteria or filters to find more options.
              </Text>
            </View>
          ) : (
            filteredHotels.map((hotel) => (
              <HotelCard 
                key={hotel.id} 
                hotel={hotel} 
                onViewDeal={() => handleViewDeal(hotel)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Search Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Search Hotels</Text>
            
            {/* Destination Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Destination / Hotel</Text>
              <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-3">
                <MaterialIcons name="location-on" size={22} color="#006D77" />
                <TextInput
                  className="ml-3 text-base font-semibold text-gray-800 flex-1"
                  value={destination}
                  onChangeText={setDestination}
                  placeholder="Enter destination or hotel name"
                />
              </View>
            </View>
            
            {/* Check-in / Check-out */}
            <View className="mb-4 flex-row justify-between gap-4">
              <View className="flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">Check in</Text>
                <TouchableOpacity 
                  className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-3"
                  onPress={() => setShowDatePicker("checkin")}
                >
                  <FontAwesome name="calendar" size={18} color="#006D77" />
                  <Text className="ml-3 text-base font-semibold text-gray-800">
                    {formatDateForDisplay(checkInDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="mb-2 text-sm font-medium text-gray-700">Check out</Text>
                <TouchableOpacity 
                  className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-3"
                  onPress={() => setShowDatePicker("checkout")}
                >
                  <FontAwesome name="calendar" size={18} color="#006D77" />
                  <Text className="ml-3 text-base font-semibold text-gray-800">
                    {formatDateForDisplay(checkOutDate)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={showDatePicker === "checkin" ? new Date(checkInDate) : new Date(checkOutDate)}
                mode="date"
                display="default"
                onChange={handleDateSelect}
                minimumDate={new Date()}
              />
            )}

            {/* Guests Selector */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-gray-700">Guests & Rooms</Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] bg-white px-4 py-3"
                onPress={() => setGuestsModalVisible(true)}
              >
                <View className="flex-row items-center">
                  <Ionicons name="people" size={22} color="#0e7490" />
                  <Text className="ml-3 text-base font-semibold text-gray-800">
                    {getGuestsText()}
                  </Text>
                </View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={26}
                  color="#006D77"
                />
              </TouchableOpacity>
            </View>
            
            <View className="flex-row space-x-3 gap-3">
              <TouchableOpacity 
                className="flex-1 rounded-xl bg-red-700 py-4 mb-4"
                onPress={() => setSearchModalVisible(false)}
              >
                <Text className="text-center text-white font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 rounded-xl bg-[#006D77] py-4 mb-4"
                onPress={applySearch}
              >
                <Text className="text-center text-white font-semibold text-lg">Search Hotels</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Guests Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={guestsModalVisible}
        onRequestClose={() => setGuestsModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Guests & Rooms</Text>
            
            {/* Adults Counter */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Adults</Text>
                <Text className="text-sm text-gray-500">Age 13 or above</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => updateGuests('adults', -1)}
                  disabled={guests.adults <= 1}
                  className={`w-8 h-8 rounded-full items-center justify-center ${guests.adults <= 1 ? 'bg-gray-200' : 'bg-cyan-100'}`}
                >
                  <Entypo name="minus" size={16} color={guests.adults <= 1 ? "#9ca3af" : "#006D77"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.adults}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('adults', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Children Counter */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Children</Text>
                <Text className="text-sm text-gray-500">Age 2-12</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => updateGuests('children', -1)}
                  disabled={guests.children <= 0}
                  className={`w-8 h-8 rounded-full items-center justify-center ${guests.children <= 0 ? 'bg-gray-200' : 'bg-cyan-100'}`}
                >
                  <Entypo name="minus" size={16} color={guests.children <= 0 ? "#9ca3af" : "#0e7490"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.children}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('children', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rooms Counter */}
            <View className="flex-row justify-between items-center mb-4">
              <View>
                <Text className="text-base font-medium text-gray-800">Rooms</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => updateGuests('rooms', -1)}
                  disabled={guests.rooms <= 1}
                  className={`w-8 h-8 rounded-full items-center justify-center ${guests.rooms <= 1 ? 'bg-gray-200' : 'bg-cyan-100'}`}
                >
                  <Entypo name="minus" size={16} color={guests.rooms <= 1 ? "#9ca3af" : "#006D77"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.rooms}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('rooms', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Infants Counter */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-base font-medium text-gray-800">Infants</Text>
                <Text className="text-sm text-gray-500">Age 0-2</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity 
                  onPress={() => updateGuests('infants', -1)}
                  disabled={guests.infants <= 0}
                  className={`w-8 h-8 rounded-full items-center justify-center ${guests.infants <= 0 ? 'bg-gray-200' : 'bg-cyan-100'}`}
                >
                  <Entypo name="minus" size={16} color={guests.infants <= 0 ? "#9ca3af" : "#006D77"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.infants}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('infants', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#006D77" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setGuestsModalVisible(false)}
              className="rounded-xl bg-[#006D77] py-4 active:bg-cyan-700"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4">Sort by</Text>
            
            {sortOptions.map((option) => (
              <TouchableOpacity 
                key={option}
                className="py-4 border-b border-gray-100"
                onPress={() => {
                  setSelectedSort(option);
                  setSortModalVisible(false);
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text className={`text-lg ${selectedSort === option ? 'text-cyan-700 font-semibold' : 'text-gray-700'}`}>
                    {option}
                  </Text>
                  {selectedSort === option && (
                    <Ionicons name="checkmark" size={20} color="#006D77" />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              className="mt-4 rounded-xl bg-gray-100 py-4"
              onPress={() => setSortModalVisible(false)}
            >
              <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Filter Modal - Using the reusable component */}
      <FilterComponent
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
        onPriceRangeChange={updatePriceRange}
        facilitiesOptions={facilitiesOptions}
        accessibilityOptions={accessibilityOptions}
        sustainabilityOptions={sustainabilityOptions}
        paymentOptions={paymentOptions}
        toggleFilter={toggleFilter}
        resetAllFilters={resetAllFilters}
      />

      {/* Map Modal - Placeholder */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={mapModalVisible}
        onRequestClose={() => setMapModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 h-4/5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Map View</Text>
              <TouchableOpacity onPress={() => setMapModalVisible(false)}>
                <Ionicons name="close" size={24} color="#006D77" />
              </TouchableOpacity>
            </View>
            
            <View className="flex-1 bg-gray-200 items-center justify-center rounded-xl mb-4">
              <Text className="text-gray-500">Map would be displayed here</Text>
            </View>
            
            <TouchableOpacity 
              className="rounded-xl bg-cyan-700 py-4"
              onPress={() => setMapModalVisible(false)}
            >
              <Text className="text-center text-white font-semibold">Close Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}