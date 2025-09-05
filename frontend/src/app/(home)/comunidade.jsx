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
import _CardPostagem from '../../components/_CardPostagem';
import _CardAnuncioVeiculo from '../../components/_CardAnuncioVeiculo';
import _ModalCriarPostagem from '../../components/_ModalCriarPostagem';
import _ModalCriarAnuncioVeiculo from '../../components/_ModalCriarAnuncioVeiculo';
import communityService from '../../services/communityService';
import { API_CONFIG } from '../../config/api';

function ComunidadeScreen() {
  const router = useRouter();
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
      
      // Tentar buscar dados reais do backend
      try {
        const data = await communityService.getPosts();
        console.log('✅ Dados carregados do backend:', data);
        
        setPostagens(data.postagens || []);
        setAnuncios(data.anuncios || []);
        
      } catch (backendError) {
        console.log('⚠️ Erro ao conectar com backend, usando dados mock:', backendError.message);
        
        // Dados mock para demonstração
        const postagensMock = [
          {
            id: 1,
            autor: 'João Silva',
            titulo: 'Dicas para economizar combustível',
            conteudo: 'Compartilhando algumas dicas que aprendi ao longo dos anos para economizar combustível durante as entregas...',
            data_criacao: new Date().toISOString(),
          },
          {
            id: 2,
            autor: 'Maria Santos',
            titulo: 'Melhores rotas para o centro',
            conteudo: 'Descobri algumas rotas alternativas que podem economizar tempo no trânsito do centro da cidade...',
            data_criacao: new Date(Date.now() - 86400000).toISOString(),
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
          },
          {
            id: 2,
            modelo: 'Yamaha Fazer 250',
            ano: 2019,
            quilometragem: 45000,
            preco: 12000.00,
            localizacao: 'Rio de Janeiro, RJ',
            link_externo: 'https://exemplo.com/anuncio2',
            foto: null,
            data_publicacao: new Date(Date.now() - 172800000).toISOString(),
          },
        ];

        setPostagens(postagensMock);
        setAnuncios(anunciosMock);
      }
      
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar dados da comunidade');
      console.error('Erro ao carregar dados:', error);
    } finally {
      setCarregando(false);
    }
  };

  const aoAtualizar = async () => {
    setAtualizando(true);
    await carregarDados();
    setAtualizando(false);
  };

  const aoCriarPostagem = () => {
    carregarDados();
  };

  const aoCriarAnuncio = () => {
    carregarDados();
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comunidade</Text>
        <TouchableOpacity
          onPress={() => {
            if (activeTab === 'postagens') {
              setMostrarModalPostagem(true);
            } else {
              setMostrarModalAnuncio(true);
            }
          }}
        >
          <Text style={styles.addButton}>+</Text>
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
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
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
    backgroundColor: '#007AFF',
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
