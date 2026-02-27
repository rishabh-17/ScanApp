import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigation = useNavigation<any>();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    panNumber: '',
    accountNo: '',
    ifscCode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        address: user.address || '',
        panNumber: user.panNumber || '',
        accountNo: user.bankDetails?.accountNo || '',
        ifscCode: user.bankDetails?.ifscCode || '',
      });
    }
  }, [user]);

  const handleInputChange = (name: string, value: string) => {
    if (name === 'panNumber' || name === 'ifscCode') {
      value = value.toUpperCase();
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    const { name, address, panNumber, accountNo, ifscCode } = formData;
    
    // Validations
    if (!name) {
       Alert.alert('Error', 'Name is required');
       return;
    }
     if (panNumber) {
       const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
       if (!panRegex.test(panNumber)) {
         Alert.alert('Validation Error', 'Please enter a valid PAN number');
         return;
       }
     }
     if (accountNo) {
       const accountRegex = /^\d{9,18}$/;
       if (!accountRegex.test(accountNo)) {
         Alert.alert('Validation Error', 'Please enter a valid account number');
         return;
       }
     }
     if (ifscCode) {
       const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
       if (!ifscRegex.test(ifscCode)) {
         Alert.alert('Validation Error', 'Please enter a valid IFSC code');
         return;
       }
     }

    try {
      await updateProfile({
        name,
        address,
        panNumber,
        bankDetails: {
          accountNo,
          ifscCode,
        },
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Mobile (Read-only)</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={user?.mobile}
        editable={false}
      />

      <Text style={styles.label}>Center (Read-only)</Text>
      <TextInput
        style={[styles.input, styles.readOnly]}
        value={user?.center}
        editable={false}
      />

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={formData.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />

      <Text style={styles.label}>PAN Number</Text>
      <TextInput
        style={styles.input}
        value={formData.panNumber}
        onChangeText={(text) => handleInputChange('panNumber', text)}
        maxLength={10}
      />

      <Text style={styles.subTitle}>Bank Details</Text>

      <Text style={styles.label}>Account Number</Text>
      <TextInput
        style={styles.input}
        value={formData.accountNo}
        onChangeText={(text) => handleInputChange('accountNo', text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>IFSC Code</Text>
      <TextInput
        style={styles.input}
        value={formData.ifscCode}
        onChangeText={(text) => handleInputChange('ifscCode', text)}
      />

      <View style={styles.buttonContainer}>
        <Button title="Update Profile" onPress={handleUpdate} />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  readOnly: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
