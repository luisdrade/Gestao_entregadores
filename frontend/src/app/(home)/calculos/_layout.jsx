import { Stack } from 'expo-router';

export default function CalculosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="trabalhado" />
      <Stack.Screen name="financeiro" />
    </Stack>
  );
}
