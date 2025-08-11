import { api } from './api';

export const testApiConnection = async () => {
  try {
    console.log('Testando conexão com a API...');
    const response = await api.get('/test/');
    console.log('Resposta do teste:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Erro no teste da API:', error);
    console.error('Detalhes do erro:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      }
    });
    return { success: false, error: error.message };
  }
};
