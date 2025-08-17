import React from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const FilterModal = ({ 
  visible, 
  onClose, 
  onFilterSelect,
  selectedFilter 
}) => {
  const filterOptions = [
    { id: 'recommended', label: 'Recommended' },
    { id: 'price_low', label: 'Price (Low to High)' },
    { id: 'price_high', label: 'Price (High to Low)' },
    { id: 'rating', label: 'Rating (High to Low)' },
    { id: 'distance', label: 'Distance (Nearby First)' },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/30 justify-end" 
        onPress={onClose}
      >
        <View className="bg-white rounded-t-3xl p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-semibold text-gray-900">Filter Options</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Filter Options */}
          <View className="space-y-4">
            {filterOptions.map((filter) => (
              <TouchableOpacity 
                key={filter.id}
                className="flex-row items-center justify-between py-3"
                onPress={() => {
                  onFilterSelect(filter.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <Text className={`text-base ${selectedFilter === filter.id ? 'text-[#006D77] font-medium' : 'text-gray-800'}`}>
                  {filter.label}
                </Text>
                {selectedFilter === filter.id && (
                  <MaterialIcons name="check" size={20} color="#006D77" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            className="mt-6 bg-[#006D77] py-3 rounded-lg items-center"
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text className="text-white font-medium">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

export default FilterModal;