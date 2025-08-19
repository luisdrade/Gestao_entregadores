import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Configuração base da API
export const api = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://192.168.56.1:8000',
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

// Função para registro de trabalho
export const registroTrabalho = async (dados) => {
  try {
    const response = await api.post('/registro/api/registro-trabalho/', dados);
    return {
      success: true,
      message: 'Trabalho registrado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao registrar trabalho:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Erro ao registrar trabalho'
    };
  }
};

// Função para registro de despesa
export const registroDespesa = async (dados) => {
  try {
    const response = await api.post('/registro/api/registro-despesa/', dados);
    return {
      success: true,
      message: 'Despesa registrada com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao registrar despesa:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Erro ao registrar despesa'
    };
  }
};
