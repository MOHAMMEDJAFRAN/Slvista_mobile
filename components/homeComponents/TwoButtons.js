import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


export default function TwoButtons() {
  return (
   <View className="mt-[-10] flex-row justify-between px-4 items-center" style={{ height: 100 }}>

      <TouchableOpacity className="mr-2 flex-1 items-center justify-center rounded-full bg-[#006D77] px-8 py-4">
        <Text className="font-medium text-white">Hotel&Apartments</Text>
      </TouchableOpacity>

      <TouchableOpacity className="ml-2 flex-1 items-center justify-center rounded-full bg-[#006D77] px-8 py-4">
        <Text className="font-medium text-white">Home Stays</Text>
      </TouchableOpacity>
    </View>
  );
}
