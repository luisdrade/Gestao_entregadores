import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { api } from '../services/clientConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ApiTest() {
  const [isTesting, setIsTesting] = useState(false);

  const testApiConnection = async () => {
    setIsTesting(true);
    try {
      // Teste básico de conexão - endpoint raiz
      const response = await api.get('/');
      Alert.alert('✅ Sucesso', 'API conectada com sucesso!\n\nStatus: ' + response.status + '\n\nDados: ' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Erro na conexão:', error);
      
      if (error.code === 'ECONNREFUSED') {
        Alert.alert('❌ Erro de Conexão', 'Não foi possível conectar ao servidor.\n\nVerifique se:\n• O backend está rodando\n• O IP está correto\n• A porta está correta');
      } else if (error.response) {
        if (error.response.status === 401) {
          Alert.alert('⚠️ Não Autorizado', 'Servidor funcionando, mas sem autenticação.\n\nStatus: 401 - Não Autorizado\n\n✅ Backend está rodando!\n❌ Precisa de login/token');
        } else {
          Alert.alert('⚠️ Erro do Servidor', `Status: ${error.response.status}\n\nMensagem: ${error.response.data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        Alert.alert('❌ Erro de Rede', 'Requisição feita mas sem resposta.\n\nVerifique sua conexão com a internet.');
      } else {
        Alert.alert('❌ Erro Desconhecido', 'Erro inesperado: ' + error.message);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const testDatabaseConnection = async () => {
    setIsTesting(true);
    try {
      // Teste de endpoint que existe - teste de conexão
      const response = await api.get('/registro/api/test-connection/');
      Alert.alert('✅ Banco Conectado', 'Conexão com banco de dados OK!\n\nEndpoint: /registro/api/test-connection/\nStatus: ' + response.status + '\n\nDados: ' + JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Erro no banco:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('⚠️ Não Autorizado', 'Banco funcionando, mas precisa de autenticação.\n\nStatus: 401 - Não Autorizado\n\n✅ Backend e banco funcionando!\n❌ Faça login primeiro');
      } else if (error.response?.status === 500) {
        Alert.alert('❌ Erro no Banco', 'Erro interno do servidor.\n\nVerifique os logs do backend.');
      } else if (error.response?.status === 404) {
        Alert.alert('⚠️ Endpoint não encontrado', 'O endpoint /registro/api/test-connection/ não existe.\n\nVerifique se as rotas estão configuradas no Django.\n\nTente reiniciar o servidor Django.');
      } else {
        Alert.alert('❌ Erro no Banco', 'Erro ao conectar com banco: ' + error.message);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const testAuthStatus = async () => {
    setIsTesting(true);
    try {
      // Verificar se há token salvo
      const token = await AsyncStorage.getItem('@GestaoEntregadores:token');
      if (token) {
        Alert.alert('🔑 Token Encontrado', 'Token de autenticação está salvo.\n\nTente fazer login novamente se estiver com problemas.');
      } else {
        Alert.alert('❌ Sem Token', 'Nenhum token de autenticação encontrado.\n\nVocê precisa fazer login primeiro.');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Erro ao verificar token: ' + error.message);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Teste de Conexão</Text>
      
      <TouchableOpacity 
        style={styles.testButton} 
        onPress={testApiConnection}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? 'Testando...' : '🧪 Testar Conexão API'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.testButton, styles.dbButton]} 
        onPress={testDatabaseConnection}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? 'Testando...' : '🗄️ Testar Banco de Dados'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.testButton, styles.authButton]} 
        onPress={testAuthStatus}
        disabled={isTesting}
      >
        <Text style={styles.buttonText}>
          {isTesting ? 'Verificando...' : '🔑 Verificar Status Auth'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.info}>
        <Text style={styles.bold}>✅ Backend funcionando!</Text>{'\n'}
        Os erros 401 e 404 indicam que o servidor está rodando, mas precisa de autenticação e rotas configuradas.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  dbButton: {
    backgroundColor: '#28a745',
  },
  authButton: {
    backgroundColor: '#FF9500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: '#28a745',
  },
});
