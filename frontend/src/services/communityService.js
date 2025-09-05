import { API_CONFIG, API_ENDPOINTS } from '../config/api';

class CommunityService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Buscar todas as postagens
  async getPosts() {
    try {
      console.log('🔄 Buscando postagens...');
      console.log('🌐 URL:', `${this.baseURL}/comunidade/`);

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Erro ao buscar postagens: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Postagens carregadas:', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao buscar postagens:', error);
      throw error;
    }
  }

  // Criar nova postagem
  async createPost(postData) {
    try {
      console.log('🚀 Enviando postagem:', postData);
      console.log('🌐 URL:', `${this.baseURL}/comunidade/`);

      const formData = new FormData();
      formData.append('autor', postData.autor);
      formData.append('titulo', postData.titulo);
      formData.append('conteudo', postData.conteudo);
      formData.append('submit_postagem', 'true');

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Erro ao criar postagem: ${response.status} - ${response.statusText}`);
      }

      // O backend agora retorna JSON
      const data = await response.json();
      console.log('✅ Postagem criada com sucesso!', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar postagem:', error);
      throw error;
    }
  }

  // Criar novo anúncio de veículo
  async createVehicleAd(adData) {
    try {
      console.log('🚀 Enviando anúncio:', adData);
      console.log('🌐 URL:', `${this.baseURL}/comunidade/`);

      const formData = new FormData();
      formData.append('modelo', adData.modelo);
      formData.append('ano', adData.ano.toString());
      formData.append('quilometragem', adData.quilometragem.toString());
      formData.append('preco', adData.preco.toString());
      formData.append('localizacao', adData.localizacao);
      formData.append('link_externo', adData.link_externo);
      formData.append('submit_anuncio', 'true');
      
      if (adData.foto) {
        formData.append('foto', {
          uri: adData.foto.uri,
          type: adData.foto.type || 'image/jpeg',
          name: adData.foto.fileName || 'foto.jpg',
        });
      }

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Erro ao criar anúncio: ${response.status} - ${response.statusText}`);
      }

      // O backend agora retorna JSON
      const data = await response.json();
      console.log('✅ Anúncio criado com sucesso!', data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao criar anúncio:', error);
      throw error;
    }
  }
}

export default new CommunityService();
