// src/context/AuthProvider.js
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthContext from './AuthContext';
import { API_URL } from '../../config';

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        password,
      });
      const userToken = res.data.key;
      await AsyncStorage.setItem('token', userToken);
      setToken(userToken);
    } catch (error) {
      console.error('Erro ao logar:', error.response?.data || error.message);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  };

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  };

  useEffect(() => {
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; // ✅ Corrigido para export default
