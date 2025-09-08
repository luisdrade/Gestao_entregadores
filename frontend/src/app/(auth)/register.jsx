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
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

const validationSchema = Yup.object().shape({
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
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export default function RegisterScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async (values) => {
    setIsSubmitting(true);
    try {
      // Mapear os campos para o formato esperado pelo backend
      const registrationData = {
        nome: values.nome,
        username: values.username,
        email: values.email,
        telefone: values.telefone,
        password: values.senha,
        password_confirm: values.senha, // Confirmar a mesma senha
      };
      
      const result = await signUp(registrationData);
      if (result.success) {
        Alert.alert(
          'Sucesso', 
          'Conta criada com sucesso! Faça login para continuar.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        // Tratar erros específicos
        let errorMessage = 'Erro ao criar conta';
        
        if (result.error) {
          if (typeof result.error === 'string') {
            errorMessage = result.error;
          } else if (result.error.details) {
            // Se há detalhes de validação, mostrar o primeiro erro
            const firstError = Object.values(result.error.details)[0];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          }
        }
        
        Alert.alert('Erro', errorMessage);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro inesperado ao criar conta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>

          <Formik
            initialValues={{
              nome: '',
              username: '',
              email: '',
              telefone: '',
              senha: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  placeholder="Nome completo"
                  style={styles.input}
                  value={values.nome}
                  onChangeText={handleChange('nome')}
                  onBlur={handleBlur('nome')}
                  placeholderTextColor="#666"
                />
                {touched.nome && errors.nome && (
                  <Text style={styles.error}>{errors.nome}</Text>
                )}

                <View style={styles.usernameContainer}>
                  <Text style={styles.usernamePrefix}>@</Text>
                  <TextInput
                    placeholder="username"
                    style={[styles.input, styles.usernameInput]}
                    autoCapitalize="none"
                    value={values.username}
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    placeholderTextColor="#666"
                  />
                </View>
                {touched.username && errors.username && (
                  <Text style={styles.error}>{errors.username}</Text>
                )}

                <TextInput
                  placeholder="Email"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  placeholderTextColor="#666"
                />
                {touched.email && errors.email && (
                  <Text style={styles.error}>{errors.email}</Text>
                )}

                <TextInputMask
                  type={'cel-phone'}
                  options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
                  placeholder="Telefone"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={values.telefone}
                  onChangeText={text => setFieldValue('telefone', text)}
                  onBlur={handleBlur('telefone')}
                  placeholderTextColor="#666"
                />
                {touched.telefone && errors.telefone && (
                  <Text style={styles.error}>{errors.telefone}</Text>
                )}

                <TextInput
                  placeholder="Senha"
                  style={styles.input}
                  secureTextEntry
                  autoCapitalize="none"
                  value={values.senha}
                  onChangeText={handleChange('senha')}
                  onBlur={handleBlur('senha')}
                  placeholderTextColor="#666"
                />
                {touched.senha && errors.senha && (
                  <Text style={styles.error}>{errors.senha}</Text>
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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 5,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 5,
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
  error: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

