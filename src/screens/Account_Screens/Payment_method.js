import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Modal, Image } from 'react-native';
import { CreditCardInput } from 'react-native-credit-card-input';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddCardPayment = ({ navigation }) => {
  const [cardData, setCardData] = useState(null);
  const [cardholderName, setCardholderName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [detectedCardType, setDetectedCardType] = useState('unknown');
  const [showCardInfoModal, setShowCardInfoModal] = useState(false);

  // Sample saved cards data
  useEffect(() => {
    setSavedCards([
      {
        id: '1',
        number: '4242424242424242',
        expiry: '12/25',
        name: 'John Doe',
        type: 'visa',
        isDefault: true
      },
      {
        id: '2',
        number: '5555555555554444',
        expiry: '09/24',
        name: 'John Doe',
        type: 'mastercard',
        isDefault: false
      }
    ]);
  }, []);

  // Function to detect card type based on number
  const detectCardType = (number) => {
    const cleanedNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanedNumber)) {
      return 'visa';
    } else if (/^5[1-5]/.test(cleanedNumber)) {
      return 'mastercard';
    } else {
      return 'unknown';
    }
  };

  // Get card icon based on type
  const getCardIcon = (type) => {
    switch (type) {
      case 'visa':
        return 'https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png';
      case 'mastercard':
        return 'https://logos-world.net/wp-content/uploads/2023/02/Masterpass-Logo.png';
      default:
        return 'unknown';
    }
  };

  const handleCardInputChange = (formData) => {
    setCardData(formData);
    
    // Auto-detect card type and update UI accordingly
    if (formData.values.number) {
      const type = detectCardType(formData.values.number);
      setDetectedCardType(type);
    } else {
      setDetectedCardType('unknown');
    }
  };

  const validateForm = () => {
    if (!cardData || !cardData.valid) {
      Alert.alert('Error', 'Please enter valid card information');
      return false;
    }
    
    // Check if card type is supported (only Visa and Mastercard)
    const cardType = detectCardType(cardData.values.number);
    if (cardType === 'unknown') {
      Alert.alert('Error', 'Only Visa and Mastercard are accepted');
      return false;
    }
    
    if (!cardholderName.trim()) {
      Alert.alert('Error', 'Please enter cardholder name');
      return false;
    }
    return true;
  };

  const handleAddCard = () => {
    if (validateForm()) {
      const cardType = detectCardType(cardData.values.number);
      const newCard = {
        id: Date.now().toString(),
        number: cardData.values.number.replace(/\s/g, ''),
        expiry: cardData.values.expiry,
        cvc: cardData.values.cvc,
        name: cardholderName,
        type: cardType,
        isDefault: isDefault
      };

      // If setting as default, remove default status from other cards
      let updatedCards = [...savedCards];
      if (isDefault) {
        updatedCards = updatedCards.map(card => ({ ...card, isDefault: false }));
      }

      if (editingCard) {
        // Update existing card
        updatedCards = updatedCards.map(card => 
          card.id === editingCard.id ? newCard : card
        );
        setEditingCard(null);
      } else {
        // Add new card
        updatedCards.push(newCard);
      }

      setSavedCards(updatedCards);
      Alert.alert('Success', `Card ${editingCard ? 'updated' : 'added'} successfully!`);
      resetForm();
      setShowAddCardModal(false);
    }
  };

  const setDefaultCard = (cardId) => {
    const updatedCards = savedCards.map(card => ({
      ...card,
      isDefault: card.id === cardId
    }));
    setSavedCards(updatedCards);
    Alert.alert('Success', 'Default card updated successfully!');
  };

  const deleteCard = (cardId) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedCards = savedCards.filter(card => card.id !== cardId);
            setSavedCards(updatedCards);
            Alert.alert('Success', 'Card deleted successfully!');
          }
        }
      ]
    );
  };

  const editCard = (card) => {
    setEditingCard(card);
    setCardholderName(card.name);
    setIsDefault(card.isDefault);
    setDetectedCardType(card.type);
    
    // Pre-fill the credit card input (this requires a bit more work with the CreditCardInput component)
    // For simplicity, we'll just open the modal and set the editing state
    setShowAddCardModal(true);
  };

  const resetForm = () => {
    setCardData(null);
    setCardholderName('');
    setIsDefault(false);
    setEditingCard(null);
    setDetectedCardType('unknown');
  };

  const maskCardNumber = (number) => {
    if (!number) return '';
    const lastFour = number.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  const openAddCardModal = () => {
    resetForm();
    setShowAddCardModal(true);
  };

  const closeModal = () => {
    setShowAddCardModal(false);
    setEditingCard(null);
  };

  // Custom card number input component with icon
  const renderCardInput = () => {
    return (
      <View className="bg-gray-50 rounded-xl p-4 mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-700 font-medium">Card Information</Text>
          <TouchableOpacity 
            onPress={() => setShowCardInfoModal(true)}
            className="flex-row items-center"
          >
            <Icon name="help-outline" size={20} color="#3B82F6" />
            <Text className="text-blue-600 ml-1 text-sm">Supported cards</Text>
          </TouchableOpacity>
        </View>
        
        <View className="relative">
          <CreditCardInput
            onChange={handleCardInputChange}
            requiresName={false}
            cardScale={0.8}
            inputContainerStyle={{
              padding: 10,
            }}
          />
          <View className="absolute right-8 top-12">
            <Image 
              source={{ uri: getCardIcon(detectedCardType) }} 
              className="w-10 h-6"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-10">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900">Payment Methods</Text>
            <Text className="text-gray-600 mt-2">Manage your credit/debit cards</Text>
          </View>

          {/* Saved Cards List */}
          {savedCards.length > 0 ? (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Your Cards</Text>
              {savedCards.map((card) => (
                <View key={card.id} className="bg-white rounded-xl p-4 shadow-sm mb-4">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Image 
                        source={{ uri: getCardIcon(card.type) }} 
                        className="w-10 h-6 mr-3"
                        resizeMode="contain"
                      />
                      <View>
                        <Text className="text-gray-800 font-medium">
                          {maskCardNumber(card.number)}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          Expires: {card.expiry} {card.isDefault && '• Default'}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity 
                        onPress={() => editCard(card)}
                        className="p-2"
                      >
                        <Icon name="edit" size={20} color="#3B82F6" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={() => deleteCard(card.id)}
                        className="p-2 ml-2"
                      >
                        <Icon name="delete" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {!card.isDefault && (
                    <TouchableOpacity 
                      onPress={() => setDefaultCard(card.id)}
                      className="mt-3 flex-row items-center"
                    >
                      <Icon name="star-outline" size={18} color="#6B7280" />
                      <Text className="text-gray-600 ml-2">Set as default</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-white rounded-xl p-6 items-center justify-center mb-6">
              <Icon name="credit-card" size={48} color="#D1D5DB" />
              <Text className="text-gray-500 mt-3 text-center">You don't have any saved cards yet</Text>
            </View>
          )}

          {/* Add New Card Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-5 mb-6"
            onPress={openAddCardModal}
          >
            <Icon name="add" size={24} color="#3B82F6" />
            <Text className="text-blue-600 font-semibold ml-2">Add New Card</Text>
          </TouchableOpacity>

          {/* Security Info */}
          <View className="bg-blue-50 rounded-xl p-4 mb-6">
            <View className="flex-row items-start">
              <Icon name="security" size={20} color="#3B82F6" style={{ marginTop: 2, marginRight: 12 }} />
              <Text className="text-blue-800 flex-1 text-sm">
                Your card details are encrypted and securely stored. We never store your CVV.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-4/5">
            <View className="p-5 border-b border-gray-200">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl font-bold text-gray-900">
                  {editingCard ? 'Edit Card' : 'Add New Card'}
                </Text>
                <TouchableOpacity onPress={closeModal}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView className="p-5" showsVerticalScrollIndicator={false}>
              {/* Card Input with Icon */}
              {renderCardInput()}

              {/* Cardholder Name */}
              <View className="mb-5">
                <Text className="text-gray-700 font-medium mb-2">Cardholder Name</Text>
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white"
                  placeholder="Enter full name as on card"
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                />
              </View>

              {/* Set as Default */}
              <TouchableOpacity 
                className="flex-row items-center mb-6"
                onPress={() => setIsDefault(!isDefault)}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center 
                  ${isDefault ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}>
                  {isDefault && <Icon name="check" size={16} color="white" />}
                </View>
                <Text className="text-gray-700">Set as default payment method</Text>
              </TouchableOpacity>

              {/* Action Buttons */}
              <View className="flex-row px-2 gap-4 space-x-3 mb-5">
                <TouchableOpacity
                  className="flex-1 border border-gray-300 rounded-full p-4 items-center"
                  onPress={closeModal}
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded-full p-4 items-center"
                  onPress={handleAddCard}
                >
                  <Text className="text-white font-semibold">
                    {editingCard ? 'Update Card' : 'Add Card'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Supported Cards Info Modal */}
      <Modal
        visible={showCardInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCardInfoModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/70 p-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-bold text-gray-900 mb-4 text-center">Supported Cards</Text>
            <Text className="text-gray-600 mb-5 text-center">
              We accept the following card types:
            </Text>
            
            <View className="space-y-4 mb-6">
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: getCardIcon('visa') }} 
                  className="w-12 h-8 mr-4"
                  resizeMode="contain"
                />
                <Text className="text-gray-800">Visa</Text>
              </View>
              
              <View className="flex-row items-center">
                <Image 
                  source={{ uri: getCardIcon('mastercard') }} 
                  className="w-12 h-8 mr-4"
                  resizeMode="contain"
                />
                <Text className="text-gray-800">Mastercard</Text>
              </View>
            </View>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-xl p-4 items-center"
              onPress={() => setShowCardInfoModal(false)}
            >
              <Text className="text-white font-semibold">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddCardPayment;