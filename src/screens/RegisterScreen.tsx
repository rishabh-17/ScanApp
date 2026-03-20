import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { pick, types, errorCodes, isErrorWithCode } from '@react-native-documents/picker';

// Replace with your local machine's IP address for Android emulator
const API_URL = 'http://3.25.120.212:5001/api';

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<any[]>([]);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [pickedDocs, setPickedDocs] = useState<{
    aadhaarDoc: any | null;
    panDoc: any | null;
    bankPassbookDoc: any | null;
    cancelledChequeDoc: any | null;
    educationalDoc: any | null;
    passportPhoto: any | null;
  }>({
    aadhaarDoc: null,
    panDoc: null,
    bankPassbookDoc: null,
    cancelledChequeDoc: null,
    educationalDoc: null,
    passportPhoto: null,
  });
  const [formData, setFormData] = useState({
    location: '',
    name: '',
    gender: '',
    fatherName: '',
    motherName: '',
    bloodGroup: '',
    mobile: '',
    alternateMobile: '',
    email: '',
    dob: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaarNumber: '',
    aadhaarDoc: '',
    panNumber: '',
    panDoc: '',
    accountNo: '',
    confirmAccountNo: '',
    ifscCode: '',
    bankName: '',
    accountHolderName: '',
    cancelledChequeDoc: '',
    bankPassbookDoc: '',
    passportPhoto: '',
    educationalDoc: '',
    highestEducation: '',
    affiliatedUniversity: '',
    previousEmployment: '',
    referenceSource: '',
    agencyName: '',
    referenceContactNo: '',
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

  const handlePickDoc = async (key: keyof typeof pickedDocs, options?: { imageOnly?: boolean }) => {
    try {
      const type = options?.imageOnly ? [types.images] : [types.images, types.pdf];
      const [result] = await pick({ type });
      setPickedDocs(prev => ({ ...prev, [key]: result }));
      handleInputChange(key, result?.name || '');
    } catch (e: any) {
      if (isErrorWithCode(e) && e.code === errorCodes.OPERATION_CANCELED) return;
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const validateInputs = () => {
    const { name, mobile, alternateMobile, password, center, panNumber, accountNo, confirmAccountNo, ifscCode, aadhaarNumber } = formData;

    if (!name || !mobile || !alternateMobile || !password || !center || !aadhaarNumber || !panNumber) {
      Alert.alert('Validation Error', 'Please fill all required fields (Name, Mobile, Alternate Number, Password, Center, Aadhaar, PAN)');
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(alternateMobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit alternate number');
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
      await register({
        ...formData,
        photo: formData.passportPhoto,
        bankDetails: {
          accountNo: formData.accountNo,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
          accountHolderName: formData.accountHolderName,
          cancelledChequeDoc: formData.cancelledChequeDoc
        },
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

        <Input label="Location" value={formData.location} onChangeText={(text: string) => handleInputChange('location', text)} placeholder="Location" />
        <Input label="Full Name *" value={formData.name} onChangeText={(text: string) => handleInputChange('name', text)} placeholder="Full Name" />
        <Input label="Gender" value={formData.gender} onChangeText={(text: string) => handleInputChange('gender', text)} placeholder="Male/Female/Other" />
        <Input label="Father Name" value={formData.fatherName} onChangeText={(text: string) => handleInputChange('fatherName', text)} placeholder="Father Name" />
        <Input label="Mother Name" value={formData.motherName} onChangeText={(text: string) => handleInputChange('motherName', text)} placeholder="Mother Name" />
        <Input label="Blood Group" value={formData.bloodGroup} onChangeText={(text: string) => handleInputChange('bloodGroup', text)} placeholder="A+/O-/etc." />
        <Input label="Mobile Number *" value={formData.mobile} onChangeText={(text: string) => handleInputChange('mobile', text)} placeholder="Mobile Number" keyboardType="phone-pad" />
        <Input label="Alternate Number *" value={formData.alternateMobile} onChangeText={(text: string) => handleInputChange('alternateMobile', text)} placeholder="Alternate Number" keyboardType="phone-pad" />
        <Input label="Email ID" value={formData.email} onChangeText={(text: string) => handleInputChange('email', text)} placeholder="Email ID" keyboardType="email-address" />
        <Input label="Date of Birth (YYYY-MM-DD)" value={formData.dob} onChangeText={(text: string) => handleInputChange('dob', text)} placeholder="YYYY-MM-DD" />

        <Text style={styles.sectionHeader}>Address Details</Text>
        <Input label="Address" value={formData.address} onChangeText={(text: string) => handleInputChange('address', text)} placeholder="Address" />
        <View style={styles.row}>
          <View style={styles.halfColLeft}>
            <Input label="City" value={formData.city} onChangeText={(text: string) => handleInputChange('city', text)} placeholder="City" />
          </View>
          <View style={styles.halfColRight}>
            <Input label="State" value={formData.state} onChangeText={(text: string) => handleInputChange('state', text)} placeholder="State" />
          </View>
        </View>
        <Input label="Pincode" value={formData.pincode} onChangeText={(text: string) => handleInputChange('pincode', text)} placeholder="Pincode" keyboardType="numeric" />

        <Text style={styles.sectionHeader}>Identity Details</Text>
        <Input label="Aadhaar Number *" value={formData.aadhaarNumber} onChangeText={(text: string) => handleInputChange('aadhaarNumber', text)} placeholder="12-digit Aadhaar" keyboardType="numeric" maxLength={12} />
        <UploadField
          label="Aadhaar Doc"
          value={pickedDocs.aadhaarDoc?.name || ''}
          onPress={() => handlePickDoc('aadhaarDoc')}
        />
        <Input label="PAN Number *" value={formData.panNumber} onChangeText={(text: string) => handleInputChange('panNumber', text)} placeholder="ABCDE1234F" autoCapitalize="characters" maxLength={10} />
        <UploadField
          label="PAN Doc"
          value={pickedDocs.panDoc?.name || ''}
          onPress={() => handlePickDoc('panDoc')}
        />

        <Text style={styles.sectionHeader}>Bank Details</Text>
        <Input label="Bank Account Number" value={formData.accountNo} onChangeText={(text: string) => handleInputChange('accountNo', text)} placeholder="Account Number" keyboardType="numeric" />
        <Input label="Confirm Account Number" value={formData.confirmAccountNo} onChangeText={(text: string) => handleInputChange('confirmAccountNo', text)} placeholder="Confirm Account Number" keyboardType="numeric" />
        <Input label="IFSC Code" value={formData.ifscCode} onChangeText={(text: string) => handleInputChange('ifscCode', text)} placeholder="IFSC Code" autoCapitalize="characters" />
        <Input label="Bank Name" value={formData.bankName} onChangeText={(text: string) => handleInputChange('bankName', text)} placeholder="Bank Name" />
        <Input label="Account Holder Name" value={formData.accountHolderName} onChangeText={(text: string) => handleInputChange('accountHolderName', text)} placeholder="Account Holder Name" />
        <UploadField
          label="Bank Passbook"
          value={pickedDocs.bankPassbookDoc?.name || ''}
          onPress={() => handlePickDoc('bankPassbookDoc')}
        />
        <UploadField
          label="Cancelled Cheque"
          value={pickedDocs.cancelledChequeDoc?.name || ''}
          onPress={() => handlePickDoc('cancelledChequeDoc')}
        />

        <Text style={styles.sectionHeader}>Education</Text>
        <Input label="Highest Education" value={formData.highestEducation} onChangeText={(text: string) => handleInputChange('highestEducation', text)} placeholder="Highest Education" />
        <Input label="Affiliated University" value={formData.affiliatedUniversity} onChangeText={(text: string) => handleInputChange('affiliatedUniversity', text)} placeholder="Affiliated University" />
        <UploadField
          label="Educational Doc"
          value={pickedDocs.educationalDoc?.name || ''}
          onPress={() => handlePickDoc('educationalDoc')}
        />

        <Text style={styles.sectionHeader}>Employment / Reference</Text>
        <Input label="Previous Employment" value={formData.previousEmployment} onChangeText={(text: string) => handleInputChange('previousEmployment', text)} placeholder="Previous Employment (if any)" />
        <Input label="Reference (Direct Walkin, Agency)" value={formData.referenceSource} onChangeText={(text: string) => handleInputChange('referenceSource', text)} placeholder="Direct Walkin / Agency" />
        <Input label="If Agency - Agency Name" value={formData.agencyName} onChangeText={(text: string) => handleInputChange('agencyName', text)} placeholder="Agency Name" />
        <Input label="Reference Contact No" value={formData.referenceContactNo} onChangeText={(text: string) => handleInputChange('referenceContactNo', text)} placeholder="Reference Contact No" keyboardType="phone-pad" />

        <Text style={styles.sectionHeader}>Photo</Text>
        <UploadField
          label="Passport Size Photo"
          value={pickedDocs.passportPhoto?.name || ''}
          onPress={() => handlePickDoc('passportPhoto', { imageOnly: true })}
        />

        <Text style={styles.sectionHeader}>Account Setup</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Center *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowCenterModal(true)}
          >
            <Text
              style={[
                styles.centerPickerText,
                formData.center ? styles.centerPickerTextSelected : styles.centerPickerTextPlaceholder,
              ]}
            >
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
          style={[styles.registerBtn, loading && styles.registerBtnDisabled]}
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

const UploadField = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity style={styles.uploadButton} onPress={onPress}>
      <Text style={styles.uploadButtonText}>{value ? value : 'Upload'}</Text>
    </TouchableOpacity>
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
  halfColLeft: {
    flex: 1,
    marginRight: 8,
  },
  halfColRight: {
    flex: 1,
  },
  centerPickerText: {
    marginTop: 12,
  },
  centerPickerTextSelected: {
    color: '#111827',
  },
  centerPickerTextPlaceholder: {
    color: '#9CA3AF',
  },

  registerBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  registerBtnDisabled: {
    opacity: 0.7,
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
