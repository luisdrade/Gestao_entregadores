import { API_CONFIG, API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class CommunityService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  // Buscar token de autenticação
  async getAuthToken() {
    try {
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      console.log('🔑 Token encontrado:', !!token);
      return token;
    } catch (error) {
      console.error('❌ Erro ao buscar token:', error);
      return null;
    }
  }

  // Buscar todas as postagens
  async getPosts() {
    try {
      console.log('🔄 Buscando postagens...');
      console.log('🌐 URL:', `${this.baseURL}/comunidade/`);

      // Buscar token do AsyncStorage
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
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

      // Buscar token do AsyncStorage
      const token = await this.getAuthToken();

      // Usar FormData em vez de JSON para compatibilidade com Django
      const formData = new FormData();
      formData.append('autor', postData.autor || 'Usuário');
      formData.append('titulo', postData.titulo);
      formData.append('conteudo', postData.conteudo);
      formData.append('submit_postagem', 'true');

      console.log('📝 Dados do FormData:', {
        autor: postData.autor,
        titulo: postData.titulo,
        conteudo: postData.conteudo,
        submit_postagem: 'true'
      });

      const response = await fetch(`${this.baseURL}/comunidade/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
      });

      console.log('📡 Resposta do servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro detalhado:', errorText);
        throw new Error(`Erro ao criar postagem: ${response.status} - ${response.statusText}`);
      }

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

      // Se não há foto, usar JSON
      if (!adData.foto) {
        // Buscar token do AsyncStorage
        const token = await this.getAuthToken();
        
        const response = await fetch(`${this.baseURL}/comunidade/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({
            modelo: adData.modelo,
            ano: parseInt(adData.ano),
            quilometragem: parseInt(adData.quilometragem),
            preco: parseFloat(adData.preco),
            localizacao: adData.localizacao,
            link_externo: adData.link_externo || '',
            vendedor: adData.vendedor || 'Usuário',
          }),
        });

        console.log('📡 Resposta do servidor:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Erro ao criar anúncio: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Anúncio criado com sucesso!', data);
        return data;
      } else {
        // Se há foto, usar FormData
        // Buscar token do AsyncStorage
        const token = await this.getAuthToken();
        
        const formData = new FormData();
        formData.append('modelo', adData.modelo);
        formData.append('ano', adData.ano.toString());
        formData.append('quilometragem', adData.quilometragem.toString());
        formData.append('preco', adData.preco.toString());
        formData.append('localizacao', adData.localizacao);
        formData.append('link_externo', adData.link_externo);
        formData.append('vendedor', adData.vendedor || 'Usuário');
        formData.append('submit_anuncio', 'true');
        
        formData.append('foto', {
          uri: adData.foto.uri,
          type: adData.foto.type || 'image/jpeg',
          name: adData.foto.fileName || 'foto.jpg',
        });

        const response = await fetch(`${this.baseURL}/comunidade/`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
        });

        console.log('📡 Resposta do servidor:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Erro ao criar anúncio: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Anúncio criado com sucesso!', data);
        return data;
      }
    } catch (error) {
      console.error('❌ Erro ao criar anúncio:', error);
      throw error;
    }
  }
}

export default new CommunityService();
