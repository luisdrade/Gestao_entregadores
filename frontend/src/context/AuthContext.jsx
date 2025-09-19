import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/clientConfig';
import { API_ENDPOINTS } from '../config/api';
import { AppState } from 'react-native';
// Importação condicional do Google Sign-In
let googleAuth = null;
try {
  googleAuth = require('../services/googleAuth');
} catch (error) {
  console.log('⚠️ Google Sign-In não disponível no Expo Go');
}

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();
    // Configurar Google Sign-In na inicialização (se disponível)
    if (googleAuth && googleAuth.configureGoogleSignIn) {
      googleAuth.configureGoogleSignIn();
    }

    // Sincronizar estado inicial do AppState no storage
    (async () => {
      try {
        const currentState = AppState.currentState;
        await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', currentState || 'active');
      } catch (e) {
        // noop
      }
    })();
  }, []);

  // Monitorar mudanças no AppState para controlar a expiração de sessão
  useEffect(() => {
    const handleAppStateChange = async (nextState) => {
      try {
        await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', nextState);
        if (nextState === 'background' || nextState === 'inactive') {
          const now = Date.now().toString();
          await AsyncStorage.setItem('@GestaoEntregadores:lastBackgroundAt', now);
        }
      } catch (e) {
        console.log('⚠️ AuthContext - Falha ao salvar estado do app:', e);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Monitorar mudanças no storage para logout automático
  useEffect(() => {
    const checkTokenStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('@GestaoEntregadores:token');
        const storedUser = await AsyncStorage.getItem('@GestaoEntregadores:user');
        
        // Se não há token mas o usuário está "logado", fazer logout
        if (!storedToken && user) {
          console.log('🚪 AuthContext - Token removido, fazendo logout automático');
          setUser(null);
          setToken(null);
          delete api.defaults.headers.Authorization;
        }
      } catch (error) {
        console.error('❌ AuthContext - Erro ao verificar status do token:', error);
      }
    };

    // Verificar a cada 2 segundos se o token ainda existe
    const interval = setInterval(checkTokenStatus, 2000);
    
    return () => clearInterval(interval);
  }, [user]);

  async function loadStoredData() {
    try {
      const [storedToken, storedUser, lastAppState, lastBackgroundAtStr] = await Promise.all([
        AsyncStorage.getItem('@GestaoEntregadores:token'),
        AsyncStorage.getItem('@GestaoEntregadores:user'),
        AsyncStorage.getItem('@GestaoEntregadores:lastAppState'),
        AsyncStorage.getItem('@GestaoEntregadores:lastBackgroundAt'),
      ]);

      console.log('🔍 AuthContext - Token armazenado:', !!storedToken);
      console.log('🔍 AuthContext - Usuário armazenado:', !!storedUser);
      console.log('🔍 AuthContext - Último estado do app:', lastAppState);

      // Regras de expiração:
      // - Se último estado salvo foi 'active' na sessão anterior, considerar app fechado -> expirar sempre
      // - Se foi 'background'/'inactive', permitir até 5 minutos
      let canKeepSession = true;
      if (lastAppState === 'active') {
        canKeepSession = false;
      } else if (lastAppState === 'background' || lastAppState === 'inactive') {
        const lastBackgroundAt = parseInt(lastBackgroundAtStr || '0', 10);
        const diffMs = Date.now() - (isNaN(lastBackgroundAt) ? 0 : lastBackgroundAt);
        const fiveMinutesMs = 5 * 60 * 1000;
        canKeepSession = diffMs <= fiveMinutesMs;
        console.log('⏱️ AuthContext - Tempo em background (ms):', diffMs, '-> mantém sessão?', canKeepSession);
      }

      if (storedToken && storedUser && canKeepSession) {
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
        console.log('🔍 AuthContext - Header Authorization definido:', api.defaults.headers.Authorization);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        if (storedToken || storedUser) {
          // Limpar se não pode manter sessão
          await AsyncStorage.removeItem('@GestaoEntregadores:token');
          await AsyncStorage.removeItem('@GestaoEntregadores:user');
        }
        delete api.defaults.headers.Authorization;
        setToken(null);
        setUser(null);
        console.log('⚠️ AuthContext - Sessão não mantida (app fechado ou tempo excedido)');
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

      const { tokens, user: userData } = response.data;
      const authToken = tokens.access;

      api.defaults.headers.Authorization = `Bearer ${authToken}`;

      await AsyncStorage.setItem('@GestaoEntregadores:token', authToken);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', 'active');

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

  async function updateUserData(userData) {
    try {
      console.log('🔄 AuthContext - Atualizando dados do usuário:', userData);
      setUser(userData);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
      console.log('✅ AuthContext - Dados do usuário atualizados com sucesso');
    } catch (error) {
      console.error('❌ AuthContext - Erro ao atualizar dados do usuário:', error);
    }
  }

  async function signUp(userData) {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro no cadastro:', error);
      console.error('Dados do erro:', error.response?.data);
      return { 
        success: false, 
        error: error.response?.data || 'Erro ao fazer cadastro' 
      };
    }
  }

  async function signInWithGoogleAuth() {
    try {
      if (!googleAuth || !googleAuth.signInWithGoogle) {
        return { 
          success: false, 
          error: 'Google Sign-In não disponível no Expo Go' 
        };
      }
      
      const result = await googleAuth.signInWithGoogle();
      
      if (result.success) {
        const { tokens, user: userData } = result.data;
        const authToken = tokens.access;
        
        api.defaults.headers.Authorization = `Bearer ${authToken}`;
        
        await AsyncStorage.setItem('@GestaoEntregadores:token', authToken);
        await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
        await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', 'active');
        
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
      // Fazer logout do Google também (se disponível)
      if (googleAuth && googleAuth.signOutFromGoogle) {
        await googleAuth.signOutFromGoogle();
      }
      
      await AsyncStorage.removeItem('@GestaoEntregadores:token');
      await AsyncStorage.removeItem('@GestaoEntregadores:user');
      
      setToken(null);
      setUser(null);
      delete api.defaults.headers.Authorization;
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
      updateUserData,
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
