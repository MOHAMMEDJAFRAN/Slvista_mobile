import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import SignInScreen from './src/screens/signin';
import Home from './src/screens/homeScreen';
import SignUpScreen from './src/screens/SignUp';
import SplashScreen from '~/screens/SplashScreen';
import Explore from './src/screens/ExploarScreen';
import SponsoredStaysScreen from '~/subscreens/SponsoredStays';
import Saved from '~/screens/SavedScreen';
import Bookings from '~/screens/BookingScreen';
import Account from '~/screens/AccountScreen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import TransportListing from '~/screens/Listing_screen/Transport_listing';
import ActivitiesListing from '~/screens/Listing_screen/ActivitiesListing';
import FoodBeverageListing from '~/screens/Listing_screen/FoodAndBevarage';
import EventsListing from "~/screens/Listing_screen/EventsListing.js";
import LocalArtistsListing from "~/screens/Listing_screen/LocalArtistsListing.js"
import ShoppingListing from '~/screens/Listing_screen/ShoppingListing';
import TourGuidesListing from '~/screens/Listing_screen/TourGuidesListing';
import OtherServicesListing from '~/screens/Listing_screen/OtherServicesListing';

import "./global.css";

export type RootStackParamList = {
  SignIn: undefined;
  Home: undefined;
  SignUp: undefined;
  SplashScreen: undefined;
  Explore: undefined;
  SponsoredStaysScreen: undefined;
  Saved: undefined;
  Bookings: undefined;
  Account: undefined;
  Main: undefined;

  TransportListing: undefined;
  ActivitiesListing: undefined;
  FoodBeverageListing: undefined;
  EventsListing: undefined;
  LocalArtistsListing: undefined;
  ShoppingListing:undefined;
  TourGuidesListing: undefined;
  OtherServicesListing: undefined;
};

export type BottomTabParamList = {
  HomeTab: undefined;
  ExploreTab: undefined;
  SavedTab: undefined;
  BookingsTab: undefined;
  AccountTab: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Create a SafeAreaWrapper component for individual screens
const SafeAreaWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left', 'bottom']}>
    {children}
  </SafeAreaView>
);

// Wrapper components for each tab screen with SafeAreaWrapper
const HomeWithSafeArea = () => (
  <SafeAreaWrapper>
    <Home />
  </SafeAreaWrapper>
);

const ExploreWithSafeArea = () => (
  <SafeAreaWrapper>
    <Explore />
  </SafeAreaWrapper>
);

const SavedWithSafeArea = () => (
  <SafeAreaWrapper>
    <Saved />
  </SafeAreaWrapper>
);

const BookingsWithSafeArea = () => (
  <SafeAreaWrapper>
    <Bookings />
  </SafeAreaWrapper>
);

const AccountWithSafeArea = () => (
  <SafeAreaWrapper>
    <Account />
  </SafeAreaWrapper>
);

const SignInWithSafeArea = () => (
  <SafeAreaWrapper>
    <SignInScreen />
  </SafeAreaWrapper>
);

const SignUpWithSafeArea = () => (
  <SafeAreaWrapper>
    <SignUpScreen />
  </SafeAreaWrapper>
);

const SplashWithSafeArea = () => (
  <SafeAreaWrapper>
    <SplashScreen />
  </SafeAreaWrapper>
);

const SponsoredStaysWithSafeArea = () => (
  <SafeAreaWrapper>
    <SponsoredStaysScreen />
  </SafeAreaWrapper>
);

const TransportListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <TransportListing />
  </SafeAreaWrapper>
);

const ActivitiesListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <ActivitiesListing />
  </SafeAreaWrapper>
);

const FoodBeverageListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <FoodBeverageListing />
  </SafeAreaWrapper>
);

const EventsListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <EventsListing />
  </SafeAreaWrapper>
);

const LocalArtistsListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <LocalArtistsListing />
  </SafeAreaWrapper>
);

const ShoppingListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <ShoppingListing />
  </SafeAreaWrapper>
);

const TourGuidesListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <TourGuidesListing />
  </SafeAreaWrapper>
);

const OtherServicesListingWithSafeArea = () => (
  <SafeAreaWrapper>
    <OtherServicesListing />
  </SafeAreaWrapper>
);

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          paddingTop: 11,
          paddingBottom: 8,
          height: 80, // Reduced heigh
          marginTop: -15,
          
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeWithSafeArea}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={26} 
              color={focused ? '#006D77' : '#9CA3AF'} 
            />
          ),
          tabBarActiveTintColor: '#006D77',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreWithSafeArea}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'compass' : 'compass-outline'} 
              size={26} 
              color={focused ? '#006D77' : '#9CA3AF'} 
            />
          ),
          tabBarActiveTintColor: '#006D77',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedWithSafeArea}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'bookmark' : 'bookmark-outline'} 
              size={26} 
              color={focused ? '#006D77' : '#9CA3AF'} 
            />
          ),
          tabBarActiveTintColor: '#006D77',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsWithSafeArea}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons 
              name={focused ? 'notebook' : 'notebook-outline'} 
              size={26} 
              color={focused ? '#006D77' : '#9CA3AF'} 
            />
          ),
          tabBarActiveTintColor: '#006D77',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      />
      <Tab.Screen
        name="AccountTab"
        component={AccountWithSafeArea}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={26} 
              color={focused ? '#006D77' : '#9CA3AF'} 
            />
          ),
          tabBarActiveTintColor: '#006D77',
          tabBarInactiveTintColor: '#9CA3AF',
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen 
            name="SplashScreen" 
            component={SplashWithSafeArea}
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="SignIn" 
            component={SignInWithSafeArea}
            options={{ headerShown: false }} 
          />
          
          <Stack.Screen 
            name="SignUp" 
            component={SignUpWithSafeArea}
            options={{ title: 'Create Account', headerShown: false }} 
          />
          
          <Stack.Screen 
            name="Main" 
            component={BottomTabNavigator}
            options={{ headerShown: false, headerBackVisible: false }} 
          />
          
          <Stack.Screen 
            name="SponsoredStaysScreen" 
            component={SponsoredStaysWithSafeArea}
            options={{ headerShown: false }} 
          />

          {/* Listing Screens */}
          <Stack.Screen 
            name="TransportListing" 
            component={TransportListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="ActivitiesListing" 
            component={ActivitiesListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="FoodBeverageListing" 
            component={FoodBeverageListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="EventsListing" 
            component={EventsListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="LocalArtistsListing" 
            component={LocalArtistsListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="ShoppingListing" 
            component={ShoppingListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="TourGuidesListing" 
            component={TourGuidesListingWithSafeArea}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="OtherServicesListing" 
            component={OtherServicesListingWithSafeArea}
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;