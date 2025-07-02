import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Animated, Dimensions,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';
import DateTimePicker from '@react-native-community/datetimepicker';

const screenHeight = Dimensions.get('window').height;

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(0);

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dataNascimento, setDataNascimento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const goToStep = (nextStep) => {
    Animated.timing(slideAnim, {
      toValue: -screenHeight * nextStep,
      duration: 350,
      useNativeDriver: true,
    }).start();
    setStep(nextStep);
  };

  const validateStep = () => {
    switch (step) {
      case 0:
        if (!nome) {
          Alert.alert('Erro', 'Informe o nome completo.');
          return false;
        }
        return true;
  
      case 1:
        if (!cpf || cpf.length < 11) {
          Alert.alert('Erro', 'Informe um CPF válido (11 dígitos).');
          return false;
        }
        return true;
  
      case 2:
        if (!telefone) {
          Alert.alert('Erro', 'Informe o telefone.');
          return false;
        }
        return true;
  
      case 3:
        if (!email) {
          Alert.alert('Erro', 'Informe o email.');
          return false;
        }
        return true;
  
      case 4:
        if (!password) {
          Alert.alert('Erro', 'Informe a senha.');
          return false;
        }
        return true;
  
      default:
        return true;
    }
  };
  

  const handleNext = () => {
    if (validateStep()) {
      if (step < 3) goToStep(step + 1);
      else handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${API_URL}/api/entregadores/`, {
        nome,
        cpf,
        telefone,
        email,
        password,
        data_nascimento: dataNascimento.toISOString().split('T')[0],
      });
      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Erro', 'Erro ao cadastrar entregador.');
    }
  };

  const renderFieldPreview = () => {
    // Mostra um preview do campo anterior, menor e esmaecido
    if (step === 0) return null;

    let label = '';
    let value = '';

    switch (step - 1) {
      case 0:
        label = 'Nome';
        value = nome;
        break;
      case 1:
        label = 'Telefone';
        value = telefone;
        break;
      case 2:
        label = 'Senha';
        value = '••••••••'; // não mostra a senha real
        break;
      case 3:
        label = 'Data Nasc.';
        value = dataNascimento.toLocaleDateString();
        break;
    }

    return (
      <View style={styles.previewContainer}>
        <Text style={styles.previewLabel}>{label}:</Text>
        <Text style={styles.previewValue}>{value}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      {renderFieldPreview()}

      <Animated.View
        style={[
          styles.formContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Etapa 1 */}
        <View style={styles.formStep}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
            autoFocus={step === 0}
          />
          {step === 0 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Etapa 2 */}
        <View style={styles.formStep}>
          <TextInput
            style={styles.input}
            placeholder="CPF"
            value={cpf}
            onChangeText={setCpf}
            keyboardType="numeric"
            autoFocus={step === 1}
          />
          {step === 1 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Etapa 3 */}
        <View style={styles.formStep}>
          <TextInput
            style={styles.input}
            placeholder="Telefone"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            autoFocus={step === 2}
          />
          {step === 2 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Etapa 4 */}
        <View style={styles.formStep}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus={step === 3}
          />
          {step === 3 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Etapa 5 */}
        <View style={styles.formStep}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoFocus={step === 4}
          />

          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center' }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: '#000' }}>
              Data de Nascimento: {dataNascimento.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dataNascimento}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setDataNascimento(date);
              }}
            />
          )}

          {step === 5 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Cadastrar</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {step > 0 && (
        <TouchableOpacity onPress={() => goToStep(step - 1)} style={styles.backButton}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 80,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 12,
    color: '#555',
  },
  previewValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    height: screenHeight * 6, // 6 etapas
  },
  formStep: {
    height: screenHeight * 0.85,
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  input: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  backButton: {
    marginTop: 15,
  },
  backText: {
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});
