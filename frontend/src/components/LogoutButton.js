import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function LogoutButton({ redirectTo = 'Login' }) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        await axios.post('http://192.168.0.110:8000/logout/', {}, {
          headers: { Authorization: `Token ${token}` }
        });
      }

      await AsyncStorage.removeItem('token');

      Alert.alert('Sucesso', 'Você saiu da conta.');
      navigation.reset({
        index: 0,
        routes: [{ name: redirectTo }],
      });

    } catch (error) {
      console.log('Erro ao fazer logout:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível sair da conta.');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.text}>Sair</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
