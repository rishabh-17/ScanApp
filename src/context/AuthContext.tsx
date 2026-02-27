import React, { createContext, useState, useEffect, useContext } from 'react';
import { MMKV } from 'react-native-mmkv';
import axios from 'axios';

let storage: MMKV | undefined;
try {
  storage = new MMKV();
} catch (e) {
  console.error('Failed to initialize MMKV:', e);
}

// Replace with your local machine's IP address for Android emulator
const API_URL = 'http://3.25.120.212:5001/api';

const AuthContext = createContext<any>({
  user: null,
  loading: true,
  login: async () => { },
  register: async () => { },
  updateProfile: async () => { },
  logout: () => { },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      if (!storage) {
        setLoading(false);
        return;
      }
      try {
        const token = storage.getString('token');
        const userData = storage.getString('user');

        if (token && userData) {
          setUser(JSON.parse(userData));
          // Optionally verify token with backend here
        }
      } catch (e) {
        console.error('Error reading storage:', e);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (mobile: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { mobile, password });
      if (storage) {
        storage.set('token', data.token);
        storage.set('user', JSON.stringify(data));
      }
      setUser(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, userData);
      // Don't log in automatically, user needs approval
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateProfile = async (userData: any) => {
    if (!storage) return;
    try {
      const token = storage.getString('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/auth/profile`, userData, config);
      storage.set('user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const logout = () => {
    if (storage) {
      storage.delete('token');
      storage.delete('user');
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
