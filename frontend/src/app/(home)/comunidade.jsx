import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext.jsx';
import Header from '../../components/_Header';
import _CardPostagem from '../../components/_CardPostagem';
import _CardAnuncioVeiculo from '../../components/_CardAnuncioVeiculo';
import _ModalCriarPostagem from '../../components/_ModalCriarPostagem';
import _ModalCriarAnuncioVeiculo from '../../components/_ModalCriarAnuncioVeiculo';
import communityService from '../../services/communityService';

function ComunidadeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('postagens'); // 'postagens' ou 'anuncios'
  const [postagens, setPostagens] = useState([]);
  const [anuncios, setAnuncios] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [atualizando, setAtualizando] = useState(false);
  const [mostrarModalPostagem, setMostrarModalPostagem] = useState(false);
  const [mostrarModalAnuncio, setMostrarModalAnuncio] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      console.log('🔄 Carregando dados da comunidade...');
      
      // Buscar dados reais do backend
      const data = await communityService.getPosts();
      console.log('✅ Dados carregados do backend:', data);
      
      // Separar postagens e anúncios baseado no tipo
      const postagens = data.postagens || [];
      const anuncios = data.anuncios || [];
      
      console.log('📝 Postagens encontradas:', postagens.length);
      console.log('🚗 Anúncios encontrados:', anuncios.length);
      
      setPostagens(postagens);
      setAnuncios(anuncios);
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados da comunidade:', error);
      
      // Em caso de erro, mostrar dados mock como fallback
      console.log('⚠️ Usando dados mock como fallback');
      
      const postagensMock = [
        {
          id: 1,
          autor: '@joao_silva',
          titulo: 'Dicas para economizar combustível',
          conteudo: 'Compartilhando algumas dicas que aprendi ao longo dos anos para economizar combustível durante as entregas. Sempre mantenha os pneus calibrados e evite acelerações bruscas!',
          data_criacao: new Date().toISOString(),
          curtidas: 12,
          comentarios: 3,
        },
        {
          id: 2,
          autor: '@maria_santos',
          titulo: 'Melhores rotas para o centro',
          conteudo: 'Descobri algumas rotas alternativas que podem economizar tempo no trânsito do centro da cidade. A Rua das Flores sempre está mais livre pela manhã!',
          data_criacao: new Date(Date.now() - 86400000).toISOString(),
          curtidas: 8,
          comentarios: 5,
        },
      ];

      const anunciosMock = [
        {
          id: 1,
          modelo: 'Honda CG 160',
          ano: 2020,
          quilometragem: 25000,
          preco: 8500.00,
          localizacao: 'São Paulo, SP',
          link_externo: 'https://exemplo.com/anuncio1',
          foto: null,
          data_publicacao: new Date().toISOString(),
          vendedor: '@joao_silva',
        },
      ];

      setPostagens(postagensMock);
      setAnuncios(anunciosMock);
      
      Alert.alert('Aviso', 'Não foi possível conectar com o servidor. Mostrando dados de exemplo.');
    } finally {
      setCarregando(false);
    }
  };

  const formatHandle = (value) => {
    try {
      const raw = (value || '').toString().trim();
      if (!raw) return '@usuario';
      // remover todos os prefixos '@' e espaços, normalizar para snake-case simples
      const noAt = raw.replace(/^@+/, '');
      const compact = noAt.replace(/\s+/g, '_');
      // remover caracteres não alfanuméricos comuns (mantém _ . -)
      const safe = compact.replace(/[^a-zA-Z0-9_.-]/g, '');
      return `@${safe || 'usuario'}`;
    } catch (_) {
      return '@usuario';
    }
  };

  const aoAtualizar = async () => {
    setAtualizando(true);
    await carregarDados();
    setAtualizando(false);
  };

  const aoCriarPostagem = async (postData) => {
    try {
      console.log('📝 Criando nova postagem:', postData);
      console.log('👤 Usuário logado:', user);
      console.log('👤 Username:', user?.username);
      console.log('👤 Nome:', user?.nome);
      console.log('👤 Email:', user?.email);
      
      // Adicionar @username do usuário logado
      const autorName = user?.username || user?.nome || user?.email || 'usuario';
      const postDataWithAuthor = {
        ...postData,
        autor: formatHandle(autorName),
      };
      
      console.log('👤 Nome do autor calculado:', autorName);
      console.log('👤 Autor final:', postDataWithAuthor.autor);
      
      console.log('👤 Autor da postagem:', postDataWithAuthor.autor);
      console.log('📋 Dados completos:', postDataWithAuthor);
      
      await communityService.createPost(postDataWithAuthor);
      console.log('✅ Postagem criada com sucesso!');
      await carregarDados(); // Recarregar dados após criar
    } catch (error) {
      console.error('❌ Erro ao criar postagem:', error);
      console.error('❌ Detalhes do erro:', error.message);
      Alert.alert('Erro', `Não foi possível criar a postagem: ${error.message}`);
    }
  };

  const aoCriarAnuncio = async (anuncioData) => {
    try {
      console.log('🚗 Criando novo anúncio:', anuncioData);
      
      // Adicionar @username do usuário logado
      const anuncioDataWithVendedor = {
        ...anuncioData,
        vendedor: formatHandle(user?.username || user?.nome || 'usuario'),
      };
      
      console.log('👤 Vendedor do anúncio:', anuncioDataWithVendedor.vendedor);
      
      await communityService.createVehicleAd(anuncioDataWithVendedor);
      console.log('✅ Anúncio criado com sucesso!');
      await carregarDados(); // Recarregar dados após criar
    } catch (error) {
      console.error('❌ Erro ao criar anúncio:', error);
      Alert.alert('Erro', 'Não foi possível criar o anúncio. Tente novamente.');
    }
  };

  const aoPressionarPostagem = (postagem) => {
    // Navegar para detalhes da postagem
    Alert.alert('Postagem', `Título: ${postagem.titulo}\nAutor: ${postagem.autor}`);
  };

  const renderizarPostagem = ({ item }) => (
    <_CardPostagem postagem={item} aoPressionar={() => aoPressionarPostagem(item)} />
  );

  const renderizarAnuncio = ({ item }) => (
    <_CardAnuncioVeiculo anuncio={item} />
  );

  const renderizarEstadoVazio = () => (
    <View style={styles.estadoVazio}>
      <Text style={styles.textoVazio}>
        {activeTab === 'postagens' 
          ? 'Nenhuma postagem ainda' 
          : 'Nenhum anúncio de veículo ainda'
        }
      </Text>
      <Text style={styles.subtextoVazio}>
        {activeTab === 'postagens' 
          ? 'Seja o primeiro a compartilhar algo!' 
          : 'Seja o primeiro a anunciar um veículo!'
        }
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Comunidade" showWelcome={false} />

      {/* Botão de Adicionar */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (activeTab === 'postagens') {
              setMostrarModalPostagem(true);
            } else {
              setMostrarModalAnuncio(true);
            }
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'postagens' && styles.activeTab]}
          onPress={() => setActiveTab('postagens')}
        >
          <Text style={[styles.tabText, activeTab === 'postagens' && styles.activeTabText]}>
            Postagens
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'anuncios' && styles.activeTab]}
          onPress={() => setActiveTab('anuncios')}
        >
          <Text style={[styles.tabText, activeTab === 'anuncios' && styles.activeTabText]}>
            Veículos
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={activeTab === 'postagens' ? postagens : anuncios}
        renderItem={activeTab === 'postagens' ? renderizarPostagem : renderizarAnuncio}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} />
        }
        ListEmptyComponent={renderizarEstadoVazio}
        contentContainerStyle={styles.containerLista}
        showsVerticalScrollIndicator={false}
      />

      <_ModalCriarPostagem
        visivel={mostrarModalPostagem}
        aoFechar={() => setMostrarModalPostagem(false)}
        aoCriarPostagem={aoCriarPostagem}
      />

      <_ModalCriarAnuncioVeiculo
        visivel={mostrarModalAnuncio}
        aoFechar={() => setMostrarModalAnuncio(false)}
        aoCriarAnuncio={aoCriarAnuncio}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  addButtonContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  addButton: {
    backgroundColor: '#2B2860',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2B2860',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  containerLista: {
    paddingBottom: 100, // Espaço para a barra inferior
  },
  estadoVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  textoVazio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtextoVazio: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ComunidadeScreen;
