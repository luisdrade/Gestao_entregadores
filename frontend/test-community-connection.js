// Teste de conexão com a API da comunidade
import { API_CONFIG } from './src/config/api.js';

const testConnection = async () => {
  console.log('🔍 Testando conexão com o backend...');
  console.log('🌐 URL base:', API_CONFIG.BASE_URL);
  
  try {
    // Teste 1: Verificar se o servidor está respondendo
    console.log('\n📡 Teste 1: Verificando se o servidor está online...');
    const response = await fetch(`${API_CONFIG.BASE_URL}/comunidade/`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    
    console.log('✅ Status:', response.status);
    console.log('✅ Status Text:', response.statusText);
    console.log('✅ Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('🎉 Servidor está respondendo!');
      
      // Teste 2: Tentar criar uma postagem de teste
      console.log('\n📝 Teste 2: Criando postagem de teste...');
      
      const formData = new FormData();
      formData.append('autor', 'Teste Mobile');
      formData.append('titulo', 'Teste de Conexão');
      formData.append('conteudo', 'Esta é uma postagem de teste enviada pelo app mobile.');
      formData.append('submit_postagem', 'true');
      
      const postResponse = await fetch(`${API_CONFIG.BASE_URL}/comunidade/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      
      console.log('📡 Status da postagem:', postResponse.status);
      console.log('📡 Status Text:', postResponse.statusText);
      
      if (postResponse.ok) {
        console.log('🎉 Postagem criada com sucesso!');
      } else {
        console.log('❌ Erro ao criar postagem:', postResponse.status);
      }
      
    } else {
      console.log('❌ Servidor não está respondendo corretamente');
    }
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    console.error('🔍 Detalhes:', error);
  }
};

// Executar o teste
testConnection();

