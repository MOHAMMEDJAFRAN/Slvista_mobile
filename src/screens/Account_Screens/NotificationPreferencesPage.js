import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

const NotificationPreferencesPage = () => {
  const [activeTab, setActiveTab] = useState('updates');
  
  const [updatesPreferences, setUpdatesPreferences] = useState({
    upcomingDeals: true,
    travelIdeas: true,
    gettingAround: false,
    priceAlerts: true,
    destinationTips: true,
    seasonalOffers: false
  });

  const [bookingsPreferences, setBookingsPreferences] = useState({
    bookingStatus: true,
    checkInReminders: true,
    itineraryUpdates: true,
    directMessages: true,
    reviewReminders: true,
    cancellationAlerts: true,
    paymentUpdates: true,
    specialRequests: true
  });

  const [pushNotifications, setPushNotifications] = useState(true);

  const toggleUpdatesPreference = (preference) => {
    setUpdatesPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const toggleBookingsPreference = (preference) => {
    setBookingsPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const togglePushNotifications = () => {
    setPushNotifications(prev => !prev);
  };

  const PreferenceCard = ({ icon: IconComponent, iconName, title, description, isEnabled, onToggle, isLast = false }) => (
    <View style={{backgroundColor: 'white', padding: 16, borderRadius: 12, marginBottom: isLast ? 0 : 12, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <View style={{marginRight: 12}}>
            <IconComponent name={iconName} size={20} color="#006D77" />
          </View>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 2}}>{title}</Text>
            <Text style={{fontSize: 13, color: '#6B7280', lineHeight: 16}}>{description}</Text>
          </View>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#006D77' }}
          thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
          disabled={!pushNotifications}
        />
      </View>
    </View>
  );

  const TabButton = ({ label, value, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{flex: 1, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: isActive ? '#006D77' : '#E5E7EB'}}
    >
      <Text style={{fontWeight: '600', fontSize: 13, color: isActive ? '#006D77' : '#6B7280'}}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, backgroundColor: '#F9FAFB'}}>
      {/* Header */}
      <View style={{backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 16, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2}}>
        
        <Text style={{color: '#6B7280', marginTop: 4, fontSize: 13}}>Customize your notification experience</Text>
      </View>

      {/* Push Notifications Toggle */}
      <View style={{backgroundColor: 'white', paddingHorizontal: 20, paddingVertical: 14, marginBottom: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Icon name="notifications" size={20} color="#006D77" />
            <View style={{marginLeft: 12}}>
              <Text style={{fontSize: 15, fontWeight: '600', color: '#374151'}}>Push Notifications</Text>
              <Text style={{fontSize: 13, color: '#6B7280'}}>Enable or disable all notifications</Text>
            </View>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={togglePushNotifications}
            trackColor={{ false: '#E5E7EB', true: '#006D77' }}
            thumbColor={pushNotifications ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={{backgroundColor: 'white', paddingHorizontal: 16, flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB'}}>
        <TabButton
          label="Updates & Offers"
          value="updates"
          isActive={activeTab === 'updates'}
          onPress={() => setActiveTab('updates')}
        />
        <TabButton
          label="Your Bookings"
          value="bookings"
          isActive={activeTab === 'bookings'}
          onPress={() => setActiveTab('bookings')}
        />
      </View>

      <ScrollView style={{flex: 1, padding: 16}} showsVerticalScrollIndicator={false}>
        
        {activeTab === 'updates' ? (
          <View style={{marginBottom: 24}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#006D77', marginBottom: 12}}>Updates & Offers</Text>
            <Text style={{color: '#6B7280', marginBottom: 16, fontSize: 13}}>Stay informed about deals and travel inspiration</Text>
            
            <PreferenceCard
              icon={Icon}
              iconName="local-offer"
              title="Upcoming Deals"
              description="Exclusive offers and limited-time discounts"
              isEnabled={updatesPreferences.upcomingDeals && pushNotifications}
              onToggle={() => toggleUpdatesPreference('upcomingDeals')}
            />
            
            <PreferenceCard
              icon={Icon2}
              iconName="airplane"
              title="Travel Ideas"
              description="Inspiration for your next adventure"
              isEnabled={updatesPreferences.travelIdeas && pushNotifications}
              onToggle={() => toggleUpdatesPreference('travelIdeas')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="directions"
              title="Getting Around"
              description="Transportation tips and local guidance"
              isEnabled={updatesPreferences.gettingAround && pushNotifications}
              onToggle={() => toggleUpdatesPreference('gettingAround')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="attach-money"
              title="Price Alerts"
              description="Notifications when prices drop for your saved trips"
              isEnabled={updatesPreferences.priceAlerts && pushNotifications}
              onToggle={() => toggleUpdatesPreference('priceAlerts')}
            />
            
            <PreferenceCard
              icon={Icon2}
              iconName="beach"
              title="Destination Tips"
              description="Local insights and hidden gems"
              isEnabled={updatesPreferences.destinationTips && pushNotifications}
              onToggle={() => toggleUpdatesPreference('destinationTips')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="ac-unit"
              title="Seasonal Offers"
              description="Special deals for holidays and seasons"
              isEnabled={updatesPreferences.seasonalOffers && pushNotifications}
              onToggle={() => toggleUpdatesPreference('seasonalOffers')}
              isLast={true}
            />
          </View>
        ) : (
          <View style={{marginBottom: 24}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#006D77', marginBottom: 12}}>Your Bookings</Text>
            <Text style={{color: '#6B7280', marginBottom: 16, fontSize: 13}}>Manage notifications for your trips and reservations</Text>
            
            <PreferenceCard
              icon={Icon}
              iconName="confirmation-number"
              title="Booking Status"
              description="Updates on reservation confirmations and changes"
              isEnabled={bookingsPreferences.bookingStatus && pushNotifications}
              onToggle={() => toggleBookingsPreference('bookingStatus')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="access-time"
              title="Check-in Reminders"
              description="Notifications before your check-in time"
              isEnabled={bookingsPreferences.checkInReminders && pushNotifications}
              onToggle={() => toggleBookingsPreference('checkInReminders')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="event"
              title="Itinerary Updates"
              description="Changes to your travel plans"
              isEnabled={bookingsPreferences.itineraryUpdates && pushNotifications}
              onToggle={() => toggleBookingsPreference('itineraryUpdates')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="message"
              title="Direct Messages"
              description="Messages from hosts and service providers"
              isEnabled={bookingsPreferences.directMessages && pushNotifications}
              onToggle={() => toggleBookingsPreference('directMessages')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="star"
              title="Review Reminders"
              description="Prompt to review after your experience"
              isEnabled={bookingsPreferences.reviewReminders && pushNotifications}
              onToggle={() => toggleBookingsPreference('reviewReminders')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="cancel"
              title="Cancellation Alerts"
              description="Notifications about cancelled bookings"
              isEnabled={bookingsPreferences.cancellationAlerts && pushNotifications}
              onToggle={() => toggleBookingsPreference('cancellationAlerts')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="payment"
              title="Payment Updates"
              description="Billing and payment notifications"
              isEnabled={bookingsPreferences.paymentUpdates && pushNotifications}
              onToggle={() => toggleBookingsPreference('paymentUpdates')}
            />
            
            <PreferenceCard
              icon={Icon}
              iconName="card-giftcard"
              title="Special Requests"
              description="Updates on your special requirements"
              isEnabled={bookingsPreferences.specialRequests && pushNotifications}
              onToggle={() => toggleBookingsPreference('specialRequests')}
              isLast={true}
            />
          </View>
        )}

        {/* Footer Info */}
        <View style={{backgroundColor: '#E6F6F8', padding: 12, borderRadius: 10, marginBottom: 35}}>
          <Text style={{fontSize: 13, color: '#374151', textAlign: 'center'}}>
            🔔 Notifications help you stay updated without checking the app constantly
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default NotificationPreferencesPage;