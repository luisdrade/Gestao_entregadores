import axios from 'axios';

// Configuração base da API
const api = axios.create({
  baseURL: 'http://192.168.0.115:8000/registro/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API para registro de trabalho
export const registroTrabalho = async (data) => {
  try {
    const response = await api.post('/registro-trabalho/', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao registrar trabalho');
  }
};

// API para registro de despesa
export const registroDespesa = async (data) => {
  try {
    const response = await api.post('/registro-despesa/', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao registrar despesa');
  }
};

// API para buscar dados do dashboard
export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard-data/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao buscar dados do dashboard');
  }
};

// API para registro de entrega e despesa (legado)
export const registroEntregaDespesa = async (data) => {
  try {
    const response = await api.post('/registro-entrega-despesa/', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Erro ao registrar entrega e despesa');
  }
};

export default api;
