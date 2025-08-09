// HomeScreen.js
import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AuthContext from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';
export default function HomeScreen() {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bem-vindo à Home!</Text>
      <LogoutButton redirectTo="Login" refreshToken={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20, marginBottom: 20 },
});
