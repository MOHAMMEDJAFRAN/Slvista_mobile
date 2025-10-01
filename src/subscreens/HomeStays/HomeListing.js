import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome, Entypo } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import RoomCard from '../../../components/HomeRoomCard';
import FilterComponent from '../../../components/RoomFilter';

export default function HomeListing({ navigation }) {
  const route = useRoute();
  const { searchParams } = route.params || {};
  
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [guestsModalVisible, setGuestsModalVisible] = useState(false);

  // Search parameters
  const [destination, setDestination] = useState(searchParams?.destination || "");
  const [checkInDate, setCheckInDate] = useState(searchParams?.checkInDate || "");
  const [checkOutDate, setCheckOutDate] = useState(searchParams?.checkOutDate || "");
  const [guests, setGuests] = useState(searchParams?.guests || {
    adults: 1,
    children: 0,
    rooms: 1,
    infants: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [50, 500],
    roomType: [],
    amenities: [],
    bedType: [],
    viewType: [],
    accessibility: []
  });

  const sortOptions = [
    "Recommended",
    "Price: Low to High",
    "Price: High to Low",
    "Room Size",
    "Guest Rating"
  ];

  const roomTypeOptions = ["Standard", "Deluxe", "Suite", "Family", "Executive"];
  const bedTypeOptions = ["Single", "Double", "Queen", "King", "Twin"];
  const viewTypeOptions = ["City View", "Ocean View", "Garden View", "Mountain View", "Pool View"];
  const amenitiesOptions = ["Free WiFi", "TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe", "Balcony"];
  const accessibilityOptions = ["Wheelchair Access", "Accessible Bathroom", "Elevator Access"];

  // Check if dates are valid and check-out is after check-in
  const validateDates = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (checkOutDate <= checkInDate) {
      alert("Check-out date must be after check-in date");
      return false;
    }
    
    return true;
  };

  // Check if room is available for selected dates
  const isRoomAvailable = (room, checkIn, checkOut) => {
    if (!checkIn || !checkOut) return true;
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    return room.availability.some(period => {
      const availableFrom = new Date(period.from);
      const availableTo = new Date(period.to);
      
      return checkInDate >= availableFrom && checkOutDate <= availableTo;
    });
  };

  // Filter rooms based on search and filter criteria
  useEffect(() => {
    if (loading) return;
    
    let results = allRooms;
    
    // Filter by destination if provided
    if (destination) {
      results = results.filter(room => 
        room.location?.toLowerCase().includes(destination.toLowerCase()) ||
        room.title?.toLowerCase().includes(destination.toLowerCase())
      );
    }
    
    // Filter by availability if dates are selected
    if (checkInDate && checkOutDate) {
      results = results.filter(room => 
        isRoomAvailable(room, checkInDate, checkOutDate)
      );
    }
    
    // Filter by price range
    results = results.filter(room => 
      room.price >= filters.priceRange[0] && 
      room.price <= filters.priceRange[1]
    );
    
    // Filter by room type if selected
    if (filters.roomType.length > 0) {
      results = results.filter(room => 
        filters.roomType.includes(room.type)
      );
    }
    
    // Filter by bed type if selected
    if (filters.bedType.length > 0) {
      results = results.filter(room => 
        filters.bedType.includes(room.bedType)
      );
    }
    
    // Filter by view type if selected
    if (filters.viewType.length > 0) {
      results = results.filter(room => 
        filters.viewType.includes(room.view)
      );
    }
    
    // Filter by amenities if selected
    if (filters.amenities.length > 0) {
      results = results.filter(room => 
        filters.amenities.some(amenity => 
          room.amenities.map(a => a.toLowerCase()).includes(amenity.toLowerCase())
        )
      );
    }
    
    // Filter by accessibility if selected
    if (filters.accessibility.length > 0) {
      results = results.filter(room => 
        filters.accessibility.some(accessibility => 
          room.accessibility.map(a => a.toLowerCase()).includes(accessibility.toLowerCase())
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
      case "Room Size":
        results.sort((a, b) => b.size - a.size);
        break;
      case "Guest Rating":
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Recommended (by rating and popularity)
        results.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1;
          if (!a.isPopular && b.isPopular) return 1;
          return b.rating - a.rating;
        });
    }
    
    setFilteredRooms(results);
  }, [allRooms, destination, checkInDate, checkOutDate, filters, selectedSort, loading]);

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

  const updatePriceRange = (values) => {
    setFilters(prev => ({
      ...prev,
      priceRange: values
    }));
  };

  const resetAllFilters = () => {
    setFilters({
      priceRange: [50, 500],
      roomType: [],
      amenities: [],
      bedType: [],
      viewType: [],
      accessibility: []
    });
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    const formattedDate = day.dateString;
    
    if (showDatePicker === "checkin") {
      if (checkOutDate && !validateDates(formattedDate, checkOutDate)) {
        return;
      }
      setCheckInDate(formattedDate);
    } else if (showDatePicker === "checkout") {
      if (checkInDate && !validateDates(checkInDate, formattedDate)) {
        return;
      }
      setCheckOutDate(formattedDate);
    }
    setShowDatePicker(null);
  };

  // Close date picker
  const closeDatePicker = () => {
    setShowDatePicker(null);
  };

  // Update guests count
  const updateGuests = (type, value) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value)
    }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Format guests text
  const getGuestsText = () => {
    const parts = [];
    if (guests.adults > 0) parts.push(`${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}`);
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children !== 1 ? 'ren' : ''}`);
    if (guests.rooms > 0) parts.push(`${guests.rooms} Room${guests.rooms !== 1 ? 's' : ''}`);
    if (guests.infants > 0) parts.push(`${guests.infants} Infant${guests.infants !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'Select guests';
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Apply search filters
  const applySearch = () => {
    if (checkInDate && checkOutDate && !validateDates(checkInDate, checkOutDate)) {
      return;
    }
    setSearchModalVisible(false);
  };

  // Simulate loading rooms data with availability and multiple images
  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      const twoWeeks = new Date();
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      
      const formatDate = (date) => date.toISOString().split('T')[0];
      
      const roomsData = [
        {
          id: 1,
          title: "Deluxe Ocean View Room",
          type: "Deluxe",
          price: 180,
          size: 35,
          bedType: "King",
          view: "Ocean View",
          maxGuests: 2,
          rating: 4.7,
          reviews: 234,
          amenities: ["Free WiFi", "TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Balcony"],
          accessibility: ["Wheelchair Access", "Elevator Access"],
          images: [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          ],
          location: "Colombo Beach Resort",
          isPopular: true,
          description: "Spacious room with stunning ocean views and premium amenities",
          availability: [
            { from: "2025-09-19", to: "2025-09-20" } 
          ]
        },
        {
          id: 2,
          title: "Executive Suite",
          type: "Suite",
          price: 320,
          size: 60,
          bedType: "King",
          view: "City View",
          maxGuests: 3,
          rating: 4.9,
          reviews: 156,
          amenities: ["Free WiFi", "TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe", "Separate Living Area"],
          accessibility: ["Elevator Access"],
          images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1540518614846-7eded433c457",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791"
          ],
          location: "Colombo City Hotel",
          isPopular: false,
          description: "Luxurious suite with separate living area and premium services",
          availability: [
            { from: "2025-09-15", to: "2025-09-16" } 
          ]
        },
        {
          id: 3,
          title: "Standard City Room",
          type: "Standard",
          price: 120,
          size: 25,
          bedType: "Queen",
          view: "City View",
          maxGuests: 2,
          rating: 4.2,
          reviews: 189,
          amenities: ["Free WiFi", "TV", "Air Conditioning"],
          accessibility: [],
          images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791"
          ],
          location: "Galle Guest House",
          isPopular: false,
          description: "Comfortable and affordable room with all essential amenities",
          availability: [
            { from: "2025-09-17", to: "2025-09-20" } 
          ]
        },
        {
          id: 4,
          title: "Family Room",
          type: "Family",
          price: 250,
          size: 45,
          bedType: "Twin",
          view: "Garden View",
          maxGuests: 4,
          rating: 4.5,
          reviews: 127,
          amenities: ["Free WiFi", "TV", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe"],
          accessibility: ["Wheelchair Access", "Accessible Bathroom"],
          images: [
            "https://images.unsplash.com/photo-1540518614846-7eded433c457",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791"
          ],
          location: "Kandy Mountain Resort",
          isPopular: true,
          description: "Perfect for families with extra space and child-friendly amenities",
          availability: [
            { from: "2025-09-30", to: "2025-10-20" } 
          ]
        }
      ];
      
      setAllRooms(roomsData);
      setLoading(false);
    };
    
    loadRooms();
  }, []);

  const handleRoomSelect = (room) => {
    navigation.navigate('HomeView2', {
      room,
      checkInDate,
      checkOutDate,
      guests
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header with search bar */}
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
        <Text className="text-gray-600">{filteredRooms.length} rooms available</Text>
        {destination && (
          <Text className="text-gray-500 text-xs mt-1">
            Showing results for {destination}
          </Text>
        )}
        {checkInDate && checkOutDate && (
          <Text className="text-gray-500 text-xs mt-1">
            {formatDateForDisplay(checkInDate)} - {formatDateForDisplay(checkOutDate)}
          </Text>
        )}
      </View>

      {/* Loading Indicator */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006D77" />
          <Text className="mt-4 text-gray-600">Loading rooms...</Text>
        </View>
      )}

      {/* Rooms List */}
      {!loading && (
        <ScrollView className="flex-1 px-4 py-3">
          {filteredRooms.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Ionicons name="search-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">No rooms found</Text>
              <Text className="text-gray-500 text-center mt-2">
                Try adjusting your search criteria or filters to find more options.
              </Text>
            </View>
          ) : (
            filteredRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                {...room}
                onSelect={() => handleRoomSelect(room)}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
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
            
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Search Homes</Text>
            
            {/* Destination Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Destination / Rooms</Text>
              <View className="flex-row items-center rounded-full border-2 border-[#006D77] bg-white px-4 py-2">
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
                  onPress={() =>
                    setShowDatePicker(prev =>
                      prev === "checkin" ? null : "checkin"
                    )
                  }

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
                  onPress={() =>
                    setShowDatePicker(prev =>
                      prev === "checkout" ? null : "checkout"
                    )
                  }

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
              <View>
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-gray-800">
                    Select {showDatePicker === "checkin" ? "Check-in" : "Check-out"} Date
                  </Text>
                  <TouchableOpacity onPress={closeDatePicker}>
                    {/* <Ionicons name="close" size={24} color="#006D77" /> */}
                  </TouchableOpacity>
                </View>
                <Calendar
                  onDayPress={handleDateSelect}
                  minDate={getTodayDate()}
                  theme={{
                    selectedDayBackgroundColor: "#006D77",
                    todayTextColor: "#006D77",
                    arrowColor: "#006D77",
                    monthTextColor: "#006D77",
                  }}
                  markedDates={{
                    [checkInDate]: { selected: true, selectedColor: "#006D77" },
                    [checkOutDate]: { selected: true, selectedColor: "#006D77" },
                  }}
                />
              </View>
            )}

            {/* Guests Selector */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-gray-700">Guests & Rooms</Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between rounded-full border-2 border-[#006D77] bg-white px-4 py-3"
                onPress={() => setGuestsModalVisible(true)}
              >
                <View className="flex-row items-center">
                  <Ionicons name="people" size={22} color="#006D77" />
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
                className="flex-1 rounded-full bg-red-700 py-4 mb-4"
                onPress={() => setSearchModalVisible(false)}
              >
                <Text className="text-center text-white font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex-1 rounded-full bg-[#006D77] py-4 mb-4"
                onPress={applySearch}
              >
                <Text className="text-center text-white font-semibold text-lg">Search Homes</Text>
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
                  <Entypo name="minus" size={16} color={guests.children <= 0 ? "#9ca3af" : "#006D77"} />
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

      {/* Filter Modal */}
      <FilterComponent
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={filters}
        onFilterChange={setFilters}
        onPriceRangeChange={updatePriceRange}
        roomTypeOptions={roomTypeOptions}
        bedTypeOptions={bedTypeOptions}
        viewTypeOptions={viewTypeOptions}
        amenitiesOptions={amenitiesOptions}
        accessibilityOptions={accessibilityOptions}
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
    </SafeAreaView>
  );
}