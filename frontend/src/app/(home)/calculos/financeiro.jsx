import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registroDespesa } from '../../../services/api';

export default function FinanceiroScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipoDespesa: '',
    descricao: '',
    valor: '',
    data: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegistrar = async () => {
    // Validação básica
    if (!formData.tipoDespesa || !formData.descricao || !formData.valor || !formData.data) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar dados para a API
      const apiData = {
        tipo_despesa: formData.tipoDespesa,
        descricao: formData.descricao,
        valor: parseFloat(formData.valor),
        data: formData.data,
      };

      const result = await registroDespesa(apiData);
      
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        
        // Limpar formulário
        setFormData({
          tipoDespesa: '',
          descricao: '',
          valor: '',
          data: '',
        });
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar despesa');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro inesperado ao registrar despesa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Gerenciamento</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navTab} onPress={() => router.push('../home')}>
          <Text style={styles.navTabText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => router.push('../calculos/trabalhado')}>
          <Text style={styles.navTabText}>Trabalhado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navTab, styles.activeTab]}>
          <Text style={[styles.navTabText, styles.activeTabText]}>Financeiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navTab} onPress={() => router.push('/(home)/relatorios')}>
          <Text style={styles.navTabText}>Relatórios</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Registre suas despesas</Text>

        <View style={styles.form}>
          {/* Tipo de despesa */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de despesa</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Tipo de despesa"
                value={formData.tipoDespesa}
                onChangeText={(value) => handleInputChange('tipoDespesa', value)}
                placeholderTextColor="#666"
              />
              <Ionicons name="chevron-down" size={20} color="#666" style={styles.inputIcon} />
            </View>
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={formData.descricao}
              onChangeText={(value) => handleInputChange('descricao', value)}
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Valor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Valor"
                value={formData.valor}
                onChangeText={(value) => handleInputChange('valor', value)}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              <Text style={styles.currencySymbol}>R$</Text>
            </View>
          </View>

          {/* Data */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Data"
                value={formData.data}
                onChangeText={(value) => handleInputChange('data', value)}
                placeholderTextColor="#666"
              />
              <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
            </View>
          </View>

          {/* Botão de registro */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.buttonDisabled]} 
            onPress={handleRegistrar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar Despesa</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  navTabText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100, // Espaço para a barra inferior
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingRight: 15,
  },
  inputIcon: {
    marginRight: 15,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#666',
    marginRight: 15,
    fontWeight: '500',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
