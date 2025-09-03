import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/clientConfig';
import { API_ENDPOINTS } from '../config/api';
import { signInWithGoogle, signOutFromGoogle, configureGoogleSignIn } from '../services/googleAuth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
    // Configurar Google Sign-In na inicialização
    configureGoogleSignIn();
  }, []);

  async function loadStoredData() {
    try {
      const storedToken = await AsyncStorage.getItem('@GestaoEntregadores:token');
      const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
      
      console.log('🔍 AuthContext - Token armazenado:', !!storedToken);
      console.log('🔍 AuthContext - Usuário armazenado:', !!storedUser);

      if (storedToken && storedUser) {
        api.defaults.headers.authorization = `Bearer ${storedToken}`;
        console.log('🔍 AuthContext - Header Authorization definido:', api.defaults.headers.authorization);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        console.log('⚠️ AuthContext - Nenhum token ou usuário encontrado no storage');
      }
    } catch (error) {
      console.error('❌ AuthContext - Erro ao carregar dados armazenados:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token: authToken, user: userData } = response.data;

      api.defaults.headers.authorization = `Bearer ${authToken}`;

      await AsyncStorage.setItem('@GestaoEntregadores:token', authToken);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));

      setToken(authToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer login' 
      };
    }
  }

  async function updateUserPhoto(fotoUrl) {
    try {
      const updatedUser = { ...user, foto: fotoUrl };
      setUser(updatedUser);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Erro ao atualizar foto do usuário:', error);
    }
  }

  async function signUp(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro ao fazer cadastro' 
      };
    }
  }

  async function signInWithGoogleAuth() {
    try {
      const result = await signInWithGoogle();
      
      if (result.success) {
        const { token: authToken, user: userData } = result.data;
        
        api.defaults.headers.authorization = `Bearer ${authToken}`;
        
        await AsyncStorage.setItem('@GestaoEntregadores:token', authToken);
        await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Erro no login com Google:', error);
      return { 
        success: false, 
        error: 'Erro ao fazer login com Google' 
      };
    }
  }

  async function signOut() {
    try {
      // Fazer logout do Google também
      await signOutFromGoogle();
      
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
      signInWithGoogle: signInWithGoogleAuth,
      signOut,
      updateUserPhoto,
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
