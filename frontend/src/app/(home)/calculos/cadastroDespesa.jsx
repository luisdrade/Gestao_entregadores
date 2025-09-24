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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { criarCategoriaDespesa } from '../../../services/clientConfig';
import TopNavBar from '../../../components/_NavBar_Superior';

export default function CadastroTipoDespesaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 10) {
      newErrors.descricao = 'Descrição deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros nos campos destacados.');
      return;
    }

    setIsLoading(true);
    try {
      // Criar categoria na API
      const result = await criarCategoriaDespesa({
        nome: formData.nome,
        descricao: formData.descricao
      });
      
      if (result.success) {
        // Emitir evento global para adicionar o novo tipo
        if (global.addExpenseType) {
          await global.addExpenseType(formData.nome);
        }
        
        Alert.alert('Sucesso', 'Tipo de despesa cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Voltar para a página anterior
              router.back();
            }
          }
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao cadastrar tipo de despesa');
      }
    } catch (error) {
      console.error('Erro ao cadastrar categoria:', error);
      Alert.alert('Erro', 'Erro inesperado ao cadastrar tipo de despesa. Tente novamente.');
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
          <Text style={styles.headerTitle}>Cadastrar Tipo de Despesa</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Bar */}
      <TopNavBar />

      {/* Content */}
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Cadastre um novo tipo de despesa</Text>

        <View style={styles.form}>
          {/* Nome */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do tipo de despesa *</Text>
            <TextInput
              style={[styles.input, errors.nome && styles.inputError]}
              placeholder="Ex: Combustível, Manutenção, Alimentação"
              value={formData.nome}
              onChangeText={(value) => handleInputChange('nome', value)}
              placeholderTextColor="#666"
            />
            {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
              placeholder="Descreva detalhadamente este tipo de despesa"
              value={formData.descricao}
              onChangeText={(value) => handleInputChange('descricao', value)}
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
          </View>

          {/* Botão de salvar */}
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.buttonDisabled]} 
            onPress={handleSalvar}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Salvar Tipo de Despesa</Text>
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
    paddingBottom: 100,
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
  },
  textArea: {
    minHeight: 100,
    paddingTop: 15,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
  },
});
