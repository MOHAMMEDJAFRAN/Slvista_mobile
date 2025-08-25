import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Animated, Dimensions } from "react-native";
import { MaterialIcons, FontAwesome, Ionicons, Entypo } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

const { height } = Dimensions.get('window');

export default function HotelAndApartment() {
  const [travelerTypeOpen, setTravelerTypeOpen] = useState(false);
  const [travelerType, setTravelerType] = useState("Traveler Type");
  const travelerOptions = ["Local", "International", "Business", "Leisure", "Family", "Solo"];
  const [animation] = useState(new Animated.Value(0));

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(null);
  
  const [destination, setDestination] = useState("Colombo, Sri Lanka");
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [guests, setGuests] = useState({
    adults: 2,
    children: 0,
    rooms: 1,
    infants: 0
  });

  // Animation values for bottom sheets
  const calendarTranslateY = useRef(new Animated.Value(height)).current;
  const guestsTranslateY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (showCalendar) {
      // Reset position before animating
      calendarTranslateY.setValue(height);
      setTimeout(() => {
        Animated.spring(calendarTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 120,
          mass: 0.8
        }).start();
      }, 10);
    }
  }, [showCalendar]);

  useEffect(() => {
    if (guestsOpen) {
      // Reset position before animating
      guestsTranslateY.setValue(height);
      setTimeout(() => {
        Animated.spring(guestsTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 25,
          stiffness: 120,
          mass: 0.8
        }).start();
      }, 10);
    }
  }, [guestsOpen]);

  const handleTravelerSelect = (option) => {
    setTravelerType(option);
    setTravelerTypeOpen(false);
    
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(animation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

  const updateGuests = (type, value) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type] + value)
    }));
  };

  const openCalendar = (type) => {
    setShowCalendar(type);
  };

  const openGuests = () => {
    setGuestsOpen(true);
  };

  const closeCalendar = () => {
    Animated.timing(calendarTranslateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setShowCalendar(null);
    });
  };

  const closeGuests = () => {
    Animated.timing(guestsTranslateY, {
      toValue: height,
      duration: 250,
      useNativeDriver: true
    }).start(() => {
      setGuestsOpen(false);
    });
  };

  const handleDaySelect = (day) => {
    if (showCalendar === "checkin") {
      setCheckInDate(day.dateString);
    } else {
      setCheckOutDate(day.dateString);
    }
    closeCalendar();
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

  const scaleInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98]
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-xl border border-gray-100">
      {/* Traveler Type - Fixed Scroller Dropdown */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Traveler Type</Text>
        <TouchableOpacity
          onPress={() => setTravelerTypeOpen(!travelerTypeOpen)}
          className="flex-row items-center justify-between rounded-full border-2 border-cyan-700 px-4 py-3 bg-white shadow-sm"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <Ionicons name="person" size={20} color="#0e7490" />
            <Text className="ml-2 text-md font-semibold text-gray-800">
              {travelerType}
            </Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: travelerTypeOpen ? '180deg' : '0deg' }] }}>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={26}
              color="#0e7490"
            />
          </Animated.View>
        </TouchableOpacity>

        {travelerTypeOpen && (
          <View className="mt-2 rounded-xl border-2 border-gray-200 bg-white shadow-lg overflow-hidden" style={{ maxHeight: 200 }}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {travelerOptions.map((option, idx) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleTravelerSelect(option)}
                  className={`px-4 py-4 ${idx !== travelerOptions.length - 1
                    ? "border-b border-gray-100"
                    : ""
                    } active:bg-cyan-50`}
                  activeOpacity={0.6}
                >
                  <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                      ${travelerType === option ? 'border-cyan-600 bg-cyan-600' : 'border-gray-300'}`}>
                      {travelerType === option && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <Text className="text-base font-medium text-gray-800">{option}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Destination Input Box */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Destination / Hotel</Text>
        <View className="flex-row items-center rounded-full border-2 border-cyan-700 bg-white px-4 py-1 shadow-sm">
          <MaterialIcons name="location-on" size={22} color="#0e7490" />
          <TextInput
            className="ml-3 text-base font-semibold text-gray-800 flex-1"
            value={destination}
            onChangeText={setDestination}
            placeholder="Enter destination or hotel name"
          />
        </View>
      </View>

      {/* Check-in / Check-out */}
      <View className="mb-5 flex-row justify-between gap-4">
        <View className="flex-1">
          <Text className="mb-2 text-sm font-medium text-gray-700">Check in</Text>
          <TouchableOpacity
            onPress={() => openCalendar("checkin")}
            className="flex-row items-center rounded-full border-2 border-cyan-700 bg-white px-4 py-3 shadow-sm"
            activeOpacity={0.7}
          >
            <FontAwesome name="calendar" size={18} color="#0e7490" />
            <Text className="ml-3 text-base font-semibold text-gray-800">
              {checkInDate || "Select date"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Text className="mb-2 text-sm font-medium text-gray-700">Check out</Text>
          <TouchableOpacity
            onPress={() => openCalendar("checkout")}
            className="flex-row items-center rounded-full border-2 border-cyan-700 bg-white px-4 py-3 shadow-sm"
            activeOpacity={0.7}
          >
            <FontAwesome name="calendar" size={18} color="#0e7490" />
            <Text className="ml-3 text-base font-semibold text-gray-800">
              {checkOutDate || "Select date"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guests Selector with Increment/Decrement */}
      <View className="mb-5">
        <Text className="mb-2 text-sm font-medium text-gray-700">Guests & Rooms</Text>
        <TouchableOpacity
          onPress={openGuests}
          className="flex-row items-center justify-between rounded-full border-2 border-cyan-700 bg-white px-4 py-3 shadow-sm"
          activeOpacity={0.7}
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
            color="#0e7490"
          />
        </TouchableOpacity>
      </View>

      {/* Divider line between guests and search button */}
      <View className="border-t border-gray-200 my-4" />

      {/* Search Hotels Button */}
      <TouchableOpacity
        className="mt-2 items-center rounded-full bg-cyan-700 py-4 shadow-md active:opacity-80"
        activeOpacity={0.7}
      >
        <Text className="text-lg font-semibold text-white">Search Hotels</Text>
      </TouchableOpacity>

      {/* Calendar Modal with Bottom Sheet Animation */}
      <Modal visible={!!showCalendar} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableOpacity 
            className="absolute inset-0"
            onPress={closeCalendar}
            activeOpacity={1}
          />
          <Animated.View 
            style={{ 
              transform: [{ translateY: calendarTranslateY }] 
            }}
            className="rounded-t-3xl bg-white p-5 shadow-2xl"
          >
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            <Text className="mb-4 text-xl font-bold text-cyan-700 text-center">
              Select {showCalendar === "checkin" ? "Check-in" : "Check-out"} Date
            </Text>
            <Calendar
              onDayPress={handleDaySelect}
              minDate={getTodayDate()} // Disable previous dates
              theme={{
                selectedDayBackgroundColor: "#0e7490",
                todayTextColor: "#0e7490",
                arrowColor: "#0e7490",
                monthTextColor: "#0e7490",
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '600',
                'stylesheet.calendar.main': {
                  dayContainer: {
                    // Disable styling for past dates
                  }
                }
              }}
              markedDates={{
                [checkInDate]: { selected: true, selectedColor: "#0e7490" },
                [checkOutDate]: { selected: true, selectedColor: "#0891b2" },
              }}
              // Disable month scroll for past dates
              enableSwipeMonths={true}
            />
            <TouchableOpacity
              onPress={closeCalendar}
              className="mt-4 rounded-xl bg-gray-100 py-4 active:bg-gray-200"
              activeOpacity={0.7}
            >
              <Text className="text-center text-gray-700 font-semibold">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Guests Modal with Bottom Sheet Animation */}
      <Modal visible={guestsOpen} transparent animationType="fade">
        <View className="flex-1 justify-end bg-black/50">
          <TouchableOpacity 
            className="absolute inset-0"
            onPress={closeGuests}
            activeOpacity={1}
          />
          <Animated.View 
            style={{ 
              transform: [{ translateY: guestsTranslateY }] 
            }}
            className="rounded-t-3xl bg-white p-5 shadow-2xl"
          >
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            <Text className="mb-4 text-xl font-bold text-cyan-700 text-center">
              Guests & Rooms
            </Text>
            
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
                  <Entypo name="minus" size={16} color={guests.adults <= 1 ? "#9ca3af" : "#0e7490"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.adults}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('adults', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#0e7490" />
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
                  <Entypo name="plus" size={16} color="#0e7490" />
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
                  <Entypo name="minus" size={16} color={guests.rooms <= 1 ? "#9ca3af" : "#0e7490"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.rooms}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('rooms', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#0e7490" />
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
                  <Entypo name="minus" size={16} color={guests.infants <= 0 ? "#9ca3af" : "#0e7490"} />
                </TouchableOpacity>
                <Text className="mx-3 text-lg font-semibold text-gray-800">{guests.infants}</Text>
                <TouchableOpacity 
                  onPress={() => updateGuests('infants', 1)}
                  className="w-8 h-8 rounded-full bg-cyan-100 items-center justify-center"
                >
                  <Entypo name="plus" size={16} color="#0e7490" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={closeGuests}
              className="rounded-xl bg-cyan-600 py-4 active:bg-cyan-700"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white font-semibold">Done</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}