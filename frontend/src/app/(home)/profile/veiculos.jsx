import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../services/api';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Schema de validação
const validationSchema = Yup.object().shape({
  tipo: Yup.string()
    .required('Tipo do veículo é obrigatório'),
  modelo: Yup.string()
    .trim()
    .min(2, 'Modelo deve ter pelo menos 2 caracteres')
    .max(50, 'Modelo deve ter no máximo 50 caracteres')
    .required('Modelo é obrigatório'),
  categoria: Yup.string()
    .required('Categoria é obrigatória'),
  placa: Yup.string()
    .trim()
    .max(10, 'Placa deve ter no máximo 10 caracteres'),
  kmPorL: Yup.number()
    .min(0.1, 'KM/L deve ser maior que 0')
    .max(50, 'KM/L deve ser menor que 50')
    .required('KM/L é obrigatório'),
});

export default function VeiculosScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showKmHelp, setShowKmHelp] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    }
  };

  const handleCadastrarVeiculo = async (values, { setSubmitting, resetForm, setFieldError }) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Cadastrando veículo:', values);
      
      // Chamada para API para cadastrar veículo
      const response = await api.post('/api/veiculos/', {
        tipo: values.tipo,
        modelo: values.modelo,
        categoria: values.categoria,
        placa: values.placa,
        km_por_l: parseFloat(values.kmPorL)
      });
      
      console.log('Resposta da API:', response.data);
      
      if (response.data.success) {
        Alert.alert('Sucesso', 'Veículo cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              router.back();
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao cadastrar veículo');
      }
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Tratar erros específicos do backend
      if (error.response?.data?.message) {
        Alert.alert('Erro', error.response.data.message);
      } else if (error.response?.data?.errors) {
        // Mapear erros de validação para campos específicos
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(field => {
          if (field === 'km_por_l') {
            setFieldError('kmPorL', errors[field][0]);
          } else {
            setFieldError(field, errors[field][0]);
          }
        });
      } else {
        Alert.alert('Erro', 'Erro inesperado ao cadastrar veículo. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const toggleKmHelp = () => {
    setShowKmHelp(!showKmHelp);
  };

  const SelectOption = ({ label, value, onSelect, isSelected }) => (
    <TouchableOpacity
      style={[styles.selectOption, isSelected && styles.selectOptionSelected]}
      onPress={() => onSelect(value)}
    >
      <Text style={[styles.selectOptionText, isSelected && styles.selectOptionTextSelected]}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registrar veículo</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Cadastro de veículo</Text>
            
            <Formik
              initialValues={{
                tipo: 'carro',
                modelo: '',
                categoria: 'passeio',
                placa: '',
                kmPorL: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleCadastrarVeiculo}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, setFieldError }) => (
                <View style={styles.form}>
                  {/* Tipo do Veículo */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Tipo do Veículo *</Text>
                    <TouchableOpacity
                      style={[
                        styles.selectContainer,
                        touched.tipo && errors.tipo && styles.inputError
                      ]}
                      onPress={() => setShowTipoModal(true)}
                    >
                      <Text style={[
                        styles.selectText,
                        !values.tipo && styles.selectPlaceholder
                      ]}>
                        {values.tipo === 'carro' ? 'Carro' : values.tipo === 'moto' ? 'Moto' : 'Selecione o tipo'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                    {touched.tipo && errors.tipo && (
                      <Text style={styles.errorText}>{errors.tipo}</Text>
                    )}
                  </View>

                  {/* Categoria */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Categoria *</Text>
                    <TouchableOpacity
                      style={[
                        styles.selectContainer,
                        touched.categoria && errors.categoria && styles.inputError
                      ]}
                      onPress={() => setShowCategoriaModal(true)}
                    >
                      <Text style={[
                        styles.selectText,
                        !values.categoria && styles.selectPlaceholder
                      ]}>
                        {values.categoria === 'passeio' ? 'Passeio' : values.categoria === 'utilitario' ? 'Utilitário' : 'Selecione a categoria'}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                    {touched.categoria && errors.categoria && (
                      <Text style={styles.errorText}>{errors.categoria}</Text>
                    )}
                  </View>

                  {/* Modelo */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Modelo *</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        touched.modelo && errors.modelo && styles.inputError
                      ]}
                      placeholder="Digite o modelo do veículo"
                      value={values.modelo}
                      onChangeText={handleChange('modelo')}
                      onBlur={handleBlur('modelo')}
                      placeholderTextColor="#666"
                      autoCapitalize="words"
                    />
                    {touched.modelo && errors.modelo && (
                      <Text style={styles.errorText}>{errors.modelo}</Text>
                    )}
                  </View>

                  {/* Placa */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Placa</Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        touched.placa && errors.placa && styles.inputError
                      ]}
                      placeholder="Digite a placa do veículo"
                      value={values.placa}
                      onChangeText={handleChange('placa')}
                      onBlur={handleBlur('placa')}
                      placeholderTextColor="#666"
                      autoCapitalize="characters"
                      maxLength={10}
                    />
                    {touched.placa && errors.placa && (
                      <Text style={styles.errorText}>{errors.placa}</Text>
                    )}
                  </View>

                  {/* KM/L */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>KM/L *</Text>
                    <View style={styles.kmContainer}>
                      <TextInput
                        style={[
                          styles.kmInput,
                          touched.kmPorL && errors.kmPorL && styles.inputError
                        ]}
                        placeholder="0.0"
                        value={values.kmPorL}
                        onChangeText={handleChange('kmPorL')}
                        onBlur={handleBlur('kmPorL')}
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        maxLength={5}
                      />
                      <TouchableOpacity 
                        style={styles.kmHelpButton}
                        onPress={toggleKmHelp}
                      >
                        <Text style={styles.kmHelpText}>Não sei quanto faz</Text>
                      </TouchableOpacity>
                    </View>
                    {touched.kmPorL && errors.kmPorL && (
                      <Text style={styles.errorText}>{errors.kmPorL}</Text>
                    )}
                    
                    {/* Dicas de KM/L */}
                    {showKmHelp && (
                      <View style={styles.kmTips}>
                        <Text style={styles.kmTipsTitle}>Dicas de consumo médio:</Text>
                        <View style={styles.kmTipItem}>
                          <Ionicons name="car" size={16} color="#34C759" />
                          <Text style={styles.kmTipText}>Carros pequenos: 10-15 km/l</Text>
                        </View>
                        <View style={styles.kmTipItem}>
                          <Ionicons name="car" size={16} color="#34C759" />
                          <Text style={styles.kmTipText}>Carros médios: 8-12 km/l</Text>
                        </View>
                        <View style={styles.kmTipItem}>
                          <Ionicons name="bicycle" size={16} color="#34C759" />
                          <Text style={styles.kmTipText}>Motos: 25-40 km/l</Text>
                        </View>
                        <View style={styles.kmTipItem}>
                          <Ionicons name="information-circle" size={16} color="#007AFF" />
                          <Text style={styles.kmTipText}>Consulte o manual do veículo</Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {/* Botão de cadastrar */}
                  <TouchableOpacity 
                    style={[
                      styles.cadastrarButton, 
                      (isLoading || Object.keys(errors).length > 0) && styles.buttonDisabled
                    ]} 
                    onPress={handleSubmit}
                    disabled={isLoading || Object.keys(errors).length > 0}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.cadastrarButtonText}>
                        {Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Cadastrar veículo'}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Modal Tipo */}
                  <Modal
                    visible={showTipoModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowTipoModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Selecione o tipo</Text>
                          <TouchableOpacity onPress={() => setShowTipoModal(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                          </TouchableOpacity>
                        </View>
                        <SelectOption
                          label="Carro"
                          value="carro"
                          onSelect={(value) => {
                            setFieldValue('tipo', value);
                            setShowTipoModal(false);
                          }}
                          isSelected={values.tipo === 'carro'}
                        />
                        <SelectOption
                          label="Moto"
                          value="moto"
                          onSelect={(value) => {
                            setFieldValue('tipo', value);
                            setShowTipoModal(false);
                          }}
                          isSelected={values.tipo === 'moto'}
                        />
                      </View>
                    </View>
                  </Modal>

                  {/* Modal Categoria */}
                  <Modal
                    visible={showCategoriaModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowCategoriaModal(false)}
                  >
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Selecione a categoria</Text>
                          <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                            <Ionicons name="close" size={24} color="#666" />
                          </TouchableOpacity>
                        </View>
                        <SelectOption
                          label="Passeio"
                          value="passeio"
                          onSelect={(value) => {
                            setFieldValue('categoria', value);
                            setShowCategoriaModal(false);
                          }}
                          isSelected={values.categoria === 'passeio'}
                        />
                        <SelectOption
                          label="Utilitário"
                          value="utilitario"
                          onSelect={(value) => {
                            setFieldValue('categoria', value);
                            setShowCategoriaModal(false);
                          }}
                          isSelected={values.categoria === 'utilitario'}
                        />
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 36,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 25,
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
  selectContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    height: 50,
  },
  selectText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  selectPlaceholder: {
    color: '#999',
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectOptionSelected: {
    backgroundColor: '#f0f8ff',
    borderBottomColor: '#007AFF',
  },
  selectOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    height: 50,
  },
  kmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  kmInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    fontSize: 16,
    height: 50,
    flex: 1,
  },
  kmHelpButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  kmHelpText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  kmTips: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  kmTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  kmTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  kmTipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
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
  cadastrarButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
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
    width: '80%',
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
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});
