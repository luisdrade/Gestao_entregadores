import axios from 'axios';

// Configuração base da API de teste
const testApi = axios.create({
  baseURL: 'http://192.168.0.115:8000/registro/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Função de teste simples
export const testApiConnection = async () => {
  try {
    const response = await testApi.get('/dashboard-data/');
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default testApi;


