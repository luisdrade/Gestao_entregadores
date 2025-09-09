import React, { useState, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../../services/clientConfig';
import DatePicker from '../../../components/_DataComp';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

// Schema de validação
const validationSchema = Yup.object().shape({
  nome: Yup.string()
    .trim()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  username: Yup.string()
    .trim()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e _')
    .required('Username é obrigatório'),
  email: Yup.string()
    .trim()
    .email('Email inválido')
    .max(150, 'Email deve ter no máximo 150 caracteres')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .trim()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres')
    .max(15, 'Telefone deve ter no máximo 15 caracteres')
    .required('Telefone é obrigatório'),
  cpf: Yup.string()
    .trim()
    .min(14, 'CPF deve ter pelo menos 14 caracteres')
    .max(14, 'CPF deve ter no máximo 14 caracteres')
    .required('CPF é obrigatório'),
  dataNascimento: Yup.string()
    .trim()
    .required('Data de nascimento é obrigatória')
    .test('valid-date', 'Data de nascimento inválida', function(value) {
      if (!value) return false;
      
      // Verificar formato DD/MM/AAAA
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(value)) return false;
      
      const [, day, month, year] = value.match(dateRegex);
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      // Verificar se é uma data válida
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getDate() !== dayNum || date.getMonth() !== monthNum - 1 || date.getFullYear() !== yearNum) {
        return false;
      }
      
      // Verificar se não é uma data futura
      const today = new Date();
      if (date > today) return false;
      
      // Verificar se não é muito antiga (mais de 120 anos)
      const minYear = today.getFullYear() - 120;
      if (yearNum < minYear) return false;
      
      return true;
    }),
  endereco: Yup.string()
    .trim()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .required('Endereço é obrigatório'),
  cep: Yup.string()
    .trim()
    .min(8, 'CEP deve ter pelo menos 8 caracteres')
    .max(9, 'CEP deve ter no máximo 9 caracteres')
    .required('CEP é obrigatório'),
  cidade: Yup.string()
    .trim()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .required('Cidade é obrigatória'),
  estado: Yup.string()
    .trim()
    .min(2, 'Estado deve ter pelo menos 2 caracteres')
    .max(2, 'Estado deve ter no máximo 2 caracteres')
    .required('Estado é obrigatório'),
});

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        
        // Converter data de nascimento de YYYY-MM-DD para DD/MM/AAAA se existir
        if (userData.data_nascimento) {
          const [year, month, day] = userData.data_nascimento.split('-');
          userData.dataNascimento = `${day}/${month}/${year}`;
        }
        
        setUser(userData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      Alert.alert('Erro', 'Erro ao carregar dados do usuário');
    }
  };

  const handleSalvar = async (values, { setSubmitting, setFieldError }) => {
    setIsLoading(true);
    try {
      // Preparar dados para envio (converter data de DD/MM/AAAA para YYYY-MM-DD)
      const dataToSend = { ...values };
      
      if (dataToSend.dataNascimento) {
        const [day, month, year] = dataToSend.dataNascimento.split('/');
        dataToSend.data_nascimento = `${year}-${month}-${day}`;
        delete dataToSend.dataNascimento; // Remover campo antigo
      }

      console.log('Dados a serem enviados:', dataToSend);

      // Salvar no backend
      const response = await api.put(`/api/entregadores/${user.id}/`, dataToSend);
      
      console.log('Resposta do backend:', response.data);
      
      if (response.data.success) {
        // Atualizar dados locais com a resposta do backend
        const updatedUserData = {
          ...user,
          ...response.data.user
        };
        
        // Converter data de nascimento de YYYY-MM-DD para DD/MM/AAAA se existir
        if (updatedUserData.data_nascimento) {
          const [year, month, day] = updatedUserData.data_nascimento.split('-');
          updatedUserData.dataNascimento = `${day}/${month}/${year}`;
        }
        
        // Atualizar AsyncStorage
        await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(updatedUserData));
        
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Tratar erros específicos do backend
      if (error.response?.data?.errors) {
        // Se o backend retornou erros de validação específicos
        Object.keys(error.response.data.errors).forEach(field => {
          const fieldName = field === 'data_nascimento' ? 'dataNascimento' : field;
          setFieldError(fieldName, error.response.data.errors[field][0]);
        });
      } else {
        Alert.alert('Erro', `Erro ao atualizar perfil: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };


  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Valores iniciais para o Formik
  const initialValues = {
    nome: user.nome || '',
    username: user.username || '',
    email: user.email || '',
    telefone: user.telefone || '',
    cpf: user.cpf || '',
    dataNascimento: user.dataNascimento || '',
    endereco: user.endereco || '',
    cep: user.cep || '',
    cidade: user.cidade || '',
    estado: user.estado || ''
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Perfil</Text>
          <View style={styles.placeholder} />
        </View>
      </View>

      {/* Content */}
      <KeyboardAvoidingView 
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Edite suas informações pessoais</Text>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSalvar}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                {Object.keys(errors).length > 0 && (
                  <View style={styles.errorSummary}>
                    <Ionicons name="warning" size={20} color="#FF6B6B" />
                    <Text style={styles.errorSummaryText}>
                      {Object.keys(errors).length} campo(s) com erro(s) para corrigir
                    </Text>
                  </View>
                )}

                {/* Nome */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Nome completo *</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      touched.nome && errors.nome && styles.inputError
                    ]}
                    placeholder="Digite seu nome completo"
                    value={values.nome}
                    onChangeText={handleChange('nome')}
                    onBlur={handleBlur('nome')}
                    placeholderTextColor="#666"
                  />
                  {touched.nome && errors.nome && (
                    <Text style={styles.errorText}>{errors.nome}</Text>
                  )}
                </View>

                {/* Username */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>@Usuário *</Text>
                  <View style={[
                    styles.usernameContainer,
                    touched.username && errors.username && styles.inputError
                  ]}>
                    <Text style={styles.usernamePrefix}>@</Text>
                    <TextInput
                      style={[styles.input, styles.usernameInput]}
                      placeholder="Usuario"
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      placeholderTextColor="#666"
                      autoCapitalize="none"
                    />
                  </View>
                  {touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )}
                </View>



                {/* CPF */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>CPF *</Text>
                  <TextInputMask
                    type={'cpf'}
                    placeholder="123.456.789-00"
                    style={[
                      styles.input, 
                      touched.cpf && errors.cpf && styles.inputError
                    ]}
                    keyboardType="numeric"
                    value={values.cpf}
                    onChangeText={text => setFieldValue('cpf', text)}
                    onBlur={handleBlur('cpf')}
                    placeholderTextColor="#666"
                  />
                  {touched.cpf && errors.cpf && (
                    <Text style={styles.errorText}>{errors.cpf}</Text>
                  )}
                </View>

                {/* Data de Nascimento */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Data de Nascimento *</Text>
                  <DatePicker
                    value={values.dataNascimento}
                    onDateChange={(date) => setFieldValue('dataNascimento', date)}
                    placeholder="DD/MM/AAAA"
                    error={touched.dataNascimento && !!errors.dataNascimento}
                    errorMessage={touched.dataNascimento && errors.dataNascimento}
                    style={styles.datePickerContainer}
                  />
                </View>

                {/* Endereço */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Endereço *</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      styles.textArea, 
                      touched.endereco && errors.endereco && styles.inputError
                    ]}
                    placeholder="Rua, número, bairro"
                    value={values.endereco}
                    onChangeText={handleChange('endereco')}
                    onBlur={handleBlur('endereco')}
                    placeholderTextColor="#666"
                    multiline
                    numberOfLines={2}
                  />
                  {touched.endereco && errors.endereco && (
                    <Text style={styles.errorText}>{errors.endereco}</Text>
                  )}
                </View>

                {/* CEP, Cidade e Estado em linha */}
                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>CEP *</Text>
                    <TextInputMask
                      type={'zip-code'}
                      placeholder="01234-567"
                      style={[
                        styles.input, 
                        touched.cep && errors.cep && styles.inputError
                      ]}
                      keyboardType="numeric"
                      value={values.cep}
                      onChangeText={text => setFieldValue('cep', text)}
                      onBlur={handleBlur('cep')}
                      placeholderTextColor="#666"
                    />
                    {touched.cep && errors.cep && (
                      <Text style={styles.errorText}>{errors.cep}</Text>
                    )}
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Cidade *</Text>
                    <TextInput
                      style={[
                        styles.input, 
                        touched.cidade && errors.cidade && styles.inputError
                      ]}
                      placeholder="São Paulo"
                      value={values.cidade}
                      onChangeText={handleChange('cidade')}
                      onBlur={handleBlur('cidade')}
                      placeholderTextColor="#666"
                    />
                    {touched.cidade && errors.cidade && (
                      <Text style={styles.errorText}>{errors.cidade}</Text>
                    )}
                  </View>
                </View>

                {/* Estado */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Estado *</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      touched.estado && errors.estado && styles.inputError
                    ]}
                    placeholder="SP"
                    value={values.estado}
                    onChangeText={handleChange('estado')}
                    onBlur={handleBlur('estado')}
                    placeholderTextColor="#666"
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                  {touched.estado && errors.estado && (
                    <Text style={styles.errorText}>{errors.estado}</Text>
                  )}
                </View>

                {/* Email */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Email *</Text>
                  <TextInput
                    style={[
                      styles.input, 
                      touched.email && errors.email && styles.inputError
                    ]}
                    placeholder="Digite seu email"
                    value={values.email}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholderTextColor="#666"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>

                {/* Telefone */}
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefone *</Text>
                  <TextInputMask
                    type={'cel-phone'}
                    options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
                    placeholder="(11) 99999-9999"
                    style={[
                      styles.input, 
                      touched.telefone && errors.telefone && styles.inputError
                    ]}
                    keyboardType="phone-pad"
                    value={values.telefone}
                    onChangeText={text => setFieldValue('telefone', text)}
                    onBlur={handleBlur('telefone')}
                    placeholderTextColor="#666"
                  />
                  {touched.telefone && errors.telefone && (
                    <Text style={styles.errorText}>{errors.telefone}</Text>
                  )}
                </View>

                {/* Botão de salvar */}
                <TouchableOpacity 
                  style={[
                    styles.saveButton, 
                    isLoading && styles.buttonDisabled,
                    !isLoading && Object.keys(errors).length > 0 && styles.buttonWithErrors
                  ]} 
                  onPress={handleSubmit}
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.saveButtonText}>
                      {Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Salvar Alterações'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
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
    minHeight: 80,
    paddingTop: 15,
    textAlignVertical: 'top',
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
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  halfWidth: {
    flex: 1,
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
  buttonWithErrors: {
    backgroundColor: '#FF6B6B',
  },
  datePickerContainer: {
    marginTop: 10,
  },
  keyboardContainer: {
    flex: 1,
  },
  errorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  errorSummaryText: {
    color: '#991B1B',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  usernamePrefix: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    paddingLeft: 15,
    paddingRight: 5,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
    paddingLeft: 0,
  },
});
