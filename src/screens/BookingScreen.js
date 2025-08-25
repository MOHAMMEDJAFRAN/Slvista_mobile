import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Linking,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import NavBar from 'components/NavBar';

const Bookings = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [modifyData, setModifyData] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: '',
  });

  // Sample data
  const upcomingBookings = [
    {
      id: '1',
      hotelName: 'The Capital Hotel',
      location: 'Colombo',
      bookingId: '4012458',
      referenceId: '4012458',
      checkIn: 'March 12, 2025',
      checkOut: 'March 13, 2025',
      originalPrice: '$175.00',
      discount: '$11.00',
      roomPrice: '$164.00',
      taxes: '$0.00',
      total: '$164.00',
      status: 'upcoming',
      image: require('../../assets/download (3).jpeg'),
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+94123456789',
      },
      progress: 'ongoing',
    }
  ];

  const completedBookings = [
    {
      id: '2',
      hotelName: 'Beach Paradise Resort',
      location: 'Galle',
      bookingId: '4012459',
      referenceId: '4012459',
      checkIn: 'January 15, 2025',
      checkOut: 'January 18, 2025',
      originalPrice: '$520.00',
      discount: '$52.00',
      roomPrice: '$468.00',
      taxes: '$10.00',
      total: '$478.00',
      status: 'completed',
      image: require('../../assets/download (3).jpeg'),
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+94123456780',
      },
      progress: 'completed',
    }
  ];

  const canceledBookings = [
    {
      id: '3',
      hotelName: 'Mountain View Lodge',
      location: 'Nuwara Eliya',
      bookingId: '4012460',
      referenceId: '4012460',
      checkIn: 'February 20, 2025',
      checkOut: 'February 22, 2025',
      originalPrice: '$320.00',
      discount: '$32.00',
      roomPrice: '$288.00',
      taxes: '$8.00',
      total: '$296.00',
      status: 'canceled',
      image: require('../../assets/download (3).jpeg'),
      customer: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+94123456781',
      },
      progress: 'cancelled',
    }
  ];

  const handleModify = (booking) => {
    setCurrentBooking(booking);
    setModifyData({
      name: booking.customer.name,
      email: booking.customer.email,
      phone: booking.customer.phone,
      specialRequests: '',
    });
    setShowModifyModal(true);
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const submitModification = () => {
    // Here you would typically send the modification request to your backend
    setShowModifyModal(false);
    setShowMessageModal(true);
  };

  const handleCancelBooking = (booking) => {
    setCurrentBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancelBooking = () => {
    // Here you would typically send the cancellation request to your backend
    setShowCancelModal(false);
    setShowMessageModal(true);
  };

  const getProgressTagColor = (progress) => {
    switch (progress) {
      case 'ongoing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderBookingCard = (booking) => (
    <View className={`mb-6 border border-gray-200 rounded-lg bg-white p-4`}>
      {/* Progress Badge */}
      {booking.progress && (
        <View className={`absolute top-2 right-2 ${getProgressTagColor(booking.progress)} px-2 py-1 rounded`}>
          <Text className="text-white text-xs font-bold">{booking.progress.toUpperCase()}</Text>
        </View>
      )}
      
      {/* Hotel Info */}
      <View className="flex-row items-center mb-4">
        <Image 
          source={booking.image} 
          className="w-16 h-16 rounded-lg mr-3" 
          resizeMode="cover" 
        />
        <View className="flex-1">
          <Text className="text-lg font-bold">{booking.hotelName}</Text>
          <Text className="text-gray-500">{booking.location}</Text>
          
          {/* Call Button */}
          <TouchableOpacity 
            className="flex-row items-center mt-1"
            onPress={() => handleCall(booking.customer.phone)}
          >
            <MaterialIcons name="call" size={16} color="#006D77" />
            <Text className="text-[#006D77] ml-1 text-sm">Contact Hotel</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Customer Details */}
      <View className="mb-4 p-3 bg-gray-50 rounded-lg">
        <Text className="font-bold mb-2">Customer Details</Text>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Name</Text>
          <Text>{booking.customer.name}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Email</Text>
          <Text>{booking.customer.email}</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-gray-500">Phone</Text>
          <Text>{booking.customer.phone}</Text>
        </View>
      </View>

      {/* Booking Details */}
      <View className="mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Booking ID</Text>
          <Text className="font-medium">{booking.bookingId}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-500">Reference ID</Text>
          <Text className="font-medium">{booking.referenceId}</Text>
        </View>
      </View>

      {/* Dates */}
      <View className="flex-row justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <View>
          <Text className="text-gray-500 text-sm">Check-in</Text>
          <Text className="font-medium">{booking.checkIn}</Text>
        </View>
        <View>
          <Text className="text-gray-500 text-sm">Check-out</Text>
          <Text className="font-medium">{booking.checkOut}</Text>
        </View>
      </View>

      {/* Payment Details */}
      <View className="mb-4">
        <Text className="font-bold mb-2">Payment Details</Text>
        
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Original Price (1 Room x 1 Night)</Text>
          <Text>{booking.originalPrice}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Discount</Text>
          <Text className="text-green-600">-{booking.discount}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Room Price (1 Room x 1 Night)</Text>
          <Text>{booking.roomPrice}</Text>
        </View>
        <View className="flex-row justify-between mb-1">
          <Text className="text-gray-500">Taxes and fees</Text>
          <Text>{booking.taxes}</Text>
        </View>
      </View>

      {/* Total */}
      <View className="flex-row justify-between border-t border-gray-200 pt-3">
        <Text className="font-bold">Total</Text>
        <Text className="font-bold text-lg">{booking.total}</Text>
      </View>

      {/* Action Buttons */}
      {activeTab === 'upcoming' && (
        <View className="flex-row justify-between mt-4">
          <TouchableOpacity 
            className="border border-[#006D77] py-2 px-4 rounded-lg flex-1 mr-2"
            onPress={() => handleModify(booking)}
          >
            <Text className="text-[#006D77] text-center">Modify</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-[#006D77] py-2 px-4 rounded-lg flex-1 ml-2"
            onPress={() => handleCancelBooking(booking)}
          >
            <Text className="text-white text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar 
        title="My Bookings" 
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      <ScrollView 
        className="flex-1 px-4" 
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Booking Status Tabs */}
        <View className="flex-row bg-white p-1 rounded-full mb-4">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${activeTab === 'upcoming' ? 'bg-[#006D77]' : ''}`}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text className={`text-center ${activeTab === 'upcoming' ? 'text-white font-medium' : 'text-gray-700'}`}>
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${activeTab === 'completed' ? 'bg-[#006D77]' : ''}`}
            onPress={() => setActiveTab('completed')}
          >
            <Text className={`text-center ${activeTab === 'completed' ? 'text-white font-medium' : 'text-gray-700'}`}>
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-2 rounded-full ${activeTab === 'canceled' ? 'bg-[#006D77]' : ''}`}
            onPress={() => setActiveTab('canceled')}
          >
            <Text className={`text-center ${activeTab === 'canceled' ? 'text-white font-medium' : 'text-gray-700'}`}>
              Canceled
            </Text>
          </TouchableOpacity>
        </View>

        {/* Booking Cards */}
        {activeTab === 'upcoming' && upcomingBookings.length > 0 ? (
          upcomingBookings.map(booking => (
            <View key={booking.id}>
              {renderBookingCard(booking)}
            </View>
          ))
        ) : activeTab === 'completed' && completedBookings.length > 0 ? (
          completedBookings.map(booking => (
            <View key={booking.id}>
              {renderBookingCard(booking)}
            </View>
          ))
        ) : activeTab === 'canceled' && canceledBookings.length > 0 ? (
          canceledBookings.map(booking => (
            <View key={booking.id}>
              {renderBookingCard(booking)}
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-10">
            <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 mt-4">
              No {activeTab} bookings found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modify Booking Modal */}
      <Modal
        visible={showModifyModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-11/12">
            <Text className="text-xl font-bold mb-4">Modify Customer Details</Text>
            
            <Text className="font-medium mb-2">Name</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              value={modifyData.name}
              onChangeText={(text) => setModifyData({...modifyData, name: text})}
              placeholder="Customer name"
            />
            
            <Text className="font-medium mb-2">Email</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              value={modifyData.email}
              onChangeText={(text) => setModifyData({...modifyData, email: text})}
              placeholder="Customer email"
              keyboardType="email-address"
            />
            
            <Text className="font-medium mb-2">Phone</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-4"
              value={modifyData.phone}
              onChangeText={(text) => setModifyData({...modifyData, phone: text})}
              placeholder="Customer phone"
              keyboardType="phone-pad"
            />
            
            <Text className="font-medium mb-2">Special Requests</Text>
            <TextInput
              className="border border-gray-300 p-2 rounded mb-6 h-20"
              value={modifyData.specialRequests}
              onChangeText={(text) => setModifyData({...modifyData, specialRequests: text})}
              placeholder="Any special requests?"
              multiline
            />
            
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="border border-[#006D77] py-2 px-4 rounded-lg flex-1 mr-2"
                onPress={() => setShowModifyModal(false)}
              >
                <Text className="text-[#006D77] text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-[#006D77] py-2 px-4 rounded-lg flex-1 ml-2"
                onPress={submitModification}
              >
                <Text className="text-white text-center">Submit Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Cancel Booking Confirmation Modal */}
      <Modal
        visible={showCancelModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <View className="items-center mb-4">
              <Ionicons name="warning" size={48} color="#EF4444" />
            </View>
            <Text className="text-lg font-bold text-center mb-2">Cancel Booking</Text>
            <Text className="text-gray-600 text-center mb-6">
              Are you sure you want to cancel this booking? 
              This action cannot be undone.
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity 
                className="border border-gray-400 py-2 px-4 rounded-lg flex-1 mr-2"
                onPress={() => setShowCancelModal(false)}
              >
                <Text className="text-gray-700 text-center">No, Keep It</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="bg-red-500 py-2 px-4 rounded-lg flex-1 ml-2"
                onPress={confirmCancelBooking}
              >
                <Text className="text-white text-center">Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Message Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-3/4">
            <View className="items-center mb-4">
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </View>
            <Text className="text-lg font-bold text-center mb-2">Success!</Text>
            <Text className="text-gray-600 text-center mb-6">
              {currentBooking && showCancelModal ? 
                "Your booking has been cancelled successfully." : 
                "Your booking modification request has been submitted successfully."}
            </Text>
            <TouchableOpacity 
              className="bg-[#006D77] py-2 px-4 rounded-lg"
              onPress={() => {
                setShowMessageModal(false);
                if (currentBooking && showCancelModal) {
                  // Optionally navigate away or refresh data
                }
              }}
            >
              <Text className="text-white text-center">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      
    </SafeAreaView>
  );
};

export default Bookings;