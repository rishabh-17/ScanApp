import { MMKV } from 'react-native-mmkv';
import axios from 'axios';

let storage: MMKV | undefined;
try {
  storage = new MMKV();
} catch (e) {
  console.error('Failed to initialize MMKV in ScanService:', e);
}

const OFFLINE_QUEUE_KEY = 'offline_scan_queue';

// Replace with your local machine's IP address for Android emulator
const API_URL = 'http://10.0.2.2:5001/api';
// For Android Emulator use: 'http://10.0.2.2:5001/api'

export interface ScanEntry {
  id: string;
  projectId: string;
  projectName?: string;
  scans: number;
  date: string;
  synced: boolean;
  status?: string;
  rejectionReason?: string;
  actions?: string[];
}

export const getScanHistory = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/scan-entry/my-entries`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch scan history', error);
    throw error;
  }
};

export const getPaymentHistory = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/payments/my-payments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch payment history', error);
    throw error;
  }
};

export const submitScan = async (token: string, projectId: string, scans: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/scan-entry`,
      {
        projectId,
        scans,
        date: new Date().toISOString(),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Scan submission failed', error);
    throw error;
  }
};
