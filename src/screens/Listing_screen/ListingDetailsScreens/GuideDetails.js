import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const GuideDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { guideItem } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);

  // Sample images if only one image is provided
  const images = guideItem.images || [guideItem.image];
  
  // Sample reviews data with user images
  const reviews = guideItem.reviews || [
    {
      id: 1,
      user: "Michael Brown",
      rating: 5,
      comment: "Sarah's historical knowledge is incredible! She made the city's history come alive.",
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
    },
    {
      id: 3,
      user: "Robert Johnson",
      rating: 5,
      comment: "Exceptional guide with deep knowledge of local culture and history.",
      date: "2023-10-10",
      userImage: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      id: 4,
      user: "Emma Wilson",
      rating: 4,
      comment: "Great communication skills and very professional. Made our tour enjoyable.",
      date: "2023-10-08",
      userImage: "https://randomuser.me/api/portraits/women/45.jpg"
    }
  ];

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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

  const renderImageItem = ({ item }) => (
    <View className="h-72 w-full">
      <Image 
        source={{ uri: item }} 
        className="w-full h-full"
        resizeMode="cover"
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
      />
    </View>
  );

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
        message: `Check out ${guideItem.name} - ${guideItem.specialty} tour guide. ${guideItem.website || ''}`,
        url: guideItem.website,
        title: guideItem.name
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
        <View className="relative">
          <FlatList
            data={images}
            renderItem={renderImageItem}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            onMomentumScrollEnd={(event) => {
              const index = Math.floor(event.nativeEvent.contentOffset.x / width);
              setActiveIndex(index);
            }}
          />
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

        {/* Details */}
        <View className="p-5 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">{guideItem.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="ribbon" size={16} color="#006D77" />
                <Text className="text-[#006D77] text-sm ml-2 font-medium">{guideItem.specialty}</Text>
              </View>
            </View>
            <View className="bg-[#E6F6F8] px-3 py-1 rounded-full">
              <Text className="text-[#006D77] text-sm font-medium">{guideItem.pricePerDay}/day</Text>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(guideItem.rating)}
          </View>
          
          {/* Availability and Experience */}
          <View className="mt-4 p-3 bg-gray-50 rounded-xl">
            <View className="flex-row items-center justify-between">
              <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(guideItem.availability)}`}>
                <Text className="text-xs font-medium">{guideItem.availability}</Text>
              </View>
              <Text className="text-gray-800 font-medium">{guideItem.experience} experience</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="location" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{guideItem.location}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="document-text" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">License: {guideItem.license}</Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${guideItem.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${guideItem.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            {guideItem.website && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(guideItem.website)}
              >
                <Ionicons name="globe" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">About Me</Text>
            <Text className="text-gray-600 text-sm leading-6">
              {guideItem.description || `${guideItem.name} is a professional tour guide with ${guideItem.experience} of experience specializing in ${guideItem.specialty}. Based in ${guideItem.location}, they are ${guideItem.availability.toLowerCase()} for tours and offers personalized experiences for travelers.`}
            </Text>
          </View>

          {/* Specialties Section */}
          {guideItem.specialties && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Specialties</Text>
              <View className="flex-row flex-wrap">
                {guideItem.specialties.map((specialty, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Languages Section */}
          {guideItem.languages && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Languages</Text>
              <View className="flex-row flex-wrap">
                {guideItem.languages.map((language, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{language}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Location Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Location</Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{guideItem.location}</Text>
            </View>
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
            onPress={() => Linking.openURL(`tel:${guideItem.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Contact Guide</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${guideItem.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GuideDetails;