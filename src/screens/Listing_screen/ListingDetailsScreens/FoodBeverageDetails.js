import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking, FlatList, Dimensions, Share, TextInput } from "react-native";
import { Ionicons, MaterialIcons, Feather, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get('window');

const FoodBeverageDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { foodItem } = route.params;
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [reviewsToShow, setReviewsToShow] = useState(2); // Number of reviews to initially display

  // Sample images if only one image is provided
  const images = foodItem.images || [foodItem.image];
  
  // Sample specialties data
  const specialties = foodItem.specialties || [
    "Fresh Ingredients",
    "Vegetarian Options",
    "Gluten-Free Options",
    "Outdoor Seating",
    "Takeaway Available"
  ];

  // Sample reviews data with user images
  const reviews = foodItem.reviews || [
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
    },
    {
      id: 3,
      user: "Robert Chen",
      rating: 5,
      comment: "Absolutely loved the food here! The flavors were amazing and the presentation was beautiful. Highly recommend!",
      date: "2023-10-12",
      userImage: null // This will use the default image
    },
    {
      id: 4,
      user: "Emily Davis",
      rating: 4,
      comment: "Cozy atmosphere with delicious food. The service was prompt and the menu had great variety.",
      date: "2023-10-10",
      userImage: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      id: 5,
      user: "David Wilson",
      rating: 5,
      comment: "Best dining experience in town! Every dish was a masterpiece. Will definitely be returning soon.",
      date: "2023-10-08",
      userImage: "https://randomuser.me/api/portraits/men/28.jpg"
    }
  ];

  // Default user image
  const defaultUserImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // Category icons mapping
  const categoryIcons = {
    "Restaurant": { icon: "utensils", library: FontAwesome5 },
    "Cafe": { icon: "coffee", library: FontAwesome5 },
    "Bar": { icon: "glass-martini-alt", library: FontAwesome5 },
    "Street Food": { icon: "hotdog", library: MaterialCommunityIcons },
    "Bakery": { icon: "bread-slice", library: MaterialCommunityIcons },
    "Dessert": { icon: "ice-cream", library: MaterialCommunityIcons }
  };

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

  const shareFoodItem = async () => {
    try {
      await Share.share({
        message: `Check out ${foodItem.name} - ${foodItem.category} in ${foodItem.location}. Rating: ${foodItem.rating}/5. ${foodItem.website || ''}`,
        url: foodItem.website,
        title: foodItem.name
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
        <Text className="text-white text-xl font-bold">Food & Beverage Details</Text>
        <TouchableOpacity onPress={shareFoodItem} className="p-2">
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
              <Text className="text-2xl font-bold text-gray-800">{foodItem.name}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="location" size={16} color="#666" />
                <Text className="text-gray-600 text-sm ml-2">{foodItem.location}</Text>
              </View>
            </View>
            <View className="bg-[#E6F6F8] px-3 py-1 rounded-full flex-row items-center">
              {getCategoryIcon(foodItem.category)}
              <Text className="text-[#006D77] text-sm ml-1 font-medium">{foodItem.category}</Text>
            </View>
          </View>
          
          <View className="mt-4">
            {renderStars(foodItem.rating)}
          </View>
          
          <View className="mt-2">
            {renderPriceRange(foodItem.priceRange)}
          </View>
          
          {/* Quick Actions */}
          <View className="flex-row justify-between mt-6 mb-2">
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`tel:${foodItem.phone}`)}
            >
              <Ionicons name="call" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
              onPress={() => Linking.openURL(`mailto:${foodItem.email}`)}
            >
              <Ionicons name="mail" size={20} color="#006D77" />
              <Text className="text-[#006D77] font-medium ml-2">Email</Text>
            </TouchableOpacity>
            {foodItem.website && (
              <TouchableOpacity 
                className="flex-1 bg-[#E6F6F8] p-3 rounded-xl mx-1 flex-row items-center justify-center"
                onPress={() => Linking.openURL(foodItem.website)}
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
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Description</Text>
            <Text className="text-gray-600 text-sm leading-6 ">
              {foodItem.name} is a wonderful {foodItem.category.toLowerCase()} located in {foodItem.location}. 
              With a rating of {foodItem.rating}, it's highly recommended by visitors. This establishment offers 
              {foodItem.priceRange.length === 1 ? ' budget-friendly' : foodItem.priceRange.length === 2 ? ' moderately priced' : ' premium'} 
              options and specializes in {specialties.slice(0, 2).join(', ').toLowerCase()} and more.
            </Text>
          </View>

          {/* Operating Hours */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Operating Hours</Text>
            <View>
              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600">Monday - Thursday</Text>
                <Text className="text-gray-800 font-medium">11:00 AM - 10:00 PM</Text>
              </View>
              <View className="flex-row justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-600">Friday - Saturday</Text>
                <Text className="text-gray-800 font-medium">11:00 AM - 11:00 PM</Text>
              </View>
              <View className="flex-row justify-between py-2">
                <Text className="text-gray-600">Sunday</Text>
                <Text className="text-gray-800 font-medium">12:00 PM - 9:00 PM</Text>
              </View>
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
          <TouchableOpacity 
            className="flex-1 bg-[#006D77] p-4 rounded-xl mr-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`tel:${foodItem.phone}`)}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">Call to Reserve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-white border border-[#006D77] p-4 rounded-xl ml-2 flex-row items-center justify-center"
            onPress={() => Linking.openURL(`https://wa.me/${foodItem.phone.replace(/\D/g, '')}`)}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FoodBeverageDetails;