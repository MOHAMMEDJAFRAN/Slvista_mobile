import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const ActivityDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { activityId } = route.params;
  const [activityItem, setActivityItem] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch activity details from API
  const fetchActivityDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/activities/${activityId}`);
      
      if (response.data.success) {
        setActivityItem(response.data.data);
      } else {
        setError("Failed to fetch activity details");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load activity details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchActivityDetails();
    }
  }, [activityId]);

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Category icons mapping
  const categoryIcons = {
    "Historical": { icon: "landmark", library: FontAwesome5 },
    "Tours": { icon: "map-marked-alt", library: FontAwesome5 },
    "Adventure": { icon: "hiking", library: FontAwesome5 },
    "Food & Drink": { icon: "utensils", library: FontAwesome5 },
    "Culture": { icon: "landmark", library: FontAwesome5 },
    "Water Activities": { icon: "water", library: MaterialCommunityIcons },
    "Shopping": { icon: "shopping-bag", library: FontAwesome5 }
  };

  // Get the appropriate icon component for the category
  const getCategoryIcon = (category) => {
    const iconConfig = categoryIcons[category] || { icon: "star", library: Ionicons };
    const IconComponent = iconConfig.library;
    return <IconComponent name={iconConfig.icon} size={16} color="#006D77" />;
  };

  // Display actual price instead of converting to range
  const renderPrice = (price) => {
    if (!price) return <Text className="text-green-600 font-semibold">Price not available</Text>;
    
    const priceNum = parseInt(price);
    if (priceNum === 0) {
      return <Text className="text-green-600 font-semibold">Free</Text>;
    }
    return <Text className="text-green-600 font-semibold">LKR {priceNum.toLocaleString()}</Text>;
  };

  // Sample specialties data (not provided by API)
  const specialties = [
    "Guided Experience",
    "Small Groups",
    "Local Experts",
    "Photo Opportunities"
  ];

  // Sample reviews data (not provided by API)
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      comment: "Amazing experience! The guide was knowledgeable and made the activity so enjoyable. Would definitely recommend to anyone visiting the area.",
      date: "2023-10-20",
      userImage: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: 2,
      user: "Mike Thompson",
      rating: 4,
      comment: "Great activity but a bit rushed in some areas. Overall had a wonderful time and learned a lot.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  ];

  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Improved image carousel with manual navigation
  const ImageCarousel = ({ images }) => {
    if (!images || images.length === 0) {
      return (
        <View className="h-72 w-full bg-gray-200 justify-center items-center">
          <Ionicons name="image" size={48} color="#9ca3af" />
          <Text className="text-gray-500 mt-2">No images available</Text>
        </View>
      );
    }

    const goToNext = () => {
      setActiveIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    };

    const goToPrev = () => {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    };

    return (
      <View className="h-72 w-full relative">
        <Image 
          source={{ uri: images[activeIndex]?.imageUrl || placeholderImage }} 
          className="w-full h-full"
          resizeMode="cover"
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        
        {/* Status badges */}
        <View className="absolute top-2 left-2 flex-row">
          {/* Active Status badge */}
          {activityItem?.isActive !== undefined && (
            <View className={`rounded-full px-2 py-1 flex-row items-center mr-2 ${activityItem.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <Ionicons 
                name={activityItem.isActive ? 'checkmark' : 'close'} 
                size={12} 
                color="white" 
              />
              <Text className="text-white text-xs ml-1">
                {activityItem.isActive ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          )}
        </View>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <TouchableOpacity 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
              onPress={goToPrev}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-2"
              onPress={goToNext}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          </>
        )}
        
        {/* Image counter */}
        {images.length > 1 && (
          <View className="absolute top-4 right-4 bg-black/50 rounded-full px-3 py-1">
            <Text className="text-white text-sm">
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        )}
        
        {/* Pagination indicators */}
        {images.length > 1 && (
          <View className="absolute bottom-4 flex-row justify-center w-full">
            {images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full mx-1 ${
                  index === activeIndex ? "bg-white" : "bg-gray-300"
                }`}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderStars = (rating, size = 16, interactive = false) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          disabled={!interactive}
          onPress={() => interactive && setUserRating(i)}
        >
          <Ionicons 
            name={i <= rating ? "star" : "star-outline"} 
            size={size} 
            color={interactive ? "#FFA500" : "#FFD700"} 
          />
        </TouchableOpacity>
      );
    }
    
    return (
      <View className="flex-row items-center">
        {stars}
        {!interactive && (
          <Text className="text-gray-600 ml-1 text-sm">({rating})</Text>
        )}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View className="bg-gray-50 p-4 rounded-xl mb-4">
      <View className="flex-row items-center">
        <Image 
          source={{ uri: item.userImage || defaultUserImage }} 
          className="w-12 h-12 rounded-full mr-3"
          resizeMode="cover"
          onError={(e) => console.log('User image loading error:', e.nativeEvent.error)}
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-gray-800">{item.user}</Text>
            <Text className="text-gray-500 text-xs">{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <View className="mt-1">
            {renderStars(item.rating)}
          </View>
        </View>
      </View>
      <Text className="mt-3 text-gray-600 text-sm leading-5">{item.comment}</Text>
    </View>
  );

  const shareActivity = async () => {
    try {
      await Share.share({
        message: `Check out ${activityItem.title} - ${activityItem.type} experience in ${activityItem.district || activityItem.city}. Price: ${activityItem.pricerange ? `LKR ${parseInt(activityItem.pricerange).toLocaleString()}` : 'Contact for price'}`,
        title: activityItem.title
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const submitReview = () => {
    if (userRating > 0 && userReview.trim() !== "") {
      // In a real app, you would send this to your backend
      alert(`Thank you for your ${userRating} star review!`);
      setUserReview("");
      setUserRating(0);
      setUserHasReviewed(true);
    } else {
      alert("Please provide both a rating and review text.");
    }
  };

  const loadMoreReviews = () => {
    // Show 3 more reviews each time the button is clicked
    setReviewsToShow(prev => Math.min(prev + 3, reviews.length));
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading activity details...</Text>
      </View>
    );
  }

  if (error || !activityItem) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
          {error || "Activity not found"}
        </Text>
        <TouchableOpacity 
          onPress={fetchActivityDetails}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="reload" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-4 bg-gray-200 px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="arrow-back" size={18} color="#4b5563" style={{marginRight: 8}} />
          <Text className="text-gray-700 font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Activity Details</Text>
        <TouchableOpacity onPress={shareActivity} className="p-2">
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={activityItem.images} />
        
        {/* Details */}
        <View className="p-5 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">{activityItem.title}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="#666" />
                <Text className="text-gray-600 text-sm ml-2">
                  {activityItem.district || activityItem.city || "Unknown location"}
                </Text>
              </View>
            </View>
            <View className="items-end">
              <View className="bg-[#E6F6F8] px-3 py-1 rounded-full flex-row items-center mb-2">
                {getCategoryIcon(activityItem.type)}
                <Text className="text-[#006D77] text-sm ml-1 font-medium">{activityItem.type}</Text>
              </View>
      
              
            </View>
          </View>
          
          {/* Using a default rating since API doesn't provide it */}
          <View className="mt-4">
            {renderStars(activityItem.rating || 4.5)}
          </View>
          
          {/* Display actual price */}
          <View className="mt-2">
            {renderPrice(activityItem.pricerange)}
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${activityItem.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${activityItem.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
          </View>

          {/* Specialties Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">What's Included</Text>
            <View className="flex-row flex-wrap">
              {specialties.map((specialty, index) => (
                <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                  <Text className="text-[#006D77] text-xs font-medium">{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* About Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">About This Activity</Text>
            <Text className="text-gray-600 text-sm leading-6">
              {activityItem.description || 
                `${activityItem.title} is a wonderful ${activityItem.type.toLowerCase()} experience located in ${activityItem.district || activityItem.city}. 
                This activity offers a unique experience for visitors.`}
            </Text>
          </View>

          {/* Your Review Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('yourReview')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Your Review</Text>
              <Ionicons 
                name={expandedSection === 'yourReview' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {(expandedSection === 'yourReview' || expandedSection === null) && (
              <View className="mt-3">
                {userHasReviewed ? (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Thank you for your review!</Text>
                    <Text className="text-gray-600 text-sm">
                      Your feedback helps others discover great activities.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this activity.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience with this activity..."
                      value={userReview}
                      onChangeText={setUserReview}
                    />
                    
                    <TouchableOpacity 
                      onPress={submitReview}
                      className="mt-4 bg-[#006D77] p-3 rounded-xl flex-row items-center justify-center"
                    >
                      <Text className="text-white font-medium">Submit Review</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>

          {/* Reviews Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('reviews')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-800">Customer Reviews</Text>
                <View className="bg-[#006D77] rounded-full px-2 py-1 ml-2">
                  <Text className="text-white text-xs">{reviews.length}</Text>
                </View>
              </View>
              <Ionicons 
                name={expandedSection === 'reviews' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {(expandedSection === 'reviews' || expandedSection === null) && (
              <View className="mt-3">
                {reviews.length > 0 ? (
                  <>
                    <FlatList
                      data={reviews.slice(0, reviewsToShow)}
                      renderItem={renderReviewItem}
                      keyExtractor={(item) => item.id.toString()}
                      scrollEnabled={false}
                    />
                    
                    {reviewsToShow < reviews.length && (
                      <TouchableOpacity 
                        onPress={loadMoreReviews}
                        className="mt-4 bg-[#E6F6F8] p-3 rounded-xl flex-row items-center justify-center"
                      >
                        <Text className="text-[#006D77] font-medium">More Reviews</Text>
                        <Ionicons name="chevron-down" size={16} color="#006D77" className="ml-2" />
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  <Text className="text-gray-500 italic text-sm">No reviews yet.</Text>
                )}
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="p-5 bg-white border-t border-gray-200">
        <View className="flex-row">
          <TouchableOpacity 
            className="flex-1 bg-[#006D77] p-4 rounded-xl mr-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`tel:${activityItem.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Call to Book</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${activityItem.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            <Text className="text-[#006D77] font-medium ml-2">WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ActivityDetails;