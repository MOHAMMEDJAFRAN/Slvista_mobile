import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, PanResponder, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PriceRangeSlider from './PriceRangeSlider';

const RoomFilter = ({
  visible,
  onClose,
  filters,
  onFilterChange,
  onPriceRangeChange,
  roomTypeOptions,
  bedTypeOptions,
  viewTypeOptions,
  amenitiesOptions,
  accessibilityOptions,
  toggleFilter,
  resetAllFilters
}) => {
  const [panY, setPanY] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.80;

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
            <Text className="text-lg font-bold text-gray-800">Room Filters</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={25} color="#006D77" />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={true} className="mb-2" scrollEnabled={panY === 0}>
            {/* Price Range Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Price per night ($)</Text>
              <PriceRangeSlider 
                min={50} 
                max={500} 
                values={filters.priceRange} 
                onValuesChange={onPriceRangeChange} 
              />
            </View>
            
            {/* Room Type Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Room Type</Text>
              <View className="flex-row flex-wrap">
                {roomTypeOptions.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('roomType', type)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.roomType.includes(type) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.roomType.includes(type) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Bed Type Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Bed Type</Text>
              <View className="flex-row flex-wrap">
                {bedTypeOptions.map((type) => (
                  <TouchableOpacity 
                    key={type}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('bedType', type)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.bedType.includes(type) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.bedType.includes(type) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* View Type Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">View Type</Text>
              <View className="flex-row flex-wrap">
                {viewTypeOptions.map((view) => (
                  <TouchableOpacity 
                    key={view}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('viewType', view)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.viewType.includes(view) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.viewType.includes(view) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{view}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Amenities Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Amenities</Text>
              <View className="flex-row flex-wrap">
                {amenitiesOptions.map((amenity) => (
                  <TouchableOpacity 
                    key={amenity}
                    className="flex-row items-center py-1 w-1/2"
                    onPress={() => toggleFilter('amenities', amenity)}
                  >
                    <View className={`w-4 h-4 rounded-full border-2 mr-2 flex items-center justify-center 
                      ${filters.amenities.includes(amenity) ? 'border-cyan-700 bg-cyan-700' : 'border-gray-300'}`}>
                      {filters.amenities.includes(amenity) && (
                        <Ionicons name="checkmark" size={10} color="white" />
                      )}
                    </View>
                    <Text className="text-gray-700 text-sm">{amenity}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Accessibility Filter */}
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-800 mb-2">Accessibility</Text>
              <View className="flex-row flex-wrap">
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

export default RoomFilter;