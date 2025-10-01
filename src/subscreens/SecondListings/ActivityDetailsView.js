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
  TextInput,
  Alert,
  Share
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

// API_BASE_URL should be defined in your .env file
const API_BASE_URL = process.env.API_BASE_URL;

const { width: screenWidth } = Dimensions.get('window');

export default function ActivityDetailsView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { activity } = route.params;

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [participants, setParticipants] = useState(1);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [addReviewModalVisible, setAddReviewModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: '',
    title: ''
  });
  const [activityDetails, setActivityDetails] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch activity details from API
  useEffect(() => {
    if (activity && activity.id) {
      fetchActivityDetails();
    } else {
      setLoading(false);
      setApiError("No activity ID provided");
    }
  }, [activity]);

  const fetchActivityDetails = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // API call to get specific activity details
      const response = await axios.get(`${API_BASE_URL}/api/v1/activities/${activity.id}`);
      
      if (response.data.success) {
        setActivityDetails(response.data.data);
      } else {
        setApiError("Failed to fetch activity details");
      }
    } catch (err) {
      console.error("API Error:", err);
      setApiError("Failed to load activity details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Use API data if available, otherwise fallback to passed activity data
  const currentActivity = activityDetails || activity;

  // Use activity.images if available, otherwise fallback to single image
  const activityImages = currentActivity.images && currentActivity.images.length > 0 
    ? currentActivity.images.map(img => img.imageUrl)
    : [currentActivity.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'];

  // Enhanced reviews data with more details
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      title: 'Amazing Experience!',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely amazing experience! The guide was knowledgeable and made the whole trip unforgettable. The views were breathtaking and the organization was perfect.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: 'Mike Chen',
      title: 'Well Organized Tour',
      rating: 4,
      date: '2024-01-10',
      comment: 'Great activity, well organized. Would recommend to anyone visiting the area. The guide was friendly and professional.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: 'Emma Davis',
      title: 'Best Part of Our Trip',
      rating: 5,
      date: '2024-01-05',
      comment: 'Best part of our trip! The views were breathtaking and the guide was fantastic. We will definitely do this again.',
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
      comment: 'This activity exceeded all expectations. The equipment was top-notch and the safety measures were excellent.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      helpful: 6,
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      title: 'Memorable Adventure',
      rating: 4,
      date: '2023-12-28',
      comment: 'A truly memorable adventure. The photos turned out great and the memories will last a lifetime.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      helpful: 3,
      verified: true
    }
  ]);

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const ratingDistribution = [0, 0, 0, 0, 0]; // For 1-5 stars
  reviews.forEach(review => {
    ratingDistribution[review.rating - 1]++;
  });

  // Activity highlights/features - using API data
  const highlights = [
    { id: 1, icon: 'access-time', text: `${currentActivity.duration || '4 hours'} duration` },
    { id: 2, icon: 'terrain', text: currentActivity.difficulty || 'Moderate' },
    { id: 3, icon: 'group', text: 'Small group experience' },
    { id: 4, icon: 'language', text: 'English speaking guide' },
    { id: 5, icon: 'photo-camera', text: 'Photo opportunities' },
    { id: 6, icon: 'local-drink', text: 'Refreshments included' },
  ];

  // What's included
  const inclusions = [
    { id: 1, text: 'Professional guide' },
    { id: 2, text: 'All equipment provided' },
    { id: 3, text: 'Safety briefing' },
    { id: 4, text: 'Bottled water' },
    { id: 5, text: 'Snacks' },
    { id: 6, text: 'Photos of your experience' }
  ];

  // What to bring
  const whatToBring = [
    { id: 1, text: 'Comfortable shoes' },
    { id: 2, text: 'Sun protection' },
    { id: 3, text: 'Camera' },
    { id: 4, text: 'Water bottle' },
    { id: 5, text: 'Extra clothing' }
  ];

  // Working Share Function
  const handleShare = async () => {
    try {
      const shareOptions = {
        message: `Check out this amazing activity: ${currentActivity.title}\n\n📍 Location: ${currentActivity.city || currentActivity.district || currentActivity.location || 'Sri Lanka'}\n💰 Price: $${currentActivity.price || parseInt(currentActivity.pricerange) || 50} per person\n⭐ Rating: ${averageRating.toFixed(1)}/5 (${reviews.length} reviews)\n\n${currentActivity.description || 'An incredible experience waiting for you!'}\n\nDownload VistaGo app to book this activity!`,
        title: currentActivity.title,
        url: activityImages[0] // Some platforms might use this as a preview
      };

      const result = await Share.share(shareOptions);
      
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of the platform (Instagram, WhatsApp, etc.)
          console.log('Shared with', result.activityType);
        } else {
          // Shared
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Share Error:', error);
      Alert.alert('Sharing Not Available', 'Sorry, sharing is not available on your device at the moment.');
    }
  };

  const handleBookNow = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your activity');
      return;
    }
    setBookingModalVisible(true);
  };

  const confirmBooking = () => {
    setBookingModalVisible(false);
    Alert.alert(
      'Booking Confirmed!',
      `Your ${currentActivity.title} for ${participants} participant(s) on ${formatDisplayDate(selectedDate)} has been confirmed.`,
      [
        {
          text: 'View Bookings',
          onPress: () => navigation.navigate('Bookings')
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
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % activityImages.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + activityImages.length) % activityImages.length
    );
  };

  const renderStarRating = (rating, size = 16, showNumber = false) => {
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={`star-${star}-${rating}`}
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

  const renderRatingBar = (starCount, count, total, index) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View key={`rating-bar-${starCount}-${index}`} className="flex-row items-center mb-1">
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

  const retryFetch = () => {
    fetchActivityDetails();
  };

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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading activity details...</Text>
      </SafeAreaView>
    );
  }

  if (apiError) {
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
        
        <Text className="text-lg font-semibold text-gray-800">Activity Details</Text>
        
        <TouchableOpacity 
          className="rounded-full p-2 bg-gray-100"
          onPress={handleShare}
        >
          <Feather name="share-2" size={18} color="#006D77" />
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {apiError && (
        <View className="bg-red-50 border border-red-200 mx-4 mt-3 p-3 rounded-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-red-700 flex-1">{apiError}</Text>
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
            source={{ uri: activityImages[currentImageIndex] }}
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
          
          {activityImages.length > 1 && (
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
                  {currentImageIndex + 1}/{activityImages.length}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Activity Info */}
        <View className="bg-white px-4 py-6">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">
              {currentActivity.title}
            </Text>
            <View className="bg-cyan-50 rounded-full px-3 py-2 min-w-[80px]">
              <Text className="text-cyan-700 font-semibold text-center">
                ${currentActivity.price || parseInt(currentActivity.pricerange) || 50}
              </Text>
              <Text className="text-cyan-600 text-xs text-center">per person</Text>
            </View>
          </View>

          {/* Rating Summary */}
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
                  {reviews.length} reviews {currentActivity.reviews }
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          <View className="flex-row items-center mb-4">
            <MaterialIcons name="location-on" size={18} color="#6b7280" />
            <Text className="ml-1 text-gray-600">
              {currentActivity.city || currentActivity.district || currentActivity.location || 'Unknown Location'}
            </Text>
            <View className="mx-3 h-4 w-px bg-gray-300" />
            <MaterialIcons name="access-time" size={18} color="#6b7280" />
            <Text className="ml-1 text-gray-600">{currentActivity.duration || '4 hours'}</Text>
          </View>

          <Text className="text-gray-700 leading-6">
            {currentActivity.description || `Experience the best of ${currentActivity.city || currentActivity.location} with this incredible ${currentActivity.difficulty?.toLowerCase() || 'moderate'} activity. Perfect for adventure seekers and nature lovers alike.`}
          </Text>

          {/* Activity Type */}
          {currentActivity.type && (
            <View className="mt-3 flex-row items-center">
              <MaterialIcons name="category" size={18} color="#6b7280" />
              <Text className="ml-1 text-gray-600">{currentActivity.type}</Text>
            </View>
          )}

          {/* Contact Info */}
          {(currentActivity.phone || currentActivity.email) && (
            <View className="mt-3 p-3 bg-gray-50 rounded-lg">
              <Text className="font-semibold text-gray-800 mb-2">Contact Information</Text>
              {currentActivity.phone && (
                <View className="flex-row items-center mb-1">
                  <MaterialIcons name="phone" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{currentActivity.phone}</Text>
                </View>
              )}
              {currentActivity.email && (
                <View className="flex-row items-center">
                  <MaterialIcons name="email" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">{currentActivity.email}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Highlights */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">Activity Highlights</Text>
          <View className="flex-row flex-wrap">
            {highlights.map((item) => (
              <View key={`highlight-${item.id}`} className="flex-row items-center w-1/2 mb-3">
                <MaterialIcons name={item.icon} size={20} color="#006D77" />
                <Text className="ml-2 text-gray-700 text-sm">{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* What's Included */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">What's Included</Text>
          {inclusions.map((item) => (
            <View key={`inclusion-${item.id}`} className="flex-row items-center mb-3">
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text className="ml-3 text-gray-700">{item.text}</Text>
            </View>
          ))}
        </View>

        {/* What to Bring */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">What to Bring</Text>
          {whatToBring.map((item) => (
            <View key={`bring-${item.id}`} className="flex-row items-center mb-3">
              <MaterialIcons name="check" size={20} color="#006D77" />
              <Text className="ml-3 text-gray-700">{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Preview Reviews */}
        <View className="bg-white px-4 py-6 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Customer Reviews</Text>
            <TouchableOpacity onPress={() => setReviewsModalVisible(true)}>
              <Text className="text-cyan-700 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.slice(0, 2).map((review) => (
            <ReviewItem key={`review-${review.id}`} review={review} />
          ))}
          
          <TouchableOpacity 
            className="flex-row items-center justify-center py-3 border border-gray-300 rounded-lg"
            onPress={() => setAddReviewModalVisible(true)}
          >
            <Ionicons name="pencil" size={18} color="#006D77" />
            <Text className="ml-2 text-cyan-700 font-medium">Write a Review</Text>
          </TouchableOpacity>
        </View>

        {/* Safety Information */}
        <View className="bg-white px-4 py-6 mt-2 mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">Safety Information</Text>
          <View className="bg-amber-50 rounded-lg p-4">
            <View className="flex-row items-start mb-2">
              <Ionicons name="warning" size={20} color="#f59e0b" />
              <Text className="ml-2 font-semibold text-amber-800">Important Notes</Text>
            </View>
            <Text className="text-amber-700 text-sm">
              • Minimum age requirement: 12 years{'\n'}
              • Not recommended for pregnant travelers{'\n'}
              • Not wheelchair accessible{'\n'}
              • Travelers should have moderate physical fitness level{'\n'}
              • Weather-dependent activity - may be rescheduled{'\n'}
              • Full refund available if canceled 24 hours in advance
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Booking Bar */}
      {/* <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600 text-sm">From</Text>
            <Text className="text-2xl font-bold text-[#006D77]">
              ${currentActivity.price || parseInt(currentActivity.pricerange) || 50}
            </Text>
          </View>
          
          <View className="flex-row space-x-3">
            <TouchableOpacity 
              className="px-6 py-3 border border-[#006D77] rounded-full"
              onPress={() => setDateModalVisible(true)}
            >
              <Text className="text-[#006D77] font-semibold">
                {selectedDate ? formatDisplayDate(selectedDate).split(',')[0] : 'Select Date'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-[#006D77] rounded-full px-6 py-3"
              onPress={handleBookNow}
            >
              <Text className="text-white font-semibold">Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

      {/* Reviews Modal */}
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

              {/* Rating Summary */}
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
              keyExtractor={(item) => `review-modal-${item.id}`}
              renderItem={({ item }) => <ReviewItem key={`review-item-${item.id}`} review={item} />}
              contentContainerClassName="p-5"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Add Review Modal */}
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
              {/* Rating Selection */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Your Rating <Text className="text-red-500">*</Text></Text>
                <View className="flex-row justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={`review-star-${star}`}
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

      {/* Booking Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bookingModalVisible}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-5">
            <View className="items-center mb-4">
              <View className="w-10 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Text className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Booking</Text>
            
            <View className="bg-gray-50 rounded-xl p-4 mb-4">
              <Text className="font-semibold text-gray-800 text-lg mb-2">{currentActivity.title}</Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Date:</Text>
                <Text className="text-gray-800 font-medium">{formatDisplayDate(selectedDate)}</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Participants:</Text>
                <View className="flex-row items-center">
                  <TouchableOpacity 
                    onPress={() => setParticipants(Math.max(1, participants - 1))}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
                  >
                    <Entypo name="minus" size={16} color="#374151" />
                  </TouchableOpacity>
                  <Text className="mx-4 text-gray-800 font-semibold text-lg">{participants}</Text>
                  <TouchableOpacity 
                    onPress={() => setParticipants(participants + 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center"
                  >
                    <Entypo name="plus" size={16} color="#374151" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Price per person:</Text>
                <Text className="text-gray-800 font-medium">
                  ${currentActivity.price || parseInt(currentActivity.pricerange) || 50}
                </Text>
              </View>
              
              <View className="border-t border-gray-200 mt-3 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="font-semibold text-gray-800 text-lg">Total:</Text>
                  <Text className="font-bold text-xl text-[#006D77]">
                    ${((currentActivity.price || parseInt(currentActivity.pricerange) || 50) * participants).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
            
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                className="flex-1 rounded-xl bg-gray-100 py-4"
                onPress={() => setBookingModalVisible(false)}
              >
                <Text className="text-center text-gray-700 font-semibold">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 rounded-xl bg-[#006D77] py-4"
                onPress={confirmBooking}
              >
                <Text className="text-center text-white font-semibold">Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}