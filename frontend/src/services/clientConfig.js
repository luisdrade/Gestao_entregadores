import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// ⚡ Cliente HTTP principal da aplicação
export const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL || 'http://10.20.13.125:8000',
  timeout: API_CONFIG.TIMEOUT || 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Interceptor para adicionar token JWT automaticamente
httpClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      console.log('🔍 ClientConfig - Token encontrado:', !!token);
      console.log('🔍 ClientConfig - Token valor:', token ? `${token.substring(0, 20)}...` : 'Nenhum');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔍 ClientConfig - Header Authorization adicionado:', config.headers.Authorization);
      } else {
        console.log('⚠️ ClientConfig - Nenhum token encontrado no AsyncStorage');
      }
    } catch (error) {
      console.error('❌ ClientConfig - Erro ao obter token:', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ ClientConfig - Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// 🛡️ Interceptor para tratar erros de resposta
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      try {
        await AsyncStorage.removeItem('@GestaoEntregadores:token');
        await AsyncStorage.removeItem('@GestaoEntregadores:user');
        console.log('🧹 ClientConfig - Storage limpo após erro 401');
      } catch (storageError) {
        console.error('❌ ClientConfig - Erro ao limpar storage:', storageError);
      }
      // Redirecionar para login se necessário
    }
    return Promise.reject(error);
  }
);

// 📡 Função para registro de trabalho
export const registroTrabalho = async (dados) => {
  try {
    const response = await httpClient.post('/registro/api/registro-trabalho/', dados);
    return {
      success: true,
      message: 'Trabalho registrado com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao registrar trabalho:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Erro ao registrar trabalho'
    };
  }
};

// 💰 Função para registro de despesa
export const registroDespesa = async (dados) => {
  try {
    const response = await httpClient.post('/registro/api/registro-despesa/', dados);
    return {
      success: true,
      message: 'Despesa registrada com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao registrar despesa:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Erro ao registrar despesa'
    };
  }
};

// Alias para compatibilidade (pode ser removido gradualmente)
export const api = httpClient;
