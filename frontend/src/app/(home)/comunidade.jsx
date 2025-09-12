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
import Header from '../../components/_Header';
import TopNavBar from '../../components/_NavBar_Superior';
import _CardPostagem from '../../components/_CardPostagem';
import _CardAnuncioVeiculo from '../../components/_CardAnuncioVeiculo';
import _ModalCriarPostagem from '../../components/_ModalCriarPostagem';
import _ModalCriarAnuncioVeiculo from '../../components/_ModalCriarAnuncioVeiculo';
import communityService from '../../services/communityService';

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
      // Simulando dados de uma comunidade real com postagens de vários usuários
      const postagensMock = [
        {
          id: 1,
          autor: 'João Silva',
          titulo: 'Dicas para economizar combustível',
          conteudo: 'Compartilhando algumas dicas que aprendi ao longo dos anos para economizar combustível durante as entregas. Sempre mantenha os pneus calibrados e evite acelerações bruscas!',
          data_criacao: new Date().toISOString(),
          curtidas: 12,
          comentarios: 3,
        },
        {
          id: 2,
          autor: 'Maria Santos',
          titulo: 'Melhores rotas para o centro',
          conteudo: 'Descobri algumas rotas alternativas que podem economizar tempo no trânsito do centro da cidade. A Rua das Flores sempre está mais livre pela manhã!',
          data_criacao: new Date(Date.now() - 86400000).toISOString(),
          curtidas: 8,
          comentarios: 5,
        },
        {
          id: 3,
          autor: 'Carlos Oliveira',
          titulo: 'App de trânsito em tempo real',
          conteudo: 'Galera, estou usando o Waze há 3 meses e tem me ajudado muito a evitar congestionamentos. Recomendo para todos!',
          data_criacao: new Date(Date.now() - 172800000).toISOString(),
          curtidas: 15,
          comentarios: 7,
        },
        {
          id: 4,
          autor: 'Ana Costa',
          titulo: 'Cuidados com a moto na chuva',
          conteudo: 'Com a temporada de chuvas chegando, lembrem-se de sempre verificar os freios e pneus. Segurança em primeiro lugar!',
          data_criacao: new Date(Date.now() - 259200000).toISOString(),
          curtidas: 20,
          comentarios: 4,
        },
        {
          id: 5,
          autor: 'Pedro Mendes',
          titulo: 'Novo restaurante na região',
          conteudo: 'Abriu um restaurante novo na Rua Principal que tem promoção para entregadores. Vale a pena conferir!',
          data_criacao: new Date(Date.now() - 345600000).toISOString(),
          curtidas: 6,
          comentarios: 2,
        },
        {
          id: 6,
          autor: 'Lucia Ferreira',
          titulo: 'Grupo de WhatsApp da região',
          conteudo: 'Criei um grupo no WhatsApp para entregadores da nossa região trocarem informações. Quem quiser participar, me chama!',
          data_criacao: new Date(Date.now() - 432000000).toISOString(),
          curtidas: 25,
          comentarios: 12,
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
          vendedor: 'João Silva',
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
          vendedor: 'Maria Santos',
        },
        {
          id: 3,
          modelo: 'Honda Biz 125',
          ano: 2021,
          quilometragem: 15000,
          preco: 6500.00,
          localizacao: 'Belo Horizonte, MG',
          link_externo: 'https://exemplo.com/anuncio3',
          foto: null,
          data_publicacao: new Date(Date.now() - 259200000).toISOString(),
          vendedor: 'Carlos Oliveira',
        },
        {
          id: 4,
          modelo: 'Yamaha XRE 300',
          ano: 2020,
          quilometragem: 30000,
          preco: 15000.00,
          localizacao: 'Salvador, BA',
          link_externo: 'https://exemplo.com/anuncio4',
          foto: null,
          data_publicacao: new Date(Date.now() - 345600000).toISOString(),
          vendedor: 'Ana Costa',
        },
      ];

      setPostagens(postagensMock);
      setAnuncios(anunciosMock);
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
    backgroundColor: '#007AFF',
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
