import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const GuideDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { guideItem, guideId } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [loading, setLoading] = useState(!guideItem);
  const [error, setError] = useState(null);
  const [guideData, setGuideData] = useState(guideItem || null);

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Fetch guide details if only ID is provided
  useEffect(() => {
    if (!guideItem && guideId) {
      fetchGuideDetails();
    }
  }, [guideId]);

  const fetchGuideDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/guides/${guideId}`);
      
      if (response.data.success) {
        const guide = response.data.data;
        // Transform API data to match component structure
        const transformedData = {
          id: guide.id,
          name: guide.guide_name,
          slug: guide.slug,
          specialty: guide.specialties?.[0] || "General Tour Guide",
          images: guide.images?.map(img => img.imageUrl) || [],
          location: guide.region,
          experience: `${new Date().getFullYear() - guide.experience} years`,
          experienceYear: guide.experience,
          rating: guide.rating || 3.5, // Default rating
          pricePerDay: `${guide.ratePerDayCurrency} ${guide.ratePerDayAmount}`,
          priceAmount: parseFloat(guide.ratePerDayAmount),
          availability: guide.isActive ? "Available" : "Not Available",
          isActive: guide.isActive,
          languages: guide.languages || [],
          email: guide.email,
          phone: guide.phone,
          whatsapp: guide.whatsapp,
          instagram: guide.instagram,
          facebook: guide.facebook,
          license: guide.licenceId,
          description: guide.bio,
          specialties: guide.specialties || [],
          expiryDate: guide.expiryDate,
          vistaVerified: guide.vistaVerified,
          createdAt: guide.createdAt,
          updatedAt: guide.updatedAt
        };
        
        setGuideData(transformedData);
      } else {
        setError("Failed to load guide details");
      }
    } catch (error) {
      console.error("Error fetching guide details:", error);
      setError("Failed to load guide details. Please try again.");
      setLoading(false);
    }
  };

  // Sample reviews data with user images
  const reviews = guideData?.reviews || [
    {
      id: 1,
      user: "Michael Brown",
      rating: 5,
      comment: "This guide's knowledge is incredible! Made the city's history come alive.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      user: "Jennifer Lee",
      rating: 4,
      comment: "Very knowledgeable and friendly guide. Would definitely recommend to others.",
      date: "2023-10-12",
      userImage: "https://randomuser.me/api/portraits/women/42.jpg"
    }
  ];

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

  // Toggle section expansion
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
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

  const getAvailabilityColor = (status) => {
    return status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
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

  const shareGuide = async () => {
    try {
      await Share.share({
        message: `Check out ${guideData.name} - ${guideData.specialty} tour guide.`,
        title: guideData.name
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const submitReview = () => {
    if (userRating > 0 && userReview.trim() !== "") {
      alert(`Thank you for your ${userRating} star review!`);
      setUserReview("");
      setUserRating(0);
      setUserHasReviewed(true);
    } else {
      alert("Please provide both a rating and review text.");
    }
  };

  const loadMoreReviews = () => {
    setReviewsToShow(prev => Math.min(prev + 3, reviews.length));
  };

  const handleRetry = () => {
    if (guideId) {
      fetchGuideDetails();
    } else {
      navigation.goBack();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading guide details...</Text>
      </View>
    );
  }

  if (error || !guideData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">{error || "Guide not found"}</Text>
        <TouchableOpacity 
          onPress={handleRetry}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="reload" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use images from API or fallback to placeholder
  const images = guideData.images && guideData.images.length > 0 
    ? guideData.images 
    : [placeholderImage];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Tour Guide Details</Text>
        <TouchableOpacity onPress={shareGuide} className="p-2">
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={images} />

        {/* Status badges */}
        <View className="absolute top-2 left-2 flex-row">
          {/* Active Status badge */}
            {guideItem.isActive !== undefined && (
              <View className={`rounded-full px-2 py-1 flex-row items-center mr-2 ${guideItem.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                <Ionicons 
                  name={guideItem.isActive ? 'checkmark' : 'close'} 
                  size={12} 
                  color="white" 
                />
                <Text className="text-white text-xs ml-1">
                  {guideItem.isActive ? 'Available' : 'Unavailable'}
                </Text>
              </View>
            )}
          </View>
        
        {/* Details */}
        <View className="p-5 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">{guideData.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="ribbon" size={16} color="#006D77" />
                <Text className="text-[#006D77] text-sm ml-2 font-medium">{guideData.specialty}</Text>
              </View>
            </View>
            <View className="bg-[#E6F6F8] px-3 py-1 rounded-full">
              <Text className="text-[#006D77] text-sm font-medium">{guideData.pricePerDay}/day</Text>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(guideData.rating)}
          </View>
          
          {/* Availability and Experience */}
          <View className="mt-4 p-3 bg-gray-50 rounded-xl">
            <View className="flex-row items-center justify-end">
              {/* <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(guideData.availability)}`}>
                <Text className="text-xs font-medium">{guideData.availability}</Text>
              </View> */}
              <Text className="text-gray-800 font-medium">{guideData.experience} experience</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{guideData.location}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="document-text" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">License: {guideData.license}</Text>
            </View>
            {guideData.vistaVerified && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="checkmark-circle" size={16} color="#006D77" />
                <Text className="text-[#006D77] text-sm ml-2">Vista Verified Guide</Text>
              </View>
            )}
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${guideData.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${guideData.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            {guideData.whatsapp && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(`https://wa.me/${guideData.whatsapp}`)}
              >
                <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                <Text className="text-[#006D77] font-medium ml-2">WhatsApp</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">About Me</Text>
            <Text className="text-gray-600 text-sm leading-6">
              {guideData.description || `${guideData.name} is a professional tour guide with ${guideData.experience} of experience specializing in ${guideData.specialty}. Based in ${guideData.location}, they are ${guideData.availability.toLowerCase()} for tours and offers personalized experiences for travelers.`}
            </Text>
          </View>

          {/* Specialties Section */}
          {guideData.specialties && guideData.specialties.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Specialties</Text>
              <View className="flex-row flex-wrap">
                {guideData.specialties.map((specialty, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Languages Section */}
          {guideData.languages && guideData.languages.length > 0 && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Languages</Text>
              <View className="flex-row flex-wrap">
                {guideData.languages.map((language, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{language}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Social Media Links */}
          {(guideData.instagram || guideData.facebook) && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Connect</Text>
              <View className="flex-row">
                {guideData.instagram && (
                  <TouchableOpacity 
                    className="p-3 bg-gray-100 rounded-full mr-3"
                    onPress={() => Linking.openURL(guideData.instagram)}
                  >
                    <Ionicons name="logo-instagram" size={24} color="#E1306C" />
                  </TouchableOpacity>
                )}
                {guideData.facebook && (
                  <TouchableOpacity 
                    className="p-3 bg-gray-100 rounded-full"
                    onPress={() => Linking.openURL(guideData.facebook)}
                  >
                    <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                  </TouchableOpacity>
                )}
              </View>
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
                      Your feedback helps others discover great tour guides.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this tour guide.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience with this tour guide..."
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
          <TouchableOpacity 
            className="flex-1 bg-[#006D77] p-4 rounded-xl mr-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`tel:${guideData.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Contact Guide</Text>
          </TouchableOpacity>
          {guideData.whatsapp && (
            <TouchableOpacity 
              className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`https://wa.me/${guideData.whatsapp}`)}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default GuideDetails;