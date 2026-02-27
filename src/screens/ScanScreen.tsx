import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { submitScan } from '../services/ScanService';

const ScanScreen = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (user && user.project) {
      if (typeof user.project === 'object' && user.project._id) {
        setProjectId(user.project._id);
        setProjectName(user.project.name);
      } else if (typeof user.project === 'string') {
        setProjectId(user.project);
        setProjectName('Assigned Project');
      }
    }
  }, [user]);

  const handleSubmit = async () => {
    if (!scans || !projectId) {
      Alert.alert('Error', 'Project ID and Scan Count are required');
      return;
    }

    try {
      const token = user?.token;
      if (!token) return Alert.alert('Error', 'User not authenticated');

      await submitScan(token, projectId, parseInt(scans));
      setScans('');
      Alert.alert('Success', 'Scan entry submitted successfully');
    } catch {
      Alert.alert('Error', 'Submission failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>New Scan Entry</Text>

        {/* Project Info */}
        {projectName ? (
          <View style={styles.projectBadge}>
            <Text style={styles.projectLabel}>Assigned Project</Text>
            <Text style={styles.projectValue}>{projectName}</Text>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Project ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Project ID"
              value={projectId}
              onChangeText={setProjectId}
              placeholderTextColor="#9CA3AF"
            />
          </>
        )}

        {/* Scan Count */}
        <Text style={styles.label}>Scan Count</Text>
        <TextInput
          style={[styles.input, styles.scanInput]}
          placeholder="0"
          keyboardType="numeric"
          value={scans}
          onChangeText={setScans}
          placeholderTextColor="#9CA3AF"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Entry</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },

  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    backgroundColor: '#F9FAFB',
  },

  scanInput: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
  },

  projectBadge: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },

  projectLabel: {
    fontSize: 12,
    color: '#6366F1',
  },

  projectValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },

  submitBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ScanScreen;