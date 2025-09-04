// Teste de conectividade com o backend
import axios from 'axios';

const testConnection = async () => {
  console.log('🔍 Testando conectividade com o backend...');
  
  try {
    // Teste 1: Verificar se o servidor está rodando
    console.log('📡 Testando conexão básica...');
    const response = await axios.get('http://127.0.0.1:8000/', {
      timeout: 5000
    });
    console.log('✅ Servidor está rodando:', response.status);
    
    // Teste 2: Verificar endpoint de login
    console.log('🔐 Testando endpoint de login...');
    const loginResponse = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
      email: 'teste@gmail.com',
      password: 'Teste123!'
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Login funcionando:', loginResponse.status);
    console.log('📊 Dados do login:', loginResponse.data);
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('🚫 Servidor não está rodando ou não está acessível');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('🌐 Erro de rede - verifique a configuração');
    } else {
      console.error('🔧 Erro específico:', error.response?.status, error.response?.data);
    }
  }
};

// Executar teste
testConnection();
