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

export interface ScanEntry {
  id: string;
  projectId: string;
  scans: number;
  date: string;
  synced: boolean;
}

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
