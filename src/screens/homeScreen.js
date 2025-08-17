import { View, ScrollView } from 'react-native';
import { useState } from 'react';

import Header from '../../components/homeComponents/Header';
import ListingButtons from '../../components/homeComponents/ListingButton';
import TwoButtons from '../../components/homeComponents/TwoButtons';
import HotelAndApartment from '../subscreens/HomeScreen/HotelAndApartment';
import HomeStays from '../subscreens/HomeScreen/HomeStayForm';
import Activities from '../subscreens/HomeScreen/Activities';
import Transport from '../subscreens/HomeScreen/Transport';
import Food from '../subscreens/HomeScreen/FoodAndBevarage';
import HotelCard from '../../components/homeComponents/hotelCard';
import SlideShow from '../../components/homeComponents/SlideShow';
import BottomTabBar from 'components/BottomTabBar';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('Hotels');

  const renderCategoryComponent = () => {
    switch (selectedCategory) {
      case 'Hotels':
        return <HotelAndApartment />;
      case 'Home Stays':
        return <HomeStays />;
      case 'Activities':
        return <Activities />;
      case 'Transport':
        return <Transport />;
      case 'Food':
        return <Food />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Header />

      <ScrollView className="flex-1">
        <TwoButtons />
        <SlideShow />

        <View className="border-b border-gray-300">
          <ListingButtons onSelectCategory={setSelectedCategory} />
        </View>

        {renderCategoryComponent()}

        <HotelCard />
      </ScrollView>

      <BottomTabBar activeTab="Home" />
    </View>
  );
}

export default Home;
