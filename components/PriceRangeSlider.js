// components/PriceRangeSlider.js
import React, { useState, useRef } from 'react';
import { View, Text, PanResponder, Dimensions } from 'react-native';

const PriceRangeSlider = ({ min, max, values, onValuesChange }) => {
  const [minValue, setMinValue] = useState(values[0]);
  const [maxValue, setMaxValue] = useState(values[1]);
  const sliderWidth = Dimensions.get('window').width - 64; // Accounting for padding
  const minThumbRef = useRef(null);
  const maxThumbRef = useRef(null);

  const totalRange = max - min;
  const minPosition = ((minValue - min) / totalRange) * 100;
  const maxPosition = ((maxValue - min) / totalRange) * 100;

  // Create pan responder for min thumb
  const minThumbPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = (gestureState.moveX / sliderWidth) * 100;
      const newValue = Math.round(min + (newPosition / 100) * totalRange);
      
      // Ensure min doesn't go below the minimum or above maxValue
      const constrainedValue = Math.max(min, Math.min(newValue, maxValue - 10));
      
      setMinValue(constrainedValue);
      onValuesChange([constrainedValue, maxValue]);
    },
    onPanResponderRelease: () => {
      // Final update after dragging
      onValuesChange([minValue, maxValue]);
    },
  });

  // Create pan responder for max thumb
  const maxThumbPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      const newPosition = (gestureState.moveX / sliderWidth) * 100;
      const newValue = Math.round(min + (newPosition / 100) * totalRange);
      
      // Ensure max doesn't go above the maximum or below minValue
      const constrainedValue = Math.min(max, Math.max(newValue, minValue + 10));
      
      setMaxValue(constrainedValue);
      onValuesChange([minValue, constrainedValue]);
    },
    onPanResponderRelease: () => {
      // Final update after dragging
      onValuesChange([minValue, maxValue]);
    },
  });

  return (
    <View className="mb-6 px-6">
      <View className="flex-row justify-between mb-4">
        <Text className="text-gray-600 font-medium">${minValue}</Text>
        <Text className="text-gray-600 font-medium">${maxValue}</Text>
      </View>
      
      {/* Slider Track */}
      <View className="relative h-10 mb-2 justify-center">
        <View className="absolute h-2 bg-gray-300 rounded-full w-full" />
        <View 
          className="absolute h-2 bg-cyan-600 rounded-full" 
          style={{ left: `${minPosition}%`, width: `${maxPosition - minPosition}%` }}
        />
        
        {/* Min Thumb */}
        <View
          ref={minThumbRef}
          className="absolute w-6 h-6 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
          style={{ 
            left: `${minPosition}%`, 
            marginLeft: -12,
            transform: [{ translateY: -12 }]
          }}
          {...minThumbPanResponder.panHandlers}
        >
          <View className="w-4 h-4 bg-cyan-700 rounded-full" />
        </View>
        
        {/* Max Thumb */}
        <View
          ref={maxThumbRef}
          className="absolute w-6 h-6 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
          style={{ 
            left: `${maxPosition}%`, 
            marginLeft: -12,
            transform: [{ translateY: -12 }]
          }}
          {...maxThumbPanResponder.panHandlers}
        >
          <View className="w-4 h-4 bg-cyan-700 rounded-full" />
        </View>
      </View>
      
      <View className="flex-row justify-between mt-1">
        <Text className="text-gray-500 text-xs">${min}</Text>
        <Text className="text-gray-500 text-xs">${max}</Text>
      </View>
    </View>
  );
};

export default PriceRangeSlider;