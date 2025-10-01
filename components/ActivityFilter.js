// components/ActivityFilter.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  PanResponder,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriceRangeSlider from './PriceRangeSlider';

const ActivityFilter = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  activities = [] // Receive activities prop to generate filter options
}) => {
  const [panY, setPanY] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.80;

  // Generate filter options from actual activities data
  const generateFilterOptions = () => {
    const types = new Set();
    const cities = new Set();
    const districts = new Set();
    let minPrice = 0;
    let maxPrice = 1000;

    activities.forEach(activity => {
      if (activity.type) types.add(activity.type);
      if (activity.city) cities.add(activity.city);
      if (activity.district) districts.add(activity.district);
      
      // Update price range based on actual data
      if (activity.price) {
        minPrice = Math.min(minPrice, activity.price);
        maxPrice = Math.max(maxPrice, activity.price);
      }
    });

    return {
      typeOptions: Array.from(types).sort(),
      cityOptions: Array.from(cities).sort(),
      districtOptions: Array.from(districts).sort(),
      priceRange: [minPrice, maxPrice]
    };
  };

  const { typeOptions, cityOptions, districtOptions, priceRange } = generateFilterOptions();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 2);
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          setPanY(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          onClose();
        }
        setPanY(0);
      },
    })
  ).current;

  const toggleFilter = (category, value) => {
    const currentValues = filters[category] || [];
    if (currentValues.includes(value)) {
      onFilterChange({
        ...filters,
        [category]: currentValues.filter(item => item !== value)
      });
    } else {
      onFilterChange({
        ...filters,
        [category]: [...currentValues, value]
      });
    }
  };

  const onPriceRangeChange = (values) => {
    onFilterChange({
      ...filters,
      priceRange: values
    });
  };

  const updateRating = (value) => {
    onFilterChange({
      ...filters,
      rating: value
    });
  };

  const resetAllFilters = () => {
    onFilterChange({
      priceRange: [0, 1000],
      type: [],
      city: [],
      district: [],
      vistaVerified: false,
      rating: 0
    });
  };

  // Show count for each filter option
  const getFilterCount = (category, value) => {
    return activities.filter(activity => activity[category] === value).length;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View 
          className="bg-white rounded-t-3xl p-5"
          style={{ 
            height: modalHeight,
            transform: [{ translateY: panY }] 
          }}
        >
          <View className="items-center mb-3" {...panResponder.panHandlers}>
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Activity Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={25} color="#006D77" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={true} className="mb-2" scrollEnabled={panY === 0}>
            {/* Price Range Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Price Range ($) 
                <Text className="text-gray-500 text-sm font-normal"> ({activities.length} activities)</Text>
              </Text>
              <PriceRangeSlider 
                min={priceRange[0]} 
                max={priceRange[1]} 
                values={filters.priceRange} 
                onValuesChange={onPriceRangeChange} 
              />
              <Text className="text-center text-gray-600 text-sm mt-2">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </Text>
            </View>
            
            {/* Activity Type Filter */}
            {typeOptions.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  Activity Type ({typeOptions.length})
                </Text>
                <View className="flex-row flex-wrap">
                  {typeOptions.map((type) => (
                    <TouchableOpacity 
                      key={type}
                      className="flex-row items-center justify-between py-2 w-full"
                      onPress={() => toggleFilter('type', type)}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center 
                          ${filters.type.includes(type) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                          {filters.type.includes(type) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <Text className="text-gray-700 text-base flex-1">{type}</Text>
                      </View>
                      <Text className="text-gray-400 text-sm">
                        ({getFilterCount('type', type)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {/* City Filter */}
            {cityOptions.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  City ({cityOptions.length})
                </Text>
                <View className="flex-row flex-wrap">
                  {cityOptions.map((city) => (
                    <TouchableOpacity 
                      key={city}
                      className="flex-row items-center justify-between py-2 w-full"
                      onPress={() => toggleFilter('city', city)}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                          ${filters.city.includes(city) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                          {filters.city.includes(city) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <Text className="text-gray-700 text-base flex-1">{city}</Text>
                      </View>
                      <Text className="text-gray-400 text-sm">
                        ({getFilterCount('city', city)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {/* District Filter */}
            {districtOptions.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold text-gray-800 mb-2">
                  District ({districtOptions.length})
                </Text>
                <View className="flex-row flex-wrap">
                  {districtOptions.map((district) => (
                    <TouchableOpacity 
                      key={district}
                      className="flex-row items-center justify-between py-2 w-full"
                      onPress={() => toggleFilter('district', district)}
                    >
                      <View className="flex-row items-center flex-1">
                        <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                          ${filters.district.includes(district) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                          {filters.district.includes(district) && (
                            <Ionicons name="checkmark" size={14} color="white" />
                          )}
                        </View>
                        <Text className="text-gray-700 text-base flex-1">{district}</Text>
                      </View>
                      <Text className="text-gray-400 text-sm">
                        ({getFilterCount('district', district)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            
            {/* Vista Verified Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Verification</Text>
              <TouchableOpacity 
                className="flex-row items-center justify-between py-2"
                onPress={() => onFilterChange({
                  ...filters,
                  vistaVerified: !filters.vistaVerified
                })}
              >
                <View className="flex-row items-center flex-1">
                  <View className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center 
                    ${filters.vistaVerified ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                    {filters.vistaVerified && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-gray-700 text-base mr-2">Vista Verified Only</Text>
                    <Ionicons name="shield-checkmark" size={16} color="#10b981" />
                  </View>
                </View>
                <Text className="text-gray-400 text-sm">
                  ({activities.filter(a => a.vistaVerified).length})
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Minimum Rating Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Minimum Rating</Text>
              <View className="flex-row justify-between items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => updateRating(star)}
                    className="flex-row items-center"
                  >
                    <Ionicons 
                      name={star <= filters.rating ? "star" : "star-outline"} 
                      size={24} 
                      color={star <= filters.rating ? "#f59e0b" : "#d1d5db"} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text className="text-center text-gray-600 text-sm">
                {filters.rating > 0 ? `${filters.rating}+ stars` : "Any rating"}
              </Text>
            </View>
          </ScrollView>
          
          <TouchableOpacity 
            className="rounded-xl bg-cyan-700 py-3 mt-2"
            onPress={onClose}
          >
            <Text className="text-center text-white font-semibold">Apply Filters</Text>
          </TouchableOpacity>
          <View className="py-3 mt-2 items-center">
            <TouchableOpacity onPress={resetAllFilters}>
              <Text className="text-cyan-700 text-md">Reset all</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityFilter;