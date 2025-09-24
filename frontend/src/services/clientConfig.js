import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// ⚡ Cliente HTTP principal da aplicação
export const httpClient = axios.create({
  //baseURL: API_CONFIG.BASE_URL || 'http://10.250.108.238:8000',
  baseURL: API_CONFIG.BASE_URL || 'http://192.168.0.115:8000',
  timeout: API_CONFIG.TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Interceptor para adicionar token JWT automaticamente
httpClient.interceptors.request.use(
  async (config) => {
    try {
      // Só adicionar token se não estiver já definido nos headers
      if (!config.headers.Authorization) {
        const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
        console.log('🔍 ClientConfig - Token encontrado:', !!token);
        console.log('🔍 ClientConfig - Token valor:', token ? `${token.substring(0, 20)}...` : 'Nenhum');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔍 ClientConfig - Header Authorization adicionado:', config.headers.Authorization);
        } else {
          console.log('⚠️ ClientConfig - Nenhum token encontrado no AsyncStorage');
        }
      } else {
        console.log('🔍 ClientConfig - Header Authorization já definido:', config.headers.Authorization);
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
        console.log('🚨 ClientConfig - Erro 401 detectado, limpando sessão');
        await AsyncStorage.removeItem('@GestaoEntregadores:token');
        await AsyncStorage.removeItem('@GestaoEntregadores:user');
        console.log('🧹 ClientConfig - Storage limpo após erro 401');
        
        // Limpar headers de autorização
        delete httpClient.defaults.headers.Authorization;
        
        // Emitir evento global para logout (se necessário)
        // Isso pode ser usado por outros componentes para detectar logout automático
        console.log('🚪 ClientConfig - Logout automático devido a token expirado');
      } catch (storageError) {
        console.error('❌ ClientConfig - Erro ao limpar storage:', storageError);
      }
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

// ✏️ Atualizar registro de trabalho
export const atualizarRegistroTrabalho = async (id, dados) => {
  try {
    await httpClient.put(`/registro/api/registro-trabalho/${id}/`, dados);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar registro de trabalho:', error);
    return { success: false, message: error.response?.data?.error || 'Erro ao atualizar' };
  }
};

// 🗑️ Excluir registro de trabalho
export const excluirRegistroTrabalho = async (id) => {
  try {
    await httpClient.delete(`/registro/api/registro-trabalho/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao excluir registro de trabalho:', error);
    return { success: false, message: error.response?.data?.error || 'Erro ao excluir' };
  }
};

// ✏️ Atualizar despesa
export const atualizarDespesa = async (id, dados) => {
  try {
    await httpClient.put(`/registro/api/registro-despesa/${id}/`, dados);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao atualizar despesa:', error);
    return { success: false, message: error.response?.data?.error || 'Erro ao atualizar' };
  }
};

// 🗑️ Excluir despesa
export const excluirDespesa = async (id) => {
  try {
    await httpClient.delete(`/registro/api/registro-despesa/${id}/`);
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao excluir despesa:', error);
    return { success: false, message: error.response?.data?.error || 'Erro ao excluir' };
  }
};

// ===== FUNÇÕES PARA CATEGORIAS DE DESPESAS =====

// 📋 Listar categorias de despesas
export const listarCategoriasDespesas = async () => {
  try {
    const response = await httpClient.get('/registro/api/categorias-despesas/');
    return {
      success: true,
      data: response.data.results || []
    };
  } catch (error) {
    console.error('❌ Erro ao listar categorias:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao listar categorias'
    };
  }
};

// ➕ Criar categoria de despesa
export const criarCategoriaDespesa = async (dados) => {
  try {
    const response = await httpClient.post('/registro/api/categorias-despesas/', dados);
    return {
      success: true,
      message: 'Categoria criada com sucesso!',
      data: response.data.data
    };
  } catch (error) {
    console.error('❌ Erro ao criar categoria:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao criar categoria'
    };
  }
};

// ✏️ Atualizar categoria de despesa
export const atualizarCategoriaDespesa = async (id, dados) => {
  try {
    const response = await httpClient.put(`/registro/api/categorias-despesas/${id}/`, dados);
    return {
      success: true,
      message: 'Categoria atualizada com sucesso!',
      data: response.data.data
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar categoria:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao atualizar categoria'
    };
  }
};

// 🗑️ Excluir categoria de despesa
export const excluirCategoriaDespesa = async (id) => {
  try {
    const response = await httpClient.delete(`/registro/api/categorias-despesas/${id}/`);
    return {
      success: true,
      message: response.data.message || 'Categoria excluída com sucesso!'
    };
  } catch (error) {
    console.error('❌ Erro ao excluir categoria:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Erro ao excluir categoria'
    };
  }
};