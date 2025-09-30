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
// A criação da postagem é delegada ao pai via aoCriarPostagem

const _ModalCriarPostagem = ({ visivel, aoFechar, aoCriarPostagem }) => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [carregando, setCarregando] = useState(false);

  const aoEnviar = async () => {
    if (!titulo.trim() || !conteudo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setCarregando(true);
    try {
      await aoCriarPostagem({
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
      });

      Alert.alert('Sucesso', 'Postagem criada com sucesso!');
      setTitulo('');
      setConteudo('');
      aoFechar();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar postagem. Tente novamente.');
      console.error('Erro ao criar postagem:', error);
    } finally {
      setCarregando(false);
    }
  };

  const aoFecharModal = () => {
    setTitulo('');
    setConteudo('');
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
          <Text style={styles.titulo}>Nova Postagem</Text>
          <TouchableOpacity
            onPress={aoEnviar}
            disabled={carregando}
            style={[styles.botaoPostar, carregando && styles.botaoPostarDesabilitado]}
          >
            <Text style={[styles.textoBotaoPostar, carregando && styles.textoBotaoPostarDesabilitado]}>
              {carregando ? 'Postando...' : 'Postar'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.conteudo}>
          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Título</Text>
            <TextInput
              style={styles.inputTitulo}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Digite o título da sua postagem"
              maxLength={200}
            />
          </View>

          <View style={styles.containerInput}>
            <Text style={styles.rotulo}>Conteúdo</Text>
            <TextInput
              style={styles.inputConteudo}
              value={conteudo}
              onChangeText={setConteudo}
              placeholder="Compartilhe suas experiências, dicas ou dúvidas..."
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
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
  botaoPostar: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  botaoPostarDesabilitado: {
    backgroundColor: '#ccc',
  },
  textoBotaoPostar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  textoBotaoPostarDesabilitado: {
    color: '#999',
  },
  conteudo: {
    flex: 1,
    padding: 16,
  },
  containerInput: {
    marginBottom: 20,
  },
  rotulo: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputTitulo: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  inputConteudo: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
  },
});

export default _ModalCriarPostagem;
