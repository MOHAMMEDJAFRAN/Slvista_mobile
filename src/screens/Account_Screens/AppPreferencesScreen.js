import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, Modal } from 'react-native';
import { ChevronRightIcon, QuestionMarkCircleIcon, ShieldCheckIcon, DocumentTextIcon, AcademicCapIcon } from 'react-native-heroicons/outline';

const AppPreferencesPage = () => {
  const [settings, setSettings] = useState({
    language: 'English',
    currency: 'USD',
    units: 'metric',
    temperature: 'celsius',
    appearance: 'light'
  });

  const handleSelection = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const openExternalLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open link');
    }
  };

  const SettingSection = ({ title, children }) => (
    <View className="mb-6">
      <Text className="text-lg font-bold text-[#006D77] mb-3">{title}</Text>
      {children}
    </View>
  );

  const SettingItem = ({ label, value, onPress, isLast = false }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row justify-between items-center py-4 ${!isLast && 'border-b border-gray-200'}`}
    >
      <Text className="text-gray-800 font-medium">{label}</Text>
      <View className="flex-row items-center">
        <Text className="text-gray-600 mr-2">{value}</Text>
        <ChevronRightIcon size={20} color="#666" />
      </View>
    </TouchableOpacity>
  );

  const AboutItem = ({ icon: Icon, title, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center py-4 border-b border-gray-200"
    >
      <Icon size={22} color="#006D77" className="mr-3" />
      <Text className="text-gray-800 font-medium flex-1">{title}</Text>
      <ChevronRightIcon size={20} color="#666" />
    </TouchableOpacity>
  );

  const LanguageModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 justify-center items-center bg-black/50"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-xl font-bold text-[#006D77] mb-6">Select Language</Text>
          {['English', 'Tamil', 'Sinhala'].map((language) => (
            <TouchableOpacity
              key={language}
              onPress={() => {
                handleSelection('language', language);
                onClose();
              }}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-lg ${settings.language === language ? 'text-[#006D77] font-bold' : 'text-gray-800'}`}>
                {language}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const CurrencyModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 justify-center items-center bg-black/50"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-xl font-bold text-[#006D77] mb-6">Select Currency</Text>
          {[
            { code: 'USD', name: 'US Dollar', symbol: '$' },
            { code: 'LKR', name: 'Sri Lankan Rupees', symbol: 'LKR' },
            { code: 'EUR', name: 'Euro', symbol: '€' },
            { code: 'GBP', name: 'British Pounds', symbol: '£' },
            { code: 'INR', name: 'Indian Rupees', symbol: '₹' }
          ].map((currency) => (
            <TouchableOpacity
              key={currency.code}
              onPress={() => {
                handleSelection('currency', currency.code);
                onClose();
              }}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-lg ${settings.currency === currency.code ? 'text-[#006D77] font-bold' : 'text-gray-800'}`}>
                {currency.symbol} - {currency.name} ({currency.code})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const UnitsModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 justify-center items-center bg-black/50"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-xl font-bold text-[#006D77] mb-6">Select Units</Text>
          {[
            { value: 'metric', label: 'Metric (km, m)' },
            { value: 'imperial', label: 'Imperial (miles, ft)' }
          ].map((unit) => (
            <TouchableOpacity
              key={unit.value}
              onPress={() => {
                handleSelection('units', unit.value);
                onClose();
              }}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-lg ${settings.units === unit.value ? 'text-[#006D77] font-bold' : 'text-gray-800'}`}>
                {unit.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const TemperatureModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 justify-center items-center bg-black/50"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-xl font-bold text-[#006D77] mb-6">Select Temperature Unit</Text>
          {[
            { value: 'celsius', label: 'Celsius (°C)' },
            { value: 'fahrenheit', label: 'Fahrenheit (°F)' }
          ].map((temp) => (
            <TouchableOpacity
              key={temp.value}
              onPress={() => {
                handleSelection('temperature', temp.value);
                onClose();
              }}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-lg ${settings.temperature === temp.value ? 'text-[#006D77] font-bold' : 'text-gray-800'}`}>
                {temp.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const AppearanceModal = ({ isVisible, onClose }) => (
    <Modal visible={isVisible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity 
        className="flex-1 justify-center items-center bg-black/50"
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View className="bg-white p-6 rounded-2xl w-80">
          <Text className="text-xl font-bold text-[#006D77] mb-6">Select Appearance</Text>
          {['light', 'dark'].map((theme) => (
            <TouchableOpacity
              key={theme}
              onPress={() => {
                handleSelection('appearance', theme);
                onClose();
              }}
              className="py-4 border-b border-gray-200 last:border-b-0"
            >
              <Text className={`text-lg capitalize ${settings.appearance === theme ? 'text-[#006D77] font-bold' : 'text-gray-800'}`}>
                {theme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const [modalVisible, setModalVisible] = useState(null);

  const openModal = (modalName) => setModalVisible(modalName);
  const closeModal = () => setModalVisible(null);

  const getCurrencySymbol = (code) => {
    const symbols = {
      USD: '$',
      LKR: 'LKR',
      EUR: '€',
      GBP: '£',
      INR: '₹'
    };
    return symbols[code] || code;
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        
        {/* Device Settings Section */}
        <SettingSection title="Device Settings">
          <View className="bg-white rounded-2xl p-5 shadow-lg shadow-black/5">
            <SettingItem
              label="Language"
              value={settings.language}
              onPress={() => openModal('language')}
            />
            <SettingItem
              label="Currency"
              value={`${getCurrencySymbol(settings.currency)} (${settings.currency})`}
              onPress={() => openModal('currency')}
            />
            <SettingItem
              label="Units"
              value={settings.units === 'metric' ? 'Metric (km, m)' : 'Imperial (miles, ft)'}
              onPress={() => openModal('units')}
            />
            <SettingItem
              label="Temperature"
              value={settings.temperature === 'celsius' ? 'Celsius (°C)' : 'Fahrenheit (°F)'}
              onPress={() => openModal('temperature')}
            />
            <SettingItem
              label="Appearance"
              value={settings.appearance.charAt(0).toUpperCase() + settings.appearance.slice(1)}
              onPress={() => openModal('appearance')}
              isLast={true}
            />
          </View>
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <View className="bg-white gap-1 rounded-2xl p-5 shadow-lg shadow-black/5">
            <AboutItem
              icon={ShieldCheckIcon}
              title="Privacy Policy"
              onPress={() => openExternalLink('https://yourapp.com/privacy')}
            />
            <AboutItem
              icon={DocumentTextIcon}
              title="Cancellation Policy"
              onPress={() => openExternalLink('https://yourapp.com/cancellation')}
            />
            <AboutItem
              icon={QuestionMarkCircleIcon}
              title="FAQs"
              onPress={() => openExternalLink('https://yourapp.com/faq')}
            />
            <AboutItem
              icon={DocumentTextIcon}
              title="Terms and Conditions"
              onPress={() => openExternalLink('https://yourapp.com/terms')}
            />
            <AboutItem
              icon={AcademicCapIcon}
              title="Open Source Licenses"
              onPress={() => openExternalLink('https://yourapp.com/licenses')}
            />
            <View className="py-4">
              <Text className="text-gray-600 text-sm">App Version</Text>
              <Text className="text-gray-800 font-medium">v1.0.1</Text>
            </View>
          </View>
        </SettingSection>

      </ScrollView>

      {/* Modals */}
      {modalVisible === 'language' && (
        <LanguageModal isVisible={true} onClose={closeModal} />
      )}
      {modalVisible === 'currency' && (
        <CurrencyModal isVisible={true} onClose={closeModal} />
      )}
      {modalVisible === 'units' && (
        <UnitsModal isVisible={true} onClose={closeModal} />
      )}
      {modalVisible === 'temperature' && (
        <TemperatureModal isVisible={true} onClose={closeModal} />
      )}
      {modalVisible === 'appearance' && (
        <AppearanceModal isVisible={true} onClose={closeModal} />
      )}
    </View>
  );
};

export default AppPreferencesPage;