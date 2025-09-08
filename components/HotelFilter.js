// components/FilterComponent.js
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriceRangeSlider from './PriceRangeSlider';

const FilterComponent = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  onPriceRangeChange,
  facilitiesOptions,
  accessibilityOptions,
  sustainabilityOptions,
  paymentOptions,
  toggleFilter,
  resetAllFilters
}) => {
  const [panY, setPanY] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.80; // Reduced from 80% to 65% of screen height
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx * 2);
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging downward
        if (gestureState.dy > 0) {
          setPanY(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged more than 100 pixels, close the modal
        if (gestureState.dy > 100) {
          onClose();
        }
        // Reset position
        setPanY(0);
      },
    })
  ).current;

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
          {/* Drag handle for closing */}
          <View 
            className="items-center mb-3"
            {...panResponder.panHandlers}
          >
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>
          
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">Filters</Text>
            <View className="flex-row space-x-4">
              
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={25} color="#006D77" />
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView 
            showsVerticalScrollIndicator={true} 
            className="mb-2"
            // Prevent scroll when user is trying to close the modal
            scrollEnabled={panY === 0}
          >
            {/* Price Range Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Price per night ($)</Text>
              <PriceRangeSlider 
                min={50} 
                max={1000} 
                values={filters.priceRange} 
                onValuesChange={onPriceRangeChange} 
              />
            </View>
            
            {/* Star Rating Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Star Rating</Text>
              <View className="flex-row justify-between">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <TouchableOpacity 
                    key={stars}
                    className="items-center py-1 px-2"
                    onPress={() => toggleFilter('starRating', stars)}
                  >
                    <View className={`w-8 h-8 rounded-full border-2 mb-1 flex items-center justify-center 
                      ${filters.starRating.includes(stars) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.starRating.includes(stars) && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    <View className="flex-row">
                      {[...Array(stars)].map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color="#FFD700" />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Facilities Filter with 2 columns */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Facilities</Text>
              <View className="flex-row flex-wrap justify-between">
                {facilitiesOptions.map((facility) => (
                  <TouchableOpacity 
                    key={facility}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('facilities', facility)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.facilities.includes(facility) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.facilities.includes(facility) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{facility}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Accessibility Filter with 2 columns */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Accessibility</Text>
              <View className="flex-row flex-wrap justify-between">
                {accessibilityOptions.map((option) => (
                  <TouchableOpacity 
                    key={option}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('accessibility', option)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.accessibility.includes(option) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.accessibility.includes(option) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Sustainability Filter with 2 columns */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Sustainability</Text>
              <View className="flex-row flex-wrap justify-between">
                {sustainabilityOptions.map((option) => (
                  <TouchableOpacity 
                    key={option}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('sustainability', option)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.sustainability.includes(option) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.sustainability.includes(option) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Payment Options Filter with 2 columns */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Payment Options</Text>
              <View className="flex-row flex-wrap justify-between">
                {paymentOptions.map((option) => (
                  <TouchableOpacity 
                    key={option}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('paymentOptions', option)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.paymentOptions.includes(option) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.paymentOptions.includes(option) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
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

export default FilterComponent;