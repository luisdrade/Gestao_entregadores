import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInputMask } from 'react-native-masked-text';

const dias = Array.from({ length: 31 }, (_, i) => i + 1);
const meses = Array.from({ length: 12 }, (_, i) => i + 1);
const anos = Array.from({ length: 100 }, (_, i) => 2025 - i);

const validationSchema = Yup.object().shape({
  nome: Yup.string().trim().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  telefone: Yup.string()
    .required('Telefone é obrigatório')
    .test('len', 'Telefone inválido', val => {
      return val && val.replace(/\D/g, '').length >= 10;
    }),
  cpf: Yup.string()
    .required('CPF é obrigatório')
    .test('len', 'CPF inválido', val => {
      return val && val.replace(/\D/g, '').length === 11;
    }),
  senha: Yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('Senha é obrigatória'),
});

export default function RegisterScreen({ navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await axios.post('http://10.20.15.64:8000/usuarios/entregadores/', {
        nome: values.nome,
        email: values.email,
        telefone: values.telefone.replace(/\D/g, ''),
        cpf: values.cpf.replace(/\D/g, ''),
        password: values.senha,
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      resetForm();
      navigation.navigate('Login');
    } catch (error) {
      console.log('Erro no cadastro:', error.response?.data || error.message);
      Alert.alert('Erro', 'Erro ao cadastrar. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <View>
            <TextInputMask
              type={'custom'}
              options={{ mask: '*******************************' }}
              placeholder="Nome"
              style={styles.input}
              value={values.nome}
              onChangeText={handleChange('nome')}
              onBlur={handleBlur('nome')}
            />
            {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}

            <TextInputMask
              type={'custom'}
              options={{ mask: '*******************************' }}
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
            />
            {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

            <TextInputMask
              type={'cel-phone'}
              options={{ maskType: 'BRL', withDDD: true, dddMask: '(99) ' }}
              placeholder="Telefone"
              style={styles.input}
              keyboardType="phone-pad"
              value={values.telefone}
              onChangeText={text => setFieldValue('telefone', text)}
              onBlur={handleBlur('telefone')}
            />
            {touched.telefone && errors.telefone && <Text style={styles.error}>{errors.telefone}</Text>}

            <TextInputMask
              type={'cpf'}
              placeholder="CPF"
              style={styles.input}
              keyboardType="numeric"
              value={values.cpf}
              onChangeText={text => setFieldValue('cpf', text)}
              onBlur={handleBlur('cpf')}
            />
            {touched.cpf && errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}



            <TextInputMask
              type={'custom'}
              options={{ mask: '*******************************' }}
              placeholder="Senha"
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              value={values.senha}
              onChangeText={handleChange('senha')}
              onBlur={handleBlur('senha')}
            />
            {touched.senha && errors.senha && <Text style={styles.error}>{errors.senha}</Text>}

            <Button title={isSubmitting ? 'Cadastrando...' : 'Cadastrar'} onPress={handleSubmit} disabled={isSubmitting} />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: 100,
  },
});
