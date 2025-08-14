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
  email: Yup.string()
    .email('Email inválido')
    .required('Email é obrigatório'),
  telefone: Yup.string()
    .min(14, 'Telefone deve ter pelo menos 14 caracteres')
    .required('Telefone é obrigatório'),
  cpf: Yup.string()
    .min(14, 'CPF deve ter pelo menos 14 caracteres')
    .required('CPF é obrigatório'),
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
      const result = await signUp(values);
      if (result.success) {
        Alert.alert(
          'Sucesso', 
          'Conta criada com sucesso! Faça login para continuar.',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Erro', result.error || 'Erro ao criar conta');
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
              email: '',
              telefone: '',
              cpf: '',
              senha: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  placeholder="Nome"
                  style={styles.input}
                  value={values.nome}
                  onChangeText={handleChange('nome')}
                  onBlur={handleBlur('nome')}
                  placeholderTextColor="#666"
                />
                {touched.nome && errors.nome && (
                  <Text style={styles.error}>{errors.nome}</Text>
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

                <TextInputMask
                  type={'cpf'}
                  placeholder="CPF"
                  style={styles.input}
                  keyboardType="numeric"
                  value={values.cpf}
                  onChangeText={text => setFieldValue('cpf', text)}
                  onBlur={handleBlur('cpf')}
                  placeholderTextColor="#666"
                />
                {touched.cpf && errors.cpf && (
                  <Text style={styles.error}>{errors.cpf}</Text>
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

