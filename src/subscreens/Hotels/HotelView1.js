import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import RoomCard from '../../../components/RoomCard';

export default function HotelView1({ route = {}, navigation }) {
  // Get hotel data passed from HotelsListing
  
  const { hotel, checkInDate, checkOutDate, guests } = route.params || {};
  
  const [hotelData, setHotelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample hotel database
  const hotelDatabase = {
    1: {
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
      accessibility: ["Wheelchair Access", "Elevator"],
      sustainability: ["Energy Efficient", "Water Conservation"],
      paymentOptions: ["Credit Card", "Debit Card", "Cash"],
      rooms: [
        {
          id: 1,
          title: "Deluxe Room",
          price: 120,
          description: "Spacious room with king-sized bed and city view",
          features: ["Free WiFi", "Air Conditioning", "TV", "Coffee Maker"],
          image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop&auto=format&q=80&brightness=110",
          maxGuests: 2,
          bedType: "King Bed",
          size: "35.5",
          rating: 4.7,
          reviews: 342
        },
        {
          id: 2,
          title: "Executive Suite",
          price: 180,
          description: "Luxurious suite with separate living area",
          features: ["Free WiFi", "Air Conditioning", "TV", "Mini Bar", "Jacuzzi"],
          image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 3,
          bedType: "King Bed",
          size: "55",
          rating: 4.9,
          reviews: 198
        },
        {
          id: 3,
          title: "Family Room",
          price: 220,
          description: "Perfect for families with extra space and amenities",
          features: ["Free WiFi", "Air Conditioning", "TV", "Coffee Maker", "Extra Bed"],
          image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 4,
          bedType: "2 Queen Beds",
          size: "45.5",
          rating: 4.5,
          reviews: 156
        }
      ]
    },
    2: {
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
      accessibility: ["Wheelchair Access", "Elevator", "Accessible Bathroom"],
      sustainability: ["Green Key Certified", "Energy Efficient", "Local Sourcing"],
      paymentOptions: ["Credit Card", "PayPal", "Cash"],
      rooms: [
        {
          id: 4,
          title: "Ocean View Room",
          price: 220,
          description: "Room with stunning ocean view",
          features: ["Free WiFi", "Air Conditioning", "TV", "Balcony"],
          image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 2,
          bedType: "King Bed",
          size: "40",
          rating: 4.8,
          reviews: 245
        },
        {
          id: 5,
          title: "Beachfront Villa",
          price: 350,
          description: "Private villa with direct beach access",
          features: ["Free WiFi", "Air Conditioning", "Private Pool", "Kitchen", "Beach Access"],
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 4,
          bedType: "King Bed + Sofa Bed",
          size: "75",
          rating: 4.9,
          reviews: 178
        }
      ]
    },
    3: {
      id: 3,
      name: "City Center Hotel",
      rating: 4.2,
      stars: 3,
      amenities: ["Business Center", "Meeting Rooms", "Restaurant", "24-hour Front Desk"],
      price: 85,
      currency: "$",
      sponsored: false,
      location: "Colombo",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop&auto=format&q=80",
      distance: "City center",
      reviews: 567,
      accessibility: ["Elevator"],
      sustainability: ["Energy Efficient"],
      paymentOptions: ["Credit Card", "Debit Card", "Cash"],
      rooms: [
        {
          id: 6,
          title: "Standard Room",
          price: 85,
          description: "Comfortable room with all essential amenities",
          features: ["Free WiFi", "Air Conditioning", "TV", "Work Desk"],
          image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 2,
          bedType: "Queen Bed",
          size: "28",
          rating: 4.2,
          reviews: 234
        },
        {
          id: 7,
          title: "Business Room",
          price: 120,
          description: "Room with extra workspace and amenities for business travelers",
          features: ["Free WiFi", "Air Conditioning", "TV", "Large Work Desk", "Printer"],
          image: "https://images.unsplash.com/photo-1574643156929-51fa098b39c7?w=800&h=600&fit=crop&auto=format&q=80",
          maxGuests: 2,
          bedType: "King Bed",
          size: "32",
          rating: 4.5,
          reviews: 156
        }
      ]
    }
  };

  // Function to fetch hotel data
  const fetchHotelData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Received hotel data:', hotel);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // If we have a full hotel object with rooms, use it
      if (hotel && hotel.rooms) {
        console.log('Using passed hotel data with rooms');
        setHotelData(hotel);
      } 
      // If we only have hotel ID, fetch from database
      else if (hotel && hotel.id) {
        console.log('Fetching hotel data by ID:', hotel.id);
        const hotelFromDB = hotelDatabase[hotel.id];
        if (hotelFromDB) {
          setHotelData(hotelFromDB);
        } else {
          throw new Error('Hotel not found in database');
        }
      }
      // If hotel is a string (name only), try to find by name
      else if (typeof hotel === 'string') {
        console.log('Finding hotel by name:', hotel);
        const foundHotel = Object.values(hotelDatabase).find(h => 
          h.name.toLowerCase().includes(hotel.toLowerCase())
        );
        if (foundHotel) {
          setHotelData(foundHotel);
        } else {
          throw new Error('Hotel not found by name');
        }
      }
      // If no hotel data, use default
      else {
        console.log('Using default hotel data');
        setHotelData(hotelDatabase[1]);
      }
    } catch (error) {
      console.error('Error fetching hotel data:', error);
      setError(error.message);
      setHotelData(hotelDatabase[1]); // Fallback to default
    } finally {
      setLoading(false);
    }
  };

  // Fetch hotel data on component mount
  useEffect(() => {
    fetchHotelData();
  }, [hotel]);

  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: { adults: 0, children: 0, rooms: 0, infants: 0 }
  });

  // Function to set search parameters from route
  const setSearchParameters = () => {
    setSearchParams({
      checkInDate: checkInDate || '',
      checkOutDate: checkOutDate || '',
      guests: guests || { adults: 0, children: 0, rooms: 0, infants: 0 }
    });
  };

  // Set search parameters from route
  useEffect(() => {
    setSearchParameters();
  }, [checkInDate, checkOutDate, guests]);

  // Function to calculate total guests
  const calculateTotalGuests = (guestsData) => {
    if (!guestsData) return 0;
    return (guestsData.adults || 0) + (guestsData.children || 0);
  };

  // Calculate total guests
  const totalGuests = useMemo(() => {
    return calculateTotalGuests(searchParams.guests);
  }, [searchParams.guests]);

  // Function to filter rooms based on guest count
  const filterRoomsByGuests = (rooms, guestCount) => {
    if (!rooms || !rooms.length) {
      console.log('No rooms available to filter');
      return [];
    }
    
    console.log('Total guests from search:', guestCount);
    console.log('All rooms:', rooms.map(r => ({ name: r.title, maxGuests: r.maxGuests })));
    
    // If no guests specified or total guests is 0, show all rooms
    if (!searchParams.guests || guestCount === 0) {
      console.log('Showing all rooms (no guest filter)');
      return rooms;
    }
    
    // Filter rooms that can accommodate the number of guests
    const filtered = rooms.filter(room => {
      const maxGuests = typeof room.maxGuests === 'number' 
        ? room.maxGuests 
        : parseInt(room.maxGuests) || 0;
      
      const canAccommodate = maxGuests >= guestCount;
      console.log(`Room: ${room.title}, Max: ${maxGuests}, Needed: ${guestCount}, Can accommodate: ${canAccommodate}`);
      
      return canAccommodate;
    });
    
    console.log('Filtered rooms:', filtered.map(r => r.title));
    return filtered;
  };

  // Filter rooms based on guest count
  const filteredRooms = useMemo(() => {
    if (!hotelData || !hotelData.rooms) return [];
    return filterRoomsByGuests(hotelData.rooms, totalGuests);
  }, [hotelData, totalGuests]);

  // Function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      return "";
    }
  };

  // Function to format guests text
  const getGuestsText = () => {
    if (!searchParams.guests) return "";
    const parts = [];
    if (searchParams.guests.adults > 0) parts.push(`${searchParams.guests.adults} Adult${searchParams.guests.adults !== 1 ? 's' : ''}`);
    if (searchParams.guests.children > 0) parts.push(`${searchParams.guests.children} Child${searchParams.guests.children !== 1 ? 'ren' : ''}`);
    if (searchParams.guests.rooms > 0) parts.push(`${searchParams.guests.rooms} Room${searchParams.guests.rooms !== 1 ? 's' : ''}`);
    if (searchParams.guests.infants > 0) parts.push(`${searchParams.guests.infants} Infant${searchParams.guests.infants !== 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : '';
  };

  // Function to show debug information
  const showDebugInfo = () => {
    Alert.alert(
      "🔍 Search Parameters",
      `🏨 Hotel: ${hotelData?.name || 'Unknown'}\n` +
      `📅 Check-in: ${formatDateForDisplay(searchParams.checkInDate) || 'Not set'}\n` +
      `📅 Check-out: ${formatDateForDisplay(searchParams.checkOutDate) || 'Not set'}\n` +
      `👥 Guests: ${getGuestsText() || 'None'}\n` +
      `🔢 Total Guests: ${totalGuests}\n` +
      `🛏️ Available Rooms: ${filteredRooms?.length || 0}`,
      [
        {
          text: "Close",
          style: "cancel"
        }
      ],
      { 
        cancelable: true,
        // Some Android-specific styling (if supported)
        userInterfaceStyle: 'light'
      }
    );
  };

  // Function to handle room selection
  const handleRoomSelect = (room) => {
    navigation.navigate('RoomDetails', { 
      room, 
      hotel: hotelData,
      checkInDate: searchParams.checkInDate,
      checkOutDate: searchParams.checkOutDate,
      guests: searchParams.guests
    });
  };

  // Function to render star ratings
  const renderStarRating = (stars) => {
    return (
      <View className="flex-row items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Ionicons 
            key={i} 
            name="star" 
            size={16} 
            color={i < stars ? "#FFD700" : "#D1D5DB"} 
          />
        ))}
        <Text className="ml-2 text-white font-semibold">{hotelData.rating}</Text>
        <Text className="ml-1 text-white">({hotelData.reviews} reviews)</Text>
      </View>
    );
  };

  // Function to render loading state
  const renderLoading = () => (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <ActivityIndicator size="large" color="#006D77" />
      <Text className="mt-4 text-gray-600">Loading hotel details...</Text>
    </View>
  );

  // Function to render error state
  const renderError = () => (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      <Ionicons name="warning" size={48} color="#EF4444" />
      <Text className="text-lg font-semibold text-gray-800 mt-4">Something went wrong</Text>
      <Text className="text-gray-600 text-center mt-2">{error}</Text>
      <TouchableOpacity 
        className="mt-6 bg-cyan-700 px-6 py-3 rounded-full"
        onPress={fetchHotelData}
      >
        <Text className="text-white font-semibold">Try Again</Text>
      </TouchableOpacity>
    </View>
  );

  // Show loading state
  if (loading) {
    return renderLoading();
  }

  // Show error state
  if (error && !hotelData) {
    return renderError();
  }

  const hotelImage = { uri: hotelData.image };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-200 bg-white">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <Ionicons name="arrow-back" size={22} color="#006D77" />
        </TouchableOpacity>

        {/* Title centered */}
        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          {hotelData.name}
        </Text>

        {/* Debug Button */}
        <TouchableOpacity
          onPress={showDebugInfo}
          className="h-11 w-11 items-center justify-center">
          <Ionicons name="information-circle" size={26} color="#006D77" />
        </TouchableOpacity>
      </View>

      {/* Date and Guest Info */}
      {(searchParams.checkInDate || searchParams.guests) && (
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            {searchParams.checkInDate && searchParams.checkOutDate && (
              <View className="flex-row items-center">
                <FontAwesome name="calendar" size={16} color="#006D77" />
                <Text className="ml-2 text-gray-700">
                  {formatDateForDisplay(searchParams.checkInDate)} - {formatDateForDisplay(searchParams.checkOutDate)}
                </Text>
              </View>
            )}
            
            {searchParams.guests && (
              <View className="flex-row items-center">
                <Ionicons name="people" size={16} color="#006D77" />
                <Text className="ml-2 text-gray-700">{getGuestsText()}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Scrollable Content */}
      <ScrollView className="p-4">
        {/* Hotel Info Card with background image */}
        <ImageBackground
          source={hotelImage}
          className="overflow-hidden rounded-2xl h-72"
          resizeMode="cover"
        >
          <View className="flex-1 justify-end p-4 bg-black/30">
            {/* Star Rating */}
            {renderStarRating(hotelData.stars)}
            
            {/* Hotel Name */}
            <Text className="text-2xl font-bold text-white">{hotelData.name}</Text>
            
            {/* Location */}
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={16} color="white" />
              <Text className="ml-1 text-white">{hotelData.location} • {hotelData.distance}</Text>
            </View>
          </View>
        </ImageBackground>

        {/* Features Box */}
        <View className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Key Features</Text>
          
          <View className="flex-row items-start mb-3">
            <MaterialIcons name="location-on" size={20} color="#4CAF50" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium">Prime Location</Text>
              <Text className="text-xs text-gray-500">In the heart of the city with easy access to attractions</Text>
            </View>
          </View>

          <View className="flex-row items-start mb-3">
            <MaterialIcons name="cancel" size={20} color="#4CAF50" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium">Free Cancellation</Text>
              <Text className="text-xs text-gray-500">Cancel up to 24 hours before check-in for a full refund</Text>
            </View>
          </View>

          <View className="flex-row items-start">
            <MaterialIcons name="star" size={20} color="#4CAF50" />
            <View className="ml-3 flex-1">
              <Text className="text-sm font-medium">Excellent Value</Text>
              <Text className="text-xs text-gray-500">Rated 4.5+ by hundreds of satisfied guests</Text>
            </View>
          </View>
        </View>

        {/* Amenities */}
        <View className="mt-4 bg-white rounded-xl p-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">Amenities</Text>
          <View className="flex-row flex-wrap">
            {hotelData.amenities.map((amenity, index) => (
              <View key={index} className="flex-row items-center w-1/2 mb-3">
                <Ionicons name="checkmark-circle" size={16} color="#0e7490" />
                <Text className="ml-2 text-sm text-gray-700">{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Room Cards */}
        <View className="mt-4">
          <Text className="text-xl font-bold text-gray-800 mb-3">Available Rooms</Text>
          
          {totalGuests > 0 && (
            <Text className="text-sm text-gray-600 mb-3">
              Showing rooms that accommodate {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
            </Text>
          )}
          
          {filteredRooms && filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <View key={room.id} className="mb-4">
                <RoomCard 
                  title={room.title}
                  price={room.price}
                  description={room.description}
                  features={room.features}
                  image={room.image}
                  maxGuests={room.maxGuests}
                  bedType={room.bedType}
                  roomSize={room.size}
                  rating={room.rating}
                  reviews={room.reviews}
                  onSelect={() => handleRoomSelect(room)}
                />
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-6 items-center justify-center">
              <Ionicons name="bed-outline" size={48} color="#9ca3af" />
              <Text className="text-lg font-semibold text-gray-600 mt-4">No rooms available</Text>
              <Text className="text-gray-500 text-center mt-2">
                {totalGuests > 0
                  ? `No rooms available for ${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}. Try adjusting your search.`
                  : 'Please try different dates or check back later.'
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}