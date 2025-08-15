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
import TopNavBar from '../../../components/_NavBar_Superior';

export default function FinanceiroScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    tipoDespesa: '',
    descricao: '',
    valor: '',
    data: '',
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

    if (!formData.tipoDespesa.trim()) {
      newErrors.tipoDespesa = 'Tipo de despesa é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 5) {
      newErrors.descricao = 'Descrição deve ter pelo menos 5 caracteres';
    }

    if (!formData.valor.trim()) {
      newErrors.valor = 'Valor é obrigatório';
    } else if (isNaN(formData.valor) || parseFloat(formData.valor) <= 0) {
      newErrors.valor = 'Valor deve ser um número positivo';
    }

    if (!formData.data.trim()) {
      newErrors.data = 'Data é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistrar = async () => {
    if (!validateForm()) {
      Alert.alert('Erro de Validação', 'Por favor, corrija os erros nos campos destacados.');
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
        Alert.alert('Sucesso', result.message, [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setFormData({
                tipoDespesa: '',
                descricao: '',
                valor: '',
                data: '',
              });
              setErrors({});
            }
          }
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar despesa');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao registrar despesa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatCurrency = (value) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue === '') return '';
    
    // Converte para centavos e formata
    const floatValue = parseFloat(numericValue) / 100;
    return floatValue.toFixed(2);
  };

  const handleCurrencyChange = (value) => {
    const formatted = formatCurrency(value);
    handleInputChange('valor', formatted);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Registro de Despesas</Text>
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
        <Text style={styles.title}>Registre suas despesas</Text>

        <View style={styles.form}>
          {/* Tipo de despesa */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de despesa *</Text>
            <View style={[styles.inputWithIcon, errors.tipoDespesa && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Ex: Combustível, Manutenção, Alimentação"
                value={formData.tipoDespesa}
                onChangeText={(value) => handleInputChange('tipoDespesa', value)}
                placeholderTextColor="#666"
              />
              <Ionicons name="pricetag" size={20} color="#666" style={styles.inputIcon} />
            </View>
            {errors.tipoDespesa && <Text style={styles.errorText}>{errors.tipoDespesa}</Text>}
          </View>

          {/* Descrição */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descrição *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.descricao && styles.inputError]}
              placeholder="Descreva detalhadamente a despesa realizada"
              value={formData.descricao}
              onChangeText={(value) => handleInputChange('descricao', value)}
              placeholderTextColor="#666"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
          </View>

          {/* Valor */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Valor da despesa *</Text>
            <View style={[styles.inputWithIcon, errors.valor && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="0,00"
                value={formData.valor}
                onChangeText={handleCurrencyChange}
                keyboardType="numeric"
                placeholderTextColor="#666"
              />
              <Text style={styles.currencySymbol}>R$</Text>
            </View>
            {errors.valor && <Text style={styles.errorText}>{errors.valor}</Text>}
          </View>

          {/* Data */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Data da despesa *</Text>
            <View style={[styles.inputWithIcon, errors.data && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                value={formData.data}
                onChangeText={(value) => handleInputChange('data', value)}
                placeholderTextColor="#666"
              />
              <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
            </View>
            {errors.data && <Text style={styles.errorText}>{errors.data}</Text>}
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
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 5,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 15,
  },
});
