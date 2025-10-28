import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient } from '../services/clientConfig';
import { API_ENDPOINTS } from '../config/api';
import { AppState } from 'react-native';

const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadStoredData();

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
          delete httpClient.defaults.headers.Authorization;
        }
        
        // Se há token mas não está definido no httpClient, definir
        if (storedToken && !httpClient.defaults.headers.Authorization) {
          httpClient.defaults.headers.Authorization = `Bearer ${storedToken}`;
          console.log('🔍 AuthContext - Token redefinido no httpClient:', httpClient.defaults.headers.Authorization);
        }
        
        // Se não há token mas está definido no httpClient, limpar
        if (!storedToken && httpClient.defaults.headers.Authorization) {
          delete httpClient.defaults.headers.Authorization;
          console.log('🧹 AuthContext - Header Authorization removido do httpClient');
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
        console.log('⚠️ AuthContext - App foi fechado (estado active), expirando sessão');
      } else if (lastAppState === 'background' || lastAppState === 'inactive') {
        const lastBackgroundAt = parseInt(lastBackgroundAtStr || '0', 10);
        const diffMs = Date.now() - (isNaN(lastBackgroundAt) ? 0 : lastBackgroundAt);
        const fiveMinutesMs = 5 * 60 * 1000;
        canKeepSession = diffMs <= fiveMinutesMs;
        console.log('⏱️ AuthContext - Tempo em background (ms):', diffMs, '-> mantém sessão?', canKeepSession);
      } else {
        // Se não há informação sobre o último estado, permitir sessão
        console.log('ℹ️ AuthContext - Sem informação de estado anterior, mantendo sessão');
      }

      if (storedToken && storedUser && canKeepSession) {
        // Definir o token no httpClient
        httpClient.defaults.headers.Authorization = `Bearer ${storedToken}`;
        console.log('🔍 AuthContext - Header Authorization definido:', httpClient.defaults.headers.Authorization);
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        console.log('✅ AuthContext - Sessão restaurada com sucesso');
      } else {
        if (storedToken || storedUser) {
          // Limpar se não pode manter sessão
          await AsyncStorage.removeItem('@GestaoEntregadores:token');
          await AsyncStorage.removeItem('@GestaoEntregadores:user');
          console.log('🧹 AuthContext - Dados de sessão removidos');
        }
        delete httpClient.defaults.headers.Authorization;
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

  async function signIn(email, password, skip2FA = false) {
    try {
      // Gerar device_id único para este dispositivo
      const deviceId = await AsyncStorage.getItem('@GestaoEntregadores:deviceId') || 
        `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await AsyncStorage.setItem('@GestaoEntregadores:deviceId', deviceId);

      const response = await httpClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
        is_mobile_app: true, // Indicar que é login do app mobile
        device_id: deviceId,
        device_name: 'Mobile App',
        device_type: 'mobile',
      });

      const responseData = response.data;

      // Verificar se precisa de 2FA
      if (responseData.requires_2fa && !skip2FA) {
        return {
          success: true,
          requires_2fa: true,
          user_email: responseData.user_email,
          reason: responseData.reason || '2FA required',
          device_id: deviceId,
        };
      }

      // Login normal (sem 2FA ou 2FA já verificado)
      const { tokens, user: userData } = responseData;
      const authToken = tokens.access;

      // Definir o token no httpClient
      httpClient.defaults.headers.Authorization = `Bearer ${authToken}`;

      await AsyncStorage.setItem('@GestaoEntregadores:token', authToken);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', 'active');

      setToken(authToken);
      setUser(userData);

      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      
      // Capturar diferentes tipos de erro do backend
      let errorMessage = 'Erro ao fazer login';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Tentar diferentes campos de erro
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          errorMessage = errorData.non_field_errors[0];
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
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

  async function loginAfterVerification(tokens, userData) {
    try {
      console.log('🔄 AuthContext - Fazendo login após verificação:', userData);
      
      // Salvar tokens e dados do usuário
      await AsyncStorage.setItem('@GestaoEntregadores:token', tokens.access);
      await AsyncStorage.setItem('@GestaoEntregadores:user', JSON.stringify(userData));
      await AsyncStorage.setItem('@GestaoEntregadores:lastAppState', 'active');
      
      // Atualizar estado
      setToken(tokens.access);
      setUser(userData);
      
      // Definir token no httpClient
      httpClient.defaults.headers.Authorization = `Bearer ${tokens.access}`;
      
      console.log('✅ AuthContext - Login após verificação realizado com sucesso');
    } catch (error) {
      console.error('❌ AuthContext - Erro no login após verificação:', error);
    }
  }

  async function signUp(userData) {
    try {
      const response = await httpClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Verificar se precisa de verificação
      if (response.data.requires_verification) {
        return { 
          success: true, 
          requires_verification: true,
          user_email: response.data.user_email,
          user_phone: response.data.user_phone,
          user_data: response.data.user_data
        };
      }
      
      // Cadastro normal (sem verificação necessária)
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

  async function signOut() {
    try {
      
      await AsyncStorage.removeItem('@GestaoEntregadores:token');
      await AsyncStorage.removeItem('@GestaoEntregadores:user');
      
      setToken(null);
      setUser(null);
      delete httpClient.defaults.headers.Authorization;
      console.log('✅ AuthContext - Logout realizado com sucesso');
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
      updateUserPhoto,
      updateUserData,
      loginAfterVerification,
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
