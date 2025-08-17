import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    return (
        <View className="mt-1 flex-row justify-between items-center p-6 bg-white border-b border-gray-300">
            <Text className="text-2xl font-bold text-cyan-700">Sri Lanka Vista</Text>
            <TouchableOpacity>
                <Ionicons name="notifications-outline" size={28} color="#00718F" />
            </TouchableOpacity>
        </View>
    );
};