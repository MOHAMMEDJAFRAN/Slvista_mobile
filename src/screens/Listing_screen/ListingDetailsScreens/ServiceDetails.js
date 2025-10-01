import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const ServiceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { serviceItem } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Sample images if only one image is provided
  const images = serviceItem.images || [serviceItem.image || placeholderImage];
  
  // Sample reviews data with user images
  const reviews = serviceItem.reviews || [
    {
      id: 1,
      user: "Michael Brown",
      rating: 5,
      comment: "Excellent service. The staff was professional and caring.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 2,
      user: "Jennifer Lee",
      rating: 4,
      comment: "Very knowledgeable and friendly service. Would definitely recommend to others.",
      date: "2023-10-12",
      userImage: "https://randomuser.me/api/portraits/women/42.jpg"
    }
  ];

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Category icons mapping
  const categoryIcons = {
    "Healthcare": "medical-services",
    "Business Services": "business-center",
    "Storage": "storage",
    "Repair Services": "build",
    "Legal Services": "gavel",
    "Laundry Services": "local-laundry-service",
    "Pet Services": "pets",
    "Financial Services": "attach-money",
    "Fitness": "fitness-center",
    "Beauty Services": "spa",
    "Home Services": "home-repair-service",
    "Translation": "translate"
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

  // Fixed renderStars function - removed the arrow function syntax error
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
    if (status === "Open Now") return "bg-green-100 text-green-800";
    if (status === "24/7 Available") return "bg-blue-100 text-blue-800";
    if (status === "Closed") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
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

  const shareService = async () => {
    try {
      await Share.share({
        message: `Check out ${serviceItem.name} - ${serviceItem.category} service. ${serviceItem.website || ''}`,
        url: serviceItem.website,
        title: serviceItem.name
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openLocationInMaps = () => {
    const encodedLocation = encodeURIComponent(serviceItem.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
  };

  const openDirectionsInMaps = () => {
    const encodedLocation = encodeURIComponent(serviceItem.location);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`);
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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Service Details</Text>
        <TouchableOpacity onPress={shareService} className="p-2">
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
              <Text className="text-2xl font-bold text-gray-800">{serviceItem.name}</Text>
              <View className="flex-row items-center mt-2">
                <MaterialIcons 
                  name={categoryIcons[serviceItem.category] || "help"} 
                  size={16} 
                  color="#006D77" 
                />
                <Text className="text-[#006D77] text-sm ml-2 font-medium">{serviceItem.category}</Text>
              </View>
            </View>
            <View className={`rounded-full px-3 py-1 ${getAvailabilityColor(serviceItem.availability)}`}>
              <Text className="text-xs font-medium">{serviceItem.availability}</Text>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(serviceItem.rating)}
          </View>
          
          {/* Location and Contact */}
          <View className="mt-4 p-3 bg-gray-50 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{serviceItem.location}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="call" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{serviceItem.phone}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="mail" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{serviceItem.email}</Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${serviceItem.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${serviceItem.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            {serviceItem.website && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(serviceItem.website)}
              >
                <Ionicons name="globe" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description</Text>
            <Text className="text-gray-600 text-sm leading-6">
              {serviceItem.description || `${serviceItem.name} provides professional ${serviceItem.category.toLowerCase()} services in ${serviceItem.location}. With a rating of ${serviceItem.rating}, they are ${serviceItem.availability.toLowerCase()} to serve your needs.`}
            </Text>
          </View>

          {/* Services Offered Section */}
          {serviceItem.specialties && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Services Offered</Text>
              <View className="flex-row flex-wrap">
                {serviceItem.specialties.map((specialty, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{specialty}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Languages Section */}
          {serviceItem.languages && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Languages</Text>
              <View className="flex-row flex-wrap">
                {serviceItem.languages.map((language, index) => (
                  <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                    <Text className="text-[#006D77] text-xs font-medium">{language}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {/* Cancellation Policy Section */}
          {serviceItem.cancellationPolicy && (
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">Cancellation Policy</Text>
              <Text className="text-gray-600 text-sm leading-6">
                {serviceItem.cancellationPolicy}
              </Text>
            </View>
          )}
          
          {/* Location Section with Map and Directions */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Location</Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#666" />
              <Text className="text-gray-600 text-sm ml-2">{serviceItem.location}</Text>
            </View>
            
            <View className="flex-row mt-4">
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mr-2 flex-row items-center justify-center"
                onPress={openLocationInMaps}
              >
                <Ionicons name="map" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">View Map</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl ml-2 flex-row items-center justify-center"
                onPress={openDirectionsInMaps}
              >
                <Ionicons name="navigate" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Directions</Text>
              </TouchableOpacity>
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
                      Your feedback helps others discover great services.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this service.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience with this service..."
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
                        <Text className="text-[#006D77] font-medium">Load More Reviews</Text>
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
            onPress={() => Linking.openURL(`tel:${serviceItem.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Contact Service</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${serviceItem.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ServiceDetails;