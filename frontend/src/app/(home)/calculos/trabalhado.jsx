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
import { registroTrabalho } from '../../../services/api';
import TopNavBar from '../../../components/_NavBar_Superior';

export default function TrabalhadoScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    data: '',
    horaInicio: '',
    horaFim: '',
    quantidadeEntregues: '',
    quantidadeNaoEntregues: '',
    tipoPagamento: '',
    valor: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegistrar = async () => {
    // Validação básica
    if (!formData.data || !formData.horaInicio || !formData.horaFim || 
        !formData.quantidadeEntregues || !formData.quantidadeNaoEntregues || 
        !formData.tipoPagamento || !formData.valor) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar dados para a API
      const apiData = {
        data: formData.data,
        hora_inicio: formData.horaInicio,
        hora_fim: formData.horaFim,
        quantidade_entregues: parseInt(formData.quantidadeEntregues),
        quantidade_nao_entregues: parseInt(formData.quantidadeNaoEntregues),
        tipo_pagamento: formData.tipoPagamento,
        valor: parseFloat(formData.valor),
      };

      const result = await registroTrabalho(apiData);
      
      if (result.success) {
        Alert.alert('Sucesso', result.message);
        
        // Limpar formulário
        setFormData({
          data: '',
          horaInicio: '',
          horaFim: '',
          quantidadeEntregues: '',
          quantidadeNaoEntregues: '',
          tipoPagamento: '',
          valor: '',
        });
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar trabalho');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Erro inesperado ao registrar trabalho');
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

      {/* NavBar */}
      <TopNavBar />


      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Registre seu dia de trabalho</Text>

        <View style={styles.form}>
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

          {/* Horários */}
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Hora início</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  placeholder="Hora início"
                  value={formData.horaInicio}
                  onChangeText={(value) => handleInputChange('horaInicio', value)}
                  placeholderTextColor="#666"
                />
                <Ionicons name="time" size={20} color="#666" style={styles.inputIcon} />
              </View>
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={styles.label}>Hora Fim</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={styles.input}
                  placeholder="Hora Fim"
                  value={formData.horaFim}
                  onChangeText={(value) => handleInputChange('horaFim', value)}
                  placeholderTextColor="#666"
                />
                <Ionicons name="time" size={20} color="#666" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          {/* Quantidades */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantidade entregues</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantidade entregues"
              value={formData.quantidadeEntregues}
              onChangeText={(value) => handleInputChange('quantidadeEntregues', value)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Quantidade não entregues</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantidade não entregues"
              value={formData.quantidadeNaoEntregues}
              onChangeText={(value) => handleInputChange('quantidadeNaoEntregues', value)}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
          </View>

          {/* Tipo de pagamento */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de pagamento</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                style={styles.input}
                placeholder="Tipo de pagamento"
                value={formData.tipoPagamento}
                onChangeText={(value) => handleInputChange('tipoPagamento', value)}
                placeholderTextColor="#666"
              />
              <Ionicons name="chevron-down" size={20} color="#666" style={styles.inputIcon} />
            </View>
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

          {/* Botão de registro */}
          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.buttonDisabled]} 
            onPress={handleRegistrar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Registrar dia trabalhado</Text>
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
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
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
