import React from 'react';
import { Stack } from 'expo-router';
import AuthProvider from '../context/AuthContext.jsx';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
