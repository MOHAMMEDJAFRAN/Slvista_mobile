import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventItem, eventId } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [loading, setLoading] = useState(!eventItem);
  const [eventData, setEventData] = useState(eventItem || null);
  const [error, setError] = useState(null);

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Category icons mapping
  const categoryIcons = {
    "Music": "music",
    "Food & Drink": "utensils",
    "Art & Culture": "palette",
    "Sports": "running",
    "Business": "briefcase",
    "Entertainment": "film",
    "Wellness": "heart",
    "Community": "users",
    "General": "calendar"
  };

  // Fetch event details from API
  useEffect(() => {
    if (eventItem) return;

    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching event details for ID:", eventId);
        const response = await axios.get(`${API_BASE_URL}/api/v1/events/${eventId}`);
        
        console.log("Event details response:", response.data);
        
        // Transform API data to match your component's expected format
        const event = response.data;
        const transformedData = {
          id: event.id,
          name: event.title,
          category: "General",
          images: event.images ? event.images.map(img => img.imageUrl) : [],
          date: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date TBA",
          time: event.eventTime || "TBA",
          location: event.venue || "Location TBA",
          rating: 4.5,
          price: "$$",
          priceType: "paid",
          ticketStatus: "Available",
          website: event.website || "#",
          email: event.email || "",
          phone: event.phone || "",
          description: event.description || "",
          city: event.city || "",
          province: event.province || "",
          vistaVerified: event.vistaVerified || false,
          isActive: event.isActive || true,
          originalData: event
        };
        
        setEventData(transformedData);
      } catch (err) {
        console.error("Error fetching event details:", err);
        
        let errorMessage = "Failed to load event details. Please try again.";
        
        if (err.response) {
          errorMessage = `Server error: ${err.response.status}`;
          if (err.response.status === 404) {
            errorMessage = "Event not found";
          }
        } else if (err.request) {
          errorMessage = "Network error. Please check your connection.";
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, eventItem]);

  // Sample reviews data with user images
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      comment: "Amazing event! The organization was perfect and the atmosphere was electric. Can't wait for the next one!",
      date: "2023-10-18",
      userImage: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: 2,
      user: "Mike Thompson",
      rating: 4,
      comment: "Great experience overall. The venue was nice but could use more seating areas. Will attend again.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/men/22.jpg"
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
        
        {/* Active Status Badge */}
        {eventData?.isActive !== undefined && (
          <View className="absolute top-2 left-2 flex-row">
            <View className={`rounded-full px-2 py-1 flex-row items-center mr-2 ${eventData.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <Ionicons 
                name={eventData.isActive ? 'checkmark' : 'close'} 
                size={12} 
                color="white" 
              />
              <Text className="text-white text-xs ml-1">
                {eventData.isActive ? 'Available' : 'Unavailable'}
              </Text>
            </View>
          </View>
        )}
        
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

  const renderPriceRange = (price) => {
    if (price === "Free") {
      return (
        <View className="flex-row items-center">
          <Text className="text-green-600 font-semibold">Free</Text>
        </View>
      );
    }
    
    return (
      <View className="flex-row items-center">
        {price.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
      </View>
    );
  };

  const getTicketStatusColor = (status) => {
    switch(status) {
      case "Selling Fast":
        return "bg-orange-100 text-orange-800";
      case "Almost Sold Out":
        return "bg-red-100 text-red-800";
      case "Available":
        return "bg-green-100 text-green-800";
      case "RSVP Required":
        return "bg-blue-100 text-blue-800";
      case "Drop-in":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  const shareEvent = async () => {
    try {
      await Share.share({
        message: `Check out ${eventData.name} - ${eventData.category} event on ${eventData.date}. ${eventData.website || ''}`,
        url: eventData.website,
        title: eventData.name
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openLocationInMaps = () => {
    const encodedLocation = encodeURIComponent(eventData.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
  };

  const openDirectionsInMaps = () => {
    const encodedLocation = encodeURIComponent(eventData.location);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`);
  };

  const submitReview = () => {
    if (userRating > 0 && userReview.trim() !== "") {
      alert(`Thank you for your ${userRating} star review!`);
      setUserReview("");
      setUserRating(0);
      setShowReviewForm(false);
      setUserHasReviewed(true);
    } else {
      alert("Please provide both a rating and review text.");
    }
  };

  const loadMoreReviews = () => {
    setReviewsToShow(prev => Math.min(prev + 3, reviews.length));
  };

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    // Re-fetch event details
    useEffect(() => {
      const fetchEventDetails = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/api/v1/events/${eventId}`);
          const event = response.data;
          const transformedData = {
            id: event.id,
            name: event.title,
            category: "General",
            images: event.images ? event.images.map(img => img.imageUrl) : [],
            date: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Date TBA",
            time: event.eventTime || "TBA",
            location: event.venue || "Location TBA",
            rating: event.rating || 4.5,
            price: "$$",
            priceType: "paid",
            ticketStatus: "Available",
            website: event.website || "#",
            email: event.email || "",
            phone: event.phone || "",
            description: event.description || "",
            isActive: event.isActive || true,
            originalData: event
          };
          setEventData(transformedData);
        } catch (err) {
          setError("Failed to load event details. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }, []);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading event details...</Text>
      </View>
    );
  }

  if (error && !eventData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">
          {error}
        </Text>
        <TouchableOpacity 
          onPress={retryFetch}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="reload" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!eventData) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="calendar" size={48} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4 text-center font-semibold">
          Event not found
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="arrow-back" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use images from API or fallback
  const images = eventData.images && eventData.images.length > 0 
    ? eventData.images 
    : [placeholderImage];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Event Details</Text>
        <TouchableOpacity onPress={shareEvent} className="p-2">
          <Ionicons name="share-social" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Error Banner */}
      {error && (
        <View className="bg-yellow-100 p-3 border-b border-yellow-200">
          <View className="flex-row items-center">
            <Ionicons name="warning" size={20} color="#d97706" />
            <Text className="text-yellow-800 ml-2 text-sm flex-1">{error}</Text>
            <TouchableOpacity onPress={retryFetch}>
              <Text className="text-[#006D77] font-semibold">Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={images} />
        
        {/* Details */}
        <View className="p-5 bg-white rounded-t-3xl -mt-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-800">{eventData.name}</Text>
              <View className="flex-row items-center mt-2">
                <FontAwesome 
                  name={categoryIcons[eventData.category] || "calendar"} 
                  size={16} 
                  color="#006D77" 
                />
                <Text className="text-[#006D77] text-sm ml-2 font-medium">{eventData.category}</Text>
              </View>
            </View>
            <View className="items-end">
              {/* <View className={`rounded-full px-3 py-1 ${getTicketStatusColor(eventData.ticketStatus)} mb-2`}>
                <Text className="text-xs font-medium">{eventData.ticketStatus}</Text>
              </View> */}
              {/* Active Status Indicator */}
              {/* {eventData.isActive !== undefined && (
                <View className={`px-3 py-1 rounded-full flex-row items-center ${eventData.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Ionicons 
                    name={eventData.isActive ? 'checkmark' : 'close'} 
                    size={14} 
                    color={eventData.isActive ? '#16a34a' : '#dc2626'} 
                  />
                  <Text className={`text-xs ml-1 font-medium ${eventData.isActive ? 'text-green-800' : 'text-red-800'}`}>
                    {eventData.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              )} */}
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(eventData.rating)}
          </View>
          
          {/* <View className="mt-2">
            {renderPriceRange(eventData.price)}
          </View> */}
          
          {/* Date and Time */}
          <View className="mt-4 p-3 bg-gray-50 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color="#006D77" />
              <Text className="text-gray-800 font-medium ml-2">{eventData.date}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="time" size={20} color="#006D77" />
              <Text className="text-gray-800 font-medium ml-2">{eventData.time}</Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${eventData.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${eventData.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            {eventData.website && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(eventData.website)}
              >
                <Ionicons name="globe" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Location Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('location')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Location</Text>
              <Ionicons 
                name={expandedSection === 'location' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {(expandedSection === 'location' || expandedSection === null) && (
              <View className="mt-3">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={16} color="#666" />
                  <Text className="text-gray-600 text-sm ml-2">{eventData.location}</Text>
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
            )}
          </TouchableOpacity>
          
          {/* About Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('about')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">About This Event</Text>
              <Ionicons 
                name={expandedSection === 'about' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {(expandedSection === 'about' || expandedSection === null) && (
              <Text className="text-gray-600 text-sm mt-3 leading-6">
                {eventData.description || `${eventData.name} is a ${eventData.category.toLowerCase()} event happening on ${eventData.date} at ${eventData.time}. This event is ${eventData.priceType === 'free' ? 'free to attend' : 'a paid event'} and currently has ${eventData.ticketStatus.toLowerCase()} tickets.`}
              </Text>
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
                      Your feedback helps others discover great events.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this event.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience at this event..."
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
            onPress={() => Linking.openURL(eventData.website || `tel:${eventData.phone}`)}
          >
            <Ionicons name="ticket" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Get Tickets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${eventData.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default EventDetails;