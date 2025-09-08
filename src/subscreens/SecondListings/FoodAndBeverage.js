import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import BottomTabBar from 'components/BottomTabBar';

// Restaurant data with online images
const restaurantData = [
  {
    id: 1,
    name: 'Spice Restaurant',
    location: 'Colombo',
    rating: 4,
    reviews: 124,
    ratingText: 'Very good',
    phone: '+94 7678456',
    category: 'Specialty restaurant, casino based',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
  },
  {
    id: 2,
    name: 'Ice cream',
    location: 'Colombo',
    rating: 4,
    reviews: 124,
    ratingText: 'Very good',
    phone: '+94 7678456',
    category: 'Dessert',
    image:
      'https://images.unsplash.com/photo-1560008581-09826d1de69e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGljZSUyMGNyZWFtJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
  },
  {
    id: 3,
    name: 'Ocean View Restaurant',
    location: 'Colombo',
    rating: 5,
    reviews: 245,
    ratingText: 'Excellent',
    phone: '+94 7723451',
    category: 'Seafood',
    image:
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2VhZm9vZCUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D&w=1000&q=80',
  },
  {
    id: 4,
    name: 'Spice Garden',
    location: 'Colombo',
    rating: 4,
    reviews: 187,
    ratingText: 'Very good',
    phone: '+94 7823498',
    category: 'Asian Fusion',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
  },
];

const cities = ['Colombo', 'Kandy', 'Galle', 'Negombo', 'Jaffna', 'Trincomalee'];

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [liked, setLiked] = useState({});

  const filteredRestaurants = restaurantData.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(searchInput.toLowerCase());

    const matchesCity = !selectedCity || restaurant.location === selectedCity;

    return matchesSearch && matchesCity;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {/* Header with Back + Title */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <TouchableOpacity className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow">
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Restaurants
        </Text>

        <View className="h-11 w-11" />
      </View>

      {/* Search Bar */}
      <View className="bg-white px-4 pb-4 pt-3 shadow-sm">
        <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
          <MaterialIcons name="search" size={22} color="#555" />
          <TextInput
            className="ml-3 flex-1 text-base text-black"
            placeholder="Search restaurants or cuisines"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={() => searchInput.trim() && setSearchInput(searchInput.trim())}
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <MaterialIcons name="close" size={20} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort, Filter, Map */}
        <View className="mt-4 flex-row items-center justify-between">
          {/* Sort */}
          <TouchableOpacity
            onPress={() => setSortOption(sortOption ? '' : 'rating')}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              sortOption ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
            <MaterialIcons name="sort" size={18} color={sortOption ? 'white' : '#374151'} />
            <Text className={`ml-2 ${sortOption ? 'text-white' : 'text-gray-700'}`}>Sort</Text>
          </TouchableOpacity>

          {/* Filter */}
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              showFilters ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
            <Ionicons name="filter" size={18} color={showFilters ? 'white' : '#374151'} />
            <Text className={`ml-2 ${showFilters ? 'text-white' : 'text-gray-700'}`}>Filter</Text>
          </TouchableOpacity>

          {/* Map */}
          <TouchableOpacity
            onPress={() => setShowMap(!showMap)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              showMap ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
            <FontAwesome name="map-marker" size={18} color={showMap ? 'white' : '#374151'} />
            <Text className={`ml-2 ${showMap ? 'text-white' : 'text-gray-700'}`}>Map</Text>
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        {sortOption && (
          <View className="mt-3 flex-row flex-wrap">
            {[
              { value: 'rating', label: 'Highest Rated' },
              { value: 'reviews', label: 'Most Reviews' },
              { value: 'name', label: 'Name (A-Z)' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSortOption(option.value)}
                className={`mb-2 mr-2 rounded-full px-3 py-1 ${
                  sortOption === option.value ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                <Text className={sortOption === option.value ? 'text-white' : 'text-gray-700'}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* City Filter Options */}
        {showFilters && (
          <View className="mt-3 flex-row flex-wrap">
            {cities.map((city) => (
              <TouchableOpacity
                key={city}
                onPress={() => setSelectedCity(selectedCity === city ? '' : city)}
                className={`mb-2 mr-2 rounded-full px-3 py-1 ${
                  selectedCity === city ? 'bg-blue-500' : 'bg-gray-100'
                }`}>
                <Text className={selectedCity === city ? 'text-white' : 'text-gray-700'}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Results Count */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <Text className="text-gray-600">
          {filteredRestaurants.length} restaurants found
          {searchInput && ` for "${searchInput}"`}
          {selectedCity && ` in ${selectedCity}`}
        </Text>
      </View>

      {/* Restaurant List */}
      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between px-4">
          {filteredRestaurants.map((restaurant) => (
            <View key={restaurant.id} className="mb-4 w-[48%] rounded-2xl bg-white shadow">
              {/* Image with heart */}
              <View className="relative">
                <Image
                  source={{ uri: restaurant.image }}
                  className="h-32 w-full rounded-t-2xl"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => setLiked({ ...liked, [restaurant.id]: !liked[restaurant.id] })}
                  className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                  <Ionicons
                    name={liked[restaurant.id] ? 'heart' : 'heart-outline'}
                    size={20}
                    color={liked[restaurant.id] ? 'red' : '#333'}
                  />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View className="p-3">
                {/* Name */}
                <Text className="text-base font-bold text-gray-800" numberOfLines={1}>
                  {restaurant.name}
                </Text>

                {/* Location */}
                <View className="mt-1 flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text className="ml-1 text-xs text-gray-600" numberOfLines={1}>
                    {restaurant.location}
                  </Text>
                </View>

                {/* Rating */}
                <View className="mt-2 flex-row items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={14}
                      color={i < Math.round(restaurant.rating) ? '#fbbf24' : '#d1d5db'}
                    />
                  ))}
                  <Text className="ml-2 text-xs text-gray-600">{restaurant.reviews} reviews</Text>
                </View>

                <Text className="mt-1 text-xs font-semibold text-green-600">
                  {restaurant.ratingText}
                </Text>

                {/* Phone button */}
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
                  className="mt-2 flex-row items-center justify-center rounded-xl border border-gray-300 py-1">
                  <MaterialIcons name="phone" size={16} color="#1e40af" />
                  <Text className="ml-1 text-sm font-semibold text-blue-700">
                    {restaurant.phone}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0">
        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}
