import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

export default function HomeStays() {
  const [travelerTypeOpen, setTravelerTypeOpen] = useState(false);
  const [travelerType, setTravelerType] = useState("Traveler Type");
  const travelerOptions = ["Local", "International"];

  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [showCalendar, setShowCalendar] = useState(null); // "checkin" or "checkout"

  return (
    <View className="m-6 rounded-2xl bg-white p-5 shadow-lg">
      {/* Traveler Type */}
      <TouchableOpacity
        onPress={() => setTravelerTypeOpen(!travelerTypeOpen)}
        className={`flex-row items-center justify-between rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 shadow-sm ${
          travelerTypeOpen ? "mb-2" : "mb-5"
        }`}
      >
        <Text className="text-xl font-bold text-black">
          {travelerType}
        </Text>
        <MaterialIcons
          name={travelerTypeOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={26}
         
        />
      </TouchableOpacity>

      {travelerTypeOpen && (
        <View className="mb-5 rounded-xl border border-gray-300 bg-white shadow-sm">
          {travelerOptions.map((option, idx) => (
            <TouchableOpacity
              key={option}
              onPress={() => {
                setTravelerType(option);
                setTravelerTypeOpen(false);
              }}
              className={`px-4 py-3 ${
                idx !== travelerOptions.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              <Text className="text-base text-black">{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Destination */}
      <View className="mb-5">
        <Text className="mb-1 text-sm text-black">Destination / Hotel</Text>
        <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
          <MaterialIcons name="location-on" size={22}  />
          <Text className="ml-3 text-base font-medium text-black">
            Colombo, Sri Lanka
          </Text>
        </View>
      </View>

      {/* Check-in / Check-out */}
      <View className="mb-5 flex-row justify-between gap-4">
        <View className="flex-1">
          <Text className="mb-1 text-sm text-black">Check in</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar("checkin")}
            className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm"
          >
            <FontAwesome name="calendar" size={18}  />
            <Text className="ml-3 text-base font-medium text-black">
              {checkInDate || "Select date"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Text className="mb-1 text-sm text-black">Check out</Text>
          <TouchableOpacity
            onPress={() => setShowCalendar("checkout")}
            className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm"
          >
            <FontAwesome name="calendar" size={18}  />
            <Text className="ml-3 text-base font-medium text-black">
              {checkOutDate || "Select date"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Guests */}
      <View className="mb-5">
        <Text className="mb-1 text-sm text-black">Guests</Text>
        <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
          <Ionicons name="people" size={22}  />
          <Text className="ml-3 text-base font-medium text-black">
            2 Adults, 1 Room, 0 Infants
          </Text>
        </View>
      </View>

      {/* Search Button */}
      <TouchableOpacity
        className="mt-6 items-center rounded-full bg-cyan-700 py-4 shadow-md active:scale-95"
      >
        <Text className="text-lg font-semibold text-white">Search Hotels</Text>
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal visible={!!showCalendar} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-3xl bg-white p-5 shadow-lg">
            <Text className="mb-3 text-lg font-semibold text-cyan-700">
              Select {showCalendar === "checkin" ? "Check-in" : "Check-out"} Date
            </Text>
            <Calendar
              onDayPress={(day) => {
                if (showCalendar === "checkin") {
                  setCheckInDate(day.dateString);
                } else {
                  setCheckOutDate(day.dateString);
                }
                setShowCalendar(null);
              }}
              theme={{
                selectedDayBackgroundColor: "#0e7490",
                todayTextColor: "#0e7490",
                arrowColor: "#0e7490",
                monthTextColor: "#0e7490",
              }}
              markedDates={{
                [checkInDate]: { selected: true, selectedColor: "#0e7490" },
                [checkOutDate]: { selected: true, selectedColor: "#0891b2" },
              }}
            />
            <TouchableOpacity
              onPress={() => setShowCalendar(null)}
              className="mt-4 rounded-lg bg-red-500 py-3"
            >
              <Text className="text-center text-white font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
