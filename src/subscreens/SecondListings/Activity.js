// screens/ActivitiesScreen.js00
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import BottomTabBar from 'components/BottomTabBar';

export default function Activity() {
  const route = useRoute();
  const navigation = useNavigation();
  const { searchQuery } = route.params || {};

  const [selectedCity, setSelectedCity] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (searchQuery) {
      setSearchInput(searchQuery);
      const matchedCity = cities.find(
        (city) => city.toLowerCase() === searchQuery.toLowerCase()
      );
      if (matchedCity) {
        setSelectedCity(matchedCity);
      }
    }
  }, [searchQuery]);

  const activities = [
    {
      id: 1,
      title: 'Sigiriya Rock Climb',
      duration: '5 hours',
      difficulty: 'Challenging',
      location: 'Sigiriya',
      price: 35,
      rating: 4.8,
      reviews: 156,
      image:
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    },
    {
      id: 2,
      title: 'Colombo Food Tour',
      duration: '3 hours',
      difficulty: 'Easy',
      location: 'Colombo',
      price: 30,
      rating: 4.6,
      reviews: 95,
      image:
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    },
    {
      id: 3,
      title: 'Kandy Temple Visit',
      duration: '2 hours',
      difficulty: 'Easy',
      location: 'Kandy',
      price: 15,
      rating: 4.2,
      reviews: 67,
      image:
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop',
    },
    {
      id: 4,
      title: 'Ella Mountain Hike',
      duration: '6 hours',
      difficulty: 'Moderate',
      location: 'Ella',
      price: 40,
      rating: 4.9,
      reviews: 203,
      image:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      title: 'Yala Safari Adventure',
      duration: '8 hours',
      difficulty: 'Moderate',
      location: 'Yala',
      price: 50,
      rating: 4.9,
      reviews: 187,
      image:
        'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Bentota Beach Relaxation',
      duration: 'Full day',
      difficulty: 'Easy',
      location: 'Bentota',
      price: 15,
      rating: 4.4,
      reviews: 92,
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    },
  ];

  const cities = [
    'Colombo',
    'Kandy',
    'Galle',
    'Sigiriya',
    'Ella',
    'Nuwara Eliya',
    'Yala',
    'Bentota',
  ];

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchInput.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchInput.toLowerCase());

    const matchesCity = !selectedCity || activity.location === selectedCity;

    return matchesSearch && matchesCity;
  });

  const getSortedActivities = () => {
    let sorted = [...filteredActivities];
    switch (sortOption) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'duration':
        const getHours = (duration) => {
          if (duration.includes('Full day')) return 8;
          return parseInt(duration);
        };
        return sorted.sort((a, b) => getHours(a.duration) - getHours(b.duration));
      default:
        return sorted;
    }
  };

  const sortedActivities = getSortedActivities();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with Back + Title */}
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 bg-white">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="h-11 w-11 items-center justify-center rounded-full border border-gray-300 bg-white shadow"
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>

        <Text className="absolute left-0 right-0 text-center text-xl font-bold text-gray-800">
          Activities
        </Text>

        <View className="h-11 w-11" />
      </View>

      {/* Search Bar */}
      <View className="bg-white px-4 pb-4 pt-3 shadow-sm">
        <View className="flex-row items-center rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 shadow-sm">
          <MaterialIcons name="search" size={22} color="#555" />
          <TextInput
            className="ml-3 flex-1 text-base text-black"
            placeholder="Search by city or activity"
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={() =>
              searchInput.trim() && setSearchInput(searchInput.trim())
            }
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
            onPress={() => setSortOption(sortOption ? '' : 'price-low')}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              sortOption ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <MaterialIcons
              name="sort"
              size={18}
              color={sortOption ? 'white' : '#374151'}
            />
            <Text
              className={`ml-2 ${sortOption ? 'text-white' : 'text-gray-700'}`}
            >
              Sort
            </Text>
          </TouchableOpacity>

          {/* Filter */}
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              showFilters ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <Ionicons
              name="filter"
              size={18}
              color={showFilters ? 'white' : '#374151'}
            />
            <Text
              className={`ml-2 ${showFilters ? 'text-white' : 'text-gray-700'}`}
            >
              Filter
            </Text>
          </TouchableOpacity>

          {/* Map */}
          <TouchableOpacity
            onPress={() => setShowMap(!showMap)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              showMap ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <FontAwesome
              name="map-marker"
              size={18}
              color={showMap ? 'white' : '#374151'}
            />
            <Text
              className={`ml-2 ${showMap ? 'text-white' : 'text-gray-700'}`}
            >
              Map
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        {sortOption && (
          <View className="mt-3 flex-row flex-wrap">
            {[
              { value: 'price-low', label: 'Price: Low to High' },
              { value: 'price-high', label: 'Price: High to Low' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'duration', label: 'Duration' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => setSortOption(option.value)}
                className={`mr-2 mb-2 rounded-full px-3 py-1 ${
                  sortOption === option.value ? 'bg-blue-500' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={
                    sortOption === option.value
                      ? 'text-white'
                      : 'text-gray-700'
                  }
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Results Count */}
      <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <Text className="text-gray-600">
          {sortedActivities.length} activities found
          {searchInput && ` for "${searchInput}"`}
          {selectedCity && ` in ${selectedCity}`}
        </Text>
      </View>

      {/* Activities List */}
      <FlatList
        data={sortedActivities}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
            <View className="mb-3 h-48 w-full overflow-hidden rounded-lg">
              <Image
                source={{ uri: item.image }}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>

            <Text className="text-lg font-semibold text-gray-800">
              {item.title}
            </Text>

            <View className="mt-2 flex-row items-center">
              <MaterialIcons name="access-time" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600">
                {item.duration}
              </Text>

              <View className="mx-3 h-4 w-px bg-gray-300" />

              <MaterialIcons name="terrain" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600">
                {item.difficulty}
              </Text>
            </View>

            <View className="mt-1 flex-row items-center">
              <MaterialIcons name="location-on" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-600">
                {item.location}
              </Text>
            </View>

            <View className="mt-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={16} color="#f59e0b" />
                <Text className="ml-1 text-sm text-gray-700">
                  {item.rating}
                </Text>
                <Text className="ml-1 text-sm text-gray-500">
                  ({item.reviews} reviews)
                </Text>
              </View>

              <Text className="text-lg font-bold text-black">
                ${item.price}
              </Text>
            </View>

            <TouchableOpacity className="mt-3 rounded-lg bg-cyan-700 px-4 py-2">
              <Text className="text-center font-medium text-white">
                Book Now
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <MaterialIcons name="search-off" size={48} color="#9ca3af" />
            <Text className="mt-2 text-center text-gray-500">
              {searchInput || selectedCity
                ? `No activities found${
                    searchInput ? ` for "${searchInput}"` : ''
                  }${selectedCity ? ` in ${selectedCity}` : ''}`
                : 'No activities available'}
            </Text>
          </View>
        }
      />

      <View className="absolute bottom-0 left-0 right-0">
        <BottomTabBar />
      </View>
    </View>
  );
}
