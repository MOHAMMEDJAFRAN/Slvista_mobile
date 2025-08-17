import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
  Account: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Create a SafeAreaWrapper component for individual screens
const SafeAreaWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaView style={{ flex: 1 }} edges={['top', 'right', 'left', 'bottom']}>
    {children}
  </SafeAreaView>
);

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="SignIn" options={{ headerShown: false }}>
            {() => (
              <SafeAreaWrapper>
                <SignInScreen />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Home" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <Home />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>
          
          <Stack.Screen name="SignUp" options={{title: 'Create Account', headerShown: false  }}>
            {() => (
              <SafeAreaWrapper>
                <SignUpScreen />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>
          
          <Stack.Screen name="SplashScreen" options={{ headerShown: false }}>
            {() => (
              <SafeAreaWrapper>
                <SplashScreen />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>
          
          <Stack.Screen name="Explore" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <Explore />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="SponsoredStaysScreen" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <SponsoredStaysScreen />
              </SafeAreaWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="Saved" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <Saved/>
              </SafeAreaWrapper>
            )}
          </Stack.Screen>


          <Stack.Screen name="Bookings" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <Bookings/>
              </SafeAreaWrapper>
            )}
          </Stack.Screen>

          <Stack.Screen name="Account" options={{ headerShown: false, headerBackVisible: false }}>
            {() => (
              <SafeAreaWrapper>
                <Account/>
              </SafeAreaWrapper>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;