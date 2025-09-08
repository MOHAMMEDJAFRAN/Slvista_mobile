import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { BellIcon, EnvelopeIcon, MegaphoneIcon, ShieldCheckIcon, ChartBarIcon, TagIcon, XMarkIcon } from 'react-native-heroicons/outline';

const EmailPreferencesPage = () => {
  const [activeTab, setActiveTab] = useState('newsletters');
  
  const [newsletterPreferences, setNewsletterPreferences] = useState({
    weeklyNewsletter: true,
    monthlyDigest: false,
    industryUpdates: true,
    tipsAndTutorials: true,
    successStories: false,
    communityHighlights: true
  });

  const [servicePreferences, setServicePreferences] = useState({
    bookingConfirmations: true,
    reservationReminders: true,
    serviceUpdates: true,
    paymentReceipts: true,
    cancellationNotices: true,
    feedbackRequests: true,
    specialOffers: false,
    appointmentReminders: true
  });

  const toggleNewsletterPreference = (preference) => {
    setNewsletterPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const toggleServicePreference = (preference) => {
    setServicePreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const PreferenceCard = ({ icon: Icon, title, description, isEnabled, onToggle, isLast = false }) => (
    <View className={`bg-white p-5 rounded-2xl shadow-lg shadow-black/5 ${!isLast && 'mb-4'}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View className="p-2 bg-blue-50 rounded-lg mr-4">
            <Icon size={24} color="#006D77" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800 mb-1">{title}</Text>
            <Text className="text-sm text-gray-600">{description}</Text>
          </View>
        </View>
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E7EB', true: '#006D77' }}
          thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
        />
      </View>
    </View>
  );

  const TabButton = ({ label, value, isActive, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-4 px-2 items-center border-b-2 ${
        isActive ? 'border-[#006D77]' : 'border-gray-200'
      }`}
    >
      <Text className={`font-semibold ${
        isActive ? 'text-[#006D77]' : 'text-gray-500'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 py-4 shadow-sm shadow-black/5">
        <Text className="text-gray-600 mt-1">Manage your email subscriptions</Text>
      </View>

      {/* Tab Navigation */}
      <View className="bg-white px-5 flex-row border-b border-gray-200">
        <TabButton
          label="Newsletters"
          value="newsletters"
          isActive={activeTab === 'newsletters'}
          onPress={() => setActiveTab('newsletters')}
        />
        <TabButton
          label="Services & Reservations"
          value="services"
          isActive={activeTab === 'services'}
          onPress={() => setActiveTab('services')}
        />
      </View>

      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        
        {activeTab === 'newsletters' ? (
          <View className="mb-8">
            <Text className="text-lg font-bold text-[#006D77] mb-4">Newsletter Subscriptions</Text>
            <Text className="text-gray-600 mb-6">Stay informed with our curated content</Text>
            
            <PreferenceCard
              icon={EnvelopeIcon}
              title="Weekly Newsletter"
              description="Get the latest updates and news every week"
              isEnabled={newsletterPreferences.weeklyNewsletter}
              onToggle={() => toggleNewsletterPreference('weeklyNewsletter')}
            />
            
            <PreferenceCard
              icon={ChartBarIcon}
              title="Monthly Digest"
              description="Comprehensive monthly summary of activities"
              isEnabled={newsletterPreferences.monthlyDigest}
              onToggle={() => toggleNewsletterPreference('monthlyDigest')}
            />
            
            <PreferenceCard
              icon={MegaphoneIcon}
              title="Industry Updates"
              description="Latest trends and developments in the industry"
              isEnabled={newsletterPreferences.industryUpdates}
              onToggle={() => toggleNewsletterPreference('industryUpdates')}
            />
            
            <PreferenceCard
              icon={BellIcon}
              title="Tips & Tutorials"
              description="Helpful guides and best practices"
              isEnabled={newsletterPreferences.tipsAndTutorials}
              onToggle={() => toggleNewsletterPreference('tipsAndTutorials')}
            />
            
            <PreferenceCard
              icon={TagIcon}
              title="Success Stories"
              description="Inspiring stories from our community"
              isEnabled={newsletterPreferences.successStories}
              onToggle={() => toggleNewsletterPreference('successStories')}
            />
            
            <PreferenceCard
              icon={BellIcon}
              title="Community Highlights"
              description="Featured members and community events"
              isEnabled={newsletterPreferences.communityHighlights}
              onToggle={() => toggleNewsletterPreference('communityHighlights')}
              isLast={true}
            />
          </View>
        ) : (
          <View className="mb-8">
            <Text className="text-lg font-bold text-[#006D77] mb-4">Service & Reservation Emails</Text>
            <Text className="text-gray-600 mb-6">Manage your service-related communications</Text>
            
            <PreferenceCard
              icon={ShieldCheckIcon}
              title="Booking Confirmations"
              description="Receive confirmation for your bookings"
              isEnabled={servicePreferences.bookingConfirmations}
              onToggle={() => toggleServicePreference('bookingConfirmations')}
            />
            
            <PreferenceCard
              icon={BellIcon}
              title="Reservation Reminders"
              description="Get reminded about upcoming reservations"
              isEnabled={servicePreferences.reservationReminders}
              onToggle={() => toggleServicePreference('reservationReminders')}
            />
            
            <PreferenceCard
              icon={MegaphoneIcon}
              title="Service Updates"
              description="Important updates about your services"
              isEnabled={servicePreferences.serviceUpdates}
              onToggle={() => toggleServicePreference('serviceUpdates')}
            />
            
            <PreferenceCard
              icon={ChartBarIcon}
              title="Payment Receipts"
              description="Receive digital copies of your payment receipts"
              isEnabled={servicePreferences.paymentReceipts}
              onToggle={() => toggleServicePreference('paymentReceipts')}
            />
            
            <PreferenceCard
              icon={XMarkIcon}
              title="Cancellation Notices"
              description="Notifications about cancellations"
              isEnabled={servicePreferences.cancellationNotices}
              onToggle={() => toggleServicePreference('cancellationNotices')}
            />
            
            <PreferenceCard
              icon={EnvelopeIcon}
              title="Feedback Requests"
              description="Share your experience with us"
              isEnabled={servicePreferences.feedbackRequests}
              onToggle={() => toggleServicePreference('feedbackRequests')}
            />
            
            <PreferenceCard
              icon={TagIcon}
              title="Special Offers"
              description="Exclusive deals and promotions"
              isEnabled={servicePreferences.specialOffers}
              onToggle={() => toggleServicePreference('specialOffers')}
            />
            
            <PreferenceCard
              icon={BellIcon}
              title="Appointment Reminders"
              description="Reminders for your scheduled appointments"
              isEnabled={servicePreferences.appointmentReminders}
              onToggle={() => toggleServicePreference('appointmentReminders')}
              isLast={true}
            />
          </View>
        )}

        {/* Footer Info */}
        <View className="bg-blue-50 p-4 mb-10 rounded-xl">
          <Text className="text-sm text-gray-700 text-center">
            💡 Your preferences are automatically saved. Changes take effect immediately.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default EmailPreferencesPage;