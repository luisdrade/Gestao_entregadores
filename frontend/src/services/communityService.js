import { API_CONFIG, API_ENDPOINTS } from '../config/api';

class CommunityService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Buscar todas as postagens
  async getPosts() {
    try {
      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar postagens: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar postagens:', error);
      throw error;
    }
  }

  // Criar nova postagem
  async createPost(postData) {
    try {
      const formData = new FormData();
      formData.append('autor', postData.autor);
      formData.append('titulo', postData.titulo);
      formData.append('conteudo', postData.conteudo);
      formData.append('submit_postagem', 'true');

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar postagem: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
      throw error;
    }
  }

  // Criar novo anúncio de veículo
  async createVehicleAd(adData) {
    try {
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
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar anúncio: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      throw error;
    }
  }
}

export default new CommunityService();
