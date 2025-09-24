import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import * as ImagePicker from 'expo-image-picker';
import communityService from '../services/communityService';
import { httpClient } from '../services/clientConfig';

const _ModalCriarAnuncioVeiculo = ({ visivel, aoFechar, aoCriarAnuncio }) => {
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [carregandoVeiculos, setCarregandoVeiculos] = useState(false);
  const [mostrarSelecaoVeiculo, setMostrarSelecaoVeiculo] = useState(false);
  const [ano, setAno] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [link_externo, setLink_externo] = useState('');
  const [foto, setFoto] = useState(null);
  const [carregando, setCarregando] = useState(false);

  // Carregar veículos do usuário quando o modal abrir
  useEffect(() => {
    if (visivel) {
      carregarVeiculos();
    }
  }, [visivel]);

  const carregarVeiculos = async () => {
    try {
      setCarregandoVeiculos(true);
      console.log('🔄 Carregando veículos do usuário...');
      
      const response = await httpClient.get('/api/veiculos/');
      
      if (response.data) {
        setVeiculos(response.data);
        console.log('✅ Veículos carregados:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar veículos:', error);
      Alert.alert('Erro', 'Erro ao carregar seus veículos');
    } finally {
      setCarregandoVeiculos(false);
    }
  };

  const selecionarImagem = async () => {
    // Temporariamente desabilitado até resolver o problema do ExponentImagePicker
    Alert.alert('Funcionalidade em desenvolvimento', 'A seleção de imagens será implementada em breve.');
    
    // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    // if (status !== 'granted') {
    //   Alert.alert('Erro', 'Permissão para acessar a galeria é necessária');
    //   return;
    // }

    // const resultado = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsEditing: true,
    //   aspect: [16, 9],
    //   quality: 0.8,
    // });

    // if (!resultado.canceled) {
    //   setFoto(resultado.assets[0]);
    // }
  };

  const aoEnviar = async () => {
    if (!veiculoSelecionado || !ano.trim() || !quilometragem.trim() || 
        !preco.trim() || !localizacao.trim() || !link_externo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setCarregando(true);
    try {
      await communityService.createVehicleAd({
        modelo: veiculoSelecionado.modelo,
        ano: parseInt(ano),
        quilometragem: parseInt(quilometragem),
        preco: parseFloat(preco),
        localizacao: localizacao.trim(),
        link_externo: link_externo.trim(),
        foto: foto,
      });

      Alert.alert('Sucesso', 'Anúncio criado com sucesso!');
      // Limpar campos
      setVeiculoSelecionado(null);
      setAno('');
      setQuilometragem('');
      setPreco('');
      setLocalizacao('');
      setLink_externo('');
      setFoto(null);
      aoCriarAnuncio();
      aoFechar();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar anúncio. Tente novamente.');
      console.error('Erro ao criar anúncio:', error);
    } finally {
      setCarregando(false);
    }
  };

  const aoFecharModal = () => {
    // Limpar campos
    setVeiculoSelecionado(null);
    setAno('');
    setQuilometragem('');
    setPreco('');
    setLocalizacao('');
    setLink_externo('');
    setFoto(null);
    setMostrarSelecaoVeiculo(false);
    aoFechar();
  };

  return (
    <Modal
      visible={visivel}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={aoFecharModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={aoFecharModal}>
            <Text style={styles.botaoCancelar}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Novo Anúncio</Text>
          <TouchableOpacity
            onPress={aoEnviar}
            disabled={carregando}
            style={[styles.botaoPublicar, carregando && styles.botaoPublicarDesabilitado]}
          >
            <Text style={[styles.textoBotaoPublicar, carregando && styles.textoBotaoPublicarDesabilitado]}>
              {carregando ? 'Publicando...' : 'Publicar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.conteudo}>
          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Selecionar Veículo *</Text>
            <TouchableOpacity
              style={styles.seletorVeiculo}
              onPress={() => setMostrarSelecaoVeiculo(true)}
            >
              <Text style={[
                styles.textoSeletorVeiculo,
                !veiculoSelecionado && styles.textoSeletorVeiculoPlaceholder
              ]}>
                {veiculoSelecionado 
                  ? `${veiculoSelecionado.modelo} (${veiculoSelecionado.tipo === 'carro' ? 'Carro' : 'Moto'})`
                  : 'Selecione um veículo'
                }
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.linha}>
            <View style={[styles.containerInput, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.rotulo}>Ano *</Text>
              <TextInput
                style={styles.input}
                value={ano}
                onChangeText={setAno}
                placeholder="2020"
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
            <View style={[styles.containerInput, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.rotulo}>Quilometragem *</Text>
              <TextInput
                style={styles.input}
                value={quilometragem}
                onChangeText={setQuilometragem}
                placeholder="50000"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Preço *</Text>
            <TextInput
              style={styles.input}
              value={preco}
              onChangeText={setPreco}
              placeholder="15000.00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Localização *</Text>
            <TextInput
              style={styles.input}
              value={localizacao}
              onChangeText={setLocalizacao}
              placeholder="São Paulo, SP"
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Link do Anúncio *</Text>
            <TextInput
              style={styles.input}
              value={link_externo}
              onChangeText={setLink_externo}
              placeholder="https://..."
              keyboardType="url"
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Foto (opcional)</Text>
            <TouchableOpacity style={styles.botaoImagem} onPress={selecionarImagem}>
              <Text style={styles.textoBotaoImagem}>
                {foto ? 'Foto selecionada' : 'Selecionar Foto'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de Seleção de Veículos */}
      <Modal
        visible={mostrarSelecaoVeiculo}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMostrarSelecaoVeiculo(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSelecaoVeiculo}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Selecionar Veículo</Text>
              <TouchableOpacity onPress={() => setMostrarSelecaoVeiculo(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            {carregandoVeiculos ? (
              <View style={styles.carregandoContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.textoCarregando}>Carregando veículos...</Text>
              </View>
            ) : veiculos.length === 0 ? (
              <View style={styles.semVeiculosContainer}>
                <Ionicons name="car-outline" size={48} color="#ccc" />
                <Text style={styles.textoSemVeiculos}>Nenhum veículo cadastrado</Text>
                <Text style={styles.textoSemVeiculosDescricao}>
                  Cadastre um veículo primeiro em "Meus Veículos"
                </Text>
              </View>
            ) : (
              <FlatList
                data={veiculos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.itemVeiculo,
                      veiculoSelecionado?.id === item.id && styles.itemVeiculoSelecionado
                    ]}
                    onPress={() => {
                      setVeiculoSelecionado(item);
                      setMostrarSelecaoVeiculo(false);
                    }}
                  >
                    <View style={styles.infoVeiculo}>
                      <View style={styles.tipoVeiculo}>
                        <Ionicons 
                          name={item.tipo === 'carro' ? 'car' : 'bicycle'} 
                          size={20} 
                          color="#007AFF" 
                        />
                        <Text style={styles.textoTipoVeiculo}>
                          {item.tipo === 'carro' ? 'Carro' : 'Moto'}
                        </Text>
                      </View>
                      <Text style={styles.textoModeloVeiculo}>{item.modelo}</Text>
                      <Text style={styles.textoCategoriaVeiculo}>
                        {item.categoria === 'passeio' ? 'Passeio' : 'Utilitário'}
                      </Text>
                    </View>
                    {veiculoSelecionado?.id === item.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.listaVeiculos}
              />
            )}
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  botaoCancelar: {
    fontSize: 16,
    color: '#007AFF',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  botaoPublicar: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoPublicarDesabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotaoPublicar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  textoBotaoPublicarDesabilitado: {
    color: '#999',
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  containerInput: {
    marginBottom: 16,
  },
  linha: {
    flexDirection: 'row',
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botaoImagem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  textoBotaoImagem: {
    fontSize: 16,
    color: '#007AFF',
  },
  // Estilos do seletor de veículos
  seletorVeiculo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    height: 50,
  },
  textoSeletorVeiculo: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  textoSeletorVeiculoPlaceholder: {
    color: '#999',
  },
  // Estilos do modal de seleção
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSelecaoVeiculo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carregandoContainer: {
    padding: 40,
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  semVeiculosContainer: {
    padding: 40,
    alignItems: 'center',
  },
  textoSemVeiculos: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
  },
  textoSemVeiculosDescricao: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  listaVeiculos: {
    maxHeight: 400,
  },
  itemVeiculo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemVeiculoSelecionado: {
    backgroundColor: '#f0f8ff',
  },
  infoVeiculo: {
    flex: 1,
  },
  tipoVeiculo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  textoTipoVeiculo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
  textoModeloVeiculo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  textoCategoriaVeiculo: {
    fontSize: 14,
    color: '#666',
  },
});

export default _ModalCriarAnuncioVeiculo;
