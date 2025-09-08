// components/HotelView1WithSafeArea.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HotelView1 from '../src/subscreens/Hotels/HotelView1';

const HotelView1WithSafeArea = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left', 'bottom']}>
      <HotelView1 {...props} />
    </SafeAreaView>
  );
};

export default HotelView1WithSafeArea;