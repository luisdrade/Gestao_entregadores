import { Stack } from 'expo-router';

export default function CalculosLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="entregas" />
      <Stack.Screen name="despesas" />
    </Stack>
  );
}
