import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import NavBar from 'components/NavBar'; // Import your NavBar component
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Trending Filter Options - Updated with better alignment
const TrendingFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'trending', label: 'Trending' },
    { id: 'discount', label: 'Discounts' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'budget', label: 'Budget' },
  ];

  return (
    <View className="bg-white px-4 py-3">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            onPress={() => onFilterChange(filter.id)}
            className={`px-4 py-2 rounded-full mr-3 ${
              activeFilter === filter.id ? 'bg-[#006D77]' : 'bg-gray-100'
            }`}
            style={{
              shadowColor: activeFilter === filter.id ? '#006D77' : 'transparent',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: activeFilter === filter.id ? 3 : 0,
            }}
          >
            <Text className={`${activeFilter === filter.id ? 'text-white' : 'text-gray-700'} text-sm font-medium`}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Sponsored Stay Card Component
const SponsoredStayCard = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      className="bg-white rounded-xl overflow-hidden shadow-sm mb-4 mx-4"
      onPress={() => navigation.navigate('StayDetails', { stay: item })}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="relative">
        <Image
          source={item.image}
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-[#FF5A5F] px-2 py-1 rounded">
          <Text className="text-white text-xs font-bold">{item.discount}</Text>
        </View>
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <Text className="font-semibold text-lg text-gray-900 flex-1">{item.title}</Text>
          <View className="flex-row items-center ml-2">
            <FontAwesome5 name="star" size={12} color="#F59E0B" />
            <Text className="text-sm text-gray-600 ml-1">{item.rating}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center mt-1">
          <Ionicons name="location-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-500 ml-1">{item.location}</Text>
        </View>
        
        <View className="flex-row items-center justify-between mt-3">
          <View>
            <Text className="text-lg font-bold text-[#006D77]">{item.price}</Text>
            <Text className="text-xs text-gray-500 line-through">{item.originalPrice}</Text>
          </View>
          <TouchableOpacity 
            className="bg-[#006D77] px-4 py-2 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium">Book Now</Text>
          </TouchableOpacity>
        </View>
        
        {item.tags && (
          <View className="flex-row flex-wrap mt-3">
            {item.tags.map((tag, index) => (
              <View 
                key={index} 
                className="bg-[#E6F6F8] px-2 py-1 rounded-full mr-2 mb-2"
              >
                <Text className="text-xs text-[#006D77]">{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Main Component
const SponsoredStaysScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Sample data
  const sponsoredStays = [
    {
      id: '1',
      title: 'Sangarilla Hotel & Spa',
      location: 'Colombo, Sri Lanka',
      rating: '4.7',
      price: '$369.00',
      originalPrice: '$520.00',
      discount: '29% OFF',
      image: require('../../assets/download (3).jpeg'),
      tags: ['Free Cancellation', 'Breakfast', 'Pool'],
    },
    {
      id: '2',
      title: 'Beach Paradise Resort',
      location: 'Galle, Sri Lanka',
      rating: '4.9',
      price: '$289.00',
      originalPrice: '$410.00',
      discount: '30% OFF',
      image: require('../../assets/download (3).jpeg'),
      tags: ['Beachfront', 'All Inclusive', 'Spa'],
    },
    {
      id: '3',
      title: 'Mountain View Lodge',
      location: 'Nuwara Eliya, Sri Lanka',
      rating: '4.6',
      price: '$199.00',
      originalPrice: '$280.00',
      discount: '29% OFF',
      image: require('../../assets/download (3).jpeg'),
      tags: ['Mountain View', 'Free WiFi', 'Family'],
    },
    {
      id: '4',
      title: 'Heritage Boutique Hotel',
      location: 'Kandy, Sri Lanka',
      rating: '4.8',
      price: '$249.00',
      originalPrice: '$350.00',
      discount: '29% OFF',
      image: require('../../assets/download (3).jpeg'),
      tags: ['Cultural', 'Central', 'Luxury'],
    },
    {
      id: '5',
      title: 'Wildlife Safari Camp',
      location: 'Yala, Sri Lanka',
      rating: '4.5',
      price: '$179.00',
      originalPrice: '$250.00',
      discount: '28% OFF',
      image: require('../../assets/download (3).jpeg'),
      tags: ['Safari', 'Nature', 'Adventure'],
    },
  ];

  // Filter stays based on active filter
  const filteredStays = sponsoredStays.filter(stay => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trending') return stay.rating >= 4.7;
    if (activeFilter === 'discount') return parseFloat(stay.discount) >= 29; // Filter for 29%+ discounts
    if (activeFilter === 'luxury') return stay.tags?.includes('Luxury');
    if (activeFilter === 'budget') return parseFloat(stay.price.replace('$', '')) < 200;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Using your imported NavBar component */}
      <NavBar 
        title="Sponsored Stays" 
        onBackPress={() => navigation.goBack()}
        showSearch={true}
      />
      
      {/* Updated Filter Options with better alignment */}
      <TrendingFilters 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />
      
      {/* Main Content */}
      <ScrollView className="flex-1 pb-4">
        {/* Featured Section */}
        <View className="mt-2">
          <Text className="text-lg font-semibold px-4 mb-3 text-gray-800">Featured Stays</Text>
          <FlatList
            data={sponsoredStays.slice(0, 2)}
            renderItem={({ item }) => <SponsoredStayCard item={item} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
          />
        </View>
        
        {/* All Sponsored Stays */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center px-4 mb-3">
            <Text className="text-lg font-semibold text-gray-800">
              {activeFilter === 'all' ? 'All Stays' : 
               activeFilter === 'trending' ? 'Trending' :
               activeFilter === 'discount' ? 'Best Discounts' :
               activeFilter === 'luxury' ? 'Luxury' : 'Budget'}
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-sm text-[#006D77] mr-1">Map View</Text>
              <MaterialIcons name="map" size={16} color="#006D77" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={filteredStays}
            renderItem={({ item }) => <SponsoredStayCard item={item} />}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 12 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SponsoredStaysScreen;