import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedToken = await AsyncStorage.getItem('@GestaoEntregadores:token');
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');

      if (storedToken && storedUser) {
        api.defaults.headers.authorization = `Bearer ${storedToken}`;
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados armazenados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      // Para demonstração, vamos simular um login bem-sucedido
      // Em produção, você conectaria com sua API real
      const mockUser = {
        id: 1,
        nome: 'Entregador Teste',
        email: email,
      };
      
      const mockToken = 'mock_token_123';

      api.defaults.headers.authorization = `Bearer ${mockToken}`;

      await AsyncStorage.setItem('@GestaoEntregadores:token', mockToken);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: 'Erro ao fazer login' 
      };
    }
  }

  async function signUp(userData) {
    try {
      // Simular cadastro bem-sucedido
      return { success: true, data: userData };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { 
        success: false, 
        error: 'Erro ao fazer cadastro' 
      };
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@GestaoEntregadores:token');
      await AsyncStorage.removeItem('@GestaoEntregadores:user');
      
      setToken(null);
      setUser(null);
      delete api.defaults.headers.authorization;
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  return (
    <AuthContext.Provider value={{
      signed: !!token,
      user,
      token,
      loading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
