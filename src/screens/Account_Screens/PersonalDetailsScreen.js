import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform, TextInput, Image } from 'react-native';
import { ChevronRightIcon } from 'react-native-heroicons/outline';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';

const PersonalDetailsPage = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    gender: 'Male',
    dateOfBirth: new Date('1990-01-01'),
    nationality: 'United States',
    email: 'john.doe@example.com',
    phone: '5551234567',
    countryCode: '+1',
    address: '123 Main St, New York, NY 10001'
  });

  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [tempCountryCode, setTempCountryCode] = useState('+1');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const countryData = [
    { label: 'United States', value: 'United States', code: '+1', flag: '🇺🇸' },
    { label: 'United Kingdom', value: 'United Kingdom', code: '+44', flag: '🇬🇧' },
    { label: 'Canada', value: 'Canada', code: '+1', flag: '🇨🇦' },
    { label: 'Australia', value: 'Australia', code: '+61', flag: '🇦🇺' },
    { label: 'India', value: 'India', code: '+91', flag: '🇮🇳' },
    { label: 'Germany', value: 'Germany', code: '+49', flag: '🇩🇪' },
    { label: 'France', value: 'France', code: '+33', flag: '🇫🇷' },
    { label: 'Japan', value: 'Japan', code: '+81', flag: '🇯🇵' },
    { label: 'China', value: 'China', code: '+86', flag: '🇨🇳' },
    { label: 'Brazil', value: 'Brazil', code: '+55', flag: '🇧🇷' },
    { label: 'Mexico', value: 'Mexico', code: '+52', flag: '🇲🇽' },
    { label: 'Spain', value: 'Spain', code: '+34', flag: '🇪🇸' },
    { label: 'Italy', value: 'Italy', code: '+39', flag: '🇮🇹' },
    { label: 'South Korea', value: 'South Korea', code: '+82', flag: '🇰🇷' },
    { label: 'Russia', value: 'Russia', code: '+7', flag: '🇷🇺' },
    { label: 'Sri Lanka', value: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
  ];

  const countryCodes = countryData.map(country => ({
    label: `${country.flag} ${country.code} (${country.value})`,
    value: country.code,
    flag: country.flag,
    country: country.value
  }));

  const countries = countryData.map(country => ({
    label: `${country.flag} ${country.value}`,
    value: country.value,
    flag: country.flag
  }));

  const getCurrentCountry = () => {
    return countryData.find(country => country.value === userData.nationality);
  };

  const getCurrentPhoneCountry = () => {
    return countryData.find(country => country.code === userData.countryCode);
  };

  const formatPhoneNumber = (phone) => {
    // Format as (XXX) XXX-XXXX for US numbers
    if (userData.countryCode === '+1' && phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(field === 'dateOfBirth' ? value.toISOString() : value);
    if (field === 'phone') {
      setTempCountryCode(userData.countryCode);
    }
    setIsModalVisible(true);
  };

  const handleSave = () => {
    if (tempValue.trim() === '' && editingField !== 'gender') {
      Alert.alert('Error', 'Please enter a valid value');
      return;
    }

    if (editingField === 'phone') {
      setUserData(prev => ({
        ...prev,
        phone: tempValue.replace(/\D/g, ''), // Remove non-digit characters
        countryCode: tempCountryCode
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [editingField]: editingField === 'dateOfBirth' ? new Date(tempValue) : tempValue
      }));
    }

    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
    setTempCountryCode('+1');
    setShowDatePicker(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingField(null);
    setTempValue('');
    setTempCountryCode('+1');
    setShowDatePicker(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const RadioButton = ({ label, value, selected, onPress }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center mb-4 p-3 rounded-lg bg-gray-100"
    >
      <View className="w-6 h-6 rounded-full border-2 border-[#006D77] items-center justify-center mr-3">
        {selected && <View className="w-3 h-3 rounded-full bg-[#006D77]" />}
      </View>
      <Text className="text-gray-800 font-medium">{label}</Text>
    </TouchableOpacity>
  );

  const CountryFlag = ({ countryCode, size = 20 }) => {
    const country = countryData.find(c => c.code === countryCode);
    return (
      <Text style={{ fontSize: size }} className="mr-2">
        {country?.flag || '🏳️'}
      </Text>
    );
  };

  const NationalityFlag = ({ countryName, size = 20 }) => {
    const country = countryData.find(c => c.value === countryName);
    return (
      <Text style={{ fontSize: size }} className="mr-2">
        {country?.flag || '🏳️'}
      </Text>
    );
  };

  const renderEditModal = () => {
    if (!editingField) return null;

    return (
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={handleCancel}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropTransitionOutTiming={0}
        className="justify-center"
      >
        <View className="bg-white p-6 rounded-2xl mx-5 max-h-96">
          <Text className="text-xl font-bold text-[#006D77] mb-6">
            Edit {editingField.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </Text>

          <ScrollView className="max-h-56" showsVerticalScrollIndicator={false}>
            {editingField === 'gender' ? (
              <View className="mb-4">
                {['Male', 'Female', 'Other'].map((gender) => (
                  <RadioButton
                    key={gender}
                    label={gender}
                    value={gender}
                    selected={tempValue === gender}
                    onPress={() => setTempValue(gender)}
                  />
                ))}
              </View>
            ) : editingField === 'dateOfBirth' ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="bg-gray-100 p-4 rounded-lg mb-4"
                >
                  <Text className="text-gray-700">
                    {tempValue ? formatDate(new Date(tempValue)) : 'Select date'}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={tempValue ? new Date(tempValue) : new Date()}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        setTempValue(selectedDate.toISOString());
                        setShowDatePicker(false);
                      }
                    }}
                  />
                )}
              </>
            ) : editingField === 'nationality' ? (
              <View className="border border-gray-300 rounded-lg mb-6 bg-white">
                <RNPickerSelect
                  onValueChange={(value) => setTempValue(value)}
                  items={countries}
                  value={tempValue}
                  placeholder={{}}
                  style={{
                    inputIOS: {
                      
                      color: '#374151',
                      fontSize: 16,
                    },
                    inputAndroid: {
                      
                      color: '#374151',
                      fontSize: 16,
                    },
                  }}
                  
                />
              </View>
            ) : editingField === 'phone' ? (
              <View className="mb-6">
                <View className="flex-row items-center mb-4">
                  <View className="w-32 mr-3 border border-gray-300 rounded-lg bg-white">
                    <RNPickerSelect
                      onValueChange={(value) => setTempCountryCode(value)}
                      items={countryCodes}
                      value={tempCountryCode}
                      placeholder={{}}
                      style={{
                        inputIOS: {
                          
                          color: '#374151',
                          fontSize: 16,
                          paddingRight: 30,
                        },
                        inputAndroid: {
                          
                          color: '#374151',
                          fontSize: 16,
                          paddingRight: 30,
                        },
                      }}
                      
                    />
                  </View>
                  <TextInput
                    value={tempValue}
                    onChangeText={setTempValue}
                    className="flex-1 border border-gray-300 rounded-lg p-4 text-gray-700"
                    placeholder="Phone number"
                    keyboardType="phone-pad"
                    autoFocus
                  />
                </View>
                <Text className="text-sm text-gray-500">
                  Example: {tempCountryCode} {tempCountryCode === '+1' ? '(555) 123-4567' : '5551234567'}
                </Text>
              </View>
            ) : editingField === 'email' ? (
              <View className="mb-6">
                <TextInput
                  value={tempValue}
                  onChangeText={setTempValue}
                  className="border border-gray-300 rounded-lg p-4 mb-3 text-gray-700"
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoFocus
                />
                <Text className="text-sm text-gray-500">
                  We'll send a verification link to this email address
                </Text>
              </View>
            ) : (
              <TextInput
                value={tempValue}
                onChangeText={setTempValue}
                className="border border-gray-300 rounded-lg p-4 mb-6 text-gray-700"
                placeholder={`Enter ${editingField}`}
                autoFocus
              />
            )}
          </ScrollView>

          <View className="flex-row justify-end gap-2 space-x-4 pt-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleCancel}
              className="px-6 py-3 bg-gray-300 rounded-full"
            >
              <Text className="text-gray-700 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              className="px-6 py-3 bg-[#006D77] rounded-full"
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const DetailCard = ({ label, value, field, flag = null }) => (
    <TouchableOpacity
      onPress={() => handleEdit(field, value)}
      className="bg-white rounded-2xl p-5 mb-4 shadow-lg shadow-black/5 active:bg-[#E6F6F8]"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-sm text-gray-500 font-medium mb-2">{label}</Text>
          <View className="flex-row items-center">
            {flag && <Text className="text-lg mr-2">{flag}</Text>}
            <Text className="text-lg text-gray-800 font-semibold">
              {field === 'dateOfBirth' ? formatDate(value) : value}
            </Text>
          </View>
        </View>
        <ChevronRightIcon size={22} color="#006D77" />
      </View>
    </TouchableOpacity>
  );

  const ContactDetailItem = ({ label, value, field, isVerified = false, phoneCode = null, flag = null }) => (
    <TouchableOpacity
      onPress={() => handleEdit(field, value)}
      className="py-4 active:bg-[#E6F6F8]"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-sm text-gray-500 font-medium mb-2">{label}</Text>
          {phoneCode ? (
            <View className="flex-row items-center">
              <Text className="text-lg mr-2">{flag}</Text>
              <Text className="text-gray-600 mr-2">{phoneCode}</Text>
              <Text className="text-lg text-gray-800 font-semibold">{formatPhoneNumber(value)}</Text>
            </View>
          ) : (
            <View className="flex-row items-center">
              {flag && <Text className="text-lg mr-2">{flag}</Text>}
              <Text className="text-lg text-gray-800 font-semibold">{value}</Text>
            </View>
          )}
          {isVerified && (
            <View className="flex-row items-center mt-1">
              <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              <Text className="text-green-600 text-sm">Verified</Text>
            </View>
          )}
        </View>
        <ChevronRightIcon size={22} color="#006D77" />
      </View>
    </TouchableOpacity>
  );

  const currentCountry = getCurrentCountry();
  const currentPhoneCountry = getCurrentPhoneCountry();

  return (
    <View className="flex-1 bg-gray-10">
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
          <Text className="text-gray-600">Manage your personal information</Text>
        </View>

        <DetailCard label="Full Name" value={userData.name} field="name" />
        <DetailCard label="Gender" value={userData.gender} field="gender" />
        <DetailCard label="Date of Birth" value={userData.dateOfBirth} field="dateOfBirth" />
        <DetailCard 
          label="Nationality" 
          value={userData.nationality} 
          field="nationality" 
          flag={currentCountry?.flag}
        />
        
        <View className="bg-white rounded-2xl p-5 mb-10 shadow-lg shadow-black/5">
          <Text className="text-lg font-bold text-[#006D77] mb-4">Contact Details</Text>
          
          <View className="space-y-1">
            <ContactDetailItem 
              label="Email" 
              value={userData.email} 
              field="email" 
              isVerified={true} 
            />
            
            <View className="h-px bg-gray-200 my-2" />
            
            <ContactDetailItem 
              label="Phone Number" 
              value={userData.phone} 
              field="phone" 
              phoneCode={userData.countryCode}
              flag={currentPhoneCountry?.flag}
            />
            
            <View className="h-px bg-gray-200 my-2" />
            
            <ContactDetailItem 
              label="Address" 
              value={userData.address} 
              field="address" 
            />
          </View>
        </View>
      </ScrollView>

      {renderEditModal()}
    </View>
  );
};

export default PersonalDetailsPage;