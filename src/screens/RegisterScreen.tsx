import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Replace with your local machine's IP address for Android emulator
const API_URL = 'http://3.25.120.212:5001/api';

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    panNumber: '',
    accountNo: '',
    confirmAccountNo: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    center: '',
    password: '', // Kept for auth
  });

  const { register } = useAuth();
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await axios.get(`${API_URL}/centers/public`);
      setCenters(response.data);
    } catch (error) {
      console.error('Failed to fetch centers', error);
      Alert.alert('Error', 'Failed to load centers');
    }
  };

  const handleInputChange = (name: string, value: string) => {
    if (name === 'panNumber' || name === 'ifscCode') value = value.toUpperCase();
    setFormData({ ...formData, [name]: value });
  };

  const validateInputs = () => {
    const { name, mobile, password, center, panNumber, accountNo, confirmAccountNo, ifscCode, aadhaarNumber } = formData;

    if (!name || !mobile || !password || !center || !aadhaarNumber || !panNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields (Name, Mobile, Password, Center, Aadhaar, PAN)');
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      Alert.alert('Validation Error', 'Invalid Aadhaar Number (12 digits)');
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      Alert.alert('Validation Error', 'Invalid PAN format');
      return false;
    }

    if (accountNo && !/^\d{9,18}$/.test(accountNo)) {
      Alert.alert('Validation Error', 'Invalid account number');
      return false;
    }

    if (accountNo !== confirmAccountNo) {
      Alert.alert('Validation Error', 'Bank Account Numbers do not match');
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

    setLoading(true);
    try {
      // Dummy file uploads for now
      const dummyDoc = "https://via.placeholder.com/150";

      await register({
        ...formData,
        bankDetails: {
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          cancelledChequeDoc: dummyDoc
        },
        aadhaarDoc: dummyDoc,
        panDoc: dummyDoc
      });

      Alert.alert('Success', 'Registration submitted. Await admin approval.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.subtitle}>Create your ScanApp account</Text>

        <Input label="Full Name *" value={formData.name} onChangeText={(text: string) => handleInputChange('name', text)} placeholder="Full Name" />
        <Input label="Mobile Number *" value={formData.mobile} onChangeText={(text: string) => handleInputChange('mobile', text)} placeholder="Mobile Number" keyboardType="phone-pad" />
        <Input label="Email ID" value={formData.email} onChangeText={(text: string) => handleInputChange('email', text)} placeholder="Email ID" keyboardType="email-address" />
        <Input label="Date of Birth (YYYY-MM-DD)" value={formData.dob} onChangeText={(text: string) => handleInputChange('dob', text)} placeholder="YYYY-MM-DD" />

        <Text style={styles.sectionHeader}>Address Details</Text>
        <Input label="Address" value={formData.address} onChangeText={(text: string) => handleInputChange('address', text)} placeholder="Address" />
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Input label="City" value={formData.city} onChangeText={(text: string) => handleInputChange('city', text)} placeholder="City" />
          </View>
          <View style={{ flex: 1 }}>
            <Input label="State" value={formData.state} onChangeText={(text: string) => handleInputChange('state', text)} placeholder="State" />
          </View>
        </View>
        <Input label="Pincode" value={formData.pincode} onChangeText={(text: string) => handleInputChange('pincode', text)} placeholder="Pincode" keyboardType="numeric" />

        <Text style={styles.sectionHeader}>Identity Details</Text>
        <Input label="Aadhaar Number *" value={formData.aadhaarNumber} onChangeText={(text: string) => handleInputChange('aadhaarNumber', text)} placeholder="12-digit Aadhaar" keyboardType="numeric" maxLength={12} />
        <Input label="PAN Number *" value={formData.panNumber} onChangeText={(text: string) => handleInputChange('panNumber', text)} placeholder="ABCDE1234F" autoCapitalize="characters" maxLength={10} />

        <View style={styles.row}>
          <TouchableOpacity style={[styles.uploadButton, { flex: 1, marginRight: 8 }]} onPress={() => Alert.alert('Info', 'Aadhaar Uploaded')}>
            <Text style={styles.uploadButtonText}>Aadhaar Doc</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadButton, { flex: 1 }]} onPress={() => Alert.alert('Info', 'PAN Uploaded')}>
            <Text style={styles.uploadButtonText}>PAN Doc</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Bank Details</Text>
        <Input label="Bank Account Number" value={formData.accountNo} onChangeText={(text: string) => handleInputChange('accountNo', text)} placeholder="Account Number" keyboardType="numeric" />
        <Input label="Confirm Account Number" value={formData.confirmAccountNo} onChangeText={(text: string) => handleInputChange('confirmAccountNo', text)} placeholder="Confirm Account Number" keyboardType="numeric" />
        <Input label="IFSC Code" value={formData.ifscCode} onChangeText={(text: string) => handleInputChange('ifscCode', text)} placeholder="IFSC Code" autoCapitalize="characters" />
        <Input label="Bank Name" value={formData.bankName} onChangeText={(text: string) => handleInputChange('bankName', text)} placeholder="Bank Name" />
        <Input label="Account Holder Name" value={formData.accountHolderName} onChangeText={(text: string) => handleInputChange('accountHolderName', text)} placeholder="Account Holder Name" />

        <TouchableOpacity style={styles.uploadButton} onPress={() => Alert.alert('Info', 'Cheque Uploaded')}>
          <Text style={styles.uploadButtonText}>Upload Cancelled Cheque</Text>
        </TouchableOpacity>

        <Text style={styles.sectionHeader}>Account Setup</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Center *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowCenterModal(true)}
          >
            <Text style={{ marginTop: 12, color: formData.center ? '#111827' : '#9CA3AF' }}>
              {formData.center
                ? (() => {
                  const selected = centers.find((c: any) => c._id === formData.center);
                  return selected ? `${selected.name} (${selected.centerCode})` : formData.center;
                })()
                : 'Select Center'}
            </Text>
          </TouchableOpacity>
        </View>

        <Input label="Password *" value={formData.password} onChangeText={(text: string) => handleInputChange('password', text)} placeholder="Password" secureTextEntry />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.registerBtn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerText}>Create Account</Text>
          )}
        </TouchableOpacity>


        {/* Login Link */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.link}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCenterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCenterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Center</Text>
            <FlatList
              data={centers}
              keyExtractor={(item: any) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange('center', item._id);
                    setShowCenterModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name} ({item.centerCode})</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCenterModal(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  sectionHeader: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },

  uploadButton: {
    backgroundColor: '#E0E7FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
  },

  uploadButtonText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 14,
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
    color: '#111827',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalItemText: {
    fontSize: 16,
    color: '#374151',
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  closeButtonText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RegisterScreen;