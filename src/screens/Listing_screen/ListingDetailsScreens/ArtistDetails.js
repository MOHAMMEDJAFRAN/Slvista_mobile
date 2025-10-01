import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput, ActivityIndicator } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { API_BASE_URL } from '@env';

const { width } = Dimensions.get('window');

const ArtistDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { artistItem } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userReview, setUserReview] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2);
  const [loading, setLoading] = useState(true);
  const [artistData, setArtistData] = useState(null);
  const [error, setError] = useState(null);

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Default placeholder image
  const placeholderImage = "https://via.placeholder.com/400x300?text=No+Image+Available";

  // Category icons mapping
  const categoryIcons = {
    "Painting": "palette",
    "Sculpture": "cube",
    "Photography": "camera",
    "Music": "music",
    "Pottery": "circle",
    "Digital Art": "laptop",
    "Textile Art": "cut",
    "Performance": "theater-masks",
    "sdfasaef": "paint-brush" // Default icon for your API category
  };

  // Fetch artist details from API
  const fetchArtistDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/v1/local-artists/${artistItem.id}`);
      
      if (response.data.success) {
        const artist = response.data.data;
        
        // Transform API data to match your component structure
        const transformedData = {
          id: artist.id,
          name: artist.name,
          category: artist.artistTypes?.[0]?.name || "sdfasaef",
          images: artist.images?.map(img => img.imageUrl) || [],
          location: artist.city || "Unknown Location",
          rating: artist.rating || 4.5, // Default rating
          price: "$$", // Default price
          specialty: artist.specialization || "No specialization provided",
          website: artist.website || "#",
          email: artist.email || "",
          phone: artist.phone || "",
          socialMedia: {
            instagram: "",
            facebook: "",
            youtube: ""
          },
          performanceDetails: {
            duration: "2-3 hours",
            groupSize: "Up to 10 people",
            requirements: "Contact for details"
          },
          languages: ["English"],
          cancellationPolicy: "Contact for details",
          performanceHistory: artist.description || "No description provided",
          reviews: [],
          isActive: artist.isActive || true // Add active status from API, default to true
        };
        
        setArtistData(transformedData);
      } else {
        setError("Failed to fetch artist details");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load artist details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtistDetails();
  }, [artistItem.id]);

  // Use API data if available, otherwise fall back to passed data
  const artist = artistData || artistItem;
  
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      comment: "Amazing artist! The workshop was incredible and I learned so much.",
      date: "2023-10-15",
      userImage: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
      id: 2,
      user: "David Kim",
      rating: 4,
      comment: "Great experience. The artist was knowledgeable and patient with beginners.",
      date: "2023-10-12",
      userImage: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  ];

  // Languages
  const languages = artist.languages || ["English", "Tamil", "Sinhala"];

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
          {artist.isActive !== undefined && (
            <View className={`rounded-full px-2 py-1 flex-row items-center mr-2 ${artist.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
              <Ionicons 
                name={artist.isActive ? 'checkmark' : 'close'} 
                size={12} 
                color="white" 
              />
              <Text className="text-white text-xs ml-1">
                {artist.isActive ? 'Available' : 'Unavailable'}
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
    return (
      <View className="flex-row items-center">
        {price.split('').map((char, index) => (
          <Text key={index} className="text-green-600 font-semibold">$</Text>
        ))}
        <Text className="text-gray-500 text-sm ml-1">
          ({price.length === 1 ? 'Budget' : price.length === 2 ? 'Moderate' : 'Premium'})
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

  const shareArtist = async () => {
    try {
      await Share.share({
        message: `Check out ${artist.name} - ${artist.category} artist. ${artist.website || ''}`,
        url: artist.website,
        title: artist.name
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const openLocationInMaps = () => {
    const encodedLocation = encodeURIComponent(artist.location);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedLocation}`);
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

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#006D77" />
        <Text className="mt-4 text-gray-600">Loading artist details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#dc2626" />
        <Text className="text-red-600 text-lg mt-4 text-center font-semibold">
          {error}
        </Text>
        <TouchableOpacity 
          onPress={fetchArtistDetails}
          className="mt-6 bg-[#006D77] px-6 py-3 rounded-xl flex-row items-center"
        >
          <Ionicons name="refresh" size={18} color="white" style={{marginRight: 8}} />
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Use images from API or fallback
  const images = artist.images && artist.images.length > 0 
    ? artist.images 
    : [placeholderImage];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-[#006D77] p-4 pt-12 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Artist Details</Text>
        <TouchableOpacity onPress={shareArtist} className="p-2">
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
              <Text className="text-2xl font-bold text-gray-800">{artist.name}</Text>
              <View className="flex-row items-center mt-2">
                <FontAwesome 
                  name={categoryIcons[artist.category] || "palette"} 
                  size={16} 
                  color="#006D77" 
                />
                <Text className="text-[#006D77] text-sm ml-2 font-medium">{artist.category}</Text>
              </View>
            </View>
            <View className="items-end">
              {/* <View className="bg-[#E6F6F8] px-3 py-1 rounded-full mb-2">
                {renderPriceRange(artist.price)}
              </View> */}
              {/* Active Status Indicator */}
              {/* {artist.isActive !== undefined && (
                <View className={`px-3 py-1 rounded-full flex-row items-center ${artist.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Ionicons 
                    name={artist.isActive ? 'checkmark' : 'close'} 
                    size={14} 
                    color={artist.isActive ? '#16a34a' : '#dc2626'} 
                  />
                  <Text className={`text-xs ml-1 font-medium ${artist.isActive ? 'text-green-800' : 'text-red-800'}`}>
                    {artist.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              )} */}
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(artist.rating)}
          </View>
          
          {/* Location and Specialty */}
          <View className="mt-4 p-3 bg-gray-50 rounded-xl">
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color="#006D77" />
              <Text className="text-gray-800 font-medium ml-2">{artist.location}</Text>
            </View>
            <View className="flex-row items-center mt-2">
              <Ionicons name="brush" size={20} color="#006D77" />
              <Text className="text-gray-800 font-medium ml-2">{artist.specialty}</Text>
            </View>
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            {artist.phone && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(`tel:${artist.phone}`)}
              >
                <Ionicons name="call" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Call</Text>
              </TouchableOpacity>
            )}
            {artist.email && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(`mailto:${artist.email}`)}
              >
                <Ionicons name="mail" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Email</Text>
              </TouchableOpacity>
            )}
            {artist.website && artist.website !== "#" && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(artist.website)}
              >
                <Ionicons name="globe" size={20} color="#006D77" />
                <Text className="text-[#006D77] font-medium ml-2">Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Languages Section */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Languages</Text>
            <View className="flex-row flex-wrap">
              {languages.map((language, index) => (
                <View key={index} className="bg-[#E6F6F8] rounded-full px-3 py-2 mr-2 mb-2">
                  <Text className="text-[#006D77] text-xs font-medium">{language}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Social Media Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('social')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Social Media</Text>
              <Ionicons 
                name={expandedSection === 'social' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {(expandedSection === 'social' || expandedSection === null) && (
              <View className="mt-3 flex-row flex-wrap">
                {artist.socialMedia?.instagram && (
                  <TouchableOpacity 
                    className="bg-[#E6F6F8] p-3 rounded-xl mr-2 mb-2 flex-row items-center"
                    onPress={() => Linking.openURL(`https://instagram.com/${artist.socialMedia.instagram.replace('@', '')}`)}
                  >
                    <Ionicons name="logo-instagram" size={20} color="#E1306C" />
                    <Text className="text-[#006D77] font-medium ml-2">Instagram</Text>
                  </TouchableOpacity>
                )}
                {artist.socialMedia?.facebook && (
                  <TouchableOpacity 
                    className="bg-[E6F6F8] p-3 rounded-xl mr-2 mb-2 flex-row items-center"
                    onPress={() => Linking.openURL(`https://facebook.com/${artist.socialMedia.facebook}`)}
                  >
                    <Ionicons name="logo-facebook" size={20} color="#4267B2" />
                    <Text className="text-[#006D77] font-medium ml-2">Facebook</Text>
                  </TouchableOpacity>
                )}
                {artist.socialMedia?.youtube && (
                  <TouchableOpacity 
                    className="bg-[#E6F6F8] p-3 rounded-xl mr-2 mb-2 flex-row items-center"
                    onPress={() => Linking.openURL(`https://youtube.com/${artist.socialMedia.youtube}`)}
                  >
                    <Ionicons name="logo-youtube" size={20} color="#FF0000" />
                    <Text className="text-[#006D77] font-medium ml-2">YouTube</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </TouchableOpacity>

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
                <Text className="text-gray-600 text-sm leading-6">
                  {artist.cancellationPolicy || "Free cancellation up to 24 hours before the scheduled performance. Cancellations within 24 hours will incur a 50% fee. No-shows will be charged the full amount."}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Performance History Section */}
          <TouchableOpacity 
            className="mt-6"
            onPress={() => toggleSection('history')}
            activeOpacity={0.7}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Performance History</Text>
              <Ionicons 
                name={expandedSection === 'history' ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>
            {expandedSection === 'history' && (
              <View className="mt-3">
                <Text className="text-gray-600 text-sm leading-6">
                  {artist.performanceHistory || "Experienced artist with over 5 years of professional performance. Has performed at various cultural events, weddings, and corporate functions. Specializes in traditional and contemporary performances."}
                </Text>
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
                      Your feedback helps others discover great artists.
                    </Text>
                  </View>
                ) : (
                  <View className="bg-gray-50 p-4 rounded-xl">
                    <Text className="text-gray-800 font-medium mb-2">Share your experience</Text>
                    <Text className="text-gray-600 text-sm mb-4">
                      Let others know what you thought about this artist.
                    </Text>
                    
                    <View className="mb-4">
                      <Text className="text-gray-800 font-medium mb-2">Your Rating</Text>
                      {renderStars(userRating, 24, true)}
                    </View>
                    
                    <Text className="text-gray-800 font-medium mb-2">Your Review</Text>
                    <TextInput
                      className="bg-white p-3 rounded-xl border border-gray-200 h-24"
                      multiline
                      placeholder="Share your experience with this artist..."
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
            onPress={() => Linking.openURL(`tel:${artist.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Contact Artist</Text>
          </TouchableOpacity>
          {artist.phone && (
            <TouchableOpacity 
              className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`https://wa.me/${artist.phone.replace(/\D/g, '')}`)}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ArtistDetails;