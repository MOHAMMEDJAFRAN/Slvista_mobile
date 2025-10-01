import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Share, Alert, TextInput, ActivityIndicator, Dimensions } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { useNavigation, useRoute } from '@react-navigation/native';
import ReserveButton from '../../../components/ReserveButton';

export default function RoomDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { room, hotel, checkInDate: initialCheckInDate, checkOutDate: initialCheckOutDate, guests } = route.params || {};
  
  const [isLoading, setIsLoading] = useState(true);
  const [checkInDate, setCheckInDate] = useState(initialCheckInDate || null);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOutDate || null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showReviewInput, setShowReviewInput] = useState(false);
  const [userReview, setUserReview] = useState({
    rating: 0,
    comment: '',
    userName: 'You',
    userAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { width } = Dimensions.get('window');

  // Default room data if none is passed
  const defaultRoom = {
    id: 1,
    title: "Deluxe Ocean View",
    price: 159,
    originalPrice: 175,
    description: "Experience luxury in our spacious Deluxe Ocean View room featuring a king-sized bed, private balcony with stunning ocean vistas, and modern amenities.",
    features: ["Ocean View", "King Bed", "Free WiFi", "Smart TV", "Air Conditioning", "Mini Bar"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=c crop&w=800&q=80"
    ],
    maxGuests: 2,
    bedType: "King Bed",
    roomSize: "35.5",
    rating: 4.5,
    reviews: 382,
    amenities: ["Free WiFi", "Free Parking", "Pool", "Bar", "Restaurant"]
  };

  const defaultHotel = {
    name: "Luxury Resort",
    location: "Beachfront, Colombo",
    rating: 4.5,
    reviews: 1247
  };

  const roomData = room || defaultRoom;
  const hotelData = hotel || defaultHotel;

  // Get room images - handle both single image and multiple images
  const getRoomImages = () => {
    if (roomData.images && Array.isArray(roomData.images)) {
      return roomData.images;
    } else if (roomData.image) {
      return [roomData.image];
    } else {
      return defaultRoom.images;
    }
  };

  const roomImages = getRoomImages();

  // Sample reviews data
  const [sampleReviews, setSampleReviews] = useState([
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 4.5,
      date: 'August 15, 2025',
      comment: 'The ocean view was absolutely breathtaking! The room was spacious and clean. Would definitely stay here again.',
    },
    {
      id: 2,
      userName: 'Michael Chen',
      userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 5,
      date: 'August 10, 2025',
      comment: 'Exceptional service and amenities. The staff went above and beyond to make our stay comfortable.',
    },
    {
      id: 3,
      userName: 'Emily Rodriguez',
      userAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4,
      date: 'August 5, 2025',
      comment: 'Great location and beautiful room. The breakfast was delicious with plenty of options.',
    },
    {
      id: 4,
      userName: 'David Wilson',
      userAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      rating: 4.8,
      date: 'August 3, 2025',
      comment: 'Amazing experience! The staff was very helpful and the room was perfect for our anniversary celebration.',
    },
    {
      id: 5,
      userName: 'Lisa Thompson',
      userAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      rating: 4.2,
      date: 'July 28, 2025',
      comment: 'Good value for money. The room was clean and comfortable with a nice view of the ocean.',
    },
    {
      id: 6,
      userName: 'Robert Garcia',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.9,
      date: 'July 25, 2025',
      comment: 'Absolutely loved our stay! The balcony overlooking the ocean was our favorite spot.',
    }
  ]);

  const [displayedReviews, setDisplayedReviews] = useState(sampleReviews.slice(0, 3));

  // Update displayed reviews when showAllReviews changes
  useEffect(() => {
    if (showAllReviews) {
      setDisplayedReviews(sampleReviews);
    } else {
      setDisplayedReviews(sampleReviews.slice(0, 3));
    }
  }, [showAllReviews, sampleReviews]);

  // Auto-rotate images in carousel
  useEffect(() => {
    if (roomImages && roomImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex => 
          prevIndex === roomImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval);
    }
  }, [roomImages, currentImageIndex]);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Simulate 1.5 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();
  const totalPrice = nights > 0 ? roomData.price * nights : roomData.price;

  const formatDate = (dateString) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDateSelect = (day) => {
    if (selectingCheckIn) {
      setCheckInDate(day.dateString);
      setSelectingCheckIn(false);
    } else {
      // Validate that check-out is after check-in
      if (checkInDate && new Date(day.dateString) <= new Date(checkInDate)) {
        Alert.alert('Invalid Date', 'Check-out date must be after check-in date');
        return;
      }
      setCheckOutDate(day.dateString);
      setShowCalendar(false);
    }
  };

  const openCalendarForCheckIn = () => {
    setSelectingCheckIn(true);
    setShowCalendar(true);
  };

  const openCalendarForCheckOut = () => {
    if (!checkInDate) {
      Alert.alert('Select Check-in First', 'Please select check-in date first');
      return;
    }
    setSelectingCheckIn(false);
    setShowCalendar(true);
  };

  const markedDates = {};
  if (checkInDate) {
    markedDates[checkInDate] = { 
      selected: true, 
      selectedColor: '#0e7490',
      startingDay: true,
      endingDay: !checkOutDate
    };
  }
  if (checkOutDate) {
    markedDates[checkOutDate] = { 
      selected: true, 
      selectedColor: '#0891b2',
      endingDay: true
    };
    
    // Mark dates between check-in and check-out
    if (checkInDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      let current = new Date(start);
      current.setDate(current.getDate() + 1);
      
      while (current < end) {
        const dateString = current.toISOString().split('T')[0];
        markedDates[dateString] = { 
          selected: true, 
          selectedColor: '#06b6d4',
          color: '#06b6d4'
        };
        current.setDate(current.getDate() + 1);
      }
    }
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing room at ${hotelData.name}: ${roomData.title} for $${roomData.price}/night`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReserve = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert('Select Dates', 'Please select both check-in and check-out dates');
      return;
    }
    
    // Navigate to CustomerDetailsHotel page instead of BookingConfirmation
    navigation.navigate('CustomerDetailsHotel', {
      room: roomData,
      hotel: hotelData,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
      nights
    });
  };

  const renderStars = (rating, size = 16, interactive = false, onPress = null) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          interactive ? (
            <TouchableOpacity key={i} onPress={() => onPress(i)}>
              <MaterialIcons name="star" size={size} color="#F59E0B" />
            </TouchableOpacity>
          ) : (
            <MaterialIcons key={i} name="star" size={size} color="#F59E0B" />
          )
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          interactive ? (
            <TouchableOpacity key={i} onPress={() => onPress(i)}>
              <MaterialIcons name="star-half" size={size} color="#F59E0B" />
            </TouchableOpacity>
          ) : (
            <MaterialIcons key={i} name="star-half" size={size} color="#F59E0B" />
          )
        );
      } else {
        stars.push(
          interactive ? (
            <TouchableOpacity key={i} onPress={() => onPress(i)}>
              <MaterialIcons name="star-border" size={size} color="#F59E0B" />
            </TouchableOpacity>
          ) : (
            <MaterialIcons key={i} name="star-border" size={size} color="#F59E0B" />
          )
        );
      }
    }
    return stars;
  };

  // Format guests text
  const getGuestsText = () => {
    if (!guests) return "2 Adults";
    
    const parts = [];
    if (guests.adults > 0) parts.push(`${guests.adults} Adult${guests.adults !== 1 ? 's' : ''}`);
    if (guests.children > 0) parts.push(`${guests.children} Child${guests.children !== 1 ? 'ren' : ''}`);
    if (guests.infants > 0) parts.push(`${guests.infants} Infant${guests.infants !== 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : '2 Adults';
  };

  // Handle star rating selection
  const handleStarRating = (rating) => {
    setUserReview(prev => ({ ...prev, rating }));
  };

  // Handle review submission
  const handleReviewSubmit = () => {
    if (userReview.rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting your review');
      return;
    }

    if (userReview.comment.trim().length < 10) {
      Alert.alert('Comment Too Short', 'Please write a more detailed review (minimum 10 characters)');
      return;
    }

    const newReview = {
      id: Date.now(),
      userName: userReview.userName,
      userAvatar: userReview.userAvatar,
      rating: userReview.rating,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      comment: userReview.comment
    };

    // Add new review to the list
    setSampleReviews(prev => [newReview, ...prev]);
    
    // Reset form
    setUserReview({
      rating: 0,
      comment: '',
      userName: 'You',
      userAvatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
    });
    
    setShowReviewInput(false);
    Alert.alert('Thank You!', 'Your review has been submitted successfully.');
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (sampleReviews.length === 0) return roomData.rating;
    
    const total = sampleReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / sampleReviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  // Skeleton carousel component
  const SkeletonCarousel = () => (
    <View className="overflow-hidden rounded-xl h-48 bg-gray-300 relative">
      {/* Animated shimmer effect */}
      <View className="absolute top-0 left-0 right-0 bottom-0">
        <View className="flex-1 bg-gray-400 opacity-30" style={{ transform: [{ translateX: -width }] }} />
      </View>
      
      {/* Dots indicator skeleton */}
      {roomImages && roomImages.length > 1 && (
        <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
          {roomImages.map((_, index) => (
            <View 
              key={index} 
              className={`h-2 w-2 rounded-full mx-1 ${index === 0 ? 'bg-gray-500' : 'bg-gray-400'}`}
            />
          ))}
        </View>
      )}
    </View>
  );

  // Loading state
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0e7490" />
        <Text className="mt-4 text-gray-600">Loading room details...</Text>
      </View>
    );
  }

  return (
    <View className="relative flex-1 bg-gray-100">
      {/* Fixed Navigation Bar - Doesn't scroll */}
      <View className="bg-white p-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <MaterialIcons name="arrow-back" size={22} color="#006D77" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="text-lg font-bold text-gray-800">Room Details</Text>

          {/* Heart + Share */}
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-100"
              onPress={() => setIsLiked(!isLiked)}>
              <MaterialIcons
                name={isLiked ? 'favorite' : 'favorite-border'}
                size={22}
                color={isLiked ? '#FF0000' : '#333'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="h-12 w-12 items-center justify-center rounded-full bg-gray-100"
              onPress={handleShare}>
              <MaterialIcons name="share" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 bg-gray-100 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Room Content */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Heading */}
          <View className="p-4 pb-2">
            <Text className="text-xl font-bold text-gray-800">{roomData.title}</Text>
            <Text className="text-sm text-gray-500">{hotelData.name}</Text>
          </View>

          {/* Image Carousel */}
          {imageLoading && <SkeletonCarousel />}
          
          <View className="relative h-48 bg-blue-100">
            <Image
              source={{ uri: roomImages[currentImageIndex] }}
              className="h-full w-full"
              resizeMode="cover"
              onLoad={() => setImageLoading(false)}
            />
            
            {/* Image indicators */}
            {roomImages && roomImages.length > 1 && (
              <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                {roomImages.map((_, index) => (
                  <View 
                    key={index} 
                    className={`h-2 w-2 rounded-full mx-1 ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Ratings */}
          <View className="flex-row items-center px-4 pt-3">
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text className="ml-1 text-sm font-semibold">{averageRating}</Text>
            <Text className="ml-1 text-sm text-gray-500">({sampleReviews.length} reviews)</Text>
          </View>

          {/* Content */}
          <View className="p-4 pt-2">
            {/* Date selection */}
            <View className="my-4 flex-row justify-between rounded-lg bg-gray-50 p-3">
              <TouchableOpacity className="flex-1" onPress={openCalendarForCheckIn}>
                <View>
                  <Text className="text-xs text-gray-500">Check-in</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="calendar-today" size={16} color="#0e7490" />
                    <Text className="ml-1 font-semibold">{formatDate(checkInDate)}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View className="mx-2 h-8 w-px bg-gray-300" />

              <TouchableOpacity className="flex-1" onPress={openCalendarForCheckOut}>
                <View>
                  <Text className="text-xs text-gray-500">Check-out</Text>
                  <View className="flex-row items-center">
                    <MaterialIcons name="calendar-today" size={16} color="#0e7490" />
                    <Text className="ml-1 font-semibold">{formatDate(checkOutDate)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* Calendar Modal */}
            <Modal
              visible={showCalendar}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowCalendar(false)}>
              <View className="flex-1 items-center justify-center bg-black/50">
                <View className="m-4 w-full max-w-md rounded-xl bg-white p-4">
                  <Text className="mb-4 text-center text-lg font-semibold">
                    {selectingCheckIn ? 'Select Check-in Date' : 'Select Check-out Date'}
                  </Text>

                  <Calendar
                    minDate={new Date().toISOString().split('T')[0]}
                    onDayPress={handleDateSelect}
                    markedDates={markedDates}
                    theme={{
                      selectedDayBackgroundColor: '#0e7490',
                      todayTextColor: '#0e7490',
                      arrowColor: '#0e7490',
                      monthTextColor: '#0e7490',
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => setShowCalendar(false)}
                    className="mt-4 rounded-lg bg-gray-200 py-3">
                    <Text className="text-center font-medium text-gray-700">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Room details */}
            <Text className="mb-3 text-gray-600">
              {guests?.rooms || 1} Room, {getGuestsText()}
            </Text>

            {/* Features */}
            <View className="mb-4 flex-row flex-wrap">
              <View className="mr-2 mb-2 rounded bg-green-100 px-2 py-1">
                <Text className="text-xs text-green-800">Free cancellation</Text>
              </View>
              <View className="mr-2 mb-2 rounded bg-blue-100 px-2 py-1">
                <Text className="text-xs text-blue-800">Breakfast included</Text>
              </View>
            </View>

            {/* Location */}
            <View className="mb-4 flex-row items-center">
              <MaterialIcons name="location-on" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm text-gray-500">{hotelData.location}</Text>
            </View>

            {/* Price */}
            <View className="border-t border-gray-200 pt-4">
              <Text className="mb-1 text-xs text-gray-500">
                {nights > 0 
                  ? `Price for ${nights} ${nights === 1 ? 'night' : 'nights'}, ${getGuestsText()}:`
                  : `Price per night, ${getGuestsText()}:`
                }
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-gray-800">${totalPrice}</Text>
                  {roomData.originalPrice && (
                    <Text className="ml-2 text-sm text-red-500 line-through">
                      ${roomData.originalPrice * (nights || 1)}
                    </Text>
                  )}
                </View>
                {nights > 0 && (
                  <Text className="text-sm text-gray-500">
                    ${roomData.price}/night
                  </Text>
                )}
              </View>
              {nights > 0 && roomData.originalPrice && (
                <Text className="mt-1 text-xs text-green-600">
                  You save ${((roomData.originalPrice || roomData.price) * nights) - totalPrice}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* About Room Section */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-lg font-bold text-gray-800">About Room</Text>
          <Text className="text-sm text-gray-600">{roomData.description}</Text>

          {/* Room specifications */}
          <View className="mt-4 flex-row justify-between">
            <View className="items-center">
              <MaterialIcons name="king-bed" size={20} color="#0e7490" />
              <Text className="mt-1 text-xs text-gray-600">{roomData.bedType}</Text>
            </View>
            <View className="items-center">
              <MaterialIcons name="people" size={20} color="#0e7490" />
              <Text className="mt-1 text-xs text-gray-600">{roomData.maxGuests} Guests</Text>
            </View>
            <View className="items-center">
              <MaterialIcons name="aspect-ratio" size={20} color="#0e7490" />
              <Text className="mt-1 text-xs text-gray-600">{roomData.roomSize} m²</Text>
            </View>
            <View className="items-center">
              <MaterialIcons name="square-foot" size={20} color="#0e7490" />
              <Text className="mt-1 text-xs text-gray-600">{roomData.roomSize} sqm</Text>
            </View>
          </View>

          {/* Room features */}
          <View className="mt-4">
            <Text className="text-md mb-2 font-semibold text-gray-800">Room Features:</Text>
            <View className="flex-row flex-wrap">
              {roomData.features?.map((feature, index) => (
                <View key={index} className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                  <Text className="text-xs text-blue-700">{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Top Amenities Section */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-3 text-lg font-bold text-gray-800">Top Amenities</Text>

          <View className="mb-2 flex-row flex-wrap">
            {roomData.amenities?.map((amenity, index) => (
              <View key={index} className="mb-3 w-1/2 flex-row items-center">
                <MaterialIcons name="check-circle" size={18} color="#0e7490" />
                <Text className="ml-2 text-gray-700">{amenity}</Text>
              </View>
            ))}
          </View>

          <View className="my-3 h-px bg-gray-200" />

          {/* Policies Section */}
          <Text className="text-md mb-3 font-bold text-gray-800">Policies</Text>

          <View className="mb-3">
            {/* Cancellation Policy */}
            <View className="mb-2 flex-row items-start">
              <MaterialIcons name="policy" size={20} color="#0e7490" />
              <View className="ml-2 flex-1">
                <Text className="font-medium text-gray-700">Cancellation policy</Text>
                <Text className="text-sm text-gray-500">Free cancellation up to 24 hours before check-in</Text>
              </View>
            </View>

            {/* Children and Extra Beds */}
            <View className="mb-2 flex-row items-start">
              <MaterialIcons name="child-care" size={20} color="#0e7490" />
              <View className="ml-2 flex-1">
                <Text className="font-medium text-gray-700">Children and extra beds</Text>
                <Text className="text-sm text-gray-500">
                  Children under 10 stay free with parents. Extra bed charges apply.
                </Text>
                <Text className="text-sm text-gray-500">
                  $25 per night for extra beds (subject to availability).
                </Text>
              </View>
            </View>

            {/* Pets */}
            <View className="mb-2 flex-row items-start">
              <MaterialIcons name="pets" size={20} color="#0e7490" />
              <View className="ml-2 flex-1">
                <Text className="font-medium text-gray-700">Pets</Text>
                <Text className="text-sm text-gray-500">
                  Pets are allowed with prior approval (charges may apply).
                </Text>
              </View>
            </View>

            {/* Payments */}
            <View className="flex-row items-start">
              <MaterialIcons name="payment" size={20} color="#0e7490" />
              <View className="ml-2 flex-1">
                <Text className="font-medium text-gray-700">Payments</Text>
                <Text className="text-sm text-gray-500">
                  Credit card required to guarantee reservation
                </Text>
                <Text className="text-sm text-gray-500">All taxes included in room rate</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reviews Section with inline review form */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">Reviews</Text>
            <TouchableOpacity 
              onPress={() => setShowReviewInput(!showReviewInput)}
              className="bg-cyan-600 px-3 py-1 rounded-full"
            >
              <Text className="text-white text-sm">
                {showReviewInput ? 'Cancel Review' : 'Add Review'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-md font-semibold text-gray-700">Excellent</Text>
              <Text className="text-xs text-gray-500">{sampleReviews.length} Reviews</Text>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl font-bold text-blue-800">{averageRating}</Text>
            </View>
          </View>

          {/* Inline Review Form */}
          {showReviewInput && (
            <View className="mb-6 p-4 bg-gray-50 rounded-lg">
              <Text className="text-md font-semibold text-gray-800 mb-3">Write Your Review</Text>
              
              {/* Star Rating */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Your Rating</Text>
                <View className="flex-row">
                  {renderStars(userReview.rating, 24, true, handleStarRating)}
                </View>
              </View>

              {/* Comment Input */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Your Review</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 h-32 text-sm bg-white"
                  multiline
                  placeholder="Share your experience with this room..."
                  value={userReview.comment}
                  onChangeText={(text) => setUserReview(prev => ({ ...prev, comment: text }))}
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleReviewSubmit}
                className="bg-cyan-600 py-3 rounded-lg"
              >
                <Text className="text-center font-medium text-white">Submit Review</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sample Reviews */}
          <View className="mt-4">
            {displayedReviews.map((review) => (
              <View
                key={review.id}
                className="mb-4 border-b border-gray-200 pb-4 last:mb-0 last:border-b-0 last:pb-0">
                <View className="mb-2 flex-row items-center">
                  <Image
                    source={{ uri: review.userAvatar }}
                    className="mr-3 h-10 w-10 rounded-full"
                  />
                  <View>
                    <Text className="font-medium text-gray-800">{review.userName}</Text>
                    <View className="flex-row items-center">
                      {renderStars(review.rating)}
                      <Text className="ml-1 text-xs text-gray-500">{review.rating}</Text>
                    </View>
                  </View>
                </View>
                <Text className="mb-2 text-xs text-gray-500">{review.date}</Text>
                <Text className="text-sm text-gray-700">{review.comment}</Text>
                <View className="border border-gray-200 w-full my-3" />
              </View>
            ))}
          </View>

          {/* Show More/Less Button */}
          {sampleReviews.length > 3 && (
            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center"
              onPress={() => setShowAllReviews(!showAllReviews)}>
              <Text className="mr-1 font-medium text-blue-600">
                {showAllReviews ? 'Show Less' : `Show All ${sampleReviews.length} Reviews`}
              </Text>
              <MaterialIcons
                name={showAllReviews ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                size={20}
                color="#0e7490"
              />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Fixed Reserve Button */}
      <View className="absolute bottom-4 left-0 right-0 items-center px-4">
        <ReserveButton 
          title={nights > 0 ? `Reserve for $${totalPrice}` : 'Select Dates to Reserve'} 
          onPress={handleReserve}
          disabled={!checkInDate || !checkOutDate}
        />
      </View>
    </View>
  );
}