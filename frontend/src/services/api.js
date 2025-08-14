import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Configuração base da API
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://192.168.137.1:8000/registro/api',
  timeout: API_CONFIG.TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      try {
        await AsyncStorage.removeItem('@GestaoEntregadores:token');
        await AsyncStorage.removeItem('@GestaoEntregadores:user');
      } catch (storageError) {
        console.error('Erro ao limpar storage:', storageError);
      }
      // Redirecionar para login se necessário
    }
    return Promise.reject(error);
  }
);
