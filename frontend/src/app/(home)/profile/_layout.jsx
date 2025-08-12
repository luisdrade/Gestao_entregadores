import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="perfil" />
      <Stack.Screen name="veiculos" />
    </Stack>
  );
}
