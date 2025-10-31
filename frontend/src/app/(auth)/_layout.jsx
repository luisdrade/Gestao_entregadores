import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'none'
      }}
    >
      <Stack.Screen 
        name="register" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="2fa-setup" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="2fa-verify" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="register-verification-method" 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="register-verify-code" 
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

