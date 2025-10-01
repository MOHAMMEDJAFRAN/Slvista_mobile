import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
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
import TransportDetails from '~/screens/Listing_screen/ListingDetailsScreens/TransportDetails';
import ActivityDetails from '~/screens/Listing_screen/ListingDetailsScreens/ActivityDetails';
import FoodBeverageDetails from '~/screens/Listing_screen/ListingDetailsScreens/FoodBeverageDetails';
import EventDetails from '~/screens/Listing_screen/ListingDetailsScreens/EventDetails';
import ArtistDetails from '~/screens/Listing_screen/ListingDetailsScreens/ArtistDetails';
import ShoppingDetails from '~/screens/Listing_screen/ListingDetailsScreens/ShoppingDetails';
import GuideDetails from '~/screens/Listing_screen/ListingDetailsScreens/GuideDetails';
import ServiceDetails from '~/screens/Listing_screen/ListingDetailsScreens/ServiceDetails';
import AddCardPayment from '~/screens/Account_Screens/Payment_method';
import PersonalDetailsScreen from '~/screens/Account_Screens/PersonalDetailsScreen';
import AppPreferencesPage from '~/screens/Account_Screens/AppPreferencesScreen';
import EmailPreferencesPage from '~/screens/Account_Screens/EmailPreferencesPage';
import NotificationPreferencesPage from '~/screens/Account_Screens/NotificationPreferencesPage';
import MyReviews from '~/screens/Account_Screens/MyReviews';
import PrivacyAndData from '~/screens/Account_Screens/PrivacyAndDataManagement';
import Guidelines from '~/screens/Account_Screens/ContentGuidelines';
import CustomerSupport from '~/screens/Account_Screens/CustomerSupport';
import ListProperty from '~/screens/Account_Screens/ListYourProperty';

import HotelView1WithSafeArea from './components/HotelView1WithSafeArea';
import HomeView2 from '~/subscreens/HomeStays/HomeView2';
import CustomerDetailsHotel from '~/subscreens/Hotels/CustomerDetailsHotel';
import CustomerDetailsHome from '~/subscreens/HomeStays/CustomerDetailsHome';
import PaymentDetailsHotel from '~/subscreens/Hotels/PaymentDetailsHotel';
import PaymentDetailsHome from '~/subscreens/HomeStays/PaymentDetailsHome';
import BookingConfirmationHome from '~/subscreens/HomeStays/BookingConfirmationHome';
import BookingConfirmationHotel from '~/subscreens/Hotels/BookingConfirmationHotel';
import Activity from '~/subscreens/SecondListings/Activity';
import FoodAndBeverage from '~/subscreens/SecondListings/FoodAndBeverage';
import HomeListing from '~/subscreens/HomeStays/HomeListing';
import RoomDetails from '~/subscreens/Hotels/RoomDetails';
import HotelsListing from '~/subscreens/Hotels/HotelsListing';
import ActivityDetailsView from '~/subscreens/SecondListings/ActivityDetailsView.js';
import FoodListing from '~/subscreens/SecondListings/FoodAndBeverage';
import FoodDetailsView from '~/subscreens/SecondListings/FoodDetaisView';
import Transport from '~/subscreens/SecondListings/Transport';
import TransportDetailsView from '~/subscreens/SecondListings/TransportDetailsView';

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

  TransportDetails: undefined;
  ActivityDetails: undefined;
  FoodBeverageDetails: undefined
  EventDetails:undefined;
  ArtistDetails: undefined;
  ShoppingDetails: undefined;
  GuideDetails: undefined;
  ServiceDetails: undefined;

  AddCardPayment: undefined;
  PersonalDetailsScreen: undefined;
  AppPreferencesPage: undefined;
  EmailPreferencesPage: undefined;
  NotificationPreferencesPage: undefined;
  MyReviews: undefined;
  PrivacyAndData: undefined;
  Guidelines: undefined;
  CustomerSupport: undefined;
  ListProperty: undefined;

  HotelView1WithSafeArea: undefined; 
  RoomDetails: undefined;
  CustomerDetailsHotel: undefined;
  CustomerDetailsHome: undefined;
  PaymentDetailsHotel: undefined;
  PaymentDetailsHome: undefined;
  BookingConfirmationHotel: undefined;
  BookingConfirmationHome: undefined;
  Activity:undefined;
  FoodAndBeverage:undefined;
  HomeListing:undefined;
  HomeView2:undefined;
  HotelsListing: undefined;
  ActivityDetailsView:undefined;
  FoodListing: undefined;
  FoodDetailsView: undefined;
  Transport: undefined;
  TransportDetailsView: undefined;
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

// Internet Connection Error Component
const ConnectionError = () => (
  <View style={styles.connectionError}>
    <Ionicons name="wifi-outline" size={64} color="#9CA3AF" />
    <Text style={styles.errorTitle}>No Internet Connection</Text>
    <Text style={styles.errorMessage}>
      Please check your internet connection and try again.
    </Text>
  </View>
);

// Create a SafeAreaWrapper component for individual screens
const SafeAreaWrapper = ({ children, showConnectionError = false }: { children: React.ReactNode; showConnectionError?: boolean }) => (
  <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left', 'bottom']}>
    {showConnectionError ? <ConnectionError /> : children}
  </SafeAreaView>
);

// Wrapper components for each tab screen with SafeAreaWrapper and connection check
const HomeWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <Home />
  </SafeAreaWrapper>
);

const ExploreWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <Explore />
  </SafeAreaWrapper>
);

const SavedWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <Saved />
  </SafeAreaWrapper>
);

const BookingsWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <Bookings />
  </SafeAreaWrapper>
);

const AccountWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
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

const SponsoredStaysWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <SponsoredStaysScreen />
  </SafeAreaWrapper>
);

const TransportListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <TransportListing />
  </SafeAreaWrapper>
);

const ActivitiesListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <ActivitiesListing />
  </SafeAreaWrapper>
);

const FoodBeverageListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <FoodBeverageListing />
  </SafeAreaWrapper>
);

const EventsListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <EventsListing />
  </SafeAreaWrapper>
);

const LocalArtistsListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <LocalArtistsListing />
  </SafeAreaWrapper>
);

const ShoppingListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <ShoppingListing />
  </SafeAreaWrapper>
);

const HotelsListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <HotelsListing />
  </SafeAreaWrapper>
);

const TourGuidesListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <TourGuidesListing />
  </SafeAreaWrapper>
);

const OtherServicesListingWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <OtherServicesListing />
  </SafeAreaWrapper>
);

const RoomDetailsWithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <RoomDetails />
  </SafeAreaWrapper>
);

const HomeView2WithSafeArea = ({ isConnected }: { isConnected: boolean }) => (
  <SafeAreaWrapper showConnectionError={!isConnected}>
    <HomeView2 />
  </SafeAreaWrapper>
);

// Bottom Tab Navigator with connection state
const BottomTabNavigator = ({ isConnected }: { isConnected: boolean }) => {
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
          height: 80,
          marginTop: -15,
          // Hide tab bar when no internet
          display: isConnected ? 'flex' : 'none',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={() => <HomeWithSafeArea isConnected={isConnected} />}
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
        component={() => <ExploreWithSafeArea isConnected={isConnected} />}
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
        component={() => <SavedWithSafeArea isConnected={isConnected} />}
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
        component={() => <BookingsWithSafeArea isConnected={isConnected} />}
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
        component={() => <AccountWithSafeArea isConnected={isConnected} />}
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

// Main component that handles the connection error screen
const MainApp = ({ isConnected }: { isConnected: boolean }) => {
  if (!isConnected) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left', 'bottom']}>
          <ConnectionError />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

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
            component={() => <BottomTabNavigator isConnected={isConnected} />}
            options={{ headerShown: false, headerBackVisible: false }} 
          />
          
          <Stack.Screen 
            name="SponsoredStaysScreen" 
            component={() => <SponsoredStaysWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          {/* Listing Screens */}
          <Stack.Screen 
            name="TransportListing" 
            component={() => <TransportListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="ActivitiesListing" 
            component={() => <ActivitiesListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="FoodBeverageListing" 
            component={() => <FoodBeverageListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="EventsListing" 
            component={() => <EventsListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="LocalArtistsListing" 
            component={() => <LocalArtistsListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="ShoppingListing" 
            component={() => <ShoppingListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="TourGuidesListing" 
            component={() => <TourGuidesListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          <Stack.Screen 
            name="OtherServicesListing" 
            component={() => <OtherServicesListingWithSafeArea isConnected={isConnected} />}
            options={{ headerShown: false }} 
          />

          {/* Listing Details Screens */}
          <Stack.Screen name="TransportDetails" component={TransportDetails} options={{ headerShown: false }}  />
          <Stack.Screen name="ActivityDetails" component={ActivityDetails} options={{ headerShown: false }} />
          <Stack.Screen name="FoodBeverageDetails" component={FoodBeverageDetails} options={{ headerShown: false }} />
          <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }} />
          <Stack.Screen name="ArtistDetails" component={ArtistDetails} options={{ headerShown: false }} />
          <Stack.Screen name="ShoppingDetails" component={ShoppingDetails} options={{ headerShown: false }}/>
          <Stack.Screen name="GuideDetails" component={GuideDetails} options={{ headerShown: false }}/>
          <Stack.Screen name="ServiceDetails" component={ServiceDetails} options={{ headerShown: false }}/>

          {/* Account pages */}
          <Stack.Screen name="AddCardPayment" component={AddCardPayment} options={{ title: 'Add Card' }}/>
          <Stack.Screen name="PersonalDetailsScreen" component={PersonalDetailsScreen} options={{ title: 'Personal Details' }}/>
          <Stack.Screen name="AppPreferencesPage" component={AppPreferencesPage} options={{ title: 'App Preferences' }}/>
          <Stack.Screen name="EmailPreferencesPage" component={EmailPreferencesPage} options={{ title: 'Email Preferences' }}/>
          <Stack.Screen name="NotificationPreferencesPage" component={NotificationPreferencesPage} options={{ title: 'Notification' }}/>
          <Stack.Screen name="MyReviews" component={MyReviews} options={{ title: 'MyReviews' }}/>
          <Stack.Screen name="PrivacyAndData" component={PrivacyAndData} options={{ title: 'Privacy And Data Management' }}/>
          <Stack.Screen name="Guidelines" component={Guidelines} options={{ title: 'Content Guidelines' }}/>
          <Stack.Screen name="CustomerSupport" component={CustomerSupport} options={{ title: 'Customer Support' }}/>
          <Stack.Screen name="ListProperty" component={ListProperty} options={{ title: 'List Your Property' }}/>

          <Stack.Screen name="HotelView1WithSafeArea" component={HotelView1WithSafeArea} options={{headerShown: false}} />
          <Stack.Screen name="RoomDetails" component={() => <RoomDetailsWithSafeArea isConnected={isConnected} />} options={{headerShown: false}}/>
          <Stack.Screen name="CustomerDetailsHotel" component={CustomerDetailsHotel} options={{headerShown: false}}/>
          <Stack.Screen name='CustomerDetailsHome' component={CustomerDetailsHome} options={{headerShown: false}}/>
          <Stack.Screen name="PaymentDetailsHotel" component={PaymentDetailsHotel} options={{headerShown: false}}/>
          <Stack.Screen name='PaymentDetailsHome' component={PaymentDetailsHome} options={{headerShown: false}}/>
          <Stack.Screen name="BookingConfirmationHotel" component={BookingConfirmationHotel} options={{headerShown: false}}/>
          <Stack.Screen name='BookingConfirmationHome' component={BookingConfirmationHome}/>
          <Stack.Screen name="Activity" component={Activity} options={{headerShown: false}}/>
          <Stack.Screen name="FoodAndBeverage" component={FoodAndBeverage}/>
          <Stack.Screen name="HomeListing" component={HomeListing} options={{headerShown: false}}/>
          <Stack.Screen name='HomeView2' component={() => <HomeView2WithSafeArea isConnected={isConnected} />} options={{headerShown: false}}/>
          <Stack.Screen name='HotelsListing' component={() => <HotelsListingWithSafeArea isConnected={isConnected} />} options={{headerShown: false}}/>
          <Stack.Screen name='ActivityDetailsView' component={ActivityDetailsView} options={{headerShown: false}}/>
          <Stack.Screen name='FoodListing' component={FoodListing} options={{headerShown: false}}/>
          <Stack.Screen name='FoodDetailsView' component={FoodDetailsView} options={{headerShown: false}}/>
          <Stack.Screen name='Transport' component={Transport} options={{headerShown: false}}/>
          <Stack.Screen name='TransportDetailsView' component={TransportDetailsView} options={{headerShown: false}}/>

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const App = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
    });

    // Get initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  // Show nothing until we know the connection status
  if (isConnected === null) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} />
      </SafeAreaProvider>
    );
  }

  return <MainApp isConnected={isConnected} />;
};

const styles = StyleSheet.create({
  connectionError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default App;