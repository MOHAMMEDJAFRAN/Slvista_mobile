import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, Feather, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomTabBar from '../../components/BottomTabBar';

const Account = () => {
  const navigation = useNavigation();
  const [isSignedIn, setIsSignedIn] = useState(true);

  // User data with avatar - replace with your actual image path
  const user = {
    name: 'Sharah Jhon',
    email: 'shara@gmail.com',
    phone: '+947898456',
    avatar: require('../../assets/Natalie-Taylor-Head-of-Marketing-Capsule-1024x1024.jpeg'), // Update this path
  };

  const menuSections = [
    {
      title: "Payment info",
      items: [
        { 
          label: "Payment Method", 
          icon: <MaterialIcons name="payment" size={20} color="#00718F" />, 
          action: () => navigation.navigate('PaymentMethods') 
        },
      ]
    },
    {
      title: "Manage account",
      items: [
        { 
          label: "Personal details", 
          icon: <FontAwesome name="user-o" size={18} color="#00718F" />, 
          action: () => navigation.navigate('PersonalDetails') 
        },
        { 
          label: "Security settings", 
          icon: <MaterialIcons name="security" size={20} color="#00718F" />, 
          action: () => navigation.navigate('SecuritySettings') 
        },
      ]
    },
    {
      title: "Preferences",
      items: [
        { 
          label: "App preference", 
          icon: <Ionicons name="options" size={20} color="#00718F" />, 
          action: () => navigation.navigate('AppPreferences') 
        },
        { 
          label: "Email preference", 
          icon: <MaterialIcons name="email" size={20} color="#00718F" />, 
          action: () => navigation.navigate('EmailPreferences') 
        },
        { 
          label: "Notification", 
          icon: <Ionicons name="notifications-outline" size={20} color="#00718F" />, 
          action: () => navigation.navigate('NotificationSettings') 
        },
      ]
    },
    {
      title: "Travel activity",
      items: [
        { 
          label: "My reviews", 
          icon: <MaterialCommunityIcons name="star-outline" size={20} color="#00718F" />, 
          action: () => navigation.navigate('MyReviews') 
        },
      ]
    },
    {
      title: "Legal and privacy",
      items: [
        { 
          label: "Privacy and data management", 
          icon: <MaterialIcons name="privacy-tip" size={20} color="#00718F" />, 
          action: () => navigation.navigate('PrivacyPolicy') 
        },
        { 
          label: "Customer support", 
          icon: <MaterialIcons name="support-agent" size={20} color="#00718F" />, 
          action: () => navigation.navigate('CustomerSupport') 
        },
        { 
          label: "Content guidelines", 
          icon: <MaterialIcons name="description" size={20} color="#00718F" />, 
          action: () => navigation.navigate('ContentGuidelines') 
        },
      ]
    },
    {
      title: "Manage your property",
      items: [
        { 
          label: "List your property", 
          icon: <MaterialIcons name="add-business" size={20} color="#00718F" />, 
          action: () => navigation.navigate('ListProperty') 
        },
      ]
    }
  ];

  const handleEditProfile = () => navigation.navigate('EditProfile');
  const handleSignOut = () => {
    setIsSignedIn(false);
    console.log('User signed out');
  };
  const handleSignIn = () => {
    navigation.navigate('SignIn'); // Navigate to your sign-in screen
    console.log('Navigating to sign in page');
  };

  const handleMessagesPress = () => {
    navigation.navigate('Messages');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          {isSignedIn ? (
            <>
              <View style={styles.profileHeader}>
                <View style={styles.profileInfo}>
                  {user.avatar ? (
                    <Image
                      source={user.avatar}
                      style={styles.avatar}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.defaultAvatar}>
                      <MaterialIcons name="person" size={30} color="#00718F" />
                    </View>
                  )}
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userContact}>{user.email}</Text>
                    <Text style={styles.userContact}>{user.phone}</Text>
                  </View>
                </View>
                <View style={styles.headerIcons}>
                  <TouchableOpacity 
                    style={styles.iconButton}
                    onPress={handleMessagesPress}
                  >
                    <Ionicons name="chatbubble-ellipses-outline" size={25} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.iconButton, styles.notificationButton]}
                    onPress={handleNotificationsPress}
                  >
                    <Ionicons name="notifications-outline" size={25} color="white" />
                    <View style={styles.notificationBadge} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Fill Profile Card */}
              <TouchableOpacity 
                style={styles.fillProfileCard}
                onPress={handleEditProfile}
              >
                <View style={styles.fillProfileText}>
                  <Text style={styles.fillProfileTitle}>Fill your Profile</Text>
                  <Text style={styles.fillProfileSubtitle}>
                    Complete your profile and use this information for booking process
                  </Text>
                </View>
                <View style={styles.fillProfileArrow}>
                  <Feather name="arrow-right" size={30} color="white" />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.signInContainer}>
              <Text style={styles.signInTitle}>You're not signed in</Text>
              <TouchableOpacity 
                style={styles.signInButton}
                onPress={handleSignIn}
                
              >
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Menu Sections - Only show if signed in */}
        {isSignedIn && (
          <View style={styles.menuContainer}>
            {menuSections.map((section, index) => (
              <View key={`section-${index}`} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={`item-${index}-${itemIndex}`}
                    style={[
                      styles.menuItem,
                      itemIndex === section.items.length - 1 && styles.lastMenuItem
                    ]}
                    onPress={item.action}
                  >
                    <View style={styles.menuItemContent}>
                      {item.icon}
                      <Text style={styles.menuItemText}>{item.label}</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#9CA3AF" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            {/* Sign out */}
            <TouchableOpacity 
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="Account" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingBottom: 120,
  },
  header: {
    backgroundColor: '#00718F',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  defaultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  userContact: {
    fontSize: 14,
    color: 'white',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  iconButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: 'red',
    borderRadius: 4,
  },
  fillProfileCard: {
    backgroundColor: '#F3F4F6',
    marginTop: 20,
    padding: 16,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fillProfileText: {
    flex: 1,
  },
  fillProfileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 10,
  },
  fillProfileSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 10,
  },
  fillProfileArrow: {
    backgroundColor: '#00718F',
    width: 70,
    height: 70,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  menuContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
    gap: 24,
  },
  section: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  signOutButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  signInContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  signInTitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  signInButtonText: {
    color: '#00718F',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Account;