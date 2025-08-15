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
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { registroDespesa } from '../../../services/api';
import TopNavBar from '../../../components/_NavBar_Superior';

export default function FinanceiroScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showExpenseTypeModal, setShowExpenseTypeModal] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState('');
  const [formData, setFormData] = useState({
    tipoDespesa: '',
    descricao: '',
    valor: '',
    data: '',
  });

  const [errors, setErrors] = useState({});

  // Tipos de despesa personalizados (começam vazios)
  const [expenseTypes, setExpenseTypes] = useState([]);

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

  const selectExpenseType = (type) => {
    if (type === 'Adicionar despesa') {
      setShowExpenseTypeModal(true);
    } else {
      setSelectedExpenseType(type);
      handleInputChange('tipoDespesa', type);
      setShowExpenseTypeModal(false);
    }
  };

  const handleAddNewExpenseType = () => {
    setShowExpenseTypeModal(false);
    // Registrar função global para receber o novo tipo
    global.addExpenseType = addExpenseType;
    // Navegar para página de cadastro de tipo de despesa
    router.push('/(home)/calculos/cadastro-tipo-despesa');
  };

  // Função para carregar tipos de despesa salvos
  const loadExpenseTypes = () => {
    try {
      // TODO: Implementar chamada para API para carregar tipos de despesa
      // Por enquanto, vamos usar AsyncStorage para persistir localmente
      // const savedTypes = await AsyncStorage.getItem('expenseTypes');
      // if (savedTypes) {
      //   setExpenseTypes(JSON.parse(savedTypes));
      // }
    } catch (error) {
      console.log('Erro ao carregar tipos de despesa:', error);
    }
  };

  // Função para adicionar novo tipo de despesa à lista
  const addExpenseType = (newType) => {
    setExpenseTypes(prev => [...prev, newType]);
    // TODO: Salvar na API e AsyncStorage
  };

  // Carregar tipos quando o componente montar
  React.useEffect(() => {
    loadExpenseTypes();
  }, []);



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
            
            {/* Campo de seleção */}
            <TouchableOpacity 
              style={[styles.selectField, errors.tipoDespesa && styles.inputError]}
              onPress={() => setShowExpenseTypeModal(true)}
            >
              <Text style={[
                styles.selectText, 
                !selectedExpenseType && styles.placeholderText
              ]}>
                {selectedExpenseType || "Selecione o tipo de despesa"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            
            {errors.tipoDespesa && <Text style={styles.errorText}>{errors.tipoDespesa}</Text>}
          </View>

          {/* Modal de seleção de tipo de despesa */}
          <Modal
            visible={showExpenseTypeModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowExpenseTypeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Selecione o tipo de despesa</Text>
                
                <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                  {expenseTypes.length === 0 ? (
                    <View style={styles.emptyState}>
                      <Ionicons name="document-outline" size={48} color="#ccc" />
                      <Text style={styles.emptyStateText}>Nenhum tipo de despesa cadastrado</Text>
                      <Text style={styles.emptyStateSubtext}>
                        Clique em "Adicionar novo tipo" para começar
                      </Text>
                    </View>
                  ) : (
                    <>
                      {expenseTypes.map((type, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.optionItem,
                            selectedExpenseType === type && styles.optionItemSelected
                          ]}
                          onPress={() => selectExpenseType(type)}
                        >
                          <Text style={[
                            styles.optionText,
                            selectedExpenseType === type && styles.optionTextSelected
                          ]}>
                            {type}
                          </Text>
                          {selectedExpenseType === type && (
                            <Ionicons name="checkmark" size={20} color="#007AFF" />
                          )}
                        </TouchableOpacity>
                      ))}
                      
                      {/* Separador */}
                      <View style={styles.separator} />
                    </>
                  )}
                  
                  {/* Opção para adicionar novo tipo */}
                  <TouchableOpacity
                    style={styles.addNewOption}
                    onPress={handleAddNewExpenseType}
                  >
                    <Ionicons name="add-circle" size={20} color="#007AFF" />
                    <Text style={styles.addNewOptionText}>Adicionar novo tipo</Text>
                  </TouchableOpacity>
                </ScrollView>
                
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={() => setShowExpenseTypeModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  placeholderText: {
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#f8f9fa',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  optionTextSelected: {
    fontWeight: '600',
    color: '#007AFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  addNewOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 10,
  },
  addNewOptionText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
