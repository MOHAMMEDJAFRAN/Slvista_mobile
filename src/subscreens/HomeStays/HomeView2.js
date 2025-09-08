import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Modal, Share } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import ReserveButton from 'components/ReserveButton';

export default function HomeView2() {
  const navigation = useNavigation();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectingCheckIn, setSelectingCheckIn] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

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
      setCheckOutDate(day.dateString);
      setShowCalendar(false);
    }
  };

  const openCalendarForCheckIn = () => {
    setSelectingCheckIn(true);
    setShowCalendar(true);
  };

  const openCalendarForCheckOut = () => {
    setSelectingCheckIn(false);
    setShowCalendar(true);
  };

  const markedDates = {};
  if (checkInDate) markedDates[checkInDate] = { selected: true, selectedColor: '#0e7490' };
  if (checkOutDate) markedDates[checkOutDate] = { selected: true, selectedColor: '#0891b2' };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing hotel: Deluxe Ocean View`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const sampleReviews = [
    {
      id: 1,
      userName: 'Sarah Johnson',
      userAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      rating: 4.5,
      date: 'August 15, 2025',
      comment:
        'The ocean view was absolutely breathtaking! The room was spacious and clean. Would definitely stay here again.',
    },
    {
      id: 2,
      userName: 'Michael Chen',
      userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      rating: 5,
      date: 'August 10, 2025',
      comment:
        'Exceptional service and amenities. The staff went above and beyond to make our stay comfortable.',
    },
    {
      id: 3,
      userName: 'Emily Rodriguez',
      userAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4,
      date: 'August 5, 2025',
      comment:
        'Great location and beautiful room. The breakfast was delicious with plenty of options.',
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars)
        stars.push(<MaterialIcons key={i} name="star" size={16} color="#F59E0B" />);
      else if (i === fullStars + 1 && hasHalfStar)
        stars.push(<MaterialIcons key={i} name="star-half" size={16} color="#F59E0B" />);
      else stars.push(<MaterialIcons key={i} name="star-border" size={16} color="#F59E0B" />);
    }
    return stars;
  };

  return (
    <View className="relative flex-1 bg-gray-100">
      <ScrollView className="flex-1 bg-gray-100 p-4" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Top Bar: Back + Heart + Share */}
        <View className="mb-4 flex-row items-center justify-between">
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow">
            <MaterialIcons name="arrow-back" size={22} color="#333" />
          </TouchableOpacity>

          {/* Heart + Share */}
          <View className="flex-row space-x-2">
            <TouchableOpacity
              className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow"
              onPress={() => setIsLiked(!isLiked)}>
              <MaterialIcons
                name={isLiked ? 'favorite' : 'favorite-border'}
                size={22}
                color={isLiked ? '#FF0000' : '#333'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow"
              onPress={handleShare}>
              <MaterialIcons name="share" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg">
          {/* Heading */}
          <View className="p-4 pb-2">
            <Text className="text-xl font-bold text-gray-800">Deluxe Ocean View</Text>
          </View>

          {/* Image */}
          <View className="relative h-48 bg-blue-100">
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
              }}
              className="h-full w-full"
            />
          </View>

          {/* Ratings */}
          <View className="flex-row items-center px-4 pt-3">
            <MaterialIcons name="star" size={16} color="#F59E0B" />
            <Text className="ml-1 text-sm font-semibold">4.5</Text>
            <Text className="ml-1 text-sm text-gray-500">(382 reviews)</Text>
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
                <View className="m-4 rounded-xl bg-white p-4">
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
                    className="mt-4 rounded-lg bg-red-500 py-3">
                    <Text className="text-center font-medium text-white">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            {/* Room details */}
            <Text className="mb-3 text-gray-600">1 Room, 2 Adults, 0 infants</Text>

            {/* Features */}
            <View className="mb-4 flex-row">
              <View className="mr-2 rounded bg-green-100 px-2 py-1">
                <Text className="text-xs text-green-800">Free cancellation</Text>
              </View>
              <View className="rounded bg-blue-100 px-2 py-1">
                <Text className="text-xs text-blue-800">Breakfast included</Text>
              </View>
            </View>

            {/* Location */}
            <View className="mb-4 flex-row items-center">
              <MaterialIcons name="location-on" size={16} color="#6B7280" />
              <Text className="ml-2 text-sm italic text-gray-500">Et sapiente accusant</Text>
            </View>

            {/* Price */}
            <View className="border-t border-gray-200 pt-4">
              <Text className="mb-1 text-xs text-gray-500">Price for 1 night, 2 adults:</Text>
              <View className="flex-row items-center">
                <Text className="text-lg font-bold text-gray-800">$159</Text>
                <Text className="ml-2 text-sm text-red-500 line-through">$175</Text>
              </View>
            </View>
          </View>
        </View>

        {/* About Room Section */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-2 text-lg font-bold text-gray-800">About Room</Text>
          <Text className="text-sm text-gray-600">
            Experience luxury in our spacious Deluxe Ocean View room featuring a king-sized bed,
            private balcony with stunning ocean vistas, and modern amenities including high-speed
            WiFi, a 55-inch smart TV, and a marble bathroom with premium toiletries. Perfect for
            couples seeking a romantic getaway or travelers who appreciate comfort and style.
          </Text>

          {/* Additional room features */}
          <View className="mt-3">
            <Text className="text-md mb-2 font-semibold text-gray-800">Room Features:</Text>
            <View className="flex-row flex-wrap">
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">Ocean View</Text>
              </View>
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">King Bed</Text>
              </View>
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">Free WiFi</Text>
              </View>
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">Smart TV</Text>
              </View>
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">Air Conditioning</Text>
              </View>
              <View className="mb-2 mr-2 rounded-full bg-blue-50 px-3 py-1">
                <Text className="text-xs text-blue-700">Mini Bar</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Top Amenities Section */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-3 text-lg font-bold text-gray-800">Top Amenities</Text>

          <View className="mb-2 flex-row flex-wrap">
            <View className="mb-3 w-1/2 flex-row items-center">
              <MaterialIcons name="wifi" size={18} color="#0e7490" />
              <Text className="ml-2 text-gray-700">Free WiFi</Text>
            </View>
            <View className="mb-3 w-1/2 flex-row items-center">
              <MaterialIcons name="local-parking" size={18} color="#0e7490" />
              <Text className="ml-2 text-gray-700">Free Parking</Text>
            </View>
            <View className="mb-3 w-1/2 flex-row items-center">
              <MaterialIcons name="pool" size={18} color="#0e7490" />
              <Text className="ml-2 text-gray-700">Pool</Text>
            </View>
            <View className="mb-3 w-1/2 flex-row items-center">
              <MaterialIcons name="local-bar" size={18} color="#0e7490" />
              <Text className="ml-2 text-gray-700">Bar</Text>
            </View>
            <View className="mb-3 w-1/2 flex-row items-center">
              <MaterialIcons name="restaurant" size={18} color="#0e7490" />
              <Text className="ml-2 text-gray-700">Restaurant</Text>
            </View>
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
                <Text className="text-sm text-gray-500">Moderate</Text>
              </View>
            </View>

            {/* Children and Extra Beds */}
            <View className="mb-2 flex-row items-start">
              <MaterialIcons name="policy" size={20} color="#0e7490" />
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
              <MaterialIcons name="policy" size={20} color="#0e7490" />
              <View className="ml-2 flex-1">
                <Text className="font-medium text-gray-700">Pets</Text>
                <Text className="text-sm text-gray-500">
                  Pets are allowed with prior approval (charges may apply).
                </Text>
              </View>
            </View>

            {/* Payments */}
            <View className="flex-row items-start">
              <MaterialIcons name="policy" size={20} color="#0e7490" />
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

        {/* Reviews Section */}
        <View className="mb-4 overflow-hidden rounded-xl bg-white p-4 shadow-lg">
          <Text className="mb-3 text-lg font-bold text-gray-800">Reviews</Text>

          <View className="mb-4 flex-row items-center justify-between">
            <View>
              <Text className="text-md font-semibold text-gray-700">Excellent</Text>
              <Text className="text-xs text-gray-500">25,146 Reviews</Text>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Text className="text-2xl font-bold text-blue-800">7.5</Text>
            </View>
          </View>

          <View className="space-y-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Cleanliness</Text>
              <View className="flex-row items-center">
                <View className="mr-2 h-2 w-32 rounded-full bg-gray-200">
                  <View className="h-2 w-20 rounded-full bg-blue-600"></View>
                </View>
                <Text className="w-6 text-right font-medium text-gray-700">6.1</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Comfort</Text>
              <View className="flex-row items-center">
                <View className="mr-2 h-2 w-32 rounded-full bg-gray-200">
                  <View className="w-26 h-2 rounded-full bg-blue-600"></View>
                </View>
                <Text className="w-6 text-right font-medium text-gray-700">8.1</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700">Facilities</Text>
              <View className="flex-row items-center">
                <View className="mr-2 h-2 w-32 rounded-full bg-gray-200">
                  <View className="w-13 h-2 rounded-full bg-blue-600"></View>
                </View>
                <Text className="w-6 text-right font-medium text-gray-700">4.0</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            className="mt-4 flex-row items-center justify-center"
            onPress={() => setShowReviews(!showReviews)}>
            <Text className="mr-1 font-medium text-blue-600">
              {showReviews ? 'Show less' : 'Show more'}
            </Text>
            <MaterialIcons
              name={showReviews ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={20}
              color="#0e7490"
            />
          </TouchableOpacity>

          {/* Sample Reviews */}
          {showReviews && (
            <View className="mt-4">
              {sampleReviews.map((review) => (
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
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Reserve Button */}
      <View className="absolute bottom-4 left-0 right-0 items-center">
        <ReserveButton title="Reserve" onPress={() => alert('Reserved!')} />
      </View>
    </View>
  );
}
