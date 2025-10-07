import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient } from '../../../services/clientConfig';
import DatePicker from '../../../components/_DataComp';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';
import { useAuth } from '../../../context/AuthContext';
import { _CampoEntrada, _Botao } from '../../../components';

// Função para buscar dados do CEP usando BrasilAPI
const buscarCEP = async (cep) => {
  try {
    // Remove formatação do CEP (remove hífens e espaços)
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CEP não encontrado');
      }
      throw new Error('Erro ao consultar CEP');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

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
    .required('Telefone é obrigatório')
    .test('telefone-length', 'Telefone deve ter formato válido', function (value) {
      if (!value) return false;
      // Aceita tanto (11) 99999-9999 quanto (11) 9999-9999
      return value.length >= 14 && value.length <= 15;
    })
    .test('telefone-format', 'Formato de telefone inválido', function (value) {
      if (!value) return false;
      const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      return telefoneRegex.test(value);
    }),
  cpf: Yup.string()
    .trim()
    .required('CPF é obrigatório')
    .test('cpf-length', 'CPF deve ter 14 caracteres (formato: 123.456.789-00)', function (value) {
      if (!value) return false;
      return value.length === 14;
    })
    .test('cpf-format', 'Formato de CPF inválido', function (value) {
      if (!value) return false;
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      return cpfRegex.test(value);
    }),
  dataNascimento: Yup.string()
    .trim()
    .required('Data de nascimento é obrigatória')
    .test('valid-date', 'Data de nascimento inválida', function (value) {
      if (!value || value.trim() === '') return false;

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

      // Verificar se não é muito nova (menos de 16 anos)
      const maxYear = today.getFullYear() - 16;
      if (yearNum > maxYear) return false;

      return true;
    }),
  endereco: Yup.string()
    .trim()
    .min(10, 'Endereço deve ter pelo menos 10 caracteres')
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .required('Endereço é obrigatório'),
  cep: Yup.string()
    .trim()
    .required('CEP é obrigatório')
    .test('cep-format', 'CEP deve ter formato 12345-678', function (value) {
      if (!value) return false;
      const cepRegex = /^\d{5}-\d{3}$/;
      return cepRegex.test(value);
    }),
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
  const { updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCEP, setIsLoadingCEP] = useState(false);
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
      const response = await httpClient.put(`/api/entregadores/${user.id}/`, dataToSend);

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

        // Atualizar contexto de autenticação (isso atualizará automaticamente a tela de perfil)
        await updateUserData(updatedUserData);

        // Atualizar estado local também
        setUser(updatedUserData);

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

  // Função para buscar CEP e preencher campos automaticamente
  const handleBuscarCEP = async (cep, setFieldValue) => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      return;
    }

    setIsLoadingCEP(true);
    try {
      const dadosCEP = await buscarCEP(cep);

      // Preencher campos automaticamente
      setFieldValue('endereco', dadosCEP.street || '');
      setFieldValue('cidade', dadosCEP.city || '');
      setFieldValue('estado', dadosCEP.state || '');

      Alert.alert(
        'CEP Encontrado!',
        `Endereço preenchido automaticamente:\n${dadosCEP.street}, ${dadosCEP.city}/${dadosCEP.state}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert(
        'CEP não encontrado',
        'Verifique se o CEP está correto e tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingCEP(false);
    }
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
      {/* Header com gradiente */}
      <View style={styles.header}>
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Editar Perfil</Text>
              <Text style={styles.headerSubtitle}>Atualize suas informações</Text>
            </View>
            <View style={styles.placeholder} />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Card principal */}
        <View style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-circle" size={32} color="#2B2860" />
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Informações Pessoais</Text>
              <Text style={styles.subtitle}>Mantenha seus dados sempre atualizados</Text>
            </View>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSalvar}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => {
              // Debug: Log dos erros quando mudarem
              if (Object.keys(errors).length > 0 && __DEV__) {
                console.log('🔍 Formik Errors:', errors);
                console.log('🔍 Formik Values:', values);
                console.log('🔍 Formik Touched:', touched);
              }

              return (
                <View style={styles.form}>
                  {Object.keys(errors).length > 0 && (
                    <View style={styles.errorSummary}>
                      <Ionicons name="warning" size={20} color="#FF6B6B" />
                      <Text style={styles.errorSummaryText}>
                        {Object.keys(errors).length} campo(s) com erro(s) para corrigir
                      </Text>
                      {/* Debug: Mostrar erros específicos */}
                      {__DEV__ && (
                        <View style={styles.debugContainer}>
                          <Text style={styles.debugTitle}>Debug - Erros encontrados:</Text>
                          {Object.entries(errors).map(([field, error]) => (
                            <Text key={field} style={styles.debugText}>
                              • {field}: {error}
                            </Text>
                          ))}
                        </View>
                      )}
                    </View>
                  )}

                  {/* Seção: Dados Básicos */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="person" size={20} color="#2B2860" />
                      <Text style={styles.sectionTitle}>Dados Básicos</Text>
                    </View>

                    {/* Nome */}
                    <_CampoEntrada
                      label="Nome completo *"
                      value={values.nome}
                      onChangeText={handleChange('nome')}
                      onBlur={handleBlur('nome')}
                      placeholder="Digite seu nome completo"
                      error={touched.nome && !!errors.nome}
                      errorMessage={touched.nome && errors.nome}
                      leftIcon={<Ionicons name="person-outline" size={20} color="#666" />}
                    />

                    {/* Username */}
                    <_CampoEntrada
                      label="@Usuário *"
                      value={values.username}
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      placeholder="Usuario"
                      error={touched.username && !!errors.username}
                      errorMessage={touched.username && errors.username}
                      leftIcon={<Ionicons name="at" size={20} color="#666" />}
                      prefix="@"
                      autoCapitalize="none"
                    />

                    {/* CPF */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>CPF *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="card" size={20} color="#666" style={styles.inputIcon} />
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
                          placeholderTextColor="#999"
                        />
                      </View>
                      {touched.cpf && errors.cpf && (
                        <Text style={styles.errorText}>{errors.cpf}</Text>
                      )}
                    </View>

                    {/* Data de Nascimento */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Data de Nascimento *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
                        <DatePicker
                          value={values.dataNascimento}
                          onDateChange={(date) => setFieldValue('dataNascimento', date)}
                          placeholder="DD/MM/AAAA"
                          error={touched.dataNascimento && !!errors.dataNascimento}
                          errorMessage={touched.dataNascimento && errors.dataNascimento}
                          style={styles.datePickerContainer}
                        />
                      </View>
                    </View>
                  </View>


                  {/* Seção: Endereço */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="location" size={20} color="#2B2860" />
                      <Text style={styles.sectionTitle}>Endereço</Text>
                    </View>


                    {/* CEP, Cidade e Estado em linha */}
                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.label}>CEP *</Text>
                      <View style={styles.cepContainer}>
                        <View style={styles.inputWrapper}>
                          <Ionicons name="map" size={20} color="#666" style={styles.inputIcon} />
                          <TextInputMask
                            type={'zip-code'}
                            placeholder="01234-567"
                            style={[
                              styles.input,
                              styles.cepInput,
                              touched.cep && errors.cep && styles.inputError
                            ]}
                            keyboardType="numeric"
                            value={values.cep}
                            onChangeText={text => {
                              setFieldValue('cep', text);
                              // Buscar automaticamente quando CEP estiver completo
                              if (text.replace(/\D/g, '').length === 8) {
                                setTimeout(() => {
                                  handleBuscarCEP(text, setFieldValue);
                                }, 500); // Delay de 500ms para evitar muitas requisições
                              }
                            }}
                            onBlur={handleBlur('cep')}
                            placeholderTextColor="#999"
                          />
                        </View>

                      </View>
                      {isLoadingCEP && (
                        <Text style={styles.cepLoadingText}>
                          🔍 Buscando endereço...
                        </Text>
                      )}
                      {touched.cep && errors.cep && (
                        <Text style={styles.errorText}>{errors.cep}</Text>
                      )}
                    </View>

                    <View style={[styles.inputContainer, styles.halfWidth]}>
                      <Text style={styles.label}>Cidade *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="business" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={[
                            styles.input,
                            touched.cidade && errors.cidade && styles.inputError
                          ]}
                          placeholder="São Paulo"
                          value={values.cidade}
                          onChangeText={handleChange('cidade')}
                          onBlur={handleBlur('cidade')}
                          placeholderTextColor="#999"
                        />
                      </View>
                      {touched.cidade && errors.cidade && (
                        <Text style={styles.errorText}>{errors.cidade}</Text>
                      )}
                    </View>

                    {/* Estado */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Estado *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="flag" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={[
                            styles.input,
                            touched.estado && errors.estado && styles.inputError
                          ]}
                          placeholder="SP"
                          value={values.estado}
                          onChangeText={handleChange('estado')}
                          onBlur={handleBlur('estado')}
                          placeholderTextColor="#999"
                          maxLength={2}
                          autoCapitalize="characters"
                        />
                      </View>
                      {touched.estado && errors.estado && (
                        <Text style={styles.errorText}>{errors.estado}</Text>
                      )}
                    </View>

                    {/* Endereço */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Endereço *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="home" size={20} color="#666" style={styles.inputIcon} />
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
                          placeholderTextColor="#999"
                          multiline
                          numberOfLines={2}
                        />
                      </View>
                      {touched.endereco && errors.endereco && (
                        <Text style={styles.errorText}>{errors.endereco}</Text>
                      )}
                    </View>
                  </View>

                  {/* Seção: Contato */}
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Ionicons name="call" size={20} color="#2B2860" />
                      <Text style={styles.sectionTitle}>Contato</Text>
                    </View>

                    {/* Email */}
                    <_CampoEntrada
                      label="Email *"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder="Digite seu email"
                      error={touched.email && !!errors.email}
                      errorMessage={touched.email && errors.email}
                      leftIcon={<Ionicons name="mail" size={20} color="#666" />}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />

                    {/* Telefone */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Telefone *</Text>
                      <View style={styles.inputWrapper}>
                        <Ionicons name="call" size={20} color="#666" style={styles.inputIcon} />
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
                          placeholderTextColor="#999"
                        />
                      </View>
                      {touched.telefone && errors.telefone && (
                        <Text style={styles.errorText}>{errors.telefone}</Text>
                      )}
                    </View>
                  </View>

                  {/* Botão de salvar fixo */}
                  <View style={styles.saveButtonContainer}>
                    <_Botao
                      title={Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Salvar Alterações'}
                      onPress={handleSubmit}
                      loading={isLoading}
                      disabled={isLoading || Object.keys(errors).length > 0}
                      variant={Object.keys(errors).length > 0 ? 'error' : 'primary'}
                      icon={!isLoading && <Ionicons name="checkmark-circle" size={20} color="#fff" />}
                      style={styles.saveButton}
                    />
                  </View>
                </View>
              );
            }}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    backgroundColor: '#2B2860',
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  placeholder: {
    width: 50,
  },

  scrollContent: {
    paddingBottom: 40,
  },
  mainCard: {
    backgroundColor: '#fafafa',
    padding: 24,
    marginBottom: 20,

  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  form: {
    gap: 24,
  },
  section: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    padding: 1,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,

    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
    backgroundColor: '#fff5f5',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  saveButtonContainer: {
    marginTop: 24,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },
  saveButton: {
    backgroundColor: '#2B2860',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B2860',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonWithErrors: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
  },
  datePickerContainer: {
    marginTop: 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  errorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  errorSummaryText: {
    color: '#c53030',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '600',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  usernamePrefix: {
    fontSize: 16,
    color: '#2B2860',
    fontWeight: '600',
    marginLeft: 8,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
    paddingLeft: 0,
    paddingVertical: 12,
  },
  debugContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7d7',
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#c53030',
    marginBottom: 5,
  },
  debugText: {
    fontSize: 11,
    color: '#c53030',
    marginBottom: 2,
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cepInput: {
    flex: 1,
  },
  cepButton: {
    backgroundColor: '#2B2860',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    height: 48,
    shadowColor: '#2B2860',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cepButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  cepLoadingText: {
    fontSize: 12,
    color: '#2B2860',
    marginTop: 6,
    fontStyle: 'italic',
    marginLeft: 4,
  },
});
