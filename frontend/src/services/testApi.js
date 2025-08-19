import { api } from './api';

export const testApi = async () => {
  try {
    const response = await api.get('/api/test/');
    return response.data;
  } catch (error) {
    console.error('Erro no teste da API:', error);
    throw error;
  }
};

