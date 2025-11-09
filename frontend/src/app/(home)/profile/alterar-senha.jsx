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
import { httpClient } from '../../../services/clientConfig';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Schema de validação
const validationSchema = Yup.object().shape({
  senhaAtual: Yup.string()
    .trim()
    .min(1, 'Senha atual é obrigatória')
    .required('Senha atual é obrigatória'),
  novaSenha: Yup.string()
    .trim()
    .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
    .required('Nova senha é obrigatória'),
  confirmarSenha: Yup.string()
    .trim()
    .oneOf([Yup.ref('novaSenha'), null], 'As senhas não coincidem')
    .required('Confirmação de senha é obrigatória'),
});

export default function AlterarSenhaScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    senhaAtual: false,
    novaSenha: false,
    confirmarSenha: false,
  });

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
      Alert.alert('Erro', 'Erro ao carregar dados do usuário');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleAlterarSenha = async (values, { setSubmitting, setFieldError, resetForm }) => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Alterando senha para usuário:', user.id);
      
      // Chamada para API para alterar a senha
      const response = await httpClient.put(`/api/change-password/${user.id}/`, {
        senhaAtual: values.senhaAtual,
        novaSenha: values.novaSenha
      });
      
      console.log('Resposta da API:', response.data);
      
      if (response.data.success) {
        Alert.alert('Sucesso', 'Senha alterada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              resetForm();
              setShowPasswords({
                senhaAtual: false,
                novaSenha: false,
                confirmarSenha: false,
              });
              router.back();
            }
          }
        ]);
      } else {
        throw new Error(response.data.message || 'Erro ao alterar senha');
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      console.error('Detalhes do erro:', error.response?.data);
      
      // Tratar erros específicos do backend
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        
        if (errorMessage.includes('Senha atual incorreta')) {
          setFieldError('senhaAtual', 'Senha atual incorreta');
        } else if (errorMessage.includes('nova senha deve ser diferente')) {
          setFieldError('novaSenha', 'A nova senha deve ser diferente da atual');
        } else {
          Alert.alert('Erro', errorMessage);
        }
      } else {
        Alert.alert('Erro', 'Erro inesperado ao alterar senha. Tente novamente.');
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Alterar Senha</Text>
            <View style={styles.placeholder} />
          </View>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.content} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
        <Text style={styles.title}>Altere sua senha</Text>
        <Text style={styles.subtitle}>Digite sua senha atual e a nova senha desejada</Text>

        <Formik
          initialValues={{
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleAlterarSenha}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View style={styles.form}>
              {/* Senha Atual */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Senha Atual *</Text>
                <View style={[
                  styles.passwordContainer, 
                  touched.senhaAtual && errors.senhaAtual && styles.inputError
                ]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Digite sua senha atual"
                    value={values.senhaAtual}
                    onChangeText={handleChange('senhaAtual')}
                    onBlur={handleBlur('senhaAtual')}
                    placeholderTextColor="#666"
                    secureTextEntry={!showPasswords.senhaAtual}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => togglePasswordVisibility('senhaAtual')}
                  >
                    <Ionicons 
                      name={showPasswords.senhaAtual ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {touched.senhaAtual && errors.senhaAtual && (
                  <Text style={styles.errorText}>{errors.senhaAtual}</Text>
                )}
              </View>

              {/* Nova Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nova Senha *</Text>
                <View style={[
                  styles.passwordContainer, 
                  touched.novaSenha && errors.novaSenha && styles.inputError
                ]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Digite a nova senha"
                    value={values.novaSenha}
                    onChangeText={handleChange('novaSenha')}
                    onBlur={handleBlur('novaSenha')}
                    placeholderTextColor="#666"
                    secureTextEntry={!showPasswords.novaSenha}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => togglePasswordVisibility('novaSenha')}
                  >
                    <Ionicons 
                      name={showPasswords.novaSenha ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {touched.novaSenha && errors.novaSenha && (
                  <Text style={styles.errorText}>{errors.novaSenha}</Text>
                )}
                <Text style={styles.helpText}>Mínimo de 6 caracteres</Text>
              </View>

              {/* Confirmar Nova Senha */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmar Nova Senha *</Text>
                <View style={[
                  styles.passwordContainer, 
                  touched.confirmarSenha && errors.confirmarSenha && styles.inputError
                ]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirme a nova senha"
                    value={values.confirmarSenha}
                    onChangeText={handleChange('confirmarSenha')}
                    onBlur={handleBlur('confirmarSenha')}
                    placeholderTextColor="#666"
                    secureTextEntry={!showPasswords.confirmarSenha}
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => togglePasswordVisibility('confirmarSenha')}
                  >
                    <Ionicons 
                      name={showPasswords.confirmarSenha ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                </View>
                {touched.confirmarSenha && errors.confirmarSenha && (
                  <Text style={styles.errorText}>{errors.confirmarSenha}</Text>
                )}
              </View>

              {/* Dicas de Segurança */}
              <View style={styles.containerSegurança}>
                <Text style={styles.dicasTitle}>Dicas para uma senha segura:</Text>
                <View style={styles.dicasItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.tipText}>Use pelo menos 6 caracteres</Text>
                </View>
                <View style={styles.dicasItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.tipText}>Combine letras, números e símbolos</Text>
                </View>
                <View style={styles.dicasItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.tipText}>Evite informações pessoais</Text>
                </View>
              </View>

              {/* Botão de alterar senha */}
              <TouchableOpacity 
                style={[
                  styles.changeButton, 
                  (isLoading || Object.keys(errors).length > 0) && styles.buttonDisabled
                ]} 
                onPress={handleSubmit}
                disabled={isLoading || Object.keys(errors).length > 0}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.changeButtonText}>
                    {Object.keys(errors).length > 0 ? 'Corrija os erros' : 'Alterar Senha'}
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
    backgroundColor: '#2B2860',
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
    paddingBottom: 150,
  },
  keyboardContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  passwordInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  eyeButton: {
    padding: 15,
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
  helpText: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
    fontStyle: 'italic',
  },
  containerSegurança: {
    paddingHorizontal: 15,
  },
  dicasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2B2860',
    marginBottom: 10,
  },
  dicasItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  changeButton: {
    backgroundColor: '#2B2860',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
});
