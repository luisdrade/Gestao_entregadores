import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="veiculos" />
      <Stack.Screen name="entregas" />
      <Stack.Screen name="relatorios" />
      <Stack.Screen name="comunidade" />
    </Stack>
  );
}
