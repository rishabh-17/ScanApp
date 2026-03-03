import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    password: '',
    center: '',
    address: '',
    panNumber: '',
    accountNo: '',
    ifscCode: '',
  });

  const { register } = useAuth();
  const navigation = useNavigation<any>();

  const handleInputChange = (name: string, value: string) => {
    if (name === 'panNumber' || name === 'ifscCode') value = value.toUpperCase();
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const { name, mobile, password, center, panNumber, accountNo, ifscCode } = formData;

    if (!name || !mobile || !password || !center) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      Alert.alert('Validation Error', 'Invalid PAN format');
      return false;
    }

    if (accountNo && !/^\d{9,18}$/.test(accountNo)) {
      Alert.alert('Validation Error', 'Invalid account number');
      return false;
    }

    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifscCode)) {
      Alert.alert('Validation Error', 'Invalid IFSC');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    try {
      const { name, mobile, password, center, address, panNumber, accountNo, ifscCode } = formData;

      await register({
        name,
        mobile,
        password,
        center,
        address,
        panNumber,
        bankDetails: { accountNo, ifscCode },
      });

      Alert.alert('Success', 'Registration submitted. Await admin approval.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your ScanApp account</Text>

        <Input
          label="Name *"
          value={formData.name}
          onChangeText={(text: string) => handleInputChange('name', text)}
          placeholder="Full Name"
        />
        <Input
          label="Mobile *"
          value={formData.mobile}
          onChangeText={(text: string) => handleInputChange('mobile', text)}
          placeholder="Mobile Number"
          keyboardType="phone-pad"
        />
        <Input
          label="Password *"
          value={formData.password}
          onChangeText={(text: string) => handleInputChange('password', text)}
          placeholder="Password"
          secureTextEntry
        />
        <Input
          label="Center *"
          value={formData.center}
          onChangeText={(text: string) => handleInputChange('center', text)}
          placeholder="Center Name"
        />
        <Input
          label="Address"
          value={formData.address}
          onChangeText={(text: string) => handleInputChange('address', text)}
          placeholder="Full Address"
        />
        <Input
          label="PAN Number"
          value={formData.panNumber}
          onChangeText={(text: string) => handleInputChange('panNumber', text)}
          placeholder="ABCDE1234F"
          maxLength={10}
        />

        <Text style={styles.section}>Bank Details (Optional)</Text>
        <Input
          label="Account Number"
          value={formData.accountNo}
          onChangeText={(text: string) => handleInputChange('accountNo', text)}
          keyboardType="numeric"
        />
        <Input
          label="IFSC Code"
          value={formData.ifscCode}
          onChangeText={(text: string) => handleInputChange('ifscCode', text)}
        />

        {/* Register Button */}
        <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const Input = ({ label, ...props }: any) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
    justifyContent: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 20,
  },

  section: {
    marginTop: 12,
    marginBottom: 4,
    fontWeight: '600',
    color: '#4F46E5',
  },

  field: { marginBottom: 14 },

  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#374151',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },

  registerBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },

  registerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  loginLink: {
    textAlign: 'center',
    marginTop: 14,
    color: '#6B7280',
  },

  link: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});

export default RegisterScreen;