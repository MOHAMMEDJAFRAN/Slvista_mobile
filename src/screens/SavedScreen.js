import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import NavBar from 'components/NavBar';
import BottomTabBar from 'components/BottomTabBar';

const Saved = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('properties');
  const [propertyType, setPropertyType] = useState('hotel-apartment');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [propertiesData, setPropertiesData] = useState({
    'hotel-apartment': [
      {
        id: '1',
        title: 'The Capital Hotel',
        rating: '4.5',
        stars: 3,
        location: 'Colombo',
        roomType: 'Deluxe Ocean View',
        guests: '2 guests',
        bed: '1 King Bed',
        size: '42 m²',
        date: 'Jul 16 - Jul 17',
        originalPrice: '$175',
        discountedPrice: '$159',
        image: require('../../assets/download (3).jpeg'),
        isSaved: true,
      },
      {
        id: '2',
        title: 'Beachfront Apartment',
        rating: '4.8',
        stars: 4,
        location: 'Galle',
        roomType: 'Luxury Apartment',
        guests: '4 guests',
        bed: '2 Queen Beds',
        size: '75 m²',
        date: 'Aug 5 - Aug 10',
        originalPrice: '$220',
        discountedPrice: '$199',
        image: require('../../assets/download (3).jpeg'),
        isSaved: true,
      }
    ],
    homestays: [
      {
        id: '3',
        title: 'Traditional Home Stay',
        rating: '4.6',
        stars: 3,
        location: 'Kandy',
        roomType: 'Family Room',
        guests: '3 guests',
        bed: '1 Double, 1 Single',
        size: '35 m²',
        date: 'Jul 20 - Jul 22',
        originalPrice: '$120',
        discountedPrice: '$99',
        image: require('../../assets/download (3).jpeg'),
        isSaved: true,
      }
    ]
  });

  const [activitiesData, setActivitiesData] = useState([
    {
      id: 'a1',
      title: 'Sigiriya Rock Climbing',
      rating: '4.7',
      location: 'Sigiriya',
      date: 'Jul 20',
      price: '$45',
      image: require('../../assets/download (3).jpeg'),
      isSaved: true,
    }
  ]);

  const [transportData, setTransportData] = useState([
    {
      id: 't1',
      title: 'Airport Transfer',
      rating: '4.3',
      location: 'Colombo',
      date: 'Jul 16',
      price: '$25',
      image: require('../../assets/download (3).jpeg'),
      isSaved: true,
    }
  ]);

  const [foodData, setFoodData] = useState([
    {
      id: 'f1',
      title: 'Seafood Dinner Cruise',
      rating: '4.9',
      location: 'Colombo',
      date: 'Jul 17',
      price: '$65',
      image: require('../../assets/download (3).jpeg'),
      isSaved: true,
    }
  ]);

  const renderStars = (count) => {
    return Array(count).fill(0).map((_, i) => (
      <Text key={i} className="text-yellow-400">★</Text>
    ));
  };

  const handleUnsave = (itemId, category) => {
    // Show confirmation dialog
    Alert.alert(
      'Remove from Saved',
      'Are you sure you want to remove this item from your saved list?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: () => {
            // Update the state based on the category
            if (category === 'properties') {
              setPropertiesData(prev => {
                const newData = {...prev};
                newData[propertyType] = newData[propertyType].filter(item => item.id !== itemId);
                return newData;
              });
            } else if (category === 'activities') {
              setActivitiesData(prev => prev.filter(item => item.id !== itemId));
            } else if (category === 'transport') {
              setTransportData(prev => prev.filter(item => item.id !== itemId));
            } else if (category === 'food') {
              setFoodData(prev => prev.filter(item => item.id !== itemId));
            }
            
            // Show success message
            setModalMessage('Item removed from saved list');
            setShowModal(true);
            
            // Hide modal after 2 seconds
            setTimeout(() => setShowModal(false), 2000);
          },
        },
      ]
    );
  };

  // UPDATED PROPERTY CARD DESIGN
  const renderPropertyCard = ({ item }) => (
    <View className="mb-4 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Top Section: Thumbnail + Info */}
      <View className="flex-row p-3">
        {/* Hotel Thumbnail */}
        <View className="relative">
          <Image source={item.image} className="w-20 h-20 rounded-lg" resizeMode="cover" />
          {/* Discount Badge */}
          <View className="absolute top-1 left-1 bg-red-500 px-2 py-0.5 rounded">
            <Text className="text-white text-[10px] font-semibold">15% off</Text>
          </View>
        </View>

        {/* Hotel Info */}
        <View className="flex-1 ml-3">
          <Text className="text-sm font-bold text-gray-900">{item.title}</Text>
          <View className="flex-row items-center mt-0.5">
            {renderStars(item.stars)}
          </View>
          <Text className="text-gray-500 text-xs">{item.location}</Text>
          <Text className="text-green-600 text-xs font-semibold">
            {item.rating} Excellent
          </Text>
        </View>

        {/* Favorite Icon */}
        <TouchableOpacity 
          className="p-1"
          onPress={() => handleUnsave(item.id, 'properties')}
        >
          <Ionicons name="heart" size={18} color="#FF5A5F" />
        </TouchableOpacity>
      </View>

      {/* Room Image with overlay */}
      <View className="relative">
        <Image source={item.image} className="w-full h-36" resizeMode="cover" />
        <View className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-2 flex-row justify-between items-center">
          <Text className="text-white font-medium text-sm">{item.roomType}</Text>
          <Ionicons name="location" size={16} color="#fff" />
        </View>
      </View>

      {/* Room Details */}
      <View className="px-3 py-2">
        <Text className="text-gray-500 text-xs">
          {item.guests} • {item.bed} • {item.size}
        </Text>
        <Text className="text-gray-500 text-xs">{item.date}</Text>
      </View>

      {/* Price Section */}
      <View className="px-3 py-3 border-t border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-xs">Price for 1 night, 2 adults</Text>
          <View className="flex-row items-center mt-1">
            <Text className="text-gray-400 text-sm line-through mr-2">{item.originalPrice}</Text>
            <Text className="text-black text-lg font-bold">{item.discountedPrice}</Text>
          </View>
        </View>
        <TouchableOpacity
          className="bg-[#006D77] px-4 py-2 rounded-lg"
          onPress={() => navigation.navigate('Booking')}
        >
          <Text className="text-white font-medium">Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderActivityCard = ({ item }) => (
    <View className="mb-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Image source={item.image} className="w-full h-48" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
            <Text className="text-gray-500 text-sm mt-1">{item.location}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => handleUnsave(item.id, 'activities')}
              className="p-1 mr-2"
            >
              <Ionicons name="heart" size={20} color="#FF5A5F" />
            </TouchableOpacity>
            <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded">
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text className="text-gray-700 text-sm ml-1">{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <View className="mt-4 pt-3 border-t border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-xs">Price per person:</Text>
            <Text className="text-[#006D77] text-lg font-bold mt-1">{item.price}</Text>
          </View>
          <TouchableOpacity className="bg-[#006D77] px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Similar render functions for transport and food cards
  const renderTransportCard = ({ item }) => (
    <View className="mb-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Image source={item.image} className="w-full h-48" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
            <Text className="text-gray-500 text-sm mt-1">{item.location}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => handleUnsave(item.id, 'transport')}
              className="p-1 mr-2"
            >
              <Ionicons name="heart" size={20} color="#FF5A5F" />
            </TouchableOpacity>
            <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded">
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text className="text-gray-700 text-sm ml-1">{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <View className="mt-4 pt-3 border-t border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-xs">Price per person:</Text>
            <Text className="text-[#006D77] text-lg font-bold mt-1">{item.price}</Text>
          </View>
          <TouchableOpacity className="bg-[#006D77] px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFoodCard = ({ item }) => (
    <View className="mb-6 border border-gray-200 rounded-xl overflow-hidden bg-white">
      <Image source={item.image} className="w-full h-48" resizeMode="cover" />
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-900">{item.title}</Text>
            <Text className="text-gray-500 text-sm mt-1">{item.location}</Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => handleUnsave(item.id, 'food')}
              className="p-1 mr-2"
            >
              <Ionicons name="heart" size={20} color="#FF5A5F" />
            </TouchableOpacity>
            <View className="flex-row items-center bg-blue-50 px-2 py-1 rounded">
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text className="text-gray-700 text-sm ml-1">{item.rating}</Text>
            </View>
          </View>
        </View>
        
        <View className="mt-4 pt-3 border-t border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-xs">Price per person:</Text>
            <Text className="text-[#006D77] text-lg font-bold mt-1">{item.price}</Text>
          </View>
          <TouchableOpacity className="bg-[#006D77] px-4 py-2 rounded-lg">
            <Text className="text-white font-medium">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'properties':
        return (
          <>
            <View className="flex-row mb-4 bg-white p-1 rounded-full">
              {['hotel-apartment', 'homestays'].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`flex-1 py-2 rounded-full ${propertyType === type ? 'bg-[#006D77]' : ''}`}
                  onPress={() => setPropertyType(type)}
                >
                  <Text 
                    className={`text-center ${propertyType === type ? 'text-white font-medium' : 'text-gray-700'}`}
                  >
                    {type === 'hotel-apartment' ? 'Hotels & Apartments' : 'Home Stays'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <FlatList
              data={propertiesData[propertyType]}
              renderItem={renderPropertyCard}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </>
        );
      case 'activities':
        return (
          <FlatList
            data={activitiesData}
            renderItem={renderActivityCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      case 'transport':
        return (
          <FlatList
            data={transportData}
            renderItem={renderTransportCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      case 'food':
        return (
          <FlatList
            data={foodData}
            renderItem={renderFoodCard}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        );
      default:
        return (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-gray-500">No saved items yet</Text>
          </View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar 
        title="Saved" 
        onBackPress={() => navigation.goBack()}
        showSearch={false}
      />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Date and Guests */}
        <View className="px-4 mb-4">
          <Text className="font-medium text-gray-900">Wed, Jul 16 - Jul 17</Text>
          <Text className="text-gray-500 text-sm">2 Adults, 0 Children</Text>
        </View>

        {/* Main Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 px-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {['properties', 'activities', 'transport', 'food'].map((tab) => (
            <TouchableOpacity
              key={tab}
              className={`px-4 py-2 rounded-full mr-2 ${activeTab === tab ? 'bg-[#006D77]' : 'bg-white'}`}
              onPress={() => setActiveTab(tab)}
            >
              <Text 
                className={`text-sm ${activeTab === tab ? 'text-white font-medium' : 'text-gray-700'}`}
              >
                {tab === 'properties' ? 'Properties' :
                 tab === 'activities' ? 'Activities' :
                 tab === 'transport' ? 'Transport' : 'Food & Beverage'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        <View className="px-4">
          {renderContent()}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-5 rounded-lg w-3/4">
            <Text className="text-lg font-semibold text-center mb-2">Success</Text>
            <Text className="text-gray-600 text-center">{modalMessage}</Text>
            <TouchableOpacity
              className="mt-4 bg-[#006D77] py-2 rounded-lg"
              onPress={() => setShowModal(false)}
            >
              <Text className="text-white text-center font-medium">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomTabBar activeTab="Saved" />
    </SafeAreaView>
  );
};

export default Saved;