import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const TransportDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transportItem } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2); // Number of reviews to initially display

  // Sample images if only one image is provided
  const images = transportItem.images || [transportItem.image];
  
  // Sample specialties data
  const specialties = transportItem.specialties || [
    "24/7 Service",
    "Luxury Vehicles",
    "Airport Transfers",
    "Corporate Travel",
    "Child Seats Available"
  ];

  // Sample reviews data with user images
  const reviews = transportItem.reviews || [
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "Excellent service! The driver was punctual and very professional. The vehicle was clean and comfortable. Would definitely use again for my airport transfers.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      user: "Jane Smith",
      rating: 4,
      comment: "Comfortable ride, but a bit pricey. Would use again. The driver was friendly and knew the best routes to avoid traffic.",
      date: "2023-09-28",
      userImage: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      user: "Robert Johnson",
      rating: 5,
      comment: "Best transport service in town. Highly recommended! I've used them multiple times for business trips and they're always reliable.",
      date: "2023-10-05",
      userImage: null // This will use the default image
    },
    {
      id: 4,
      user: "Sarah Williams",
      rating: 4,
      comment: "Great service overall. The car was clean and the driver was on time. Would recommend for airport transfers.",
      date: "2023-10-01",
      userImage: "https://randomuser.me/api/portraits/women/15.jpg"
    },
    {
      id: 5,
      user: "Michael Brown",
      rating: 5,
      comment: "Exceptional service! The driver went above and beyond to make our journey comfortable. Will definitely use again.",
      date: "2023-09-25",
      userImage: "https://randomuser.me/api/portraits/men/18.jpg"
    }
  ];

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Transport type icons mapping
  const transportIcons = {
    Bus: { icon: "bus", library: MaterialCommunityIcons },
    Taxi: { icon: "taxi", library: MaterialCommunityIcons },
    Train: { icon: "train", library: MaterialCommunityIcons },
    Bicycle: { icon: "bicycle", library: FontAwesome5 },
    Shuttle: { icon: "shuttle-van", library: FontAwesome5 },
    Car: { icon: "car", library: FontAwesome5 },
    Airplane: { icon: "airplane", library: MaterialCommunityIcons },
    Flight: { icon: "airplane", library: MaterialCommunityIcons },
    Helicopter: { icon: "helicopter", library: MaterialCommunityIcons },
    Boat: { icon: "ship", library: MaterialCommunityIcons },
    Ship: { icon: "ship", library: MaterialCommunityIcons }
  };

  // Get the appropriate icon component for the transport type
  const getTransportIcon = (type) => {
    const iconConfig = transportIcons[type] || { icon: "directions-car", library: MaterialIcons };
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

  const shareTransport = async () => {
    try {
      await Share.share({
        message: `Check out ${transportItem.name} - ${transportItem.type} service in ${transportItem.location}. Rating: ${transportItem.rating}/5. ${transportItem.website}`,
        url: transportItem.website,
        title: transportItem.name
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
        <Text className="text-white text-xl font-bold">Transport Details</Text>
        <TouchableOpacity onPress={shareTransport} className="p-2">
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
              <Text className="text-2xl font-bold text-gray-800">{transportItem.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="#666" />
                <Text className="text-gray-600 text-sm ml-2">{transportItem.location}</Text>
              </View>
            </View>
            <View className="bg-[#E6F6F8] px-3 py-1 rounded-full flex-row items-center">
              {getTransportIcon(transportItem.type)}
              <Text className="text-[#006D77] text-sm ml-1 font-medium">{transportItem.type}</Text>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(transportItem.rating)}
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${transportItem.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${transportItem.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(transportItem.website)}
            >
              <Ionicons name="globe" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Website</Text>
            </TouchableOpacity>
          </View>

          {/* Specialties Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Specialties</Text>
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
            <Text className="text-lg font-semibold text-gray-800 mb-3">About</Text>
            <Text className="text-gray-600 text-sm leading-6">
              {transportItem.name} provides excellent {transportItem.type.toLowerCase()} services in the {transportItem.location} area. 
              With a rating of {transportItem.rating}, they are committed to providing quality transportation solutions 
              for all your needs. They specialize in {specialties.slice(0, 2).join(', ').toLowerCase()} and more.
            </Text>
          </View>

          {/* Cancellation Policy Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('cancellation')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Cancellation Policy</Text>
              <Ionicons 
                name={expandedSection === 'cancellation' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {expandedSection === 'cancellation' && (
              <View className="mt-3">
                <View className="flex-row items-start py-2">
                  <Ionicons name="time-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Free cancellation</Text>
                    <Text className="text-gray-600 text-sm mt-1">Cancel up to 24 hours in advance for a full refund</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="alert-circle-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Late cancellation</Text>
                    <Text className="text-gray-600 text-sm mt-1">50% charge for cancellations within 24 hours of booking</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="close-circle-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">No-show policy</Text>
                    <Text className="text-gray-600 text-sm mt-1">Full charge applies if you don't show up for your booking</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Pickup Instructions Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('pickup')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Pickup Instructions</Text>
              <Ionicons 
                name={expandedSection === 'pickup' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {expandedSection === 'pickup' && (
              <View className="mt-3">
                <View className="flex-row items-start py-2">
                  <Ionicons name="pin-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Be at the pickup point on time</Text>
                    <Text className="text-gray-600 text-sm mt-1">Drivers wait a maximum of 5 minutes after scheduled pickup time</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="call-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Contact driver</Text>
                    <Text className="text-gray-600 text-sm mt-1">You'll receive driver details and contact information 30 minutes before pickup</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="bag-handle-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Luggage information</Text>
                    <Text className="text-gray-600 text-sm mt-1">Please specify if you have oversized luggage when booking</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

          {/* Safety Measures Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('safety')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Safety Measures</Text>
              <Ionicons 
                name={expandedSection === 'safety' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {expandedSection === 'safety' && (
              <View className="mt-3">
                <View className="flex-row items-start py-2">
                  <Ionicons name="construct-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Regular vehicle maintenance</Text>
                    <Text className="text-gray-600 text-sm mt-1">All vehicles undergo regular inspections and maintenance</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="medical-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">First aid kits</Text>
                    <Text className="text-gray-600 text-sm mt-1">First aid kits available in all vehicles for emergencies</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="person-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Experienced drivers</Text>
                    <Text className="text-gray-600 text-sm mt-1">All drivers are licensed, experienced, and background-checked</Text>
                  </View>
                </View>
                <View className="flex-row items-start py-2">
                  <Ionicons name="shield-checkmark-outline" size={16} color="#006D77" className="mt-1" />
                  <View className="ml-3 flex-1">
                    <Text className="text-gray-800 font-medium">Sanitization protocols</Text>
                    <Text className="text-gray-600 text-sm mt-1">Vehicles are thoroughly cleaned and sanitized between rides</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>

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
                      Your feedback helps others discover great transport services.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this transport service.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience with this transport service..."
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
            onPress={() => Linking.openURL(`tel:${transportItem.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Call to Book</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${transportItem.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TransportDetails;