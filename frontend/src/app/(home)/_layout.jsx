import { Stack } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomTabBar from '../../components/_NavBar_Inferior';

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} style={styles.stack}>
        <Stack.Screen name="home" />
        <Stack.Screen name="relatorios" />
        <Stack.Screen name="comunidade" />
        <Stack.Screen name="calculos" />
        <Stack.Screen name="profile" />
      </Stack>
      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  stack: {
    flex: 1,
    marginBottom: 80, // Espaço para a barra inferior
  },
});

