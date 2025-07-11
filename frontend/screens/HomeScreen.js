import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../src/API';

export default function HomeScreen({ navigation }) {

  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const response = await api.get('entregadores/me/');
      setUser(response.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível carregar usuário.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  useEffect(() => {
    loadUser();
  }, []);


  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Bem-vindo, {user.nome}!</Text>
          <Text style={styles.infoText}>Email: {user.email}</Text>
          <Text style={styles.infoText}>CPF: {user.cpf}</Text>
        </>
      ) : (
        <Text style={styles.title}>Carregando dados...</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  infoText: { fontSize: 16, textAlign: 'center', marginBottom: 10 },
  button: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 5, marginTop: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});