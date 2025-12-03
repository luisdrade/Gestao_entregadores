import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext.jsx';
import { httpClient } from '../../services/clientConfig';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

const validacaoRegister = Yup.object().shape({
  nome: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .required('Nome é obrigatório'),
  username: Yup.string()
    .min(3, 'Username deve ter pelo menos 3 caracteres')
    .max(20, 'Username deve ter no máximo 20 caracteres')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username pode conter apenas letras, números e _')
    .required('Username é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres')
    .required('Telefone é obrigatório'),
  senha: Yup.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .required('Senha é obrigatória'),
  confirmarSenha: Yup.string()
    .oneOf([Yup.ref('senha'), null], 'As senhas devem ser iguais')
    .required('Confirmação de senha é obrigatória'),
  aceitarTermosLGPD: Yup.boolean()
    .oneOf([true], 'Você deve aceitar os termos da LGPD para continuar')
    .required('Aceite dos termos da LGPD é obrigatório'),
});

export default function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    setFieldErrors({}); //Limpar erros anteriores
  
    try {
      
      // Mapear os campos para o formato esperado pelo backend
      const registrationData = {
        nome: values.nome,
        username: values.username,
        email: values.email,
        telefone: values.telefone,
        password: values.senha,
        password_confirm: values.confirmarSenha, 
      };
      console.log('🔄 Iniciando registro...');
      console.log('🌐 URL da API:', API_CONFIG.BASE_URL);
      console.log('📤 Dados sendo enviados:', registrationData);
      
      const result = await signUp(registrationData);
      console.log('🔍 Resultado do signUp:', result);

      if (result.success) {
        if (result.success) {
          if (result.requires_verification) {
            // Navegar direto para tela de verificação SEM enviar email automaticamente
            router.push({
              pathname: '/register-verify-code',
              params: {
                userEmail: result.user_email,
                userPhone: result.user_phone,
                verificationMethod: 'email',
                expiresAt: null, // Sem tempo de expiração
                attemptsRemaining: 5
              }
            });
          } else {
            // Cadastro normal (sem verificação necessária)
            Alert.alert(
              'Sucesso', 
              'Conta criada com sucesso! Faça login para continuar.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }

      } else {
        const newFieldErrors = {};
        console.log('🔍 Processando erros:', result.error);
        console.log('🔍 Detalhes dos erros:', result.details);
        
        // Processar erros de detalhes (vindos do backend)
        if (result.details) {
          const details = result.details;
          
          // Mapear erros do back para campos do front
          if (details.email && Array.isArray(details.email)) {
            newFieldErrors.email = details.email[0];
          } else if (details.email) {
            newFieldErrors.email = details.email;
          }
          
          if (details.username && Array.isArray(details.username)) {
            newFieldErrors.username = details.username[0];
          } else if (details.username) {
            newFieldErrors.username = details.username;
          }
          
          if (details.telefone && Array.isArray(details.telefone)) {
            newFieldErrors.telefone = details.telefone[0];
          } else if (details.telefone) {
            newFieldErrors.telefone = details.telefone;
          }
          
          if (details.password && Array.isArray(details.password)) {
            newFieldErrors.senha = details.password[0];
          } else if (details.password) {
            newFieldErrors.senha = details.password;
          }
          
          if (details.password_confirm && Array.isArray(details.password_confirm)) {
            newFieldErrors.confirmarSenha = details.password_confirm[0];
          } else if (details.password_confirm) {
            newFieldErrors.confirmarSenha = details.password_confirm;
          }
          
          if (details.nome && Array.isArray(details.nome)) {
            newFieldErrors.nome = details.nome[0];
          } else if (details.nome) {
            newFieldErrors.nome = details.nome;
          }
          
          if (details.non_field_errors && Array.isArray(details.non_field_errors)) {
            // Se não há erro específico em confirmarSenha, colocar o erro geral lá
            if (!newFieldErrors.confirmarSenha) {
              newFieldErrors.confirmarSenha = details.non_field_errors[0];
            } else {
              newFieldErrors.general = details.non_field_errors[0];
            }
          }
        }
        
        // Se não houve erros de campo específicos mas há erro geral
        if (Object.keys(newFieldErrors).length === 0 && result.error) {
          newFieldErrors.general = result.error;
        }
        
        console.log('🔍 Erros mapeados para campos:', newFieldErrors);
        setFieldErrors(newFieldErrors);
      }
      
    } catch (error) {
      console.error('❌ Erro detalhado no registro:', error);
      console.error('❌ Response data:', error.response?.data);
      
      // Capturar diferentes tipos de erro
      let errorMessage = 'Erro inesperado ao criar conta';
      const newFieldErrors = {};
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Processar details primeiro (validações de campo)
        if (errorData.details) {
          const details = errorData.details;
          
          if (details.email) {
            newFieldErrors.email = Array.isArray(details.email) ? details.email[0] : details.email;
          }
          if (details.username) {
            newFieldErrors.username = Array.isArray(details.username) ? details.username[0] : details.username;
          }
          if (details.telefone) {
            newFieldErrors.telefone = Array.isArray(details.telefone) ? details.telefone[0] : details.telefone;
          }
          if (details.password) {
            newFieldErrors.senha = Array.isArray(details.password) ? details.password[0] : details.password;
          }
          if (details.password_confirm) {
            newFieldErrors.confirmarSenha = Array.isArray(details.password_confirm) ? details.password_confirm[0] : details.password_confirm;
          }
          if (details.nome) {
            newFieldErrors.nome = Array.isArray(details.nome) ? details.nome[0] : details.nome;
          }
          if (details.non_field_errors) {
            if (!newFieldErrors.confirmarSenha) {
              newFieldErrors.confirmarSenha = Array.isArray(details.non_field_errors) ? details.non_field_errors[0] : details.non_field_errors;
            } else {
              newFieldErrors.general = Array.isArray(details.non_field_errors) ? details.non_field_errors[0] : details.non_field_errors;
            }
          }
        }
        
        // Se não há erros de campo, usar mensagem geral
        if (Object.keys(newFieldErrors).length === 0) {
          if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' ? errorData.error : 'Erro ao processar cadastro';
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
          newFieldErrors.general = errorMessage;
        }
      } else if (error.message) {
        if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
          errorMessage = 'Erro de conexão. Verifique sua internet.';
        } else {
          errorMessage = error.message;
        }
        newFieldErrors.general = errorMessage;
      }
      
      setFieldErrors(newFieldErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.conteudo}>
          <Text style={styles.titulo}>Criar Conta</Text>
          <Text style={styles.subtitulo}>Preencha os dados para se cadastrar</Text>

          <Formik
            initialValues={{
              nome: '',
              username: '',
              email: '',
              telefone: '',
              senha: '',
              confirmarSenha: '',
              aceitarTermosLGPD: false,
            }}
            validationSchema={validacaoRegister}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  placeholder="Nome completo"
                  style={[
                    styles.input,
                    (touched.nome && errors.nome) || fieldErrors.nome ? styles.inputErro : null
                  ]}
                  value={values.nome}
                  onChangeText={(text) => {
                    handleChange('nome')(text);
                    if (fieldErrors.nome) {
                      setFieldErrors(prev => ({ ...prev, nome: null }));
                    }
                  }}
                  onBlur={handleBlur('nome')}
                  placeholderTextColor="#666"
                />
                {(touched.nome && errors.nome) && (
                  <Text style={styles.error}>{errors.nome}</Text>
                )}
                {fieldErrors.nome && (
                  <Text style={styles.error}>{fieldErrors.nome}</Text>
                )}

                <View style={[
                  styles.usernameContainer,
                  (touched.username && errors.username) || fieldErrors.username ? styles.inputErro : null
                ]}>
                  <Text style={styles.usernamePrefix}>@</Text>
                  <TextInput
                    placeholder="Usuario"
                    style={[styles.input, styles.usernameInput]}
                    autoCapitalize="none"
                    value={values.username}
                    onChangeText={(text) => {
                      handleChange('username')(text);
                      if (fieldErrors.username) {
                        setFieldErrors(prev => ({ ...prev, username: null }));
                      }
                    }}
                    onBlur={handleBlur('username')}
                    placeholderTextColor="#666"
                  />
                </View>
                {(touched.username && errors.username) && (
                  <Text style={styles.error}>{errors.username}</Text>
                )}
                {fieldErrors.username && (
                  <Text style={styles.error}>{fieldErrors.username}</Text>
                )}

                <TextInput
                  placeholder="Email"
                  style={[
                    styles.input,
                    (touched.email && errors.email) || fieldErrors.email ? styles.inputErro : null
                  ]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={(text) => {
                    handleChange('email')(text);
                    if (fieldErrors.email) {
                      setFieldErrors(prev => ({ ...prev, email: null }));
                    }
                  }}
                  onBlur={handleBlur('email')}
                  placeholderTextColor="#666"
                />
                {(touched.email && errors.email) && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}
                {fieldErrors.email && (
                  <Text style={styles.error}>{fieldErrors.email}</Text>
                )}

                <TextInputMask
                  type={'cel-phone'}
                  options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
                  placeholder="Telefone"
                  style={[
                    styles.input,
                    (touched.telefone && errors.telefone) || fieldErrors.telefone ? styles.inputErro : null
                  ]}
                  keyboardType="phone-pad"
                  value={values.telefone}
                  onChangeText={text => {
                    setFieldValue('telefone', text);
                    // Limpar erro do campo quando usuário começar a digitar
                    if (fieldErrors.telefone) {
                      setFieldErrors(prev => ({ ...prev, telefone: null }));
                    }
                  }}
                  onBlur={handleBlur('telefone')}
                  placeholderTextColor="#666"
                />
                {(touched.telefone && errors.telefone) && (
                  <Text style={styles.error}>{errors.telefone}</Text>
                )}
                {fieldErrors.telefone && (
                  <Text style={styles.error}>{fieldErrors.telefone}</Text>
                )}

                <TextInput
                  placeholder="Senha"
                  style={[
                    styles.input,
                    (touched.senha && errors.senha) || fieldErrors.senha ? styles.inputErro : null
                  ]}
                  secureTextEntry
                  autoCapitalize="none"
                  value={values.senha}
                  onChangeText={(text) => {
                    handleChange('senha')(text);
                    // Limpar erro do campo quando usuário começar a digitar
                    if (fieldErrors.senha) {
                      setFieldErrors(prev => ({ ...prev, senha: null }));
                    }
                  }}
                  onBlur={handleBlur('senha')}
                  placeholderTextColor="#666"
                />
                {(touched.senha && errors.senha) && (
                  <Text style={styles.error}>{errors.senha}</Text>
                )}
                {fieldErrors.senha && (
                  <Text style={styles.error}>{fieldErrors.senha}</Text>
                )}

                <TextInput
                  placeholder="Confirmar Senha"
                  style={[
                    styles.input,
                    (touched.confirmarSenha && errors.confirmarSenha) || fieldErrors.confirmarSenha ? styles.inputErro : null
                  ]}
                  secureTextEntry
                  autoCapitalize="none"
                  value={values.confirmarSenha}
                  onChangeText={(text) => {
                    handleChange('confirmarSenha')(text);
                    // Limpar erro do campo quando usuário começar a digitar
                    if (fieldErrors.confirmarSenha) {
                      setFieldErrors(prev => ({ ...prev, confirmarSenha: null }));
                    }
                  }}
                  onBlur={handleBlur('confirmarSenha')}
                  placeholderTextColor="#666"
                />
                {(touched.confirmarSenha && errors.confirmarSenha) && (
                  <Text style={styles.error}>{errors.confirmarSenha}</Text>
                )}
                {fieldErrors.confirmarSenha && (
                  <Text style={styles.error}>{fieldErrors.confirmarSenha}</Text>
                )}

                {/* Checkbox LGPD */}
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => {
                    setFieldValue('aceitarTermosLGPD', !values.aceitarTermosLGPD);
                    handleBlur('aceitarTermosLGPD');
                    if (fieldErrors.aceitarTermosLGPD) {
                      setFieldErrors(prev => ({ ...prev, aceitarTermosLGPD: null }));
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, values.aceitarTermosLGPD && styles.checkboxChecked]}>
                    {values.aceitarTermosLGPD && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Aceito os <Text style={styles.termsLink} onPress={() => router.push('/(auth)/termos-lgpd')}>termos da LGPD</Text>
                  </Text>
                </TouchableOpacity>
                {(touched.aceitarTermosLGPD && errors.aceitarTermosLGPD) && (
                  <Text style={styles.error}>{errors.aceitarTermosLGPD}</Text>
                )}
                {fieldErrors.aceitarTermosLGPD && (
                  <Text style={styles.error}>{fieldErrors.aceitarTermosLGPD}</Text>
                )}

                {/* Erro geral */}
                {fieldErrors.general && (
                  <View style={styles.geralErroContainer}>
                    <Text style={styles.geralErro}>{fieldErrors.general}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.button, isSubmitting && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Cadastrar</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.linkText}>Já tem conta? Faça login</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },
  conteudo: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',

  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2B2860',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  inputErro: {
    borderColor: '#ff3b30',
    borderWidth: 2,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  usernamePrefix: {
    fontSize: 16,
    color: '#2B2860',
    fontWeight: '600',
    paddingLeft: 16,
    paddingRight: 5,
  },
  usernameInput: {
    flex: 1,
    borderWidth: 0,
    marginBottom: 0,
    paddingLeft: 0,
  },
  error: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#2B2860',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    shadowColor: '#2B2860',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#5B9BD5',
    fontSize: 14,
    fontWeight: '500',
  },
  geralErroContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  geralErro: {
    color: '#ff3b30',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 10,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#2B2860',
    borderColor: '#2B2860',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#5B9BD5',
    fontWeight: '500',
  },
});


