import React, { useState } from 'react';
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
} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import communityService from '../services/communityService';

const _ModalCriarAnuncioVeiculo = ({ visivel, aoFechar, aoCriarAnuncio }) => {
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [preco, setPreco] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [link_externo, setLink_externo] = useState('');
  const [foto, setFoto] = useState(null);
  const [carregando, setCarregando] = useState(false);

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
    if (!modelo.trim() || !ano.trim() || !quilometragem.trim() || 
        !preco.trim() || !localizacao.trim() || !link_externo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setCarregando(true);
    try {
      await communityService.createVehicleAd({
        modelo: modelo.trim(),
        ano: parseInt(ano),
        quilometragem: parseInt(quilometragem),
        preco: parseFloat(preco),
        localizacao: localizacao.trim(),
        link_externo: link_externo.trim(),
        foto: foto,
      });

      Alert.alert('Sucesso', 'Anúncio criado com sucesso!');
      // Limpar campos
      setModelo('');
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
    setModelo('');
    setAno('');
    setQuilometragem('');
    setPreco('');
    setLocalizacao('');
    setLink_externo('');
    setFoto(null);
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
            <Text style={styles.rotulo}>Modelo do Veículo *</Text>
            <TextInput
              style={styles.input}
              value={modelo}
              onChangeText={setModelo}
              placeholder="Ex: Honda CG 160"
            />
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
});

export default _ModalCriarAnuncioVeiculo;
