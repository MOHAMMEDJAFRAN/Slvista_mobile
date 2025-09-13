import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const FoodBeverageDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { foodItem, itemId } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [loading, setLoading] = useState(!foodItem);
  const [error, setError] = useState(null);
  const [details, setDetails] = useState(foodItem || {});

  // Category icons mapping
  const categoryIcons = {
    "Restaurant": { icon: "utensils", library: FontAwesome5 },
    "Cafe": { icon: "coffee", library: FontAwesome5 },
    "Bar": { icon: "glass-martini-alt", library: FontAwesome5 },
    "Street Food": { icon: "hotdog", library: MaterialCommunityIcons },
    "Bakery": { icon: "bread-slice", library: MaterialCommunityIcons },
    "Dessert": { icon: "ice-cream", library: MaterialCommunityIcons }
  };

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Sample specialties data (fallback if API doesn't provide)
  const specialties = details.specialties || [
    "Fresh Ingredients",
    "Vegetarian Options",
    "Gluten-Free Options",
    "Outdoor Seating",
    "Takeaway Available"
  ];

  // Sample reviews data (fallback if API doesn't provide)
  const reviews = [
    {
      id: 1,
      user: "Michael Johnson",
      rating: 5,
      comment: "Exceptional dining experience! The service was impeccable and the food was outstanding. The atmosphere was perfect for a special occasion.",
      date: "2023-10-18",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      user: "Sarah Williams",
      rating: 4,
      comment: "Great food and friendly staff. The portions were generous and everything was fresh. Would definitely come back again.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/women/22.jpg"
    }
  ];

  // Fetch details from API if we only have an ID
  useEffect(() => {
    const fetchFoodDetails = async () => {
      if (foodItem) {
        // We already have the food item data
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/v1/food-and-beverages/${itemId}`);
        
        if (response.data.success) {
          // Transform API data to match your component structure
          const transformedData = {
            id: response.data.data.id,
            name: response.data.data.name,
            category: response.data.data.cuisineType || "Restaurant",
            images: response.data.data.images ? response.data.data.images.map(img => img.imageUrl) : [],
            location: response.data.data.province || "Western",
            rating: response.data.data.rating || 4.5, // Default rating since API doesn't provide
            priceRange: "$$", // Default price range since API doesn't provide
            website: response.data.data.website,
            email: response.data.data.email,
            phone: response.data.data.phone,
            description: response.data.data.description,
            specialties: response.data.data.cuisineType ? [response.data.data.cuisineType] : ["Local Cuisine"],
            reviews: [], // Empty reviews since API doesn't provide
            isActive: response.data.data.isActive // Add active status from API
          };
          
          setDetails(transformedData);
          setError(null);
        } else {
          setError("Failed to fetch details from server");
        }
      } catch (err) {
        console.error("Error fetching food details:", err);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [foodItem, itemId]);

  // Get the appropriate icon component for the category
  const getCategoryIcon = (category) => {
    const iconConfig = categoryIcons[category] || { icon: "utensils", library: FontAwesome5 };
    const IconComponent = iconConfig.library;
    return <IconComponent name={iconConfig.icon} size={16} color="#006D77" />;
  };

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
          source={{ uri: images[activeIndex] || placeholderImage }} 
          className="w-full h-full"
          resizeMode="cover"
          onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        
        {/* Status badges */}
        <View className="absolute top-2 left-2 flex-row">
          {/* Active Status badge */}
          {details.isActive !== undefined && (
            <View className={`rounded-full px-2 py-1 flex-row items-center mr-2 ${details.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <Ionicons 
                name={details.isActive ? 'checkmark' : 'close'} 
                size={12} 
                color="white" 
              />
              <Text className="text-white text-xs ml-1">
                {details.isActive ? 'Available' : 'Unavailable'}
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

  const renderPriceRange = (priceRange) => {
    return (
      <View className="flex-row items-center">
        {priceRange.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
        <Text className="text-gray-500 text-sm ml-1">
          ({priceRange.length === 1 ? 'Budget' : priceRange.length === 2 ? 'Moderate' : 'Premium'})
        </Text>
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

  const shareFoodItem = async () => {
    try {
      await Share.share({
        message: `Check out ${details.name} - ${details.category} in ${details.location}. Rating: ${details.rating}/5. ${details.website || ''}`,
        url: details.website,
        title: details.name
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
        <Text className="mt-4 text-gray-600">Loading food & beverage details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">{error}</Text>
        <Text className="text-gray-500 text-sm mt-2 text-center">
          Please check your connection and try again
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use images from API or fallback
  const images = details.images && details.images.length > 0 
    ? details.images 
    : [placeholderImage];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Food & Beverage Details</Text>
        <TouchableOpacity onPress={shareFoodItem} className="p-2">
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={images} />
        
        {/* Details */}
        <View className="p-5 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">{details.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="#666" />
                <Text className="text-gray-600 text-sm ml-2">{details.location}</Text>
              </View>
            </View>
            <View className="items-end">
              <View className="bg-[#E6F6F8] px-3 py-1 rounded-full flex-row items-center mb-2">
                {getCategoryIcon(details.category)}
                <Text className="text-[#006D77] text-sm ml-1 font-medium">{details.category}</Text>
              </View>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(details.rating)}
          </View>
          
          {/* <View className="mt-2">
            {renderPriceRange(details.priceRange)}
          </View> */}
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            {details.phone && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(`tel:${details.phone}`)}
              >
                <Ionicons name="call" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Call</Text>
              </TouchableOpacity>
            )}
            {details.email && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(`mailto:${details.email}`)}
              >
                <Ionicons name="mail" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Email</Text>
              </TouchableOpacity>
            )}
            {details.website && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(details.website)}
              >
                <Ionicons name="globe" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Specialties Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Specialties & Features</Text>
            <View className="flex-row flex-wrap">
              {specialties.map((specialty, index) => (
                <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                  <Text className="text-[#006D77] text-xs font-medium">{specialty}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* About Section */}
          {details.description && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Description</Text>
              <Text className="text-gray-600 text-sm leading-6 ">
                {details.description}
              </Text>
            </View>
          )}

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
                      Your feedback helps others discover great dining experiences.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this establishment.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your dining experience..."
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
                      data={reviews.slice(0, expandedSection === 'reviews' ? reviews.length : reviewsToShow)}
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
          {details.phone && (
            <TouchableOpacity 
              className="flex-1 bg-[#006D77] p-4 rounded-xl mr-2 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${details.phone}`)}
            >
              <Ionicons name="call" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">Call to Reserve</Text>
            </TouchableOpacity>
          )}
          {details.phone && (
            <TouchableOpacity 
              className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`https://wa.me/${details.phone.replace(/\D/g, '')}`)}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default FoodBeverageDetails;