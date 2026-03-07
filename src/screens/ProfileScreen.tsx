import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const ProfileScreen = () => {
  const { user, updateProfile, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    panNumber: '',
    accountNo: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        dob: user.dob || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
        aadhaarNumber: user.aadhaarNumber || '',
        panNumber: user.panNumber || '',
        accountNo: user.bankDetails?.accountNo || '',
        ifscCode: user.bankDetails?.ifscCode || '',
        bankName: user.bankDetails?.bankName || '',
        accountHolderName: user.bankDetails?.accountHolderName || '',
      });
    }
  }, [user]);

  const handleInputChange = (name: string, value: string) => {
    if (name === 'panNumber' || name === 'ifscCode') value = value.toUpperCase();
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        bankDetails: {
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
        }
      });
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.role}>{user?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.form}>
        <Input label="Full Name" value={formData.name} onChangeText={(text: string) => handleInputChange('name', text)} />
        <Input label="Email ID" value={formData.email} onChangeText={(text: string) => handleInputChange('email', text)} keyboardType="email-address" />
        <Input label="Date of Birth" value={formData.dob} onChangeText={(text: string) => handleInputChange('dob', text)} placeholder="YYYY-MM-DD" />
        
        <Text style={styles.sectionHeader}>Address Details</Text>
        <Input label="Address" value={formData.address} onChangeText={(text: string) => handleInputChange('address', text)} />
        <Input label="City" value={formData.city} onChangeText={(text: string) => handleInputChange('city', text)} />
        <Input label="State" value={formData.state} onChangeText={(text: string) => handleInputChange('state', text)} />
        <Input label="Pincode" value={formData.pincode} onChangeText={(text: string) => handleInputChange('pincode', text)} keyboardType="numeric" />

        <Text style={styles.sectionHeader}>Identity Details</Text>
        <Input label="Aadhaar Number" value={formData.aadhaarNumber} onChangeText={(text: string) => handleInputChange('aadhaarNumber', text)} keyboardType="numeric" />
        <Input label="PAN Number" value={formData.panNumber} onChangeText={(text: string) => handleInputChange('panNumber', text)} />

        <Text style={styles.sectionHeader}>Bank Details</Text>
        <Input label="Account Number" value={formData.accountNo} onChangeText={(text: string) => handleInputChange('accountNo', text)} keyboardType="numeric" />
        <Input label="IFSC Code" value={formData.ifscCode} onChangeText={(text: string) => handleInputChange('ifscCode', text)} />
        <Input label="Bank Name" value={formData.bankName} onChangeText={(text: string) => handleInputChange('bankName', text)} />
        <Input label="Account Holder Name" value={formData.accountHolderName} onChangeText={(text: string) => handleInputChange('accountHolderName', text)} />

        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Update Profile</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  role: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionHeader: {
    marginTop: 16,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  updateBtn: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

export default ProfileScreen;
