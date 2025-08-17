import React, { useState, useEffect, useRef } from 'react';
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
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import BottomTabBar from 'components/BottomTabBar';
import { useNavigation } from '@react-navigation/native';
import NavBar from 'components/NavBar';

const { width } = Dimensions.get('window');

const FilterModal = ({ visible, onClose, onFilterSelect, selectedFilter }) => {
  const filters = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'price_low', label: 'Price (Low to High)' },
    { id: 'price_high', label: 'Price (High to Low)' },
    { id: 'rating', label: 'Rating (High to Low)' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/30 justify-end" onPress={onClose}>
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold">Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter.id}
              className="py-3 border-b border-gray-100 flex-row justify-between items-center"
              onPress={() => {
                onFilterSelect(filter.id);
              }}
            >
              <Text className={`text-gray-800 ${selectedFilter === filter.id ? 'font-medium' : ''}`}>
                {filter.label}
              </Text>
              {selectedFilter === filter.id && (
                <Feather name="check" size={20} color="#006D77" />
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="mt-6 bg-[#006D77] py-3 rounded-lg items-center"
            onPress={onClose}
          >
            <Text className="text-white font-medium">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const StoryStaysCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();
  
  const storyStays = [
    {
      id: '1',
      title: 'Homes with Heartwarming Stories',
      description: 'Stay with local families and experience their inspiring journeys while enjoying authentic hospitality.',
      image: require('../../assets/download (3).jpeg')
    },
    {
      id: '2',
      title: 'Cultural Homestays',
      description: 'Immerse yourself in local traditions with families preserving their heritage.',
      image: require('../../assets/download (3).jpeg')
    },
    {
      id: '3',
      title: 'Artisan Family Stays',
      description: 'Live with craft families and learn traditional skills passed through generations.',
      image: require('../../assets/download (3).jpeg')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % storyStays.length;
      setCurrentIndex(nextIndex);
    });

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      className="w-full bg-[#F8FAFB] rounded-xl overflow-hidden shadow-sm mr-4"
      style={{ width: width - 32 }}
      onPress={() => navigation.navigate('StoryStayDetails', { story: item })}
    >
      <Image
        source={item.image}
        className="w-full h-44"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="font-semibold text-gray-900 text-lg">{item.title}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-3 px-4">
        <Text className="text-base font-semibold text-[#006D77]">STORY STAYS</Text>
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => navigation.navigate('AllStoryStays')}
        >
          <Text className="text-sm text-[#006D77] mr-1">See all</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#006D77" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={storyStays}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width - 32}
        decelerationRate="fast"
        onScrollToIndexFailed={() => {}}
        getItemLayout={(data, index) => ({
          length: width - 32,
          offset: (width - 32) * index,
          index,
        })}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / (width - 32));
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
      />

      <View className="flex-row justify-center mt-3 space-x-2">
        {storyStays.map((_, index) => (
          <View 
            key={index}
            
          />
        ))}
      </View>
    </View>
  );
};

const SpecialOffersCarousel = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  
  const specialOffers = [
    {
      id: '1',
      title: 'Summer Beach Escape',
      description: 'Enjoy 30% off at beachfront resorts this summer',
      image: require('../../assets/New-Star-Samui_May-Escape.jpg'),
      price: '$199/night',
      originalPrice: '$284/night',
      discount: '30% OFF',
      link: 'https://example.com/summer-beach-escape'
    },
    {
      id: '2',
      title: 'Mountain Retreat',
      description: 'Weekend getaway with breakfast included',
      image: require('../../assets/New-Star-Samui_May-Escape.jpg'),
      price: '$159/night',
      originalPrice: '$220/night',
      discount: '28% OFF',
      link: 'https://example.com/mountain-retreat'
    },
    {
      id: '3',
      title: 'City Break Special',
      description: 'Explore the city with our exclusive package',
      image: require('../../assets/New-Star-Samui_May-Escape.jpg'),
      price: '$129/night',
      originalPrice: '$180/night',
      discount: '28% OFF',
      link: 'https://example.com/city-break-special'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % specialOffers.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const renderItem = ({ item }) => (
    <Animated.View 
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
      className="w-full bg-[#E6F6F8] rounded-xl overflow-hidden shadow-sm mr-4"
      style={{ width: width - 32 }}
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
          <View className="flex-1">
            <Text className="font-semibold text-gray-900 text-lg">{item.title}</Text>
            <Text className="text-xs text-gray-500 mt-1">{item.description}</Text>
          </View>
        </View>
        <View className="flex-row items-center mt-2">
          <Text className="text-lg font-bold text-[#006D77]">{item.price}</Text>
          <Text className="text-xs text-gray-500 ml-2 line-through">{item.originalPrice}</Text>
        </View>
        <TouchableOpacity 
          className="mt-4 bg-[#006D77] py-2 rounded-lg items-center"
          onPress={() => Linking.openURL(item.link)}
        >
          <Text className="text-white font-medium">View Offer</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center mb-3 px-4">
        <Text className="text-base font-semibold text-gray-800">Special Offers</Text>
        <Text className="text-sm text-gray-500">Special offers in srilanka</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={specialOffers}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width - 32}
        decelerationRate="fast"
        onScrollToIndexFailed={() => {}}
        getItemLayout={(data, index) => ({
          length: width - 32,
          offset: (width - 32) * index,
          index,
        })}
        onScroll={({ nativeEvent }) => {
          const index = Math.round(nativeEvent.contentOffset.x / (width - 32));
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}
      />

      <View className="flex-row justify-center mt-3 space-x-2">
        {specialOffers.map((_, index) => (
          <View 
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${currentIndex === index ? 'bg-[#006D77]' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    </View>
  );
};

// Data
const categories = ['All', 'Mountain', 'Beach', 'Camp', 'Traditional'];
const samplePlaces = [
  { 
    id: '1', 
    title: 'Sigiriya', 
    location: 'Colombo', 
    rating: '4.8', 
    image: require('../../assets/download (3).jpeg'),
    link: 'https://example.com/sigiriya'
  },
  { 
    id: '2', 
    title: 'Galle', 
    location: 'Colombo', 
    rating: '4.5', 
    image: require('../../assets/download (3).jpeg'),
    link: 'https://example.com/galle'
  },
];
const sponsored = [
  {
    id: 's1', 
    title: 'Sangarilla Hotel', 
    location: 'Colombo', 
    price: '$369.00', 
    originalPrice: '$520.00',
    discount: '29% OFF',
    image: require('../../assets/download (3).jpeg'),
    link: 'https://example.com/sangarilla-hotel',
    rating: '4.7'
  },
  {
    id: 's2', 
    title: 'Beach Paradise Resort', 
    location: 'Galle', 
    price: '$289.00', 
    originalPrice: '$410.00',
    discount: '30% OFF',
    image: require('../../assets/download (3).jpeg'),
    link: 'https://example.com/beach-paradise',
    rating: '4.9'
  },
  {
    id: 's3', 
    title: 'Mountain View Lodge', 
    location: 'Nuwara Eliya', 
    price: '$199.00', 
    originalPrice: '$280.00',
    discount: '29% OFF',
    image: require('../../assets/download (3).jpeg'),
    link: 'https://example.com/mountain-view',
    rating: '4.6'
  }
];
const events = [
  { 
    id: 'e1', 
    title: 'Colemba Music Festival', 
    description: 'The biggest music festival in Sri Lanka featuring local and international artists.',
    image: require('../../assets/images (15).jpeg'),
    date: '15-17 June 2023',
    link: 'https://example.com/colemba-festival'
  },
  { 
    id: 'e2', 
    title: 'Kandy Ecala Premiere', 
    description: 'The leisure, cultural procession with traditional winners and visitors.',
    image: require('../../assets/images (15).jpeg'),
    date: '10-20 August 2023',
    link: 'https://example.com/kandy-ecala'
  },
  { 
    id: 'e3', 
    title: 'Galle Literary Festival', 
    description: 'Celebrating literature with renowned authors and thinkers.',
    image: require('../../assets/images (15).jpeg'),
    date: '25-29 January 2024',
    link: 'https://example.com/galle-literary'
  },
  { 
    id: 'e4', 
    title: 'Colombo Food Festival', 
    description: 'Experience the diverse culinary traditions of Sri Lanka.',
    image: require('../../assets/images (15).jpeg'),
    date: '5-7 May 2023',
    link: 'https://example.com/colombo-food'
  },
];

const Explore = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('Explore');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('recommended');

  const handleSearch = () => {
    if (query.trim()) {
      navigation.navigate('SearchResults', { query, filter: activeFilter, category: activeCategory });
    }
  };

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity 
      className="w-[46%] bg-gray-100 rounded-xl overflow-hidden mr-3 mb-4"
      onPress={() => Linking.openURL(item.link)}
    >
      <Image source={item.image} className="w-full h-28" resizeMode="cover" />
      <View className="p-3">
        <Text className="font-semibold text-gray-800">{item.title}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-500 ml-1">{item.location}</Text>
          </View>
          <View className="flex-row items-center">
            <FontAwesome5 name="star" size={12} color="#F59E0B" />
            <Text className="text-xs text-gray-600 ml-1">{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSponsored = ({ item }) => (
    <TouchableOpacity 
      className="flex-row items-center bg-gray-50 p-3 mb-3 shadow-sm rounded-lg"
      onPress={() => Linking.openURL(item.link)}
    >
      <Image source={item.image} className="w-16 h-16 rounded-lg" resizeMode="cover" />
      <View className="ml-3 flex-1">
        <Text className="font-semibold text-gray-800">{item.title}</Text>
        <Text className="text-xs text-gray-500">{item.location}</Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <FontAwesome5 name="star" size={12} color="#F59E0B" />
            <Text className="text-xs text-gray-600 ml-1">{item.rating}</Text>
          </View>
          <View className="items-end">
            <Text className="text-sm font-semibold text-[#006D77]">{item.price}</Text>
            <Text className="text-xs text-gray-500 line-through">{item.originalPrice}</Text>
          </View>
        </View>
        <View className="absolute top-2 right-2 bg-[#FF5A5F] px-2 py-1 rounded">
          <Text className="text-white text-xs font-bold">{item.discount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEvent = ({ item }) => (
    <TouchableOpacity 
      className="w-[48%] bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-sm"
      onPress={() => Linking.openURL(item.link)}
    >
      <Image source={item.image} className="w-full h-32" resizeMode="cover" />
      <View className="p-3">
        <Text className="font-semibold text-gray-800 text-sm">{item.title}</Text>
        <Text className="text-xs text-gray-500 mt-1">{item.date}</Text>
        <Text 
          className="text-xs text-gray-500 mt-1" 
          numberOfLines={2} 
          ellipsizeMode="tail"
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NavBar 
        title="Explore" 
        onBackPress={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {/* Search and Filter */}
      <View className="px-4">
        <View className="relative">
          <View className="bg-[#E9F6F8] rounded-2xl h-28 w-full" />
          
          <View className="absolute left-4 right-4 top-6">
            <View className="flex-row items-center bg-white rounded-full px-3 py-2 shadow-sm">
              <Ionicons name="search" size={18} color="#9CA3AF" />
              <TextInput
                className="flex-1 px-3 text-base text-gray-700"
                placeholder="Search places, hotels..."
                placeholderTextColor="#9CA3AF"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              <TouchableOpacity 
                className="p-2 bg-[#E6F6F8] rounded-full"
                onPress={() => setFilterModalVisible(true)}
              >
                <MaterialIcons name="tune" size={18} color="#006D77" />
              </TouchableOpacity>
            </View>

            {/* Category Chips */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              className="mt-8 pb-1"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full mr-2 ${
                    activeCategory === cat ? 'bg-[#006D77]' : 'bg-white'
                  } border ${activeCategory === cat ? 'border-transparent' : 'border-gray-200'} shadow-sm`}
                >
                  <Text className={`${activeCategory === cat ? 'text-white' : 'text-gray-700'} text-sm`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} className="mt-14 px-4">
        {/* Regular Places */}
        <FlatList
          data={samplePlaces}
          renderItem={renderPlaceCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          scrollEnabled={false}
        />

        {/* Sponsored Stays */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold text-gray-700">Sponsored stays - Featured for you</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SponsoredStaysScreen')}>
              <Text className="text-sm text-[#006D77]">See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={sponsored}
            renderItem={renderSponsored}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Story Stays Carousel */}
        <StoryStaysCarousel />

        {/* Special Offers Carousel */}
        <SpecialOffersCarousel />

        {/* Popular Events */}
        <View className="mt-6 mb-8">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-base font-semibold text-gray-800">Popular Events in Sri Lanka</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllEvents')}>
              <Text className="text-sm text-[#006D77]">See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={events}
            renderItem={renderEvent}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar 
        activeTab={activeTab} 
        onTabPress={(tab) => {
          setActiveTab(tab);
          if (tab !== 'Explore') {
            navigation.navigate(tab);
          }
        }} 
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onFilterSelect={(filter) => {
          setActiveFilter(filter);
          // You could trigger a re-filter of data here if needed
        }}
        selectedFilter={activeFilter}
      />
    </SafeAreaView>
  );
};

export default Explore;