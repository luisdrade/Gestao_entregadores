import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import { googleClientId } from '../src/authConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const redirectUri = makeRedirectUri({
    useProxy: true,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: googleClientId,
      redirectUri,
      responseType: ResponseType.Token,
      scopes: ['profile', 'email'],
      usePKCE: false, // ESSA LINHA DESATIVA PKCE
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleGoogleAuth(access_token);
    }
  }, [response]);

  const handleGoogleAuth = async (token) => {
    try {
      const res = await axios.post(`${API_URL}/api/social/google/`, {
        access_token: token,
      });
      const { key } = res.data;
      await AsyncStorage.setItem('token', key);
      Alert.alert('Sucesso', 'Login com Google realizado!');
      navigation.replace('Home');
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert('Erro', 'Falha no login social.');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login/`, {
        email,
        password,
      });
      const { key } = res.data;
      await AsyncStorage.setItem('token', key);
      navigation.replace('Home');
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível fazer login.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Entregadores</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#DB4437' }]}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={styles.buttonText}>Entrar com Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 5, marginBottom: 15 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, marginBottom: 15 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  registerButton: { padding: 10 },
  registerText: { color: '#007AFF', textAlign: 'center' },
});
