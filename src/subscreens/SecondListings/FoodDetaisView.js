import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Share,
  Alert,
  Linking,
  TextInput
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

// Configure axios base URL
const API_BASE_URL = process.env.API_BASE_URL;

export default function FoodDetailsView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { restaurant: initialRestaurant } = route.params || {};

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [addReviewModalVisible, setAddReviewModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState('Main Course');
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: '',
    title: ''
  });
  const [apiError, setApiError] = useState(null);

  // Enhanced reviews data matching activity details page
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Amazing Dining Experience!',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely amazing food! The service was exceptional and the atmosphere was perfect for a romantic dinner. The steak was cooked to perfection.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      title: 'Great Food and Service',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great food and good service. The portions were generous and everything was fresh. Will definitely come back!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      title: 'Best Restaurant in Town!',
      rating: 5,
      date: '2024-01-05',
      comment: 'Best restaurant in town! The seafood was incredibly fresh and well-prepared. The ambiance is wonderful.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      helpful: 15,
      verified: false
    },
    {
      id: 4,
      name: 'David Wilson',
      title: 'Worth Every Penny',
      rating: 5,
      date: '2024-01-02',
      comment: 'This restaurant exceeded all expectations. The wine selection was excellent and the dessert was to die for.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      helpful: 6,
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Memorable Dinner',
      rating: 4,
      date: '2023-12-28',
      comment: 'A truly memorable dinner experience. The service was attentive and the food presentation was beautiful.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      helpful: 3,
      verified: true
    }
  ]);

  // Calculate average rating and distribution (matching activity details)
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // For 1-5 stars
  reviews.forEach(review => {
    ratingDistribution[review.rating - 1]++;
  });

  // Menu data (removed ordering functionality)
  const menuCategories = {
    'Starters': [
      { id: 1, name: 'Spring Rolls', price: 12, description: 'Crispy vegetable spring rolls with sweet chili sauce', isVegetarian: true },
      { id: 2, name: 'Chicken Satay', price: 15, description: 'Grilled chicken skewers with peanut sauce', isVegetarian: false },
      { id: 3, name: 'Calamari', price: 18, description: 'Crispy fried squid with lemon aioli', isVegetarian: false },
    ],
    'Main Course': [
      { id: 4, name: 'Grilled Salmon', price: 28, description: 'Atlantic salmon with roasted vegetables', isVegetarian: false },
      { id: 5, name: 'Vegetable Curry', price: 16, description: 'Mixed vegetables in coconut curry sauce', isVegetarian: true },
      { id: 6, name: 'Beef Stir Fry', price: 22, description: 'Tender beef with bell peppers and black bean sauce', isVegetarian: false },
    ],
    'Desserts': [
      { id: 7, name: 'Chocolate Lava Cake', price: 10, description: 'Warm chocolate cake with melting center', isVegetarian: true },
      { id: 8, name: 'Ice Cream', price: 8, description: 'Vanilla, chocolate, or strawberry', isVegetarian: true },
    ],
    'Beverages': [
      { id: 9, name: 'Fresh Juice', price: 6, description: 'Orange, apple, or pineapple juice', isVegetarian: true },
      { id: 10, name: 'Soft Drinks', price: 4, description: 'Coke, Sprite, or Fanta', isVegetarian: true },
    ]
  };

  // Fetch restaurant details from API
  useEffect(() => {
    if (initialRestaurant?.id) {
      fetchRestaurantDetails();
    } else {
      setLoading(false);
      setApiError("No restaurant ID provided");
    }
  }, [initialRestaurant]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/v1/food-and-beverages/${initialRestaurant.id}`);
      
      if (response.data.success) {
        const apiData = response.data.data;
        
        // Transform API data to match our component structure
        const transformedRestaurant = {
          id: apiData.id,
          name: apiData.name,
          location: apiData.city || apiData.province,
          address: `${apiData.city}, ${apiData.province}`,
          rating: 4.0, // Default rating since not in API
          reviews: Math.floor(Math.random() * 200) + 50, // Random reviews for demo
          priceRange: getRandomPriceRange(),
          cuisine: apiData.cuisineType ? [apiData.cuisineType] : ['Multi-cuisine'],
          features: getRandomFeatures(),
          phone: apiData.phone,
          email: apiData.email,
          website: apiData.website,
          description: apiData.description || 'No description available',
          images: apiData.images && apiData.images.length > 0 
            ? apiData.images.map(img => img.imageUrl)
            : ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop'],
          isPopular: Math.random() > 0.7,
          distance: `${(Math.random() * 5).toFixed(1)} km`,
          deliveryTime: `${Math.floor(Math.random() * 30) + 20}-${Math.floor(Math.random() * 30) + 40} min`,
          isActive: apiData.isActive,
          vistaVerified: apiData.vistaVerified,
          slug: apiData.slug,
          createdAt: apiData.createdAt,
          updatedAt: apiData.updatedAt,
          // API specific fields
          cuisineType: apiData.cuisineType,
          province: apiData.province,
          city: apiData.city,
          vistaVerified: apiData.vistaVerified,
          isActive: apiData.isActive
        };

        setRestaurant(transformedRestaurant);
      } else {
        setApiError("Failed to fetch restaurant details from server");
      }
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      setApiError("Failed to load restaurant details. Please check your connection and try again.");
      setRestaurant(null); // Clear restaurant data on error
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mock data
  const getRandomPriceRange = () => {
    const ranges = ['$', '$$', '$$$'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  };

  const getRandomFeatures = () => {
    const allFeatures = ['Delivery', 'Takeaway', 'Outdoor Seating', 'Vegetarian Options', 'WiFi', 'Parking'];
    return allFeatures.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  // Restaurant features with IDs
  const features = [
    { id: 1, icon: 'access-time', text: `${restaurant?.deliveryTime || '30-40 min'} delivery` },
    { id: 2, icon: 'attach-money', text: restaurant?.priceRange || '$$' },
    { id: 3, icon: 'location-on', text: restaurant?.distance || '2.5 km' },
    { id: 4, icon: 'star', text: `${averageRating.toFixed(1)} rating` },
    { id: 5, icon: 'group', text: `${reviews.length}+ reviews` },
    { id: 6, icon: 'local-offer', text: 'Free delivery above $25' },
  ];

  // Cuisine with IDs
  const cuisineItems = (restaurant?.cuisine || []).map((item, index) => ({
    id: index + 1,
    name: item
  }));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this amazing restaurant: ${restaurant.name} - ${restaurant.location}. Rating: ${averageRating.toFixed(1)} stars.`,
        title: restaurant.name
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share restaurant');
    }
  };

  const handleCall = () => {
    if (restaurant?.phone) {
      Linking.openURL(`tel:${restaurant.phone}`);
    } else {
      Alert.alert('Phone Not Available', 'Phone number is not available for this restaurant.');
    }
  };

  const handleDirections = () => {
    Alert.alert('Directions', `Opening maps for ${restaurant?.address || restaurant?.location}`);
  };

  const handleReservation = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your reservation');
      return;
    }
    setReservationModalVisible(true);
  };

  const confirmReservation = () => {
    setReservationModalVisible(false);
    Alert.alert(
      'Reservation Confirmed!',
      `Your table for ${guests} guests at ${restaurant.name} on ${formatDisplayDate(selectedDate)} has been confirmed.`,
      [
        {
          text: 'View Reservations',
          onPress: () => navigation.navigate('Reservations')
        },
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleNextImage = () => {
    if (restaurant?.images && restaurant.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % restaurant.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (restaurant?.images && restaurant.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex - 1 + restaurant.images.length) % restaurant.images.length
      );
    }
  };

  // Star rating component matching activity details - FIXED
  const renderStarRating = (rating, size = 16, showNumber = false) => {
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={`food-star-${star}-${rating}`}
            name={star <= rating ? "star" : "star-outline"}
            size={size}
            color={star <= rating ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        {showNumber && (
          <Text className="ml-2 text-gray-600 font-medium">{rating.toFixed(1)}</Text>
        )}
      </View>
    );
  };

  // Rating bar for distribution (matching activity details) - FIXED
  const renderRatingBar = (starCount, count, total, index) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View key={`food-rating-bar-${starCount}-${index}`} className="flex-row items-center mb-1">
        <Text className="w-4 text-gray-600 text-sm">{starCount}</Text>
        <Ionicons name="star" size={14} color="#f59e0b" />
        <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
          <View 
            className="h-2 bg-amber-500 rounded-full" 
            style={{ width: `${percentage}%` }}
          />
        </View>
        <Text className="w-8 text-gray-600 text-sm">{count}</Text>
      </View>
    );
  };

  // Add review function (matching activity details)
  const handleAddReview = () => {
    if (newReview.rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating for your review');
      return;
    }
    if (newReview.comment.trim().length < 10) {
      Alert.alert('Review Too Short', 'Please write a more detailed review (minimum 10 characters)');
      return;
    }

    const review = {
      id: reviews.length + 1,
      name: newReview.name || 'Anonymous',
      title: newReview.title || 'Great Experience',
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      helpful: 0,
      verified: false
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 0, comment: '', name: '', title: '' });
    setAddReviewModalVisible(false);
    Alert.alert('Review Added', 'Thank you for your review!');
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  // Review item component (matching activity details)
  const ReviewItem = ({ review }) => (
    <View className="mb-6 pb-4 border-b border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-1">
          <Image
            source={{ uri: review.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="font-semibold text-gray-800">{review.name}</Text>
              {review.verified && (
                <Ionicons name="checkmark-circle" size={16} color="#10b981" className="ml-1" />
              )}
            </View>
            <Text className="text-gray-500 text-xs mt-1">{review.date}</Text>
          </View>
        </View>
        {renderStarRating(review.rating)}
      </View>
      
      {review.title && (
        <Text className="font-semibold text-gray-800 mb-2">{review.title}</Text>
      )}
      
      <Text className="text-gray-700 mb-3">{review.comment}</Text>
      
      <TouchableOpacity 
        className="flex-row items-center self-start"
        onPress={() => handleHelpful(review.id)}
      >
        <Ionicons name="thumbs-up" size={16} color="#6b7280" />
        <Text className="ml-1 text-gray-600 text-sm">Helpful ({review.helpful})</Text>
      </TouchableOpacity>
    </View>
  );

  // Menu item component (removed ordering functionality)
  const MenuItem = ({ item }) => (
    <View className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center">
            <Text className="text-lg font-semibold text-gray-800">{item.name}</Text>
            {item.isVegetarian && (
              <View className="ml-2 bg-green-100 rounded-full px-2 py-1">
                <Text className="text-green-700 text-xs font-medium">Veg</Text>
              </View>
            )}
          </View>
          <Text className="text-gray-600 text-sm mt-1">{item.description}</Text>
          <Text className="text-lg font-bold text-cyan-700 mt-2">${item.price}</Text>
        </View>
      </View>
    </View>
  );

  const retryFetch = () => {
    setApiError(null);
    fetchRestaurantDetails();
  };

  // Show error screen when API fails
  if (apiError && !restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Ionicons name="warning-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">{apiError}</Text>
        <TouchableOpacity 
          className="mt-6 bg-[#006D77] rounded-full px-6 py-3"
          onPress={retryFetch}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="mt-3 bg-gray-200 rounded-full px-6 py-3"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading restaurant details...</Text>
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#dc2626" />
        <Text className="text-lg font-semibold text-gray-800 mt-4 text-center">Restaurant Not Found</Text>
        <Text className="mt-2 text-gray-600 text-center px-8">
          Unable to load restaurant details. Please try again.
        </Text>
        <TouchableOpacity 
          className="mt-6 bg-[#006D77] rounded-full px-6 py-3"
          onPress={retryFetch}
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="mt-3 bg-gray-200 rounded-full px-6 py-3"
          onPress={() => navigation.goBack()}
        >
          <Text className="text-gray-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-4 py-3 shadow-sm flex-row items-center justify-between">
        <TouchableOpacity 
          className="rounded-full p-2 bg-gray-100"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="#006D77" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-gray-800">Restaurant Details</Text>
        
        <TouchableOpacity 
          className="rounded-full p-2 bg-gray-100"
          onPress={handleShare}
        >
          <Feather name="share-2" size={18} color="#006D77" />
        </TouchableOpacity>
      </View>

      {/* Error Message (for partial errors when restaurant is loaded but API had issues) */}
      {apiError && restaurant && (
        <View className="bg-yellow-50 border border-yellow-200 mx-4 mt-3 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Ionicons name="warning" size={20} color="#d97706" />
              <Text className="text-yellow-700 ml-2 flex-1">{apiError}</Text>
            </View>
            <TouchableOpacity onPress={retryFetch} className="ml-2">
              <MaterialIcons name="refresh" size={20} color="#006D77" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View className="relative h-80">
          <Image
            source={{ uri: restaurant.images?.[currentImageIndex] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop' }}
            className="w-full h-full"
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
          />
          
          {imageLoading && (
            <View className="absolute inset-0 justify-center items-center bg-gray-200">
              <ActivityIndicator size="large" color="#006D77" />
            </View>
          )}
          
          {restaurant.images && restaurant.images.length > 1 && (
            <>
              <TouchableOpacity 
                className="absolute left-4 top-1/2 -translate-y-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                onPress={handlePrevImage}
              >
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="absolute right-4 top-1/2 -translate-y-4 w-10 h-10 rounded-full bg-black/50 items-center justify-center"
                onPress={handleNextImage}
              >
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
              
              <View className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1">
                <Text className="text-white text-sm font-medium">
                  {currentImageIndex + 1}/{restaurant.images.length}
                </Text>
              </View>
            </>
          )}
          
          {/* Open Status Badge */}
          <View className={`absolute top-4 left-4 rounded-full px-3 py-1 ${
            restaurant.isActive ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <Text className="text-white font-semibold text-sm">
              {restaurant.isActive ? 'OPEN NOW' : 'CLOSED'}
            </Text>
          </View>

          {/* Vista Verified Badge */}
          {restaurant.vistaVerified && (
            <View className="absolute top-4 right-4 bg-blue-500 rounded-full px-3 py-1">
              <Text className="text-white font-semibold text-sm">VERIFIED</Text>
            </View>
          )}
        </View>

        {/* Restaurant Info */}
        <View className="bg-white px-4 py-6">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">
              {restaurant.name}
            </Text>
          </View>

          {/* Rating Summary (matching activity details) */}
          <TouchableOpacity 
            className="flex-row items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg"
            onPress={() => setReviewsModalVisible(true)}
          >
            <View className="flex-row items-center">
              <View className="bg-amber-500 rounded-full w-12 h-12 items-center justify-center">
                <Text className="text-white font-bold text-lg">{averageRating.toFixed(1)}</Text>
              </View>
              <View className="ml-3">
                {renderStarRating(averageRating, 20, true)}
                <Text className="text-gray-600 text-sm mt-1">
                  {reviews.length} reviews
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View className="flex-row items-center mb-4">
            <MaterialIcons name="location-on" size={18} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{restaurant.address}</Text>
          </View>

          <Text className="text-gray-700 leading-6">
            {restaurant.description}
          </Text>

          {/* Contact Information */}
          {(restaurant.phone || restaurant.email || restaurant.website) && (
            <View className="mt-4 p-3 bg-gray-50 rounded-lg">
              <Text className="font-semibold text-gray-800 mb-2">Contact Information</Text>
              {restaurant.phone && (
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="phone" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{restaurant.phone}</Text>
                </View>
              )}
              {restaurant.email && (
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="email" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{restaurant.email}</Text>
                </View>
              )}
              {restaurant.website && (
                <View className="flex-row items-center">
                  <MaterialIcons name="link" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{restaurant.website}</Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row space-x-3 gap-4 mt-4">
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-green-600 rounded-full py-3"
              onPress={handleCall}
              disabled={!restaurant.phone}
            >
              <MaterialIcons name="phone" size={18} color="white" />
              <Text className="ml-2 text-white font-semibold">Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-blue-600 rounded-full py-3"
              onPress={handleDirections}
            >
              <MaterialIcons name="directions" size={18} color="white" />
              <Text className="ml-2 text-white font-semibold">Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features - FIXED */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">Restaurant Features</Text>
          <View className="flex-row flex-wrap">
            {features.map((item) => (
              <View key={`feature-${item.id}`} className="flex-row items-center w-1/2 mb-3">
                <MaterialIcons name={item.icon} size={20} color="#006D77" />
                <Text className="ml-2 text-gray-700 text-sm">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Cuisine - FIXED */}
        {cuisineItems.length > 0 && (
          <View className="bg-white px-4 py-6 mt-2">
            <Text className="text-xl font-bold text-gray-800 mb-4">Cuisine & Specialties</Text>
            <View className="flex-row flex-wrap">
              {cuisineItems.map((item) => (
                <View key={`cuisine-${item.id}`} className="bg-cyan-50 rounded-full px-4 py-2 mr-2 mb-2">
                  <Text className="text-cyan-700 font-medium">{item.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Menu Preview - FIXED */}
        <View className="bg-white px-4 py-6 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Menu Highlights</Text>
            <TouchableOpacity onPress={() => setMenuModalVisible(true)}>
              <Text className="text-cyan-700 font-medium">View Full Menu</Text>
            </TouchableOpacity>
          </View>
          
          {menuCategories['Main Course'].slice(0, 2).map((item) => (
            <MenuItem key={`menu-preview-${item.id}`} item={item} />
          ))}
        </View>

        {/* Operating Hours - FIXED */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">Operating Hours</Text>
          <View className="space-y-2">
            <View key="weekdays" className="flex-row justify-between">
              <Text className="text-gray-700">Monday - Friday</Text>
              <Text className="text-gray-600">11:00 AM - 10:00 PM</Text>
            </View>
            <View key="weekends" className="flex-row justify-between">
              <Text className="text-gray-700">Saturday - Sunday</Text>
              <Text className="text-gray-600">10:00 AM - 11:00 PM</Text>
            </View>
          </View>
        </View>

        {/* Customer Reviews (matching activity details design) - FIXED */}
        <View className="bg-white px-4 py-6 mt-2 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Customer Reviews</Text>
            <TouchableOpacity onPress={() => setReviewsModalVisible(true)}>
              <Text className="text-cyan-700 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.slice(0, 2).map((review) => (
            <ReviewItem key={`food-review-${review.id}`} review={review} />
          ))}
          
          <TouchableOpacity 
            className="flex-row items-center justify-center py-3 border border-gray-300 rounded-lg"
            onPress={() => setAddReviewModalVisible(true)}
          >
            <Ionicons name="pencil" size={18} color="#006D77" />
            <Text className="ml-2 text-cyan-700 font-medium">Write a Review</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Rest of the modals remain the same... */}
      {/* Date Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-4/5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Select Date</Text>
              <TouchableOpacity onPress={() => setDateModalVisible(false)}>
                <Ionicons name="close" size={24} color="#006D77" />
              </TouchableOpacity>
            </View>
            
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setDateModalVisible(false);
              }}
              minDate={new Date().toISOString().split('T')[0]}
              markedDates={{
                [selectedDate]: { 
                  selected: true, 
                  selectedColor: "#006D77",
                  selectedTextColor: "#ffffff"
                }
              }}
              theme={{
                selectedDayBackgroundColor: "#006D77",
                todayTextColor: "#006D77",
                arrowColor: "#006D77",
                monthTextColor: "#006D77",
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Reservation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reservationModalVisible}
        onRequestClose={() => setReservationModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Reservation</Text>
            
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <Text className="font-semibold text-gray-800 text-lg mb-2">{restaurant.name}</Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Date:</Text>
                <Text className="text-gray-800 font-medium">{formatDisplayDate(selectedDate)}</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Guests:</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={() => setGuests(Math.max(1, guests - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
                  >
                    <Entypo name="minus" size={16} color="#374151" />
                  </TouchableOpacity>
                  <Text className="mx-4 text-gray-800 font-semibold text-lg">{guests}</Text>
                  <TouchableOpacity 
                    onPress={() => setGuests(guests + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
                  >
                    <Entypo name="plus" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Time:</Text>
                <Text className="text-gray-800 font-medium">7:30 PM</Text>
              </View>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="flex-1 rounded-xl bg-gray-100 py-4"
                onPress={() => setReservationModalVisible(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 rounded-xl bg-[#006D77] py-4"
                onPress={confirmReservation}
              >
                <Text className="text-center text-white font-semibold">Confirm Reservation</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Full Menu Modal - FIXED */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuModalVisible}
        onRequestClose={() => setMenuModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="p-5 border-b border-gray-200">
              <View className="items-center mb-4">
                <View className="w-10 h-1 bg-gray-300 rounded-full" />
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">Menu</Text>
                <TouchableOpacity onPress={() => setMenuModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#006D77" />
                </TouchableOpacity>
              </View>

              {/* Menu Categories - FIXED */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {Object.keys(menuCategories).map((category) => (
                  <TouchableOpacity
                    key={`menu-category-${category}`}
                    onPress={() => setActiveMenuCategory(category)}
                    className={`mr-3 px-4 py-2 rounded-full ${
                      activeMenuCategory === category ? 'bg-cyan-700' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={activeMenuCategory === category ? 'text-white font-medium' : 'text-gray-700'}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <FlatList
              data={menuCategories[activeMenuCategory]}
              keyExtractor={(item) => `menu-item-${item.id}`}
              renderItem={({ item }) => <MenuItem item={item} />}
              contentContainerClassName="p-5"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Reviews Modal (matching activity details) - FIXED */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reviewsModalVisible}
        onRequestClose={() => setReviewsModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="p-5 border-b border-gray-200">
              <View className="items-center mb-4">
                <View className="w-10 h-1 bg-gray-300 rounded-full" />
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">Reviews & Ratings</Text>
                <TouchableOpacity onPress={() => setReviewsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#006D77" />
                </TouchableOpacity>
              </View>

              {/* Rating Summary - FIXED */}
              <View className="flex-row items-center justify-between mb-6">
                <View className="items-center">
                  <Text className="text-4xl font-bold text-gray-800">{averageRating.toFixed(1)}</Text>
                  {renderStarRating(averageRating, 20)}
                  <Text className="text-gray-600 mt-1">{reviews.length} reviews</Text>
                </View>
                
                <View className="flex-1 ml-6">
                  {[5, 4, 3, 2, 1].map((star, index) => (
                    renderRatingBar(star, ratingDistribution[star-1], reviews.length, index)
                  ))}
                </View>
              </View>
            </View>

            <FlatList
              data={reviews}
              keyExtractor={(item) => `food-review-modal-${item.id}`}
              renderItem={({ item }) => <ReviewItem key={`food-review-item-${item.id}`} review={item} />}
              contentContainerClassName="p-5"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Add Review Modal (matching activity details) - FIXED */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addReviewModalVisible}
        onRequestClose={() => setAddReviewModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5 max-h-4/5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Write a Review</Text>
              <TouchableOpacity onPress={() => setAddReviewModalVisible(false)}>
                <Ionicons name="close" size={24} color="#006D77" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Rating Selection - FIXED */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Your Rating <Text className="text-red-500">*</Text></Text>
                <View className="flex-row justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={`food-review-star-${star}`}
                      onPress={() => setNewReview({...newReview, rating: star})}
                      className="p-2"
                    >
                      <Ionicons 
                        name={star <= newReview.rating ? "star" : "star-outline"} 
                        size={32} 
                        color={star <= newReview.rating ? "#f59e0b" : "#d1d5db"} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Review Title */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Review Title (Optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="Summarize your experience"
                  value={newReview.title}
                  onChangeText={(text) => setNewReview({...newReview, title: text})}
                />
              </View>

              {/* Review Comment */}
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Your Review <Text className="text-red-500">*</Text></Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 h-32 text-align-top"
                  placeholder="Share details of your experience..."
                  multiline
                  value={newReview.comment}
                  onChangeText={(text) => setNewReview({...newReview, comment: text})}
                />
              </View>

              {/* Name */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-gray-700 mb-2">Your Name (Optional)</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  placeholder="How should we display your name?"
                  value={newReview.name}
                  onChangeText={(text) => setNewReview({...newReview, name: text})}
                />
              </View>
            </ScrollView>

            <View className="flex-row gap-3">
              <TouchableOpacity 
                className="flex-1 rounded-full bg-gray-100 py-4"
                onPress={() => setAddReviewModalVisible(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 rounded-full bg-[#006D77] py-4"
                onPress={handleAddReview}
              >
                <Text className="text-center text-white font-semibold">Submit Review</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}