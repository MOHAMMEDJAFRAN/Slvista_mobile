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

// API_BASE_URL should be defined in your .env file
const API_BASE_URL = process.env.API_BASE_URL;

const { width: screenWidth } = Dimensions.get('window');

// Safe format function
const formatTransportType = (typeName) => {
  if (!typeName || typeof typeName !== 'string') {
    return 'Transport Service';
  }
  
  switch(typeName.toLowerCase()) {
    case 'car':
      return 'Car';
    case 'threewheelars':
      return 'Three Wheelers';
    case 'bike':
      return 'Bike';
    case 'scooter':
      return 'Scooter';
    case 'tuktuk':
      return 'Tuk-tuk';
    default:
      return typeName.charAt(0).toUpperCase() + typeName.slice(1);
  }
};

export default function TransportDetailsView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { transport } = route.params;

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [reviewsModalVisible, setReviewsModalVisible] = useState(false);
  const [addReviewModalVisible, setAddReviewModalVisible] = useState(false);
  const [featuresModalVisible, setFeaturesModalVisible] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    name: '',
    title: ''
  });
  const [transportDetails, setTransportDetails] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Fetch transport details from API
  useEffect(() => {
    if (transport && transport.id) {
      fetchTransportDetails();
    } else {
      setLoading(false);
      setApiError("No transport ID provided");
      // Set a basic transport object to prevent crashes
      setTransportDetails({
        name: 'Transport Service',
        transportTypes: ['Transport Service'],
        type: 'Transport Service',
        images: ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'],
        location: 'Location not specified',
        description: 'Professional transport service',
        available: true,
        price: 50
      });
    }
  }, [transport]);

  const fetchTransportDetails = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // API call to get specific transport details
      const response = await axios.get(`${API_BASE_URL}/api/v1/transport-agencies/${transport.id}`);
      
      if (response.data.success) {
        setTransportDetails(response.data.data);
      } else {
        setApiError("Failed to fetch transport details");
        // Set fallback data
        setTransportDetails(transport);
      }
    } catch (err) {
      console.error("API Error:", err);
      setApiError("Failed to load transport details. Please try again.");
      // Set fallback data
      setTransportDetails(transport);
    } finally {
      setLoading(false);
    }
  };

  // Get transport types from API data with safety checks
  const getTransportTypes = () => {
    if (!transportDetails) {
      return transport?.transportTypes || [transport?.type || 'Transport Service'];
    }
    
    if (transportDetails.transportTypes && Array.isArray(transportDetails.transportTypes)) {
      return transportDetails.transportTypes
        .map(type => {
          // Handle both string types and object types with name property
          const typeName = typeof type === 'string' ? type : (type?.name || 'Transport Service');
          return formatTransportType(typeName);
        })
        .filter(Boolean); // Remove any null/undefined values
    }
    
    // Fallback to the type property or default
    const fallbackType = transportDetails.type || 'Transport Service';
    return Array.isArray(fallbackType) ? fallbackType : [fallbackType];
  };

  // Use API data if available, otherwise fallback to passed transport data
  const currentTransport = transportDetails || transport;

  // Enhanced transport data with API details and safety checks
  const enhancedTransport = {
    ...currentTransport,
    // Use API images or fallback
    images: (currentTransport.images && currentTransport.images.length > 0) 
      ? currentTransport.images.map(img => typeof img === 'string' ? img : (img?.imageUrl || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'))
      : [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1564419320408-38e24e038739?w=400&h=300&fit=crop'
        ],
    // Transport types from API with safety
    transportTypes: getTransportTypes(),
    type: getTransportTypes().join(', '),
    // Company info from API with safety
    company: currentTransport.title || currentTransport.name || 'Transport Service',
    phone: currentTransport.phone || '+94 7678456',
    email: currentTransport.email || 'info@transport.com',
    website: currentTransport.website || '',
    address: currentTransport.address || 'Address not available',
    city: currentTransport.city || 'City not available',
    district: currentTransport.district || 'District not available',
    province: currentTransport.province || 'Province not available',
    serviceArea: currentTransport.serviceArea || 'Service area not specified',
    // Enhanced details with fallbacks
    operatingHours: '24/7',
    price: currentTransport.price || Math.floor(Math.random() * 100) + 20,
    cancellationPolicy: 'Free cancellation up to 24 hours before booking',
    insurance: 'Full insurance coverage included',
    driverDetails: 'Professional licensed drivers',
    vehicleSpecs: {
      seats: 5,
      luggage: 3,
      transmission: 'Automatic',
      fuel: 'Petrol',
      year: 2023
    },
    description: currentTransport.description || `Professional ${getTransportTypes().join(', ').toLowerCase()} service in ${currentTransport.city || 'the area'}. ${currentTransport.serviceArea ? `Service area: ${currentTransport.serviceArea}.` : ''}`,
    available: currentTransport.isActive !== false,
    vistaVerified: currentTransport.vistaVerified || false,
    distance: currentTransport.distance || `${(Math.random() * 10).toFixed(1)} km`,
    name: currentTransport.name || currentTransport.title || 'Transport Service',
    location: currentTransport.location || currentTransport.city || 'Location not specified'
  };

  // Enhanced reviews data matching food details page
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'John Smith',
      title: 'Excellent Service!',
      rating: 5,
      date: '2024-01-15',
      comment: 'The car was in perfect condition and the service was exceptional. Very professional and on time. Will definitely use again!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      name: 'Maria Garcia',
      title: 'Great Experience',
      rating: 4,
      date: '2024-01-10',
      comment: 'Very reliable service. The vehicle was clean and comfortable. Driver was friendly and knowledgeable about the area.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      helpful: 8,
      verified: true
    },
    {
      id: 3,
      name: 'David Wilson',
      title: 'Highly Recommended',
      rating: 5,
      date: '2024-01-05',
      comment: 'Best transport service I have used. The booking process was smooth and the vehicle exceeded expectations.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      helpful: 15,
      verified: false
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      title: 'Great Value for Money',
      rating: 4,
      date: '2024-01-02',
      comment: 'Affordable prices with great service. The car was fuel efficient and perfect for our family trip.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      helpful: 6,
      verified: true
    },
    {
      id: 5,
      name: 'Mike Chen',
      title: 'Smooth Booking Process',
      rating: 5,
      date: '2023-12-28',
      comment: 'Very easy to book online. The pickup was punctual and the vehicle was exactly as described. Great experience!',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      helpful: 3,
      verified: true
    }
  ]);

  // Calculate average rating and distribution
  const averageRating = reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  // Transport features with IDs
  const features = [
    { id: 1, icon: 'access-time', text: enhancedTransport.operatingHours },
    { id: 2, icon: 'attach-money', text: `From $${enhancedTransport.price}/day` },
    { id: 3, icon: 'location-on', text: enhancedTransport.distance },
    { id: 4, icon: 'star', text: `${averageRating.toFixed(1)} rating` },
    { id: 5, icon: 'group', text: `${reviews.length}+ reviews` },
    { id: 6, icon: 'security', text: enhancedTransport.insurance },
    { id: 7, icon: 'person', text: enhancedTransport.driverDetails },
    { id: 8, icon: 'local-offer', text: enhancedTransport.cancellationPolicy },
    { id: 9, icon: 'verified', text: enhancedTransport.vistaVerified ? 'Vista Verified' : 'Not Verified' },
    { id: 10, icon: 'map', text: enhancedTransport.serviceArea },
  ];

  // Vehicle specifications with IDs
  const vehicleSpecs = [
    { id: 1, icon: 'event-seat', text: `${enhancedTransport.vehicleSpecs.seats} seats`, label: 'Capacity' },
    { id: 2, icon: 'business-center', text: `${enhancedTransport.vehicleSpecs.luggage} bags`, label: 'Luggage' },
    { id: 3, icon: 'settings', text: enhancedTransport.vehicleSpecs.transmission, label: 'Transmission' },
    { id: 4, icon: 'local-gas-station', text: enhancedTransport.vehicleSpecs.fuel, label: 'Fuel' },
    { id: 5, icon: 'calendar-today', text: enhancedTransport.vehicleSpecs.year, label: 'Year' },
  ];

  // Company info items with IDs
  const companyInfoItems = [
    { id: 1, icon: 'business', text: enhancedTransport.company },
    { id: 2, icon: 'phone', text: enhancedTransport.phone },
    { id: 3, icon: 'email', text: enhancedTransport.email },
    { id: 4, icon: 'access-time', text: enhancedTransport.operatingHours },
    { id: 5, icon: 'location-on', text: enhancedTransport.address },
    { id: 6, icon: 'map', text: `${enhancedTransport.city}, ${enhancedTransport.district}` },
  ];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${enhancedTransport.type} service: ${enhancedTransport.name} - ${enhancedTransport.location}. Rating: ${averageRating.toFixed(1)} stars.`,
        title: enhancedTransport.name
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share transport service');
    }
  };

  const handleCall = () => {
    Linking.openURL(`tel:${enhancedTransport.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${enhancedTransport.email}`);
  };

  const handleWebsite = () => {
    if (enhancedTransport.website) {
      Linking.openURL(enhancedTransport.website);
    } else {
      Alert.alert('No Website', 'Website not available for this transport service');
    }
  };

  const handleDirections = () => {
    Alert.alert('Directions', `Opening maps for ${enhancedTransport.address}`);
  };

  const handleBooking = () => {
    if (!selectedDate) {
      Alert.alert('Select Date', 'Please select a date for your booking');
      return;
    }
    setBookingModalVisible(true);
  };

  const confirmBooking = () => {
    setBookingModalVisible(false);
    Alert.alert(
      'Booking Confirmed!',
      `Your ${enhancedTransport.type} from ${enhancedTransport.name} on ${formatDisplayDate(selectedDate)} has been confirmed.`,
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
      (prevIndex + 1) % enhancedTransport.images.length
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex - 1 + enhancedTransport.images.length) % enhancedTransport.images.length
    );
  };

  const retryFetch = () => {
    fetchTransportDetails();
  };

  // Star rating component
  const renderStarRating = (rating, size = 16, showNumber = false) => {
    const safeRating = rating || 0;
    return (
      <View className="flex-row items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={`transport-star-${star}-${safeRating}`}
            name={star <= safeRating ? "star" : "star-outline"}
            size={size}
            color={star <= safeRating ? "#f59e0b" : "#d1d5db"}
          />
        ))}
        {showNumber && (
          <Text className="ml-2 text-gray-600 font-medium">{safeRating.toFixed(1)}</Text>
        )}
      </View>
    );
  };

  // Rating bar for distribution
  const renderRatingBar = (starCount, count, total, index) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <View key={`transport-rating-bar-${starCount}-${index}`} className="flex-row items-center mb-1">
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

  // Add review function
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

  // Review item component
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

  // Feature item component
  const FeatureItem = ({ feature }) => (
    <View className="flex-row items-center mb-3">
      <MaterialIcons name={feature.icon} size={20} color="#006D77" />
      <Text className="ml-3 text-gray-700 flex-1">{feature.text}</Text>
    </View>
  );

  // Specification item component
  const SpecItem = ({ spec }) => (
    <View className="bg-cyan-50 rounded-xl p-4 items-center justify-center mx-2 min-w-[80px]">
      <MaterialIcons name={spec.icon} size={24} color="#006D77" />
      <Text className="text-cyan-700 font-bold text-lg mt-2">{spec.text}</Text>
      <Text className="text-cyan-600 text-xs mt-1">{spec.label}</Text>
    </View>
  );

  // Company info item component
  const CompanyInfoItem = ({ item }) => (
    <View className="flex-row items-center mb-3">
      <MaterialIcons name={item.icon} size={20} color="#006D77" />
      <Text className="ml-3 text-gray-700">{item.text}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading transport details...</Text>
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
        
        <Text className="text-lg font-semibold text-gray-800">Transport Details</Text>
        
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
            source={{ uri: enhancedTransport.images[currentImageIndex] }}
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
          
          {enhancedTransport.images.length > 1 && (
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
                  {currentImageIndex + 1}/{enhancedTransport.images.length}
                </Text>
              </View>
            </>
          )}
          
          {/* Availability Status Badge */}
          <View className={`absolute top-4 left-4 rounded-full px-3 py-1 ${
            enhancedTransport.available ? 'bg-green-500' : 'bg-red-500'
          }`}>
            <Text className="text-white font-semibold text-sm">
              {enhancedTransport.available ? 'AVAILABLE' : 'UNAVAILABLE'}
            </Text>
          </View>

          {/* Vista Verified Badge */}
          {enhancedTransport.vistaVerified && (
            <View className="absolute top-4 right-4 bg-green-500 rounded-full px-3 py-1">
              <Text className="text-white font-semibold text-sm">VERIFIED</Text>
            </View>
          )}
        </View>

        {/* Transport Info */}
        <View className="bg-white px-4 py-6">
          <View className="flex-row justify-between items-start mb-3">
            <Text className="text-2xl font-bold text-gray-800 flex-1 mr-4">
              {enhancedTransport.name}
            </Text>
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
                  {reviews.length} reviews
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>

          {/* Transport Type Tags */}
          <View className="flex-row flex-wrap mb-4">
            {enhancedTransport.transportTypes.slice(0, 3).map((type, index) => (
              <View key={index} className="bg-cyan-50 rounded-full px-3 py-1 mr-2 mb-2">
                <Text className="text-cyan-700 text-sm font-medium">{type}</Text>
              </View>
            ))}
            {enhancedTransport.transportTypes.length > 3 && (
              <Text className="text-gray-500 text-sm">+{enhancedTransport.transportTypes.length - 3} more</Text>
            )}
          </View>

          <View className="flex-row items-center mb-4">
            <MaterialIcons name="location-on" size={18} color="#6b7280" />
            <Text className="ml-1 text-gray-600">
              {enhancedTransport.location}
            </Text>
          </View>

          <Text className="text-gray-700 leading-6">
            {enhancedTransport.description}
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-4 mt-4">
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-gray-100 drop-shadow-xl rounded-full py-3"
              onPress={handleCall}
            >
              <MaterialIcons name="phone" size={20} color="#006D77" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-gray-100 drop-shadow-xl rounded-full py-3"
              onPress={handleDirections}
            >
              <MaterialIcons name="directions" size={20} color="#006D77" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-gray-100 drop-shadow-xl rounded-full py-3"
              onPress={handleEmail}
            >
              <MaterialIcons name="email" size={20} color="#006D77"/>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 flex-row items-center justify-center bg-gray-100 drop-shadow-xl rounded-full py-3"
              onPress={handleWebsite}
            >
              <MaterialIcons name="public" size={20} color="#006D77" />
            </TouchableOpacity>
          </View>   
          </View>

        {/* Vehicle Specifications */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">Vehicle Specifications</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {vehicleSpecs.map((spec) => (
              <SpecItem key={`spec-${spec.id}`} spec={spec} />
            ))}
          </ScrollView>
        </View>

        {/* Features */}
        <View className="bg-white px-4 py-6 mt-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Service Features</Text>
            <TouchableOpacity onPress={() => setFeaturesModalVisible(true)}>
              <Text className="text-cyan-700 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          {features.slice(0, 4).map((feature) => (
            <FeatureItem key={`feature-${feature.id}`} feature={feature} />
          ))}
        </View>

        {/* Company Info */}
        <View className="bg-white px-4 py-6 mt-2">
          <Text className="text-xl font-bold text-gray-800 mb-4">Company Information</Text>
          <View className="space-y-3">
            {companyInfoItems.map((item) => (
              <CompanyInfoItem key={`company-info-${item.id}`} item={item} />
            ))}
          </View>
        </View>

        {/* Customer Reviews */}
        <View className="bg-white px-4 py-6 mt-2 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Customer Reviews</Text>
            <TouchableOpacity onPress={() => setReviewsModalVisible(true)}>
              <Text className="text-cyan-700 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.slice(0, 2).map((review) => (
            <ReviewItem key={`transport-review-${review.id}`} review={review} />
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

      {/* Bottom Booking Bar */}
      {/* <View className="bg-white border-t border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gray-600 text-sm">From</Text>
            <Text className="text-2xl font-bold text-[#006D77]">
              ${enhancedTransport.price}
            </Text>
            <Text className="text-gray-500 text-xs">per day</Text>
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
              onPress={handleBooking}
              disabled={!enhancedTransport.available}
            >
              <Text className="text-white font-semibold">
                {enhancedTransport.available ? 'Book Now' : 'Unavailable'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

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
              <Text className="text-xl font-bold text-gray-800">Select Booking Date</Text>
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
              <Text className="font-semibold text-gray-800 text-lg mb-2">{enhancedTransport.name}</Text>
              <Text className="text-cyan-700 font-medium mb-3">{enhancedTransport.type}</Text>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Date:</Text>
                <Text className="text-gray-800 font-medium">{formatDisplayDate(selectedDate)}</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Duration:</Text>
                <Text className="text-gray-800 font-medium">1 Day</Text>
              </View>
              
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-gray-600">Price:</Text>
                <Text className="text-gray-800 font-medium">${enhancedTransport.price}</Text>
              </View>
              
              <View className="border-t border-gray-200 pt-3 mt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600 font-medium">Total:</Text>
                  <Text className="text-gray-800 font-bold text-lg">${enhancedTransport.price}</Text>
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

      {/* Full Features Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={featuresModalVisible}
        onRequestClose={() => setFeaturesModalVisible(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="p-5 border-b border-gray-200">
              <View className="items-center mb-4">
                <View className="w-10 h-1 bg-gray-300 rounded-full" />
              </View>
              
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">All Features</Text>
                <TouchableOpacity onPress={() => setFeaturesModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#006D77" />
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={features}
              keyExtractor={(item) => `feature-modal-${item.id}`}
              renderItem={({ item }) => <FeatureItem key={`feature-item-${item.id}`} feature={item} />}
              contentContainerClassName="p-5"
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

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
              keyExtractor={(item) => `transport-review-modal-${item.id}`}
              renderItem={({ item }) => <ReviewItem key={`transport-review-item-${item.id}`} review={item} />}
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
                      key={`transport-review-star-${star}`}
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