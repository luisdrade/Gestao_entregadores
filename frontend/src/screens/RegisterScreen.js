import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '../../config';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [cpf, setCpf] = useState('');
  const [data_nascimento, setDataNascimento] = useState('');

  const handleRegister = async () => {
    try {
      console.log("🔄 Enviando dados para cadastro:", {
        nome,
        email,
        telefone,
        password,
        cpf,
        data_nascimento,
      });

      const response = await axios.post(`${API_URL}/api/entregadores/`, {
        nome,
        email,
        telefone,
        password,
        cpf,
        data_nascimento,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log("✅ Cadastro realizado com sucesso:", response.data);
      Alert.alert('Sucesso', 'Cadastro realizado!');
      navigation.navigate('Login');
    } catch (error) {
      console.log("❌ Erro completo:", JSON.stringify(error, null, 2));
      console.log("📡 Mensagem de erro:", error.message);
      if (error.response) {
        console.log("📥 Erro.response.status:", error.response.status);
        console.log("📥 Erro.response.data:", error.response.data);
      } else {
        console.log("⚠️ Erro sem response (possível problema de rede)");
      }

      Alert.alert('Erro', 'Falha ao registrar.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} />
      <TextInput placeholder="CPF" value={cpf} onChangeText={setCpf} style={styles.input} />
      <TextInput placeholder="Data de Nascimento (YYYY-MM-DD)" value={data_nascimento} onChangeText={setDataNascimento} style={styles.input} />
      <TextInput placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <Button title="Cadastrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
});
